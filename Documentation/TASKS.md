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
  -----------------------
- [x] Corregir la fórmula de velocidad de Boost para que sea inversamente proporcional a la escala.
- [x] Incorporar los cuatro estadios de crecimiento definidos, incluyendo Viejo, sin implementar todavía el crecimiento.
- [x] Revisar que las configuraciones de peso base contemplen los cuatro estadios, aunque sus valores permanezcan provisionales.

# Instrucción 02 — Movimiento habitual de los peces

## Objetivo

Implementar el movimiento habitual de los peces dentro de la pileta. Los peces deben desplazarse continuamente con un comportamiento natural, evitando movimientos excesivamente mecánicos.

Esta instrucción contempla exclusivamente el movimiento habitual. No implementar todavía alimentación, hambre, persecución, evasión ni otros comportamientos de IA.

## 1. Inspección previa

Antes de modificar el código:

- Inspeccionar la estructura actual del proyecto.
- Revisar los datos y configuraciones de peces implementados en la Instrucción 01.
- Reutilizar las estructuras existentes siempre que sea posible.
- Mantener Phaser y la arquitectura actual.
- Evitar reestructuraciones innecesarias.

## 2. Movimiento habitual

Todos los peces deben desplazarse continuamente mientras estén en movimiento habitual.

El comportamiento debe seguir estas reglas:

- Cada pez mantiene un rumbo durante un intervalo de tiempo fijo.
- Al finalizar ese intervalo, selecciona un nuevo rumbo completamente aleatorio.
- El cambio de rumbo debe tener pequeñas variaciones progresivas para evitar movimientos artificiales.
- No implementar sistemas complejos de rotación gradual del sprite.
- El movimiento debe continuar hasta que otro comportamiento tenga prioridad.

El intervalo de cambio de rumbo debe ser configurable individualmente por especie.

## 3. Velocidad

Cada especie tendrá una velocidad habitual base configurable.

- La velocidad debe fluctuar ligeramente durante el desplazamiento.
- Las fluctuaciones deben ser aleatorias y moderadas.
- La velocidad no debe cambiar bruscamente.
- La escala individual del pez debe afectar su velocidad según las reglas de parámetros derivados ya establecidas.
- Las fluctuaciones no deben modificar permanentemente la velocidad base ni los datos persistentes del pez.

No establecer valores definitivos arbitrarios sin necesidad. Si se necesitan valores iniciales para probar el sistema, identificarlos como provisionales y centralizarlos en la configuración correspondiente.

## 4. Límites de la pileta

Cuando un pez alcanza un borde de la zona de juego:

- Debe cambiar inmediatamente su rumbo hacia el centro de la pileta.
- No debe continuar desplazándose fuera del área jugable.
- El nuevo rumbo debe evitar que el pez permanezca atrapado contra los bordes.

El comportamiento debe considerar el tamaño efectivo del pez para evitar que parte de su representación atraviese los límites.

## 5. Obstáculos fijos

El movimiento habitual debe contemplar obstáculos fijos dentro de la pileta.

Cuando un pez detecta que su trayectoria lo llevará contra un obstáculo:

- Cambia inmediatamente de rumbo.
- Selecciona aleatoriamente una dirección que permita evitarlo.
- No intenta rodear el obstáculo.
- No intenta recuperar su rumbo anterior.

Evitar implementar navegación compleja, búsqueda de caminos o sistemas de evitación innecesariamente sofisticados.

La detección debe ser suficientemente anticipada para evitar que el pez atraviese el obstáculo antes de cambiar de dirección.

## 6. Separación de responsabilidades

Mantener separadas las responsabilidades:

- **Fish AI Controller:** determina qué comportamiento debe ejecutar el pez.
- **Movement Controller:** ejecuta el desplazamiento y administra el rumbo y la velocidad.
- **Configuración de especie:** proporciona los parámetros de movimiento correspondientes.

No introducir dependencias innecesarias entre el movimiento y otros sistemas.

El movimiento habitual debe poder interrumpirse posteriormente cuando la IA necesite ejecutar otro comportamiento.

## 7. Restricciones

No implementar:

- Búsqueda de alimento.
- Hambre o supervivencia.
- Persecución de presas.
- Embestidas o Boost.
- Evasión de depredadores.
- Cardumen o cohesión entre peces.
- Crecimiento o cambios de etapa.
- Nuevos sistemas de persistencia.
- Object Pooling.
- Navegación avanzada o pathfinding.

No modificar innecesariamente el HUD, la economía ni los sistemas existentes.

## 8. Criterios de aceptación

La implementación se considera terminada cuando:

