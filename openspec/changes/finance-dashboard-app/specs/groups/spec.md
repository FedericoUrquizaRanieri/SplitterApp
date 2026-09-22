## Purpose

Permite armar grupos de personas, registrar gastos compartidos divididos entre los miembros participantes, registrar pagos de deuda entre miembros y conocer el saldo neto de cada miembro (a quién se le debe y quién debe). Es un libro contable aislado de las finanzas personales.

## ADDED Requirements

### Requirement: Administración de grupos
El usuario SHALL poder crear, renombrar y eliminar grupos desde una pestaña "Grupos". Cada grupo SHALL tener un nombre y una lista de miembros.

#### Scenario: Crear un grupo
- **WHEN** el usuario crea un grupo con un nombre
- **THEN** el grupo aparece en la pestaña Grupos sin miembros ni gastos

#### Scenario: Renombrar un grupo
- **WHEN** el usuario cambia el nombre de un grupo y confirma
- **THEN** el grupo se muestra con el nuevo nombre y conserva sus miembros, gastos y pagos

#### Scenario: Eliminar un grupo
- **WHEN** el usuario confirma la eliminación de un grupo
- **THEN** el grupo desaparece junto con sus miembros, gastos y pagos, sin afectar cuentas, categorías ni transacciones personales

### Requirement: Administración de miembros
El usuario SHALL poder agregar, renombrar y quitar miembros de un grupo. Los miembros SHALL identificarse por nombre y ser administrados por el dueño de la app (no son usuarios con cuenta propia ni reciben invitaciones).

#### Scenario: Agregar un miembro
- **WHEN** el usuario agrega un miembro con un nombre a un grupo
- **THEN** el miembro aparece en el grupo con saldo neto cero y queda disponible como pagador y participante

#### Scenario: Quitar un miembro con saldo pendiente
- **WHEN** el usuario intenta quitar un miembro cuyo saldo neto es distinto de cero
- **THEN** la app impide la acción y muestra el saldo pendiente que debe saldarse antes de quitarlo

#### Scenario: Quitar un miembro al día
- **WHEN** el usuario quita un miembro con saldo neto cero
- **THEN** el miembro deja de mostrarse en el grupo y de ofrecerse como pagador o participante, sus gastos y pagos históricos se conservan y los saldos de los demás no cambian

### Requirement: Registro de gastos de grupo
El usuario SHALL poder registrar un gasto de grupo indicando descripción, monto, fecha, el miembro que pagó y los miembros participantes del reparto. El pagador SHALL poder ser cualquier miembro. Por defecto participan todos los miembros y el usuario SHALL poder excluir miembros del reparto. El monto SHALL dividirse en partes iguales entre los participantes; la suma de las partes SHALL ser igual al monto y el resto de una división no exacta SHALL asignarse al pagador si participa, o de lo contrario al primer participante en orden determinista.

#### Scenario: Gasto dividido entre todos
- **WHEN** el usuario registra un gasto de $90 pagado por Ana en un grupo de tres miembros sin excluir a nadie
- **THEN** cada miembro tiene una parte de $30 y el saldo neto de Ana aumenta en $60

#### Scenario: Excluir participantes
- **WHEN** el usuario registra un gasto excluyendo a un miembro del reparto
- **THEN** el miembro excluido no tiene parte en ese gasto y el monto se divide solo entre los participantes seleccionados

#### Scenario: División no exacta
- **WHEN** el usuario registra un gasto de $100 pagado por Ana y dividido entre tres participantes que incluyen a Ana
- **THEN** las partes son $33,34 para Ana y $33,33 para cada uno de los otros dos, y la suma de las partes es exactamente $100

#### Scenario: Gasto inválido
- **WHEN** el usuario confirma un gasto con monto menor o igual a cero o sin ningún participante
- **THEN** se muestra un mensaje de error y el gasto no se guarda

### Requirement: Edición y eliminación de gastos de grupo
El usuario SHALL poder editar cualquier campo de un gasto de grupo (incluidos pagador y participantes) o eliminarlo previa confirmación. Al editar, las partes SHALL recalcularse con la misma regla de reparto, y los saldos netos SHALL recalcularse en ambos casos.

#### Scenario: Editar el monto de un gasto
- **WHEN** el usuario cambia el monto de un gasto de grupo y confirma
- **THEN** las partes se recalculan y los saldos netos de los miembros reflejan el nuevo reparto

#### Scenario: Eliminar un gasto
- **WHEN** el usuario confirma la eliminación de un gasto de grupo
- **THEN** el gasto desaparece y los saldos netos se recalculan como si nunca se hubiera registrado

### Requirement: Registro de pagos de deuda
El usuario SHALL poder registrar un pago de deuda entre dos miembros distintos del mismo grupo indicando quién paga, quién recibe, monto y fecha. El usuario SHALL poder eliminar un pago registrado. Los pagos SHALL impactar en los saldos netos de ambos miembros.

#### Scenario: Registrar un pago
- **WHEN** Bruno, que debe $30, registra un pago de $30 a Ana
- **THEN** el saldo neto de Bruno pasa a cero y el de Ana se reduce en $30

#### Scenario: Pago parcial
- **WHEN** un miembro que debe $50 registra un pago de $20 a su acreedor
- **THEN** el miembro queda debiendo $30 y el acreedor ve reducido su saldo a favor en $20

#### Scenario: Pago inválido
- **WHEN** el usuario intenta registrar un pago con monto menor o igual a cero o con el mismo miembro como pagador y receptor
- **THEN** se muestra un mensaje de error y el pago no se guarda

### Requirement: Saldo neto por miembro
La app SHALL mostrar, para cada miembro del grupo, su saldo neto calculado como: lo pagado como pagador de gastos, menos la suma de sus partes en los gastos, más los pagos de deuda que realizó, menos los pagos de deuda que recibió. Un saldo positivo SHALL mostrarse como "le deben" y uno negativo como "debe". El saldo SHALL derivarse siempre de los gastos, partes y pagos almacenados, y la suma de los saldos netos de un grupo SHALL ser cero.

#### Scenario: Vista de saldos
- **WHEN** el usuario abre un grupo
- **THEN** se muestra cada miembro con su saldo neto indicado como "le deben", "debe" o "al día"

#### Scenario: Saldos consistentes
- **WHEN** se registran, editan o eliminan gastos y pagos en un grupo
- **THEN** la suma de los saldos netos de todos los miembros del grupo es cero

### Requirement: Aislamiento de las finanzas personales
Los gastos, partes y pagos de grupo NO SHALL reflejarse en cuentas, categorías, historial de transacciones, presupuestos, análisis ni dashboard personal. Los datos de grupos SHALL persistirse localmente y sincronizarse con el backend con el mismo mecanismo que el resto de los datos (spec `sync`).

#### Scenario: Gasto de grupo no afecta cuentas
- **WHEN** el usuario registra un gasto de grupo
- **THEN** los saldos de cuentas, el historial, los presupuestos y los widgets del dashboard no cambian

#### Scenario: Grupos sin conexión
- **WHEN** el usuario registra gastos o pagos de grupo sin conexión
- **THEN** los datos se guardan localmente y se sincronizan al recuperar la conexión
