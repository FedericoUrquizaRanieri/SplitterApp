## 1. Esqueleto del proyecto KMP

- [ ] 1.1 Inicializar `finance-app/` como proyecto Gradle Kotlin Multiplatform (settings.gradle.kts, version catalog, wrapper) y verificar que el build raíz compila con `./gradlew build`
- [ ] 1.2 Crear módulos `shared`, `composeApp` y `backend` y verificar que cada compila con `./gradlew :shared:compileKotlinJvm :backend:compileKotlinJvm :composeApp:assembleDebug`
- [ ] 1.3 Configurar targets Android, iOS y Desktop en `composeApp` con Compose Multiplatform y verificar que se generan los APK/ipa/desktop
- [ ] 1.4 Configurar entry points por plataforma (AndroidManifest+MainActivity, MainViewController para iOS, main() Desktop) y verificar que se abre una ventana/pantalla tipo "Hola" en cada plataforma
- [ ] 1.5 Integrar Koin (DI), kotlinx-serialization y coroutines/Flow en `shared` y `composeApp`; verificar que las dependencias resuelven en la fase de configuración de Gradle
- [ ] 1.6 Crear el tema visual base (paleta restringida, tipografía, espaciados, dark/light) en `shared`/design y verificar que un componente de prueba lo aplica en las 3 plataformas

## 2. Capa de datos: modelo, SQLDelight y repositorios

- [ ] 2.1 Definir esquema SQLDelight (Account, Category, Transaction, Budget, DashboardWidgetConfig, tablas de grupos Group/GroupMember/GroupExpense/GroupExpenseShare/GroupSettlement, tabla de salida/outbox) y verificar migración y consultas con tests de inserción/lectura en JVM
- [ ] 2.2 Implementar el modelo de dominio (mismos nombres y tipos: id UUID, montos en centavos Long, `updated_at`, `deleted_at`) y verificar con tests unitarios de serialización
- [ ] 2.3 Implementar repositorios de cuentas (crear/editar/eliminar y cálculo de saldo actual por saldo inicial + movimientos) y verificar con tests JVM
- [ ] 2.4 Implementar repositorio de categorías con seed de categorías por defecto al primer uso y verificar con test JVM que el primer arranque las crea una sola vez
- [ ] 2.5 Implementar repositorio de transacciones (CRUD, validación de monto>0/categoría para egreso/cuenta obligatoria, actualización de saldos) y verificar con tests JVM de alta, edición y borrado
- [ ] 2.6 Implementar repositorio de presupuestos (CRUD, unicidad por categoría+periodo, cálculo de consumo sobre egresos) y verificar con tests JVM de consumo y límite
- [ ] 2.7 Implementar repositorio del layout del dashboard (widgets y orden) y verificar persistencia con tests JVM
- [ ] 2.8 Exponer los repositorios como `Flow` de estados y verificar con tests que emiten estados tras cada mutación

## 3. Backend y sincronización

- [ ] 3.1 Crear backend Ktor (JVM) con el mismo esquema (SQLite) y endpoints REST de entidades; verificar con tests de endpoints que el CRUD básico funciona
- [ ] 3.2 Implementar endpoint de sync push/pull idempotente (upsert por UUID + cursor por `updated_at`) y verificar con tests que el mismo lote enviado dos veces no duplica datos
- [ ] 3.3 Implementar motor de sync en `shared` (outbox, pull incremental, push por lotes, reintentos) y verificar con tests JVM que los cambios locales llegan al backend
- [ ] 3.4 Implementar resolución de conflictos LWW por `updated_at` con registro del descarte y verificar con tests unitarios que gana la versión más reciente sin duplicados ni pérdida silenciosa
- [ ] 3.5 Implementar sincronización automática (al iniciar, al recuperar conexión, periódica) y manual "sincronizar ahora" con `Flow<SyncState>`; verificar con tests del ciclo de eventos
- [ ] 3.6 Verificar operación offline: con el backend inaccesible se pueden crear/editar/eliminar datos y al restaurar la conexión se propaga todo (cobertura de tests JVM y smoke manual)

## 4. UI compartida y navegación base

- [ ] 4.1 Montar la navegación por estado (dashboard, historial, análisis, presupuestos, cuentas, categorías, grupos) y verificar navegación manual en las 3 plataformas
- [ ] 4.2 Definir la shell de la app (barra superior, navegación inferior/lateral según tamaño) y verificar que respeta el layout adaptativo en pantallas chica y grande
- [ ] 4.3 Implementar manejo de estados de carga/error/vacío compartidos y verificar en pantalla de historial sin datos

## 5. Registro de transacciones, historial, cuentas y categorías (spec: transactions)

- [ ] 5.1 Implementar el modal de alta de transacción (tipo, monto, categoría, cuenta, fecha, nota) y verificar alta de egreso/ingreso, cancelación y el vínculo con saldos y métricas del dashboard
- [ ] 5.2 Implementar validaciones del formulario y verificar mensajes para monto<=0, egreso sin categoría y cuenta obligatoria
- [ ] 5.3 Implementar el historial agrupado por mes con filtros por tipo, rango de fechas y categoría, y búsqueda por notas; verificar cada filtro y la búsqueda en UI
- [ ] 5.4 Implementar detalle/edición y eliminación con confirmación y verificar recálculo de saldos y métricas tras editar/borrar
- [ ] 5.5 Implementar pantalla de cuentas (crear/editar/eliminar, saldo actual, confirmación al eliminar cuenta con movimientos) y verificar casos con y sin movimientos
- [ ] 5.6 Implementar pantalla de categorías (crear, renombrar, cambiar color, agrupar, eliminar con reclasificación a "Sin categoría") y verificar la selección en el modal de transacción

