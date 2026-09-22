## Why

No existe hoy una app propia que permita a un usuario controlar sus finanzas personales: registrar ingresos y egresos, presupuestar y analizar de dónde viene y hacia dónde va el dinero. Se necesita una aplicación Kotlin Multiplatform que centralice estas funciones en un único dashboard interactivo, moderno y minimalist, disponible en Android, iOS y Desktop.

## What Changes

- Creación de una aplicación greenfield **Kotlin Multiplatform** con UI compartida en **Compose Multiplatform** para **Android, iOS y Desktop**.
- **Dashboard interactivo y reordenable**: grilla de widgets (métricas, números y gráficos) que el usuario puede reorganizar, quitar y agregar; la disposición persiste entre sesiones.
- **Registro de transacciones**: alta de ingresos y egresos mediante un modal, con categoría, cuenta, fecha, monto y notas.
- **Historial de transacciones**: listado filtrable y agrupado por periodo, con búsqueda y paginación/scroll.
- **Categorías de gastos**: administración (crear, renombrar, colorear, agrupar) y asignación a transacciones.
- **Cuentas y balances**: gestión de cuentas y visualización gráfica de balances.
- **Análisis de ingresos y egresos**: gráficos comparativos, tendencias y distribución por categoría, con herramientas para operar los gráficos (zoom, periodo, comparación) y filtrarlos.
- **Presupuestos**: creación y visualización de presupuestos por categoría con seguimiento del consumo.
- **Grupos**: pestaña para armar grupos con personas, registrar gastos a dividir entre sus miembros (excluyendo participantes si hace falta) y calcular el saldo neto de cada miembro: a quién se le debe y quién debe.
- **Diseño minimalista**: tipografía y paleta restringidas, jerarquía clara, animaciones sutiles; la UI es modificable por el usuario (dashboards reordenables, widgets configurables).
- **Persistencia local-first con sincronización**: base de datos local (SQLDelight) como fuente primaria y sincronización a un backend REST propio.
- **Usuarios**: monousuario, sin autenticación en esta fase.

## Capabilities

### New Capabilities
- `dashboard`: Dashboard interactivo y reordenable; widgets de métricas, números y gráficos; persistencia del layout y personalización por el usuario.
- `transactions`: Registro de ingresos y egresos (modal), historial filtrable y administración de categorías de gastos.
- `analytics`: Gráficos de cuentas/balances y análisis de ingresos y egresos; herramientas para operar y filtrar gráficos.
- `budgets`: Creación, edición y visualización de presupuestos por categoría con seguimiento del consumo.
- `groups`: Grupos con miembros, gastos divididos en partes iguales entre participantes seleccionados, pagos de deuda entre miembros y cálculo del saldo neto por miembro.
- `sync`: Persistencia local (SQLDelight), sincronización con backend REST y resolución de conflictos; operación monousuario sin login.

### Modified Capabilities
- Ninguna: proyecto greenfield sin specs existentes.

## Impact

- **Nuevo proyecto** dentro del workspace (coexiste con `splitter-app/`, no lo modifica): `finance-app/` con módulos KMP (`composeApp`, `shared`, backend).
- **Stack nuevo**: Kotlin Multiplatform + Compose Multiplatform, SQLDelight, Ktor Client, Ktor Server (backend), coroutines/Flow, Koin u otro DI ligero.
- **Backend REST propio**: nuevos endpoints para transacciones, categorías, cuentas, presupuestos, grupos y sincronización.
- **Sin impacto** en el proyecto Next.js existente (`splitter-app`).