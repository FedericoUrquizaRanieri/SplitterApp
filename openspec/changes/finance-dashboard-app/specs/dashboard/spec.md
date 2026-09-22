## Purpose

Provee el dashboard interactivo y reordenable que agrupa las métricas, números y gráficos financieros en widgets personalizables y con disposición persistente.

## ADDED Requirements

### Requirement: Grilla de widgets del dashboard
El dashboard SHALL mostrar una cuadrícula de widgets con la información financiera del usuario. Los widgets disponibles incluyen: saldo total, ingresos del periodo, egresos del periodo, evolución de cuentas y balances, distribución de egresos por categoría y seguimiento de presupuestos. El conjunto de widgets mostrado de forma predeterminada SHALL cubrir al menos una métrica, un saldo y un gráfico.

#### Scenario: Los widgets del dashboard se muestran al abrir la app
- **WHEN** el usuario abre el dashboard
- **THEN** se muestran los widgets predeterminados con sus valores calculados

#### Scenario: Las métricas se actualizan con cada transacción
- **WHEN** el usuario registra o edita una transacción
- **THEN** los widgets afectados (saldo, ingresos, egresos, cuentas, presupuestos) se recalculan y muestran el nuevo valor

#### Scenario: Widget vacío sin datos
- **WHEN** un widget no tiene datos para el periodo o filtro seleccionado
- **THEN** el widget muestra un estado vacío con un mensaje claro y no rompe el layout

### Requirement: Layout del dashboard reordenable
El usuario SHALL poder reordenar los widgets del dashboard arrastrándolos a una nueva posición dentro de la cuadrícula. El orden resultante SHALL persistir entre sesiones.

#### Scenario: Reordenar un widget
- **WHEN** el usuario arrastra un widget a una nueva posición de la cuadrícula
- **THEN** el widget se ubica en la nueva posición y los widgets adyacentes se reacomodan sin solaparse

#### Scenario: El orden se restaura al reabrir
- **WHEN** el usuario reordena los widgets, cierra la app y vuelve a abrirla
- **THEN** el dashboard muestra los widgets en el mismo orden configurado

#### Scenario: Reordenamiento interrumpido
- **WHEN** el usuario suelta un widget fuera de una posición válida
- **THEN** el widget regresa a su posición original y la grilla queda intacta

### Requirement: Personalización de widgets
El usuario SHALL poder agregar y quitar widgets de un catálogo, y SHALL poder configurar los parámetros de cada widget (tipo de gráfico, periodo, categoría o cuenta a mostrar según corresponda). Las personalizaciones SHALL persistir entre sesiones.

#### Scenario: Agregar un widget
- **WHEN** el usuario selecciona un widget del catálogo
- **THEN** el widget se agrega al dashboard y queda disponible para reubicarlo

#### Scenario: Quitar un widget
- **WHEN** el usuario elimina un widget del dashboard
- **THEN** el widget desaparece del dashboard sin afectar los datos ni los demás widgets

#### Scenario: Configurar un widget
- **WHEN** el usuario cambia el periodo (o categoría/cuenta) de un widget
- **THEN** el widget muestra la información correspondiente a la nueva configuración y este cambio queda guardado

#### Scenario: Último widget no se puede quitar
- **WHEN** el usuario intenta quitar el último widget restante del dashboard
- **THEN** la app impide la acción y muestra un aviso (el dashboard requiere al menos un widget)

### Requirement: Layout adaptativo por tamaño de pantalla
El dashboard SHALL adaptar su disposición al tamaño de la pantalla: una sola columna apilada en pantallas pequeñas y una cuadrícula de varias columnas en pantallas grandes.

#### Scenario: Pantalla pequeña
- **WHEN** el dashboard se muestra en una pantalla angosta (móvil)
- **THEN** los widgets se apilan en una sola columna con ancho completo

#### Scenario: Pantalla grande
- **WHEN** el dashboard se muestra en una pantalla amplia (tablet/desktop)
- **THEN** los widgets se distribuyen en una cuadrícula de varias columnas aprovechando el ancho disponible

### Requirement: Estilo visual minimalista
El dashboard SHALL seguir un estilo minimalista: paleta de colores restringida, tipografía clara, jerarquía visual basada en espacio y peso tipográfico, y animaciones sutiles que no interfieran con la lectura de datos.

#### Scenario: Consistencia visual entre widgets
- **WHEN** se muestran varios widgets en el dashboard
- **THEN** todos usan la misma paleta, tipografía y espaciado definidos por el tema de la app