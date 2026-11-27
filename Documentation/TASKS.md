# Project Development Rules
## Before working
- Read CURRENT_STATE.md.
- Consult ARCHITECTURE.md when changing systems.
- Consult PROJECT.md when necessary.
## During development
- Understand existing code before modifying it.
- Avoid unnecessary dependencies.
- Keep systems modular.
- Do not duplicate existing functionality.
## After completing a task
- Update CURRENT_STATE.md.
- Update TASKS.md.
- Record important changes in CHANGELOG.md.
- Verify that the implementation works.
## Context management
- Never assume previous conversation history
  is available.
- Treat project documentation as the source
  of truth.
- [x] Corregir la formula de velocidad de Boost para que sea inversamente proporcional a la escala.
- [x] Incorporar los cuatro estadios de crecimiento definidos, incluyendo Viejo, sin implementar todavia el crecimiento.
- [x] Revisar que las configuraciones de peso base contemplen los cuatro estadios, aunque sus valores permanezcan provisionales.
# Instruccion 02 - Movimiento habitual de los peces
## Objetivo
Implementar el movimiento habitual de los peces dentro de la pileta. Los peces deben desplazarse continuamente con un comportamiento natural, evitando movimientos excesivamente mecanicos.
Esta instruccion contempla exclusivamente el movimiento habitual. No implementar todavia alimentacion, hambre, persecucion, evasion ni otros comportamientos de IA.
## 1. Inspeccion previa
Antes de modificar el codigo:
- Inspeccionar la estructura actual del proyecto.
- Revisar los datos y configuraciones de peces implementados en la Instruccion 01.
- Reutilizar las estructuras existentes siempre que sea posible.
- Mantener Phaser y la arquitectura actual.
- Evitar reestructuraciones innecesarias.
## 2. Movimiento habitual
Todos los peces deben desplazarse continuamente mientras estan en movimiento habitual.
El comportamiento debe seguir estas reglas:
- Cada pez mantiene un rumbo durante un intervalo de tiempo fijo.
- Al finalizar ese intervalo, selecciona un nuevo rumbo completamente aleatorio.
- El cambio de rumbo debe tener pequeñas variaciones progresivas para evitar movimientos artificiales.
- No implementar sistemas complejos de rotacion gradual del sprite.
- El movimiento debe continuar hasta que otro comportamiento tenga prioridad.
El intervalo de cambio de rumbo debe ser configurable individualmente por especie.
## 3. Velocidad
Cada especie tendra una velocidad habitual base configurable.
- La velocidad debe fluctuar ligeramente durante el desplazamiento.
- Las fluctuaciones deben ser aleatorias y moderadas.
- La velocidad no debe cambiar bruscamente.
- La escala individual del pez debe afectar su velocidad segun las reglas de parametros derivados ya establecidas.
- Las fluctuaciones no deben modificar permanentemente la velocidad base ni los datos persistentes del pez.
No establecer valores definitivos arbitrarios sin necesidad. Si se necesitan valores iniciales para probar el sistema, identificarlos como provisionales y centralizarlos en la configuracion correspondiente.
## 4. Limites de la pileta
Cuando un pez alcanza un borde de la zona de juego:
- Debe cambiar inmediatamente su rumbo hacia el centro de la pileta.
- No debe continuar desplazandose fuera del area jugable.
- El nuevo rumbo debe evitar que el pez permanezca atrapado contra los bordes.
El comportamiento debe considerar el tamaño efectivo del pez para evitar que parte de su representacion atraviese los limites.
## 5. Obstaculos fijos
El movimiento habitual debe contemplar obstaculos fijos dentro de la pileta.
Cuando un pez detecta que su trayectoria lo llevaria contra un obstaculo:
- Cambia inmediatamente de rumbo.
- Selecciona aleatoriamente una direccion que permita evitarlo.
- No intenta rodear el obstaculo.
- No intenta recuperar su rumbo anterior.
Evitar implementar navegacion compleja, busqueda de caminos o sistemas de evacion innecesariamente sofisticados.
La deteccion debe ser suficientemente anticipada para evitar que el pez atraviese el obstaculo antes de cambiar de direccion.
## 6. Separacion de responsabilidades
Mantener separadas las responsabilidades:
- Fish AI Controller: determina que comportamiento debe ejecutar el pez.
- Movement Controller: ejecuta el desplazamiento y administra el rumbo y la velocidad.
- Configuracion de especie: proporciona los parametros de movimiento correspondientes.
No introducir dependencias innecesarias entre el movimiento y otros sistemas.
El movimiento habitual debe poder interrumpirse posteriormente cuando la IA necesite ejecutar otro comportamiento.
## 7. Restricciones
No implementar:
- Busqueda de alimento.
- Hambre o supervivencia.
- Persecucion de presas.
- Embestidas o Boost.
- Evasion de depredadores.
- Cardumen o cohesion entre peces.
- Crecimiento o cambios de etapa.
- Nuevos sistemas de persistencia.
- Object Pooling.
- Navegacion avanzada o pathfinding.
No modificar innecesariamente el HUD, la economia ni los sistemas existentes.
## 8. Criterios de aceptacion
La implementacion se considera terminada cuando:
1. Los peces pueden desplazarse continuamente.
2. Mantienen su rumbo durante intervalos fijos configurables por especie.
3. Seleccionan nuevos rumbos aleatorios.
4. El movimiento presenta pequeiñas variaciones progresivas.
5. La velocidad fluctua ligeramente sin cambios bruscos.
6. La escala individual afecta correctamente los parimetros correspondientes.
7. Los peces cambian de rumbo hacia el centro al alcanzar los bordes.
8. Los peces detectan obsticulos fijos y cambian de rumbo para evitarlos.
9. No atraviesan los limites ni los obsticulos.
10. Los tres tipos de peces pueden utilizar el mismo sistema con configuraciones diferentes.
11. Los sistemas existentes siguen funcionando correctamente.
## 9. Informe final
Al terminar, informar:
- Archivos creados y modificados.
- Responsabilidad de cada componente.
- Decisiones ticnicas tomadas.
- Parimetros configurables y valores provisionales.
- Pruebas realizadas y resultados.
- Problemas encontrados y decisiones pendientes.
No comenzar automiticamente la siguiente instruccion. Esperar la revision y aprobacion del usuario.
# Instruccion 03 - Sistema de vision de los peces
Objetivo
Implementar el sistema de percepcion visual de los peces. Debe permitir detectar entidades cercanas dentro del campo visual y conservar informacion sobre su ultima posicion conocida.
Esta instruccion implementa exclusivamente la percepcion. No debe implementar todavia evasion, alimentacion, persecucion ni decisiones de comportamiento.
1. Campo visual
Cada pez tiene un unico rango de vision, definido por especie.
El campo visual es un cono de aproximadamente 270,i%, con un punto ciego posterior de aproximadamente 90,i%.
La vision sigue la orientacion de la cabeza del pez, no su direccion de desplazamiento.
Retroceder no modifica la orientacion visual.
El alcance efectivo se calcula aplicando la escala individual del pez al rango base de su especie.
No utilizar distancias diferentes para detectar alimento, presas, amenazas o compai%eros.
2. Entidades detectables
El sistema debe poder identificar y clasificar las entidades detectadas como:
Alimento.
Presa.
Amenaza o depredador.
Compai%ero de especie.
La clasificacion debe proporcionar informacion a los sistemas de comportamiento, pero no decidir qui debe hacer el pez.
La reaccion ante cada categoria dependeri posteriormente de la IA, el hambre, el instinto y las reglas de comportamiento.
3. Pirdida de contacto visual
Cuando una entidad detectada sale del campo visual o supera el alcance:
Conservar su ultima posicion conocida.
Permitir que los sistemas de comportamiento consulten esa posicion.
Iniciar un temporizador de recuperacion visual.
Mientras el temporizador siga activo, el pez puede intentar recuperar el contacto visual cuando se implementen los comportamientos correspondientes.
Al vencer el temporizador, dejar de considerar vilida la ultima posicion conocida.
La recuperacion visual y la duracion mixima de persecucion deben utilizar temporizadores independientes. Recuperar contacto visual no debe reiniciar el temporizador miximo de persecucion.
4. Configuracion y arquitectura
Reutilizar FISH_CONFIG y el sistema de parimetros derivados existente.
Incorporar el rango base de vision por especie sin inventar valores definitivos.
Aplicar la escala individual mediante las formulas centralizadas.
Mantener separadas las responsabilidades del sistema de vision y del controlador de IA.
Evitar duplicar cilculos o almacenar parimetros derivados innecesariamente.
Reutilizar los datos y referencias de entidades existentes.
5. Limites de esta instruccion
NO implementar:
Evasion.
Alimentacion ni consumo de alimento.
Persecucion de presas.
Embestidas o Boost.
Cambios de estado por deteccion.
Movimiento adicional.
Cardumen.
Crecimiento.
Persistencia o guardado nuevo.
HUD o economia.
No inventar duraciones ni valores de alcance que todavia no estin definidos. Mantener los valores pendientes como configurables o provisionales.
6. Criterios de aceptacion
Todos los peces utilizan el mismo sistema de vision.
Cada especie puede tener su propio rango base.
La escala individual modifica correctamente el alcance.
El campo visual respeta el cono de 270,i% y el punto ciego posterior.
La orientacion visual depende de la cabeza y no del desplazamiento.
Se detectan y clasifican correctamente las cuatro categorias de entidades.
Se conserva la ultima posicion conocida cuando se pierde contacto.
La recuperacion visual tiene un temporizador independiente.
El sistema no ejecuta comportamientos ni modifica el movimiento habitual.
Los peces siguen funcionando correctamente y no se introducen regresiones.
7. Informe de implementacion
Al finalizar, informar:
Archivos creados y modificados.
Responsabilidades de cada componente.
Como se calcula el campo visual y el alcance efectivo.
Como se clasifican las entidades.
Como funciona la pirdida y recuperacion de contacto.
Valores provisionales utilizados y parimetros pendientes.
Pruebas realizadas y resultados.
Problemas encontrados o decisiones que requieran confirmacion.
No comenzar la siguiente instruccion automiticamente.
- [x] Instruccion 03 - Sistema de vision: percepcion con cono 270,i%, clasificacion, ultima posicion conocida y recuperacion visual independiente.
Tareas de correccion ��� Instruccion 03: Sistema de vision
Objetivo
Corregir los problemas detectados durante la revision de la implementacion del sistema de vision, sin rehacer los componentes que ya funcionan ni adelantar comportamientos que corresponden a instrucciones posteriores.
1. Corregir la clasificacion de peces segun su dieta
Eliminar la comparacion de effectiveWeight como criterio para determinar relaciones de depredacion.
La clasificacion debe basarse exclusivamente en la dieta de cada especie y su etapa de desarrollo.
Dieta de la mojarrita
Todas las etapas consumen unicamente alimento base.
La mojarrita se considera presa durante toda su vida.
Dieta del dientudo
Larva: alimento base y mojarrita larva.
Joven: alimento base y mojarrita hasta joven.
Adulto: alimento base, mojarrita hasta vieja y surubi larva.
Viejo: alimento base, mojarrita hasta vieja y surubi hasta joven.
Dieta del surubi
Larva: alimento base.
Joven: mojarrita larva y dientudo larva.
Adulto: mojarrita hasta joven y dientudo larva.
Viejo: mojarrita hasta vieja y dientudo hasta joven.
Regla: cuando se indica ,ihasta,%W% una etapa, se incluyen todas las etapas anteriores.
Criterios de clasificacion visual
PREY: el pez observado puede ser consumido por el pez que observa, segun su dieta y etapa.
THREAT: el pez observado puede consumir al pez que observa, segun su dieta y etapa.
COMPANION: pez de la misma especie.
FOOD: alimento base.
La clasificacion debe consultar una unica fuente de configuracion de dietas, evitando duplicar reglas en VisionSystem.
No utilizar el peso efectivo ni la escala individual para decidir relaciones depredador-presa.
No implementar todavia el ataque, la persecucion ni el consumo de presas.
2. Corregir la orientacion del campo visual
Actualmente, getHeadAngle() solamente contempla orientacion horizontal (izquierda o derecha).
Revisar como se representa la orientacion real de la cabeza del pez y determinar si el sistema puede obtener una direccion visual coherente con la representacion actual.
El campo visual debe seguir la orientacion de la cabeza.
No debe depender de la direccion de desplazamiento.
Retroceder no debe modificar la orientacion visual.
Mantener el cono de 270,i% y el punto ciego posterior de 90,i%.
Si la representacion actual del pez solamente permite orientacion horizontal, documentar esa limitacion y no inventar una rotacion visual que el sprite no representa.
3. Corregir la documentacion
Revisar especificamente:
Documentation/ARCHITECTURE.md
Documentation/CHANGELOG.md
Corregir los caracteres de escape y secuencias de control que hayan alterado el texto, especialmente en las secciones relacionadas con la implementacion de vision.
Comprobar que nombres de propiedades, rutas, fragmentos de codigo y tirminos ticnicos se lean correctamente.
No reemplazar documentacion existente ni eliminar informacion vilida.
4. Revisar dependencias innecesarias
Comprobar la dependencia de VisionSystem declarada en FishAIController.
Actualmente, la vision se actualiza desde GameScene, por lo que hay que verificar si esa dependencia realmente se utiliza.
Si no tiene una funcion efectiva, eliminarla y limpiar las referencias correspondientes. No modificar la arquitectura general por este motivo.
Restricciones
No rehacer el sistema de vision completo.
No implementar evasion, alimentacion, persecucion, embestidas ni decisiones de comportamiento.
No implementar movimiento adicional.
No modificar el sistema de crecimiento.
No agregar persistencia ni HUD.
No introducir comparaciones de peso para determinar depredacion.
Reutilizar la configuracion y las estructuras existentes siempre que sea posible.
Verificacion y entrega
Al finalizar:
Comprobar que las relaciones de presa y amenaza respeten las dietas y etapas.
Verificar que ninguna presa sea clasificada incorrectamente por su peso.
Comprobar la orientacion del campo visual.
Revisar que la documentacion no contenga caracteres corruptos.
Ejecutar las pruebas y compilacion disponibles.
Informar los archivos modificados, las correcciones realizadas y cualquier limitacion pendiente.
No comenzar una nueva instruccion de desarrollo al terminar.
- [x] Correcciones Instruccion 03: dietas por especie/etapa en fuente unica, sin peso para depredacion; dependencia no usada de vision removida de FishAIController; documentacion de orientacion visual/limitacion.
- [x] Corrección final Instrucción 03: orientación visual desacoplada del movimiento (sin actualización automática desde heading); clasificación de alimento mantiene canConsumeBaseFood() y consumable; documentación restaurada tras reorganización accidental.