1. Los peces pueden desplazarse continuamente.
2. Mantienen su rumbo durante intervalos fijos configurables por especie.
3. Seleccionan nuevos rumbos aleatorios.
4. El movimiento presenta pequeñas variaciones progresivas.
5. La velocidad fluctúa ligeramente sin cambios bruscos.
6. La escala individual afecta correctamente los parámetros correspondientes.
7. Los peces cambian de rumbo hacia el centro al alcanzar los bordes.
8. Los peces detectan obstáculos fijos y cambian de rumbo para evitarlos.
9. No atraviesan los límites ni los obstáculos.
10. Los tres tipos de peces pueden utilizar el mismo sistema con configuraciones diferentes.
11. Los sistemas existentes siguen funcionando correctamente.

## 9. Informe final

Al terminar, informar:

- Archivos creados y modificados.
- Responsabilidad de cada componente.
- Decisiones técnicas tomadas.
- Parámetros configurables y valores provisionales.
- Pruebas realizadas y resultados.
- Problemas encontrados y decisiones pendientes.

No comenzar automáticamente la siguiente instrucción. Esperar la revisión y aprobación del usuario.

Instrucción 03 — Sistema de visión de los peces

Objetivo

Implementar el sistema de percepción visual de los peces. Debe permitir detectar entidades cercanas dentro del campo visual y conservar información sobre su última posición conocida.

Esta instrucción implementa exclusivamente la percepción. No debe implementar todavía evasión, alimentación, persecución ni decisiones de comportamiento.

1. Campo visual

Cada pez tiene un único rango de visión, definido por especie.

El campo visual es un cono de aproximadamente 270°, con un punto ciego posterior de aproximadamente 90°.

La visión sigue la orientación de la cabeza del pez, no su dirección de desplazamiento.

Retroceder no modifica la orientación visual.

El alcance efectivo se calcula aplicando la escala individual del pez al rango base de su especie.

No utilizar distancias diferentes para detectar alimento, presas, amenazas o compañeros.

2. Entidades detectables

El sistema debe poder identificar y clasificar las entidades detectadas como:

Alimento.

Presa.

Amenaza o depredador.

Compañero de especie.

La clasificación debe proporcionar información a los sistemas de comportamiento, pero no decidir qué debe hacer el pez.

La reacción ante cada categoría dependerá posteriormente de la IA, el hambre, el instinto y las reglas de comportamiento.

3. Pérdida de contacto visual

Cuando una entidad detectada sale del campo visual o supera el alcance:

Conservar su última posición conocida.

Permitir que los sistemas de comportamiento consulten esa posición.

Iniciar un temporizador de recuperación visual.

Mientras el temporizador siga activo, el pez puede intentar recuperar el contacto visual cuando se implementen los comportamientos correspondientes.

Al vencer el temporizador, dejar de considerar válida la última posición conocida.

La recuperación visual y la duración máxima de persecución deben utilizar temporizadores independientes. Recuperar contacto visual no debe reiniciar el temporizador máximo de persecución.

4. Configuración y arquitectura

Reutilizar FISH_CONFIG y el sistema de parámetros derivados existente.

Incorporar el rango base de visión por especie sin inventar valores definitivos.

Aplicar la escala individual mediante las fórmulas centralizadas.

Mantener separadas las responsabilidades del sistema de visión y del controlador de IA.

Evitar duplicar cálculos o almacenar parámetros derivados innecesariamente.

Reutilizar los datos y referencias de entidades existentes.

5. Límites de esta instrucción

NO implementar:

Evasión.

Alimentación ni consumo de alimento.

Persecución de presas.

Embestidas o Boost.

Cambios de estado por detección.

Movimiento adicional.

Cardumen.

Crecimiento.

Persistencia o guardado nuevo.

HUD o economía.

No inventar duraciones ni valores de alcance que todavía no estén definidos. Mantener los valores pendientes como configurables o provisionales.

6. Criterios de aceptación

Todos los peces utilizan el mismo sistema de visión.

Cada especie puede tener su propio rango base.

La escala individual modifica correctamente el alcance.

El campo visual respeta el cono de 270° y el punto ciego posterior.

La orientación visual depende de la cabeza y no del desplazamiento.

Se detectan y clasifican correctamente las cuatro categorías de entidades.

Se conserva la última posición conocida cuando se pierde contacto.

La recuperación visual tiene un temporizador independiente.

El sistema no ejecuta comportamientos ni modifica el movimiento habitual.

Los peces siguen funcionando correctamente y no se introducen regresiones.

7. Informe de implementación

Al finalizar, informar:

Archivos creados y modificados.

Responsabilidades de cada componente.

Cómo se calcula el campo visual y el alcance efectivo.

Cómo se clasifican las entidades.

Cómo funciona la pérdida y recuperación de contacto.

Valores provisionales utilizados y parámetros pendientes.

Pruebas realizadas y resultados.

Problemas encontrados o decisiones que requieran confirmación.

No comenzar la siguiente instrucción automáticamente.
- [x] Instrucción 03 - Sistema de visión: percepción con cono 270°, clasificación, última posición conocida y recuperación visual independiente.
