## Context

Proyecto greenfield sobre un workspace que hoy solo contiene `splitter-app/` (Next.js) y que no será modificado. No hay specs previas ni código Kotlin existente. Plataformas objetivo: Android, iOS y Desktop; persistencia local + backend propio; monousuario sin login. Motivación completa en `proposal.md`.

## Goals / Non-Goals

**Goals:**
- Definir una arquitectura KMP modular en la que Android, iOS y Desktop compartan al máximo la UI (Compose Multiplatform) y la lógica.
- Persistencia local-first con sincronización determinista y off-line first.
- Gráficos y dashboard reordenable sin atarse a librerías específicas de una sola plataforma.
- Permitir testeo unitario de la lógica core (cálculos, sincronización, agregaciones) en JVM pura.

**Non-Goals:**
- Multi-usuario / autenticación.
- Compartición real entre personas: los grupos se administran por el dueño con nombres de miembros; no hay invitaciones ni usuarios remotos.
- Pagos, importación bancaria, multi-moneda.
- Backend de alta disponibilidad ni despliegue en producción (fase de desarrollo local).
- Refactor o integración con `splitter-app/` (Next.js), que permanece intacto.

## Decisions

### D1. Estructura de proyecto
`finance-app/` como proyecto Gradle Kotlin Multiplatform multi-módulo (un único build raíz), junto a `splitter-app/`, sin tocarlo. Módulos:
- `shared/` — dominio, repositorios, casos de uso, base local (SQLDelight), motor de sincronización y cliente HTTP (Ktor). Source sets `commonMain` + `jvmTest`/`androidUnitTest`.
- `composeApp/` — UI Compose Multiplatform (`commonMain`), con `androidMain`, `iosMain` y `desktopMain` solo para entry points y ajustes de plataforma.
- `backend/` — servidor Ktor (JVM), API REST + sincronización, propia base de datos.

**Alternativa considerada:** app iOS/Android nativos separados → se descarta por coste duplicado de UI; el requisito es una UI compartida.

### D2. La UI compartida en Compose Multiplatform
Un solo árbol Compose para las tres plataformas. Se usan `expect/actual` únicamente para: rutas de base de datos, `platformSettings`, integración de clipboard/file y gestos que difieran. Se evita duplicar pantallas.

**Alternativa considerada:** code-sharing solo de lógica con UI nativa por plataforma → no cumple el objetivo de UI compartida.

### D3. Persistencia local con SQLDelight
SQLDelight como capa de acceso a base relacional tipada en `commonMain` (Android `sqlite`, iOS `sqlite`, Desktop `sqlite-jdbc`). Preferencias/adornos del layout no críticos en DataStore (KMP).
- Montos almacenados como **centavos en Long** para evitar errores de punto flotante.
- Borrado lógico (flag `deleted_at`) para soportar sincronización y restauración.

**Alternativa considerada:** Room (Android-only) u ORM basado en reflejo → Room no es KMP; se descarta. Realm → menos control sobre SQL y conflictos.

### D4. Modelo de datos
Todas las entidades sincronizables llevan `id` UUID generado en el cliente, `updated_at` (epoch millis) para sincronización y `deleted_at` para borrado lógico (D3):
- `Account(id, name, type, initial_balance_cents, deleted_at, updated_at)`
- `Category(id, name, color, parent_group?, deleted_at, updated_at)` — `parent_group` es la agrupación de categorías (no confundir con los grupos de personas); categorías por defecto sembradas al primer uso.
- `Transaction(id, type, amount_cents, category_id, account_id, date, notes, created_at, updated_at, deleted_at)`
- `Budget(id, category_id, limit_cents, period_start, period_end, deleted_at, updated_at)` — limitación: un presupuesto activo por (categoría, periodo).
- `Group(id, name, deleted_at, updated_at)` y `GroupMember(id, group_id, name, color?, deleted_at, updated_at)` — miembros por nombre administrados por el dueño.
- `GroupExpense(id, group_id, payer_member_id, description, amount_cents, date, created_at, updated_at, deleted_at)`; `GroupExpenseShare(id, expense_id, member_id, share_cents, deleted_at, updated_at)` — cada participante del reparto con su parte; `GroupSettlement(id, group_id, from_member_id, to_member_id, amount_cents, date, deleted_at, updated_at)` — pagos de deuda entre miembros.
- `DashboardWidgetConfig(id, widget_type, order_index, config_json, size, deleted_at, updated_at)` — el layout del dashboard vive en base para que la disposición se sincronice entre dispositivos.

### D5. Sincronización determinista (last-write-wins)
Motor de sincronización en `shared`:
- Tabla de salida (outbox) de cambios locales y cola de reintentos.
- Pull incremental por `updated_at` desde un cursor; push en lotes idempotentes (upsert por UUID).
- Conflictos resueltos con **LWW por `updated_at`** (la versión más reciente gana), sin duplicados y sin pérdida silenciosa (se registra el descarte).
- Sincronización automática: al iniciar, al recuperar conexión y periódica; manual con "sincronizar ahora".
- Estado de sync expuesto como `Flow<SyncState>`.

**Alternativa considerada:** OT/CRDT o vectores de versión → sobre-ingeniería para monousuario; LWW es suficiente y testeable.

### D6. Gráficos con renderer Canvas propio en commonMain
Los gráficos (líneas, barras agrupadas, sectores, tendencias) se dibujan con Canvas de Compose en `commonMain`, tras una interfaz `ChartRenderer`. Zoom/pan/drill por gestos de puntero (drag, pellizco, clic) con llamada a lógica de agregación en el dominio.