# Instrucción 04 — Sistema de evasión de peces

## Objetivo

Implementar el sistema de evasión de amenazas para los peces, utilizando el sistema de visión existente y la arquitectura actual de IA.

La evasión debe permitir que un pez reaccione ante un depredador detectado, interrumpa su actividad actual y se aleje de la amenaza durante un período determinado.

Implementar exclusivamente evasión. No avanzar con alimentación, caza ni otros comportamientos.

## 1. Activación de la evasión

- Un pez puede iniciar evasión cuando detecta una amenaza o depredador mediante `VisionSystem`.
- La activación debe incluir una comprobación del atributo `instinct` individual del pez.
- Instinct es un valor entero aleatorio entre 2 y 8, asignado al crear el pez y persistente durante toda su vida.
- Utilizar el valor existente. No modificar su generación ni persistencia.

La relación entre Instinct y la probabilidad de evasión todavía no está definida numéricamente.

**No inventar probabilidades, umbrales ni fórmulas de conversión.** Revisar las convenciones existentes y, si no hay una regla establecida, informar qué definición falta sin introducir una fórmula arbitraria.

## 2. Prioridad de comportamiento

La evasión debe tener la máxima prioridad entre los comportamientos de IA definidos hasta ahora.

Orden de prioridad:

1. Evasión.
2. Alimentación / caza.
3. Rendición.
4. Cardumen.
5. Confort.

