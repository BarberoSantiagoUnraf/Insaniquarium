# Instrucción 01 — Fundamentos de la IA de peces

## Objetivo

Preparar la estructura técnica sobre la que se implementará la IA de las tres especies: mojarrita, surubí y dientudo.

Esta etapa debe establecer los datos individuales, parámetros configurables y responsabilidades de los sistemas.

**No implementar todavía comportamientos, movimiento, visión, alimentación ni persecución.**

## 1. Revisar el proyecto existente

Antes de modificar archivos:

- Inspeccionar la estructura actual del proyecto.
- Identificar cómo se crean, representan y administran actualmente los peces.
- Reutilizar los sistemas existentes cuando corresponda.
- No reemplazar ni reestructurar funcionalidades que ya funcionan sin una necesidad justificada.
- Mantener la compatibilidad con Phaser y las convenciones actuales del proyecto.

## 2. Datos individuales del pez

Preparar una estructura de datos común para todas las especies.

Debe contemplar:

- Identificador único.
- Especie.
- Etapa de crecimiento.
- Escala individual.
- Instinto.
- Peso efectivo.
- Progreso de crecimiento.
- Estado de hambre.
- Temporizador de hambre.
- Temporizador de supervivencia.
- Posición.
- Orientación.

La escala individual debe generarse aleatoriamente entre 0.7 y 1.3.

El instinto debe generarse aleatoriamente entre 2 y 8.

Ambos valores deben permanecer constantes durante la vida del pez.

Separar los datos persistentes de los datos temporales utilizados durante la simulación.

## 3. Configuraciones por especie

Crear una configuración centralizada para cada especie.

Debe permitir definir posteriormente:

- Velocidad habitual.
- Intervalo de cambio de dirección.
- Rango de visión.
- Tiempo de recuperación visual.
- Parámetros de Boost.
- Duración de evasión.
- Tiempo máximo de persecución.
- Duración de confort.
- Duración de rendición.
- Peso base por etapa.
- Parámetros de hambre y supervivencia.

No inventar valores definitivos para parámetros todavía no establecidos.

Utilizar valores provisionales únicamente cuando sean necesarios para inicializar el sistema, identificándolos claramente como tales.

## 4. Parámetros individuales derivados

Preparar la posibilidad de calcular los parámetros efectivos de cada pez a partir de su configuración de especie y su escala individual.

Por ejemplo:

- Rango de visión efectivo.
- Velocidad de Boost.
- Duración de Boost.
- Cooldown de Boost.
- Duración de evasión.

Las fórmulas deben poder ajustarse centralizadamente.

No duplicar cálculos ni almacenar innecesariamente valores que puedan derivarse de otros datos.

## 5. Estructura de estados de comportamiento

Preparar una estructura que permita representar los siguientes estados:

- Movimiento habitual.
- Búsqueda de alimento.
- Aproximación a presa.
- Persecución.
- Embestida.
- Evasión.
- Confort.
- Rendición.

Por ahora, únicamente preparar su representación y transición futura.

No implementar sus comportamientos ni temporizadores.

La estructura debe permitir priorizar la evasión sobre cualquier otro estado.

## 6. Separación de responsabilidades

Preparar las responsabilidades de los siguientes sistemas:

- Fish AI Controller: coordina el comportamiento individual.
- Vision System: detecta entidades.
- Movement Controller: ejecuta desplazamientos.
- Hunger System: administra hambre y supervivencia.
- Feeding System: administra el consumo.
- Behavior System: gestiona los comportamientos.
- Entity Manager: administra las entidades activas.

No es necesario implementar todavía todos estos sistemas. Crear únicamente las estructuras y dependencias necesarias para que puedan incorporarse progresivamente.

Evitar crear clases, interfaces o abstracciones que no tengan una utilidad concreta en esta etapa.

## 7. Persistencia

Preparar los datos para que posteriormente puedan guardarse y restaurarse.

Diferenciar claramente:

- Datos persistentes del pez.
- Datos temporales de la simulación.
- Referencias a otras entidades.

No implementar todavía el guardado ni la carga.

## 8. Criterios de aceptación

La tarea estará terminada cuando:

1. Las tres especies puedan utilizar la misma estructura de datos.
2. Cada pez tenga identificador, escala e instinto individuales.
3. Los valores individuales se generen dentro de sus rangos establecidos.
4. Existan configuraciones independientes por especie.
5. Los parámetros derivados puedan calcularse desde la configuración y escala.
6. Los estados de comportamiento estén representados.
7. Las responsabilidades estén separadas y preparadas para futuras implementaciones.
8. Los peces existentes continúen funcionando correctamente.
9. No se hayan implementado comportamientos que todavía no corresponden a esta etapa.

## Restricciones

- No implementar movimiento.
- No implementar visión.
- No implementar detección.
- No implementar alimentación.
- No implementar persecución.
- No implementar evasión.
- No implementar crecimiento.
- No implementar persistencia.
- No implementar Object Pooling.
- No modificar el HUD ni la economía.

Al finalizar, informar:

- Archivos creados y modificados.
- Responsabilidad de cada archivo.
- Decisiones técnicas relevantes.
- Pruebas realizadas.
- Problemas encontrados o decisiones que requieran confirmación.

No avanzar automáticamente a la siguiente instrucción.