## 6. Presupuestos (spec: budgets)

- [ ] 6.1 Implementar creación/edición/eliminación de presupuestos por categoría y periodo con unicidad por categoría+periodo y aviso al duplicar; verificar en UI
- [ ] 6.2 Implementar visualización de consumo (consumido, restante, %, barra de progreso) y verificar cálculo sobre egresos del periodo con datos de prueba
- [ ] 6.3 Implementar estados y alertas de 80% (advertencia) y >100% (excedido, restante negativo), y verificar la recuperación al ajustar el límite
- [ ] 6.4 Integrar presupuestos como widgets del dashboard y verificar que el consumo refleja las transacciones en vivo

## 7. Análisis y gráficos (spec: analytics)

- [ ] 7.1 Implementar la interfaz `ChartRenderer` Canvas en commonMain (línea, barras agrupadas, sectores, tendencia) y verificar renderizado en las 3 plataformas con datos de prueba
- [ ] 7.2 Implementar gráfico de evolución de balance por cuenta y balance total con include/excluir cuentas; verificar recálculo al alternar cuentas
- [ ] 7.3 Implementar barras de ingresos vs egresos por periodo, distribución por categoría (sectores) y serie temporal de tendencias; verificar con datos reales de prueba
- [ ] 7.4 Implementar filtros compartidos de rangos de fechas, categorías, cuentas y tipo y verificar que todos los gráficos reflejan los filtros activos
- [ ] 7.5 Implementar herramientas de operación: granularidad día/semana/mes/año, zoom/pan en series, comparación con periodo anterior y drill-down de sectores; verificar cada herramienta en UI
- [ ] 7.6 Aislar la lógica de agregación y ejes y verificar sus resultados con tests JVM (granularidad, comparación de periodos, porcentajes de distribución)

## 8. Dashboard reordenable y personalizable (spec: dashboard)

- [ ] 8.1 Implementar la grilla de widgets con el conjunto predeterminado (saldo total, ingresos del periodo, egresos del periodo, evolución de cuentas, distribución por categoría, presupuestos) y verificar que se muestran con valores calculados
- [ ] 8.2 Implementar reordenamiento por arrastre con reflow sin solape y, al soltar fuera de posición válida, vuelta a la posición original; verificar en mobile y desktop
- [ ] 8.3 Implementar catálogo de widgets (agregar/quitar, mínimo un widget) y configuración por widget (tipo de gráfico, periodo, categoría/cuenta); verificar la persistencia entre sesiones
- [ ] 8.4 Implementar persistencia del layout (orden, configuración y tamaño) en SQLDelight y verificar que se restaura al reabrir y se sincroniza entre dispositivos
- [ ] 8.5 Implementar estado vacío por widget y layout adaptativo (1 columna móvil / multi-columna en pantallas grandes) y verificar en las 3 plataformas
- [ ] 8.6 Implementar estilo minimalista del dashboard (paleta, jerarquía tipográfica, animaciones sutiles) y verificar coherencia visual entre widgets

## 9. Grupos (spec: groups)

- [ ] 9.1 Implementar la pestaña Grupos con CRUD de grupos (crear, renombrar, eliminar) y verificar navegación y persistencia en UI
- [ ] 9.2 Implementar CRUD de miembros por grupo (agregar, renombrar, quitar solo con saldo neto cero) y verificar listado, bloqueo al quitar con saldo pendiente y selección de participantes al cargar un gasto
- [ ] 9.3 Implementar alta de gasto de grupo (descripción, monto, pagador = cualquier miembro, fecha, selección de participantes excluyendo gente) con split equitativo y resto asignado al pagador (o al primer participante si el pagador no participa); verificar el invariante Σ shares = monto
- [ ] 9.4 Implementar edición y eliminación de gastos de grupo (recalculando las shares) y verificar el recálculo de los saldos netos
- [ ] 9.5 Implementar el cálculo del saldo neto por miembro (Σ pagado − Σ shares + Σ settlements pagados − Σ settlements recibidos) y la vista "le deben / debe / al día" por persona; verificar con tests JVM casos simples, de edición, de exclusión de participantes y el invariante Σ netos = 0
- [ ] 9.6 Implementar registro y eliminación de pagos de deuda (settlements from→to, miembros distintos, monto > 0) y verificar que las deudas pendientes se reducen de forma determinista
- [ ] 9.7 Sincronizar grupos, miembros, gastos, shares y settlements con el backend mediante el motor LWW y verificar idempotencia y resolución de conflictos
- [ ] 9.8 Verificar que los gastos de grupo no afectan las cuentas, categorías, historial, presupuestos, análisis ni dashboard personal (módulo aislado) con tests y smoke manual

## 10. Integración y verificación final

- [ ] 10.1 Punto de entrada del modal de nuevo gasto desde el dashboard y verificar flujo completo: alta → historial → saldo de cuenta → métricas → gráficos
- [ ] 10.2 Verificar el ciclo de sincronización completo (dos dispositivos simulados), incluida la resolución de un conflicto real (mismo dato editado dos veces con LWW), también sobre datos de grupos
- [ ] 10.3 Verificar la app operativa offline de extremo a extremo (registro/edición/consulta sin backend, incluidos grupos) y la sincronización posterior al recuperar conexión
- [ ] 10.4 Correr la suite completa de tests (JVM unit + UI smoke en las 3 plataformas) y verificar que `./gradlew build` termina en verde
- [ ] 10.5 Revisar que ninguna funcionalidad de `specs/**` queda sin cubrir y actualizar el estado de tareas en consecuencia