En esta instrucción solo se implementa evasión y su prioridad sobre los comportamientos existentes o futuros.

- Al comenzar la evasión, interrumpir el comportamiento actual.
- Ningún comportamiento de menor prioridad puede reemplazar la evasión mientras esté activa.
- La evasión no debe reiniciarse constantemente por detectar nuevamente al mismo depredador.
- Si el depredador desaparece de la visión, el pez debe continuar huyendo hasta finalizar su duración.

## 3. Duración de la evasión

La duración depende de la escala individual del pez.

Fórmula acordada:

`EvasionDuration = EvasionDurationBase × Scale`

- `EvasionDurationBase` debe ser configurable.
- `Scale` utiliza el valor individual persistente del pez, entre 0.7 y 1.3.
- Los peces más grandes permanecen más tiempo evadiendo.
- Los peces más pequeños finalizan antes.

No establecer un valor base arbitrario si no existe previamente. Si falta, dejarlo configurable e informar el valor provisional elegido, sin ocultarlo ni convertirlo en definitivo.

El temporizador debe ser independiente de la recuperación visual y de cualquier futura duración máxima de persecución.

## 4. Movimiento evasivo

La evasión debe utilizar el `MovementController` existente. No crear un sistema de movimiento paralelo.

- El pez debe alejarse activamente del depredador.
- Comparar la posición del depredador con la dirección de desplazamiento del pez.
- Si la amenaza está delante del pez o sobre su trayectoria, reaccionar cambiando inmediatamente el rumbo hacia una dirección de escape válida.
- Si pierde visión del depredador, continuar el desplazamiento evasivo.
- No regresar al rumbo anterior al finalizar.
- Utilizar Boost si está disponible para ese pez.
- No introducir aceleración compleja, navegación avanzada ni pathfinding.

La evasión debe ser reactiva y simple. No hace falta simular un comportamiento sofisticado de supervivencia.

## 5. Orientación visual

Respetar la separación ya implementada:

- `heading` controla el desplazamiento.
- `orientation` controla la orientación visual de la cabeza.

Cambiar de dirección para escapar no debe modificar automáticamente `orientation`.

No modificar el sistema de orientación visual aprobado en la Instrucción 03.

## 6. Arquitectura y responsabilidades

Revisar la arquitectura existente antes de implementar.

