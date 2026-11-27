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
