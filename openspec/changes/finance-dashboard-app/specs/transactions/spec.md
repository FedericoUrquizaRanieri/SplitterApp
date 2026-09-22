## Purpose

Permite registrar ingresos y egresos mediante un formulario modal, consultar el historial de transacciones y administrar las cuentas y categorías que las clasifican.

## ADDED Requirements

### Requirement: Registro de una transacción mediante modal
El usuario SHALL poder registrar un ingreso o un egreso mediante un modal que solicita: tipo (egreso/ingreso), monto, categoría, cuenta, fecha y nota opcional. Al confirmar, la transacción SHALL quedar guardada, reflejarse en el historial y actualizar el saldo de la cuenta y las métricas del dashboard.

#### Scenario: Alta de un egreso
- **WHEN** el usuario abre el modal, ingresa un monto válido, elige categoría, cuenta y confirma
- **THEN** el egreso se guarda, aparece en el historial y el saldo de la cuenta se reduce

#### Scenario: Alta de un ingreso
- **WHEN** el usuario registra una transacción con tipo ingreso y confirma
- **THEN** el ingreso se guarda con signo positivo, aparece en el historial y el saldo de la cuenta aumenta

#### Scenario: Cancelar la carga
- **WHEN** el usuario abre el modal y lo cierra sin confirmar
- **THEN** no se guarda ninguna transacción y no se modifican saldos ni métricas

### Requirement: Validación de datos de la transacción
El monto SHALL ser un número positivo mayor a cero. La categoría SHALL ser obligatoria para los egresos. La cuenta SHALL ser siempre obligatoria. Cuando los datos no son válidos, la app SHALL mostrar el error correspondiente y NO guardar la transacción.

#### Scenario: Monto inválido
- **WHEN** el usuario confirma con monto menor o igual a cero
- **THEN** se muestra un mensaje de error y la transacción no se guarda

#### Scenario: Egreso sin categoría
- **WHEN** el usuario confirma un egreso sin seleccionar categoría
- **THEN** se muestra un mensaje indicando que la categoría es requerida y la transacción no se guarda

#### Scenario: Fecha por defecto
- **WHEN** el usuario abre el modal sin editar la fecha
- **THEN** la fecha toma el valor del día actual y la transacción se registra en ese periodo

### Requirement: Historial de transacciones
El usuario SHALL poder consultar el historial de transacciones en una lista agrupada por periodo (mes), mostrando por cada transacción su tipo, monto con signo, categoría, cuenta y fecha. El historial SHALL permitir filtrar por tipo (ingresos/egresos), por rango de fechas y por categoría, y buscar por texto en las notas.

#### Scenario: Listar transacciones agrupadas
- **WHEN** el usuario abre el historial
- **THEN** las transacciones se muestran agrupadas por mes, ordenadas de más reciente a más antigua dentro de cada grupo

#### Scenario: Filtrar por tipo
- **WHEN** el usuario aplica el filtro "solo egresos"
- **THEN** el historial muestra únicamente egresos y el total del periodo refleja solo ese tipo

#### Scenario: Filtrar por rango de fechas
- **WHEN** el usuario selecciona un rango de fechas en el historial
- **THEN** solo se muestran transacciones dentro del rango

#### Scenario: Buscar por notas
- **WHEN** el usuario escribe texto en el buscador del historial
- **THEN** se muestran solo las transacciones cuyas notas contienen el texto buscado

### Requirement: Edición y eliminación de transacciones
El usuario SHALL poder abrir el detalle de una transacción desde el historial, editar sus campos y guardar, o eliminarla previa confirmación. En ambos casos los saldos y las métricas del dashboard SHALL recalcularse en consecuencia.

#### Scenario: Editar una transacción
- **WHEN** el usuario modifica el monto o categoría de una transacción y confirma
- **THEN** la transacción queda actualizada y el saldo de la cuenta y las métricas reflejan el cambio

#### Scenario: Eliminar una transacción
- **WHEN** el usuario confirma la eliminación de una transacción
- **THEN** la transacción desaparece del historial y el saldo de la cuenta y las métricas se recalculan

#### Scenario: Cancelar la eliminación
- **WHEN** el usuario desiste de la confirmación de borrado
- **THEN** la transacción permanece intacta

### Requirement: Administración de cuentas
El usuario SHALL poder crear cuentas (nombre, tipo y saldo inicial), consultar su saldo actual, y editarlas o eliminarlas. El saldo actual de cada cuenta SHALL reflejar el saldo inicial más el neto de sus transacciones.

#### Scenario: Crear una cuenta
- **WHEN** el usuario crea una cuenta con nombre, tipo y saldo inicial
- **THEN** la cuenta aparece en la lista con su saldo inicial como saldo actual

#### Scenario: El saldo refleja las transacciones
- **WHEN** se registra un egreso con una cuenta asociada
- **THEN** el saldo actual de esa cuenta disminuye en ese monto

#### Scenario: Eliminar una cuenta con movimientos
- **WHEN** el usuario intenta eliminar una cuenta que tiene transacciones asociadas
- **THEN** la app pide confirmación y, al confirmar, elimina la cuenta y describe el destino alternativo de sus transacciones

### Requirement: Administración de categorías de gastos
El usuario SHALL poder crear, renombrar, cambiar el color y eliminar categorías, y SHALL poder agruparlas. Al primer uso, la app SHALL sembrar un conjunto de categorías por defecto. Los egresos quedan clasificados por una categoría; al eliminar una categoría con transacciones asociadas, esas transacciones SHALL pasar a una categoría "Sin categoría".

#### Scenario: Categorías por defecto al primer uso
- **WHEN** el usuario usa la app por primera vez
- **THEN** existe un conjunto predeterminado de categorías (alimentación, transporte, vivienda, ocio, salud, etc.) listo para asignar

#### Scenario: Crear una categoría
- **WHEN** el usuario crea una categoría con nombre y color
- **THEN** la categoría queda disponible para asignar a nuevos egresos

#### Scenario: Eliminar categoría con movimientos
- **WHEN** el usuario elimina una categoría que tiene egresos asociados
- **THEN** los egresos asociados quedan reclasificados como "Sin categoría" y la categoría desaparece de la lista