- `VisionSystem`: proporciona información sobre amenazas detectadas y sus posiciones.
- `FishAIController`: coordina prioridades y activación de evasión.
- `MovementController`: ejecuta los cambios de dirección y movimiento evasivo.
- Configuración por especie: aloja los parámetros de evasión que correspondan.

Evitar duplicar información que ya esté disponible en los contactos de visión o en los parámetros derivados del pez.

Si es necesario incorporar un estado de evasión, integrarlo al sistema de estados existente, sin reemplazar ni reorganizar toda la arquitectura.

## 7. Restricciones

No implementar:

- Alimentación ni consumo de alimento.
- Búsqueda de alimento.
- Caza, persecución ni embestidas.
- Comportamiento de cardumen.
- Rendición.
- Confort.
- Nuevas mecánicas de hambre o supervivencia.
- Cambios en el sistema de visión.
- Cambios en la orientación visual.
- Crecimiento, persistencia o economía.
- Nuevos sistemas de movimiento.
- Refactors generales.

No modificar comportamientos ajenos a la evasión salvo que sea imprescindible para integrarla correctamente. Si fuera necesario, explicar el motivo en el informe.

## 8. Verificación

Comprobar:

1. Un pez detecta una amenaza y puede activar evasión.
2. La activación utiliza Instinct sin alterar el atributo individual.
3. La evasión interrumpe el comportamiento de menor prioridad.
4. El pez se aleja del depredador.
5. La evasión continúa aunque el depredador deje de ser visible.
6. El temporizador no se reinicia por detecciones repetidas.
7. La duración respeta `EvasionDurationBase × Scale`.
8. Se utiliza Boost cuando corresponde y está disponible.
9. Al finalizar, el pez continúa con un rumbo válido y no recupera el anterior.
10. El movimiento evasivo no altera la orientación visual.
11. Los peces siguen respetando los límites de la arena.
12. No se producen errores ni regresiones en el movimiento habitual o en la visión.

Si faltan valores o reglas previamente acordadas, identificarlos claramente. No disfrazar decisiones de diseño nuevas como si ya estuvieran establecidas.

## 9. Informe final

Al terminar, informar:

- Archivos modificados.
- Cómo se activa la evasión.
- Cómo se utiliza Instinct.
- Cómo se calcula la duración.
- Cómo decide el rumbo de escape.
- Integración de Boost.
- Prioridad respecto a otros comportamientos.
- Pruebas realizadas y resultado del build.
- Decisiones provisionales pendientes de aprobación.
- Problemas encontrados.

No comenzar alimentación, caza, cardumen ni la siguiente instrucción. Esperar mi revisión y aprobación.


- [x] Instrucción 04 - Sistema de evasión: activación por amenaza/instinct, prioridad máxima, duración EvasionDurationBase*Scale, huida con última posición conocida, boost si disponible, sin alterar orientación visual. Valores provisionales y regla Instinct->probabilidad pendientes.

# Corrección puntual — Instrucción 04: Boost durante la evasión

## Objetivo

Corregir el funcionamiento del Boost dentro del sistema de evasión implementado en la Instrucción 04.

El Boost actual se activa al comenzar la evasión, pero no tiene una duración efectiva configurada. Esto provoca que permanezca activo durante toda la evasión, comportándose como un aumento de velocidad permanente.

Resolver este problema sin inventar valores de duración, cooldown ni nuevas reglas de comportamiento.

## 1. Corregir la activación del Boost

Revisar la lógica de:

- `canUseBoost()`
- `startEvasion()`
- `updateEvasionState()`
- `getEvadeSpeed()`
- Configuración del Boost en `fishConfig.js`

El Boost no debe activarse automáticamente solo porque exista un `boostSpeed` derivado.

Si su configuración todavía no dispone de duración y cooldown válidos, debe considerarse no disponible para su activación.

La evasión debe seguir funcionando normalmente aunque el Boost no esté disponible.

## 2. Evitar Boost indefinido

Actualmente `boostDuration` es `null`, por lo que no existe un tiempo efectivo para finalizar el impulso.

Corregir este comportamiento de forma que:

- Un Boost sin duración definida no pueda activarse.
- No se mantenga un Boost activo indefinidamente.
- No se invente una duración provisional.
- No se invente un cooldown.
- No se altere la duración de la evasión para compensar la ausencia de Boost.

Si el sistema aún no dispone de valores válidos, el pez evade utilizando su velocidad habitual.

## 3. Mantener la estructura existente

Conservar:

- El sistema de evasión actual.
- La detección de amenazas.
- La última posición conocida de la amenaza.
- La duración de evasión proporcional a la escala.
- El movimiento de escape.
- La prioridad de evasión.
- La arquitectura actual de `FishAIController` y `MovementController`.

No crear un nuevo sistema de Boost ni introducir abstracciones innecesarias.

## 4. Restricciones

No modificar:

- Probabilidad de evasión por Instinct.
- Rangos ni campo visual.
- Dietas o clasificación de peces.
- Movimiento habitual.
- Duración de evasión.
- Persecución, alimentación, confort o rendición.
- Crecimiento ni persistencia.
- Economía, HUD o interfaz.
- Valores de duración o cooldown que todavía no hayan sido definidos.

No realizar refactors generales ni cambios de documentación ajenos a esta corrección.

## 5. Verificación

Comprobar que:

1. Un pez puede evadir correctamente sin Boost.
2. El Boost no se activa si su configuración carece de duración válida.
3. No existe un aumento de velocidad permanente durante toda la evasión.
4. La evasión termina según su propio temporizador, independientemente del Boost.
5. No se producen errores cuando `boostSpeed`, `boostDuration` o cooldown son `null`.
6. `npm run build` finaliza correctamente.
7. Los cambios del commit están limitados a la corrección solicitada.

## 6. Informe final

Informar los archivos modificados, el funcionamiento final del Boost, las verificaciones realizadas y cualquier pendiente.

No implementar duración, cooldown ni balance del Boost. No avanzar a otras conductas de IA hasta mi revisión y aprobación.
- [x] Corrección puntual Instrucción 04: Boost no se activa sin duración/cooldown válidos; evasión funciona con velocidad habitual si boost no disponible.

# Instrucción 05 — Sistema de hambre y alimentación básica

