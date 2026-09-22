## Purpose

Permite crear presupuestos por categoría y monitorear su consumo respecto de los egresos registrados, alertando cuando se acerca o supera el límite.

## ADDED Requirements

### Requirement: Creación y edición de presupuestos
El usuario SHALL poder crear un presupuesto asignando una categoría, un monto límite y un periodo (mes o rango personalizado). El usuario SHALL poder editar el límite, la categoría o el periodo de un presupuesto existente y eliminarlo.

#### Scenario: Crear un presupuesto
- **WHEN** el usuario crea un presupuesto con categoría, monto y periodo
- **THEN** el presupuesto queda guardado y visible en la sección de presupuestos

#### Scenario: Editar el límite
- **WHEN** el usuario modifica el monto límite de un presupuesto y confirma
- **THEN** el presupuesto se actualiza y el cálculo del consumo usa el nuevo límite

#### Scenario: Eliminar un presupuesto
- **WHEN** el usuario elimina un presupuesto
- **THEN** el presupuesto desaparece sin afectar las transacciones ni las categorías

#### Scenario: Presupuesto duplicado en el mismo periodo
- **WHEN** el usuario intenta crear un presupuesto para una categoría y periodo ya presupuestados
- **THEN** la app muestra un aviso y ofrece editar el presupuesto existente en lugar de duplicarlo

### Requirement: Visualización del consumo del presupuesto
Cada presupuesto SHALL mostrar el monto consumido, el monto restante, el porcentaje del límite consumido y una barra de progreso que lo represente. El consumo SHALL calcularse sobre los egresos de la categoría dentro del periodo del presupuesto.

#### Scenario: Progreso del consumo
- **WHEN** se registran egresos en una categoría con presupuesto
- **THEN** la barra de progreso del presupuesto avanza proporcionalmente al consumo y muestra montos consumido/restante

#### Scenario: Presupuesto sin consumo
- **WHEN** no hay egresos en la categoría dentro del periodo
- **THEN** el presupuesto muestra 0% consumido y el monto completo como restante

### Requirement: Alertas de presupuesto
La app SHALL notificar al usuario en el dashboard cuando un presupuesto alcanza el 80% y cuando supera el 100% del límite. Estos umbrales SHALL mostrarse visualmente en la barra de progreso (color de advertencia y color de excedido).

#### Scenario: Umbral del 80%
- **WHEN** el consumo de un presupuesto llega al 80% del límite
- **THEN** la barra cambia a estado de advertencia y se muestra un aviso en el dashboard

#### Scenario: Presupuesto superado
- **WHEN** el consumo de un presupuesto supera el 100% del límite
- **THEN** la barra muestra el estado de excedido, el monto restante aparece en negativo y se muestra un aviso en el dashboard

#### Scenario: Recuperación tras advertencia
- **WHEN** el usuario ajusta el límite de un presupuesto y el consumo vuelve a estar por debajo del 80%
- **THEN** el aviso de advertencia desaparece y la barra vuelve al estado normal