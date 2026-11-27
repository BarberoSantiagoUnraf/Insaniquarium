# Estado actual

## Implementado

- Proyecto base con Phaser 3.90.0 y Vite 8.3.8.
- Pantalla inicial con Jugar y Salir.
- Pantalla de juego con fondo provisional y un surubí centrado debajo del HUD.
- HUD superior del 20 % de la altura con herramientas, contador y pausa.
- Menú de pausa con Continuar, Guardar y Volver al menú; la simulación se detiene al pausar.
- Selección persistente y exclusiva de alimento, mojarritas y surubí; volver a pulsar la misma herramienta la desactiva.
- Colocación de alimento con clic dentro del área de juego y ciclo de caída, espera de 4 segundos y desaparición.
- Generación de mojarritas y surubíes por clic.
- Movimiento habitual de peces: desplazamiento continuo, rumbo aleatorio por intervalos configurables por especie, variación progresiva de rumbo, fluctuación moderada de velocidad, cambio inmediato hacia el centro al tocar bordes y evitación simple de obstáculos fijos.
- Sistema de visión por pez: cono 270° (90° ciego posterior) orientado a la cabeza, alcance efectivo isionRange * scale, clasificación de alimento/presa/amenaza/compañero, última posición conocida y temporizador independiente de recuperación visual.
- Estructura común de datos de peces con identificador, especie, etapa, escala e instinto individuales, separando datos persistentes, temporales y referencias.
- Registro de todos los peces en EntityManager, incluido el surubí inicial.
- Configuración independiente para mojarrita, surubí y dientudo, con parámetros no definidos en 
ull y valores provisionales identificados.
- Cuatro estadios de crecimiento representados: larva, juvenil, adulto y viejo; los pesos base de los tres últimos permanecen provisionales y no hay lógica de crecimiento.
- Cálculo centralizado de parámetros derivados desde la configuración y la escala individual.
- Representación de los ocho estados de comportamiento con prioridad máxima para la evasión.
- Mapa de responsabilidades y dependencias de los sistemas de IA; FishAIController, MovementController y VisionSystem implementados para ROAM/percepción.
- Escala individual aplicada al tamaño visual de los peces.
- Billetera inicial de 100 monedas con costos fijos: alimento 2, mojarrita 5 y surubí 20.
- Contador de monedas actualizado en el HUD después de cada compra.
- Saldo nunca negativo: una compra sin fondos no se ejecuta.
- Servicio de guardado preparado con handler configurable.

## Verificación

- 
pm run build ejecutado correctamente.
- Verificación por script Node: detección de presa/alimento en cono frontal, pérdida de contacto conserva última posición y ecoveryTimer, contacto expira al vencer temporizador.
- Verificación por cálculo: velocidad habitual derivada inversamente proporcional a la escala (mojarrita scale 1.3 -> 47.69, scale 0.7 -> 88.57).

## Pendiente

- Sustituir texturas provisionales por arte definitivo.
- Implementar guardado real cuando exista el formato de partida.
- Definir los valores definitivos de los parámetros de peces que hoy son provisionales o 
ull.
- Implementar alimentación, hambre/supervivencia, persecución, embestida, evasión, confort, rendición y crecimiento usando la percepción.
- Incorporar obstáculos/decoraciones reales con hitboxes en el área de juego.
- Ajustar valores provisionales de movimiento/visión tras pruebas visuales.




