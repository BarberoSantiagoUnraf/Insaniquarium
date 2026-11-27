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