## Purpose

Garantiza la persistencia local de los datos financieros y su sincronización con un backend propio para respaldo y operación multi-dispositivo monousuario.

## ADDED Requirements

### Requirement: Persistencia local
La app SHALL almacenar localmente todos los datos (transacciones, cuentas, categorías, presupuestos, configuración del dashboard y grupos con sus miembros, gastos, partes y pagos) y SHALL ser totalmente funcional sin conexión: leer, crear, editar y eliminar datos mientras está sin conexión.

#### Scenario: Operación sin conexión
- **WHEN** el dispositivo no tiene conexión de red
- **THEN** el usuario puede registrar transacciones, editar y consultar todo su historial sin errores

#### Scenario: Datos disponibles desde el primer arranque
- **WHEN** el usuario abre la app sin conexión
- **THEN** todos los datos previamente sincronizados están disponibles desde la base local

### Requirement: Sincronización con el backend
La app SHALL sincronizar sus cambios con el backend: enviar los cambios locales pendientes y recibir los cambios remotos. La sincronización SHALL ejecutarse al iniciar la app, al volver a tener conexión y en segundo plano de forma periódica, además de ofrecer sincronización manual.

#### Scenario: Sincronización al iniciar
- **WHEN** la app se abre con conexión disponible
- **THEN** se envían los cambios locales pendientes y se descargan los cambios remotos más recientes

#### Scenario: Cambio local se propaga al backend
- **WHEN** el usuario crea una transacción estando en línea
- **THEN** la transacción llega al backend y queda marcada como sincronizada localmente

#### Scenario: Recuperación de conexión
- **WHEN** la app vuelve a tener conexión tras haber estado sin conexión
- **THEN** la app sincroniza automáticamente todos los cambios locales pendientes

#### Scenario: Falla de red durante la sincronización
- **WHEN** una sincronización falla por error de red
- **THEN** los cambios pendientes se conservan localmente y la app reintenta en la siguiente oportunidad sin perder datos

### Requirement: Resolución de conflictos de sincronización
Cuando un mismo dato fue modificado en dos dispositivos, la app SHALL resolver el conflicto de forma determinista manteniendo la versión modificada más reciente, sin bloquear la operación del usuario y sin duplicar datos.

#### Scenario: Conflicto entre dispositivos
- **WHEN** el mismo presupuesto fue modificado en dos dispositivos con fechas de modificación distintas
- **THEN** al sincronizar queda vigente la versión con la fecha de modificación más reciente y la otra se descarta

#### Scenario: El usuario no pierde cambios
- **WHEN** un cambio local entra en conflicto con uno remoto durante la sincronización
- **THEN** ninguna de las dos versiones se pierde silenciosamente y el resultado final es una única versión consistente

### Requirement: Indicador de estado de sincronización
La app SHALL mostrar el estado de la sincronización (sincronizado, sincronizando, sin conexión, error) y SHALL ofrecer una acción manual de "sincronizar ahora".

#### Scenario: Estados visibles
- **WHEN** la sincronización cambia de estado (por ejemplo de "sin conexión" a "sincronizando")
- **THEN** el indicador de estado se actualiza en la interfaz mostrando el nuevo estado

#### Scenario: Sincronización manual
- **WHEN** el usuario activa "sincronizar ahora"
- **THEN** la app ejecuta la sincronización de inmediato y actualiza el indicador con el resultado

### Requirement: Monousuario sin autenticación
La app SHALL operar en modo monousuario sin login: un único flujo de datos por instalación, sin selección de cuenta ni credenciales en esta fase.

#### Scenario: Acceso directo a los datos
- **WHEN** el usuario abre la app por primera vez
- **THEN** puede usar todas las funciones inmediatamente sin pantalla de login ni registro