**Motivo:** las librerías de gráficos multiplataforma (p. ej. KoalaPlot, Vico) son Android-first o inmaduras en iOS/Desktop; un renderer Canvas da control total del estilo minimalista y de las herramientas (zoom, granularidad, comparación) sin dependencias de riesgo. La lógica de agregación/ejes queda separada de la renderización y se testea en JVM.

**Riesgo asumido:** coste de implementación mayor a usar una librería.

### D7. Arquitectura por capas con UDF
MVVM con flujo de datos unidireccional: UI (Compose) → intenciones → casos de uso → repositorios → (SQLDelight + Ktor client) → `Flow` de estados observables. DI ligera con Koin; navegación UI por estado (sin librería de navegación pesada), permitiendo restauración simple entre pantallas del dashboard.

**Alternativa considerada:** inyección manual → viable, pero Koin evita fricción a medida que crecen los módulos; DI manual es aceptable como fallback si se quiere menos dependencias.

### D8. Backend Ktor (monousuario, sin auth)
Servidor Ktor (JVM) exponiendo la misma lógica de negocio y esquema: endpoints REST para entidades y un endpoint de sync push/pull idempotente. Sin auth en esta fase (red local/desarrollo); el diseño no impide agregar auth luego. Storage SQLite vía Exposed o JDBC.

**Alternativa considerada:** Supabase/Back4App → aporta auth y hosting pero agrega dependencia externa y no es "backend propio" como pidió el usuario.

### D9. Módulo de grupos aislado con saldos derivados (spec: groups)
Los gastos de grupo viven en un libro de contabilidad separado: NO se reflejan en cuentas, categorías, historial ni dashboard personal (specs `transactions`, `analytics` y `dashboard` no los incluyen). Comparten solo infraestructura: SQLDelight (D3), motor de sync LWW (D5) y backend Ktor (D8).
- Pagador de un gasto de grupo: cualquier miembro. El reparto es equitativo entre los participantes seleccionados al momento del alta (permite excluir gente).
- `GroupExpenseShare.share_cents` se calcula y almacena al alta (y se recalcula al editar el gasto, marcando las partes anteriores como borradas) para fijar el reparto histórico: invariante Σ shares = monto. El residuo de una división no exacta se asigna al pagador si participa; si no, al primer participante por orden de `id`, de forma determinista.
- Saldo neto por miembro = Σ(montos de gastos que pagó) − Σ(sus shares) + Σ(settlements que pagó, `from`) − Σ(settlements que recibió, `to`). Pagar una deuda acerca al deudor a cero (su neto sube) y reduce el saldo a favor del acreedor (su neto baja). Se deriva SIEMPRE de las entidades almacenadas, nunca de acumuladores; invariante: Σ netos del grupo = 0. Neto > 0 → le deben; neto < 0 → debe. Se presenta por miembro (no matriz entre terceros).
- Un miembro solo puede quitarse (borrado lógico) con neto = 0; sus gastos, shares y settlements históricos se conservan.
- `GroupSettlement` registra un pago de deuda (from → to) y reduce las deudas pendientes de forma determinista al recalcular.

**Alternativa considerada:** matriz de deudas optimizada con emparejamiento mínimo entre miembros → el usuario eligió saldo neto por persona.

## Risks / Trade-offs

- [Módulo iOS de Compose Multiplatform inmaduro / UI compleja (dashboard + gráficos)] → Validar temprano en device real; mantener renderer Canvas liviano y aislar código iOS en `expect/actual`.
- [Charts propios = más esfuerzo de implementación y de calidad visual] → Lógica de agregación y ejes testeable en JVM; iterar el estilo desde el primer sprint; KoalaPlot como fallback detrás de la interfaz `ChartRenderer`.
- [LWW puede descartar datos modificados en paralelo] → Aceptable para monousuario; el descarte queda registrado para auditoría y los tests cubren el caso.
- [Sincronización incorrecta corrompe datos en ambos lados] → Upserts idempotentes por UUID + pruebas unitarias de conflictos + indicador de estado visible al usuario.
- [Rendimiento de la grilla reordenable con muchos widgets] → `key` estable por widget, recomposición acotada por widget, y límite razonable de widgets simultáneos.
- [Gestos distintos por plataforma (desktop/mobile)] → Abstraer interacciones de puntero detrás de la capa de gestos con `expect/actual` mínimo.
- [El saldo neto de grupo depende de gastos, shares y settlements; editar un reparto histórico o un pago puede desalinear deudas] → Derivar siempre el saldo desde las entidades almacenadas (nunca acumuladores); verificar el invariante Σ shares = monto con tests.
- [División no exacta de un gasto de grupo (resto) puede confundir] → Resto asignado al pagador de forma determinista y visible en la UI del reparto.

## Migration Plan

Proyecto greenfield: no hay datos que migrar. Faseado:
1. Esqueleto Gradle KMP + módulos (`shared`, `composeApp`, `backend`) compilando en las 3 plataformas.
2. Capa de datos (SQLDelight + modelo + repositorios) con tests JVM.
3. Backend y motor de sync (tests de conflictos).
4. Features UI: transacciones → presupuestos → analytics → dashboard reordenable/personalizable (con persistencia y sync de layout) → grupos.
5. Integración y verificación final de todas las capacidades, incluidos grupos.
Rollback: cada fase es reversible por control de versiones; el backend es desplegable/descartable localmente.

## Open Questions

- Despliegue final del backend (Docker local vs. servicio en la nube) y dominio/hosting: se puede decidir después sin cambiar specs ni arquitectura.
- Fuentes/paleta exactas y marca visual: diferible al sprint de estilos sin afectar la arquitectura.
- Conjunto exacto de categorías por defecto: se definirá en implementación manteniendo la capacidad de sembrarlas.