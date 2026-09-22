## Purpose

Provee los gráficos para analizar cuentas, balances e ingresos y egresos, junto con herramientas para operar y filtrar estas visualizaciones.

## ADDED Requirements

### Requirement: Gráficos de cuentas y balances
El usuario SHALL poder visualizar la evolución del balance de cada cuenta a lo largo del tiempo y el balance total agregado. Los gráficos de cuentas SHALL permitir incluir o excluir cuentas de la visualización.

#### Scenario: Evolución del balance de una cuenta
- **WHEN** el usuario selecciona una cuenta en el análisis
- **THEN** se muestra un gráfico de línea con la evolución de su balance y un marcador con el balance actual

#### Scenario: Incluir y excluir cuentas
- **WHEN** el usuario excluye una cuenta de la visualización
- **THEN** el gráfico y el balance total se recalculan sin esa cuenta, y al volver a incluirla se restaura

#### Scenario: Cuenta sin movimientos
- **WHEN** una cuenta no tiene transacciones en el periodo
- **THEN** el gráfico muestra su balance inicial constante y un estado vacío solo si tampoco tiene saldo inicial

### Requirement: Análisis de ingresos y egresos
El usuario SHALL poder visualizar gráficos comparativos de ingresos contra egresos por periodo (barras agrupadas), la distribución de egresos por categoría (sector) y la tendencia temporal de los montos.

#### Scenario: Barras de ingresos vs egresos
- **WHEN** el usuario abre el análisis por periodo
- **THEN** se muestran barras agrupadas por periodo comparando ingresos y egresos

#### Scenario: Distribución por categoría
- **WHEN** el usuario abre la distribución de egresos
- **THEN** se muestra un gráfico de sectores con el porcentaje de cada categoría sobre el total de egresos del periodo

#### Scenario: Tendencias temporales
- **WHEN** el usuario consulta la serie temporal de montos
- **THEN** se muestra la evolución de ingresos y egresos en el tiempo, permitiendo visualizar picos y caídas

### Requirement: Filtrado de gráficos
Todo gráfico SHALL reflejar los filtros activos de rango de fechas, categorías, cuentas y tipo. Los filtros aplicados a un gráfico SHALL persistir mientras el usuario no los modifique.

#### Scenario: Filtrar por rango de fechas
- **WHEN** el usuario establece un rango de fechas en el análisis
- **THEN** todos los gráficos del análisis se recalculan usando solo las transacciones del rango

#### Scenario: Filtrar por categoría
- **WHEN** el usuario selecciona solo algunas categorías
- **THEN** los gráficos de egresos y de distribución se recalculan con esas categorías

#### Scenario: Filtrar por cuenta
- **WHEN** el usuario selecciona una cuenta específica
- **THEN** los gráficos muestran únicamente las transacciones de esa cuenta

### Requirement: Herramientas de operación de gráficos
El usuario SHALL poder operar los gráficos: cambiar la granularidad temporal (día/semana/mes/año), hacer zoom y desplazamiento en series temporales, comparar periodos y explorar segmentos. La interacción con un punto o segmento SHALL mostrar el detalle del valor y permitir profundizar.

#### Scenario: Cambiar la granularidad
- **WHEN** el usuario cambia la agregación de "mes" a "semana"
- **THEN** el gráfico se reagrupa mostrando los datos en la nueva granularidad

#### Scenario: Zoom y desplazamiento en series temporales
- **WHEN** el usuario hace zoom sobre un tramo de la serie temporal
- **THEN** el gráfico amplía ese tramo y permite desplazarse a lo largo del rango completo

#### Scenario: Comparar periodos
- **WHEN** el usuario activa la comparación con el periodo anterior
- **THEN** el gráfico superpone ambos periodos y muestra la variación porcentual

#### Scenario: Explorar un segmento de sectores
- **WHEN** el usuario selecciona un sector del gráfico de distribución
- **THEN** se muestra el desglose de las transacciones de esa categoría y el resto del gráfico se reescala a las categorías restantes