Implementar el sistema inicial de hambre y el comportamiento de búsqueda y consumo de alimento base para los peces de **Insanuquarium Deluxe Plus**.

Esta tarea debe respetar la arquitectura y las decisiones ya aprobadas. No inventar valores de balance ni avanzar hacia comportamientos que todavía no están dentro del alcance.

## 1. Antes de implementar

- Revisar la implementación actual de `FishAIController`, `VisionSystem`, `fishData`, `fishConfig`, `behaviorStates` y `systemRoles`.
- Revisar cómo `GameScene` crea, actualiza y elimina los alimentos.
- Reutilizar las estructuras y responsabilidades existentes.
- No duplicar información que ya proporciona `VisionSystem`.
- No modificar sistemas ajenos a esta tarea.

## 2. Sistema de hambre

Implementar la responsabilidad del sistema de hambre, separada del controlador de IA.

Debe contemplar:

- Estado de hambre individual por pez.
- Actualización del hambre mediante `delta`.
- Uso de los parámetros de configuración existentes para determinar los valores y tiempos.
- Temporizador de hambre independiente del temporizador de supervivencia.
- Compatibilidad con la estructura de datos individual del pez.

**Configuración sin valores definidos:**

Los parámetros de hambre que actualmente están en `null` deben permanecer así. No asignar valores predeterminados, aproximados ni provisionales.

Si los parámetros necesarios no tienen valores numéricos finitos y válidos, el sistema debe permanecer inactivo para ese pez. No debe producir `NaN`, divisiones por cero, valores negativos inesperados ni comportamientos automáticos.

No interpretar `null` como cero.

## 3. Búsqueda de alimento base

Implementar la integración entre la IA y la percepción para permitir que un pez busque alimento base cuando corresponda.

Condiciones:

- Utilizar los contactos proporcionados por `VisionSystem`.
- Considerar únicamente alimentos que el pez pueda consumir según `canConsumeBaseFood`.
- No implementar una clasificación de dieta paralela.
- No buscar alimento si el sistema de hambre está inactivo o no tiene parámetros válidos.
- Utilizar la última posición conocida del alimento cuando se pierda el contacto visual, respetando el mecanismo de recuperación existente.
- No inventar umbrales de hambre para iniciar la búsqueda. Si el umbral necesario todavía no está configurado, la búsqueda debe permanecer desactivada.

La búsqueda debe representarse mediante el estado `SEEK_FOOD`, respetando el sistema de prioridades existente.

## 4. Consumo de alimento base

Implementar el mecanismo básico de consumo:

- El pez debe poder consumir un alimento base válido al alcanzar una distancia de interacción adecuada.
- El alimento consumido debe dejar de estar disponible para otros peces.
- La eliminación debe integrarse con el ciclo de vida de alimentos existente en `GameScene`.
- Evitar que dos peces consuman el mismo alimento.
- El consumo debe actualizar el estado de hambre solamente cuando exista una configuración válida para determinar esa actualización.
- Si la cantidad de recuperación de hambre todavía no está configurada, no inventarla ni consumir el alimento de manera que se pierda sin producir un efecto válido.

Mantener separadas las responsabilidades de percepción, decisión de comportamiento, hambre y consumo.

## 5. Supervivencia

Respetar la regla ya acordada:

- El hambre avanza según su configuración.
- El temporizador de supervivencia solo avanza cuando el pez tiene hambre y está buscando alimento.
- No avanzar el temporizador de supervivencia durante otros estados.
- No inventar una duración de supervivencia ni una condición de muerte.
- Si los parámetros necesarios no están configurados, la supervivencia permanece inactiva.

No implementar muerte del pez en esta tarea si todavía no existe una configuración válida y una regla aprobada para ello.

## 6. Prioridades y compatibilidad

Respetar las prioridades existentes:

`EVADE > SURRENDER > COMFORT > CHARGE > CHASE > APPROACH_PREY > SEEK_FOOD > ROAM`

En particular:

- La evasión debe interrumpir la búsqueda de alimento.
- La rendición debe impedir que la búsqueda se imponga sobre ella.
- El confort debe impedir la búsqueda de alimento.
- La búsqueda no debe reemplazar estados de mayor prioridad.
- Al finalizar o abandonar la búsqueda, el pez debe poder volver a su comportamiento habitual.

No modificar ni reinterpretar las prioridades existentes.

## 7. Separación de responsabilidades

Mantener la separación entre:

- `VisionSystem`: detectar y mantener contactos.
- Sistema de hambre: actualizar el hambre y sus temporizadores.
- Sistema de alimentación: validar y ejecutar el consumo.
- `FishAIController`: decidir el comportamiento según prioridades y datos disponibles.
- `MovementController`: ejecutar el movimiento solicitado por la IA.
- `GameScene`: gestionar el ciclo de vida de los alimentos y su representación.

Si la arquitectura actual requiere adaptar nombres o ubicaciones, hacerlo respetando las responsabilidades existentes y evitando crear abstracciones innecesarias.

## 8. Fuera de alcance

No implementar:

- Caza o depredación entre peces.
- Persecución de presas.
- Crecimiento o cambios de etapa.
- Reproducción.
- Muerte por hambre.
- Nuevos valores de balance.
- Cambios en visión, evasión o movimiento habitual que no sean estrictamente necesarios para integrar esta tarea.
- Guardado y carga de hambre.
- Nuevos tipos de alimento.

## 9. Validación

Comprobar:

1. Los peces con parámetros de hambre en `null` no activan búsqueda ni consumo.
2. Los valores no configurados no generan errores ni resultados inválidos.
3. La percepción sigue identificando correctamente los alimentos consumibles y no consumibles.
4. La IA respeta las prioridades existentes al decidir buscar alimento.
5. Un alimento no puede ser consumido por más de un pez.
6. El alimento consumido se elimina correctamente de la gestión de `GameScene`.
7. El temporizador de supervivencia no avanza fuera de las condiciones acordadas.
8. El movimiento habitual y la evasión siguen funcionando sin regresiones.

Ejecutar el build disponible y corregir los errores introducidos por esta implementación. Si existen pruebas automatizadas, ejecutarlas; no afirmar que se verificó algo que no se ejecutó.

## 10. Entrega

Al terminar:

- Resumir los archivos modificados.
- Explicar brevemente las responsabilidades implementadas.
- Indicar qué partes permanecen inactivas por falta de parámetros configurados.
- Informar los comandos de validación ejecutados y sus resultados.
- No realizar commit ni push sin autorización.
- No comenzar la siguiente tarea.

**Criterio principal:** dejar implementada la infraestructura de hambre y alimentación básica, preparada para activarse cuando definamos los parámetros pendientes, sin introducir decisiones de diseño o balance por cuenta propia.
- [x] Instrucción 05 - Hambre y alimentación básica: HungerSystem/FeedingSystem/SEEK_FOOD integrados; inactivos sin parámetros válidos; consumo único; supervivencia solo hambriento+SEEK_FOOD; sin muerte/balance.
# Corrección puntual — Instrucción 05: Hambre y alimentación básica

Corregir los problemas detectados durante la revisión del commit `78a7e9022868a57bb877a2818088bec01a2750ea`.

No rehacer los sistemas ni ampliar el alcance. Mantener las decisiones y la arquitectura ya aprobadas.

## 1. Preservar las prioridades de comportamiento

Archivo: `src/ai/FishAIController.js`

Corregir `updateBehaviorState()` para que la búsqueda de alimento no sobrescriba estados de mayor prioridad.

Debe respetar el orden acordado:

`EVADE > SURRENDER > COMFORT > CHARGE > CHASE > APPROACH_PREY > SEEK_FOOD > ROAM`

Requisitos:

- No modificar `EVADE`, `SURRENDER` ni `COMFORT`.
- No sobrescribir `CHARGE`, `CHASE` ni `APPROACH_PREY`, aunque sus comportamientos todavía no estén implementados.
- Activar `SEEK_FOOD` únicamente cuando corresponda por hambre y configuración válida, y ningún estado de mayor prioridad esté activo.
- Volver a `ROAM` solamente cuando el estado actual sea `SEEK_FOOD` y ya no corresponda mantenerlo.
- No alterar las prioridades ni introducir estados nuevos.

Revisar también el flujo de actualización posterior a `updateBehaviorState()`: ningún bloque debe reemplazar accidentalmente un estado protegido.

## 2. Corregir el temporizador de hambre

Archivo: `src/systems/HungerSystem.js`

Actualmente, cuando el hambre llega a cero, `hungerTimer` puede conservar tiempo acumulado. Al recuperar hambre, ese tiempo puede provocar descuentos inmediatos incorrectos.

Corregir el comportamiento para que:

- El temporizador no acumule tiempo de descuento mientras el hambre permanece en cero.
- Al llegar a cero, no conserve intervalos pendientes que puedan aplicarse después de una recuperación.
- Al recuperar hambre, el siguiente descuento respete un intervalo nuevo y completo.
- El comportamiento siga utilizando `delta` y `hungerDecayInterval`.
- No se alteren los valores de configuración ni la velocidad de disminución del hambre.

Mantener independiente el temporizador de supervivencia.

## 3. Centralizar la recuperación de hambre

Archivos:
- `src/systems/FeedingSystem.js`
- `src/systems/HungerSystem.js`
- `src/ai/FishAIController.js`

Actualmente, `FeedingSystem` modifica directamente `fish.transient.hunger`, duplicando una responsabilidad que pertenece a `HungerSystem`.

Corregir la integración:

- `HungerSystem` debe ser responsable de modificar el nivel de hambre.
- Utilizar `HungerSystem.recover()` o adaptar su interfaz si es estrictamente necesario.
- `FeedingSystem` debe validar el alimento, la compatibilidad y la distancia de consumo.
- No retirar el alimento de `foods` ni destruir su representación hasta confirmar que la recuperación de hambre puede realizarse correctamente.
- Si la recuperación falla, el alimento debe permanecer disponible.
- Si tiene éxito, retirar el alimento una sola vez y limpiar el objetivo de alimentación.
- Evitar duplicar la fórmula de recuperación en distintos sistemas.

No modificar la cantidad de recuperación ni inventar valores.

## 4. Compatibilidad y alcance

Mantener:

- Los parámetros de hambre y supervivencia sin valores configurados en `null`.
- La búsqueda inactiva cuando falten parámetros válidos.
- La dieta definida mediante `canConsumeBaseFood`.
- La percepción y recuperación visual existentes.
- La evasión y el movimiento habitual.
- El consumo exclusivo de alimento base.

No implementar caza, crecimiento, muerte por hambre, nuevos estados ni valores de balance.

## 5. Validación obligatoria

Comprobar específicamente:

1. `SURRENDER` y `COMFORT` no son reemplazados por `ROAM` ni `SEEK_FOOD`.
2. `CHARGE`, `CHASE` y `APPROACH_PREY` tampoco son sobrescritos.
3. `SEEK_FOOD` se activa cuando corresponde y vuelve a `ROAM` cuando deja de corresponder.
4. El temporizador de hambre no acumula tiempo mientras el hambre está en cero.
5. Después de recuperar hambre, no se aplican descuentos inmediatos por intervalos anteriores.
6. `FeedingSystem` no modifica directamente el nivel de hambre.
7. Si `HungerSystem.recover()` falla, el alimento no se elimina.
8. Un alimento consumido correctamente se elimina una sola vez.
9. Los parámetros `null` siguen dejando inactivo el sistema.
10. Evasión y movimiento habitual siguen funcionando sin regresiones.

Ejecutar `npm run build` y las comprobaciones disponibles. Si no existen pruebas automatizadas, crear comprobaciones puntuales con scripts Node sin incorporar dependencias innecesarias.

## 6. Entrega

Informar:
- Archivos modificados.
- Correcciones realizadas.
- Resultados de las comprobaciones.
- Resultado del build.

No realizar commit ni push sin autorización. No comenzar otra tarea.

**Objetivo:** corregir exclusivamente los tres defectos identificados y dejar la Instrucción 05 lista para una nueva revisión.
- [x] Corrección puntual Instrucción 05: prioridades protegidas, hungerTimer reseteado en 0, recuperación centralizada en HungerSystem y consumo seguro.
# Corrección puntual — Instrucción 05: temporizador de hambre y estado de búsqueda

Realizar únicamente las dos correcciones pendientes detectadas durante la revisión del commit `ed3f909`.

## 1. Reinicio del temporizador al recuperar hambre

**Archivo:** `src/systems/HungerSystem.js`

Modificar `recover(fish)` para que, cuando la recuperación sea válida y se aplique correctamente:

- Actualice el hambre utilizando la fórmula existente.
- Reinicie `fish.transient.hungerTimer` a `0`.
- Garantice que el siguiente descenso de hambre ocurra después de completar un intervalo entero (`hungerDecayInterval`).
- No reinicie ni modifique `survivalTimer` como consecuencia directa de la recuperación.

Mantener las validaciones actuales de `canRecover()` y los límites de hambre.

## 2. Limpieza del estado al abandonar la búsqueda

**Archivo:** `src/ai/FishAIController.js`

En la transición de `SEEK_FOOD` a `ROAM`:

- Establecer `fish.transient.isSeekingFood = false`.
- Limpiar el objetivo de alimentación mediante `clearFeedingTarget(fish)`.
- Evitar modificar estados de mayor prioridad.
- Mantener el comportamiento actual cuando el pez continúa buscando alimento.

Revisar todas las rutas de salida de `SEEK_FOOD` para asegurar que no quede el indicador activo después de abandonar ese estado.

## 3. Pruebas de verificación

Comprobar como mínimo:

1. Si un pez acumula parte de un intervalo de hambre y luego come, el temporizador vuelve a cero.
2. Después de comer, el hambre no disminuye hasta completar un nuevo intervalo.
3. Si el hambre llega a cero, el temporizador permanece en cero.
4. La recuperación no modifica directamente el temporizador de supervivencia.
5. Al pasar de `SEEK_FOOD` a `ROAM`, `isSeekingFood` queda en `false`.
6. Al abandonar `SEEK_FOOD`, el objetivo de alimentación queda limpio.
7. Los estados `EVADE`, `SURRENDER`, `COMFORT`, `CHARGE`, `CHASE` y `APPROACH_PREY` siguen protegidos.

## 4. Restricciones

- No modificar valores de configuración ni introducir parámetros nuevos.
- No cambiar las fórmulas de hambre, recuperación o supervivencia.
- No modificar `VisionSystem`, `MovementController`, evasión ni prioridades.
- No implementar caza, crecimiento, muerte, cardumen ni otros comportamientos.
- No reorganizar archivos ni refactorizar sistemas que no estén involucrados.
- Mantener la arquitectura y responsabilidades actuales.

## 5. Entrega

- Ejecutar las pruebas disponibles y realizar una compilación si el proyecto lo permite.
- Informar los archivos modificados y los resultados de las verificaciones.
- No realizar commit ni push hasta recibir autorización.
- [x] Corrección puntual Instrucción 05 (timer/estado): recover reinicia hungerTimer; salida de SEEK_FOOD limpia isSeekingFood y target.
# Instrucción 06 — Detección y aproximación a presas

## Objetivo

Implementar la primera etapa del comportamiento de caza: permitir que los peces detecten presas compatibles con su dieta y se aproximen a ellas cuando corresponda.

Respetar la arquitectura y las reglas existentes. No implementar todavía el ataque ni el consumo de otros peces.

## 1. Antes de implementar

Revisar:

- `FishAIController`
- `VisionSystem`
- `MovementController`
- `FeedingSystem`
- `HungerSystem`
- `fishConfig`
- `behaviorStates`
- `fishData`

Reutilizar las reglas de dieta y percepción existentes. No duplicar sistemas ni crear una segunda clasificación de presas.

## 2. Detección y selección de presas

- Utilizar los contactos de `VisionSystem` clasificados como `PREY`.
- Validar la compatibilidad mediante `canConsumeFish(observer, target)`.
- No utilizar el peso efectivo para determinar si un pez puede consumir a otro.
- Seleccionar la presa compatible más cercana entre los contactos visibles.
- Ignorar peces incompatibles, al propio pez y contactos que ya no sean válidos.
- No modificar las reglas de dieta existentes.

La búsqueda de presas debe permanecer inactiva si el sistema de hambre no está configurado o el pez no tiene hambre.

## 3. Aproximación

Implementar el estado existente `APPROACH_PREY`.

- Cuando corresponda buscar una presa, el pez debe aproximarse a la posición de la presa compatible seleccionada.
- Utilizar el movimiento existente mediante `MovementController`.
- Mantener la velocidad habitual durante esta etapa.
- No introducir aceleraciones, velocidades nuevas ni valores de balance.
- Si pierde contacto visual, utilizar la última posición conocida mediante el mecanismo de recuperación de `VisionSystem`.
- Si la presa deja de ser válida o vence su recuperación visual, abandonar la aproximación y volver al comportamiento correspondiente.

No modificar la orientación visual de manera que vuelva a quedar acoplada al rumbo de movimiento.

## 4. Prioridades

Respetar exactamente las prioridades existentes:

`EVADE > SURRENDER > COMFORT > CHARGE > CHASE > APPROACH_PREY > SEEK_FOOD > ROAM`

- La evasión debe interrumpir la aproximación.
- La aproximación no debe sobrescribir estados de mayor prioridad.
- No implementar todavía `CHASE` ni `CHARGE`.
- No alterar las prioridades ni sus valores.

## 5. Separación de responsabilidades

Mantener:

- `VisionSystem`: detección y seguimiento de contactos.
- `fishConfig`: reglas de dieta y compatibilidad.
- `FishAIController`: selección de presa y decisión de aproximarse.
- `MovementController`: ejecución del movimiento.
- `HungerSystem`: estado de hambre y temporizadores.
- `FeedingSystem`: consumo de alimento base ya implementado.

Evitar introducir dependencias circulares o trasladar reglas de dieta al controlador de IA.

## 6. Fuera de alcance

No implementar:

- Ataque o embestida.
- Persecución acelerada.
- Consumo o eliminación de peces.
- Muerte de presas.
- Cambios de etapa o crecimiento.
- Cardumen.
- Confort o rendición.
- Nuevos valores de balance.
- Nuevas reglas de Instinct.
- Cambios en evasión o visión que no sean estrictamente necesarios.

Los parámetros de persecución que continúan en `null` deben permanecer sin configurar.

## 7. Validación

Comprobar como mínimo:

1. Un pez detecta únicamente presas compatibles con su dieta.
2. La selección prioriza la presa compatible más cercana.
3. Los peces sin hambre no inician la aproximación.
4. Los parámetros de hambre sin configurar mantienen inactiva la búsqueda.
5. El pez se aproxima utilizando su velocidad habitual.
6. La pérdida temporal de visión utiliza la última posición conocida.
7. La aproximación termina cuando la presa deja de ser válida o vence la recuperación visual.
8. La evasión interrumpe la aproximación.
9. Ningún estado de mayor prioridad es sobrescrito.
10. La alimentación base y el movimiento habitual siguen funcionando.

Ejecutar `npm run build` y las comprobaciones disponibles. No afirmar que se realizaron pruebas que no se ejecutaron.

## 8. Entrega

Informar:

- Archivos modificados.
- Funcionamiento de la selección de presas.
- Transiciones de comportamiento implementadas.
- Resultados de las verificaciones.
- Resultado del build.
- Decisiones pendientes que hayan impedido implementar alguna parte.

No realizar commit ni push sin autorización. No comenzar la siguiente instrucción.
- [x] Instrucción 06 - Detección y aproximación a presas: APPROACH_PREY usa PREY visible más cercana validada por canConsumeFish, requiere hambre/config válida, velocidad habitual, última posición conocida por recovery; sin CHASE/CHARGE/ataque.
# Instrucción 07 — Persecución acelerada (CHASE)

## Objetivo

Implementar el estado `CHASE` como una continuación de la aproximación a presas (`APPROACH_PREY`).

El pez debe poder perseguir una presa compatible mediante un movimiento más rápido que el habitual, respetando la arquitectura y las prioridades existentes.

Esta instrucción no implementa la embestida, el ataque ni el consumo de otros peces.

## 1. Revisión previa

Antes de modificar código, revisar:

- `FishAIController`
- `VisionSystem`
- `MovementController`
- `HungerSystem`
- `fishConfig`
- `behaviorStates`
- `fishData`

Reutilizar los sistemas y datos existentes. No duplicar la detección de presas ni las reglas de dieta.

## 2. Activación de CHASE

- `CHASE` debe depender de una presa compatible detectada mediante `VisionSystem`.
- La presa debe seguir siendo válida según `canConsumeFish()`.
- El pez debe estar hambriento y tener habilitado el sistema de hambre.
- La transición desde `APPROACH_PREY` debe depender de parámetros de configuración explícitos.
- Los parámetros de activación y duración deben permanecer inactivos si están en `null` o no contienen valores válidos.
- No inventar umbrales, duraciones ni fórmulas basadas en `Instinct`.

## 3. Movimiento de persecución

- Utilizar `MovementController` para ejecutar el movimiento.
- La persecución debe permitir una velocidad superior a la habitual, únicamente cuando su configuración sea válida.
- No modificar la velocidad habitual ni los parámetros del movimiento de otros estados.
- No introducir aceleraciones progresivas, animaciones ni efectos visuales nuevos.
- Mantener las restricciones de límites y obstáculos existentes.

## 4. Seguimiento de la presa

- Mantener la presa seleccionada mientras siga siendo válida.
- Actualizar su posición objetivo cuando continúe visible.
- Si se pierde visión, reutilizar la última posición conocida mediante el mecanismo de recuperación existente.
- Abandonar la persecución cuando la presa deje de ser válida o expire la recuperación visual.
- No reiniciar el temporizador máximo de persecución al recuperar contacto visual.

## 5. Prioridades

Respetar el orden existente:

`EVADE > SURRENDER > COMFORT > CHARGE > CHASE > APPROACH_PREY > SEEK_FOOD > ROAM`

- La evasión debe interrumpir inmediatamente `CHASE`.
- Los estados de mayor prioridad no pueden ser sobrescritos por la persecución.
- No implementar todavía `CHARGE`.
- No permitir transiciones incorrectas hacia `ROAM` al abandonar la persecución.

## 6. Responsabilidades

- `VisionSystem`: detección y recuperación de contacto visual.
- `fishConfig`: parámetros de persecución.
- `FishAIController`: selección de presa y decisiones de transición.
- `MovementController`: desplazamiento durante la persecución.
- `HungerSystem`: estado de hambre.
- `FeedingSystem`: permanece limitado a la alimentación básica existente.

No trasladar decisiones de IA al sistema de movimiento.

## 7. Fuera de alcance

No implementar:

- Embestida o ataque (`CHARGE`).
- Consumo, daño o eliminación de peces.
- Cambios en las reglas de dieta.
- Nuevas fórmulas de `Instinct`.
- Cardumen o comportamiento de confort.
- Crecimiento.
- Cambios en evasión o visión que no sean estrictamente necesarios.

## 8. Validación

Comprobar:

1. Una presa incompatible nunca inicia una persecución.
2. Un pez que no tiene hambre no inicia `CHASE`.
3. Los parámetros `null` mantienen la persecución inactiva.
4. Una configuración válida permite activar la transición desde `APPROACH_PREY`.
5. La velocidad de persecución se aplica únicamente durante `CHASE`.
6. La presa se sigue correctamente mientras permanece visible.
7. La recuperación visual utiliza la última posición conocida.
8. La persecución termina ante una presa inválida o recuperación expirada.
9. Recuperar contacto visual no reinicia el temporizador máximo.
10. La evasión interrumpe la persecución.
11. Los estados de mayor prioridad permanecen protegidos.
12. La aproximación, alimentación básica y movimiento habitual no presentan regresiones.

## 9. Entrega

- Ejecutar `npm run build`.
- Ejecutar las comprobaciones disponibles.
- Informar los archivos modificados, transiciones implementadas y resultados de validación.
- Identificar expresamente los parámetros que permanecen pendientes.
- No afirmar que una prueba fue ejecutada si no se ejecutó.
- No realizar commit ni push sin autorización.
- No avanzar a la siguiente instrucción.
- [x] Instrucción 07 - Persecución acelerada (CHASE): transición desde APPROACH_PREY con config chase válida, hambre activa y presa compatible; chaseSpeed solo en CHASE; última posición conocida; no reinicia max timer al recuperar visión; evasión/prioridades respetadas. Parámetros chase en null por defecto.
