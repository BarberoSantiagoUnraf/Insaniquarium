# Arquitectura

## Stack

- Phaser 3.90.0 fijado.
- Vite 8.3.8 fijado.
- JavaScript modular (	ype: module).

## Estructura

- src/scenes/BootScene.js: genera texturas provisionales y arranca MenuScene.
- src/scenes/MenuScene.js: pantalla inicial con botones Jugar y Salir.
- src/scenes/GameScene.js: escenario, herramientas, entidades y ciclo de alimento.
- src/scenes/PauseScene.js: menú de pausa superpuesto.
- src/ui/GameHud.js: HUD superior, selección de herramientas y contador.
- src/ui/UiButton.js: botón reutilizable con estados normal, hover, activo y seleccionado.
- src/systems/Wallet.js: saldo, validación de costo y notificaciones.
- src/systems/MovementController.js: movimiento habitual, rumbo, velocidad, bordes y evitación simple de obstáculos.
- src/services/saveService.js: punto de extensión para guardado.
- src/config/constants.js: constantes de escenas, texturas, herramientas, economía y reglas de peces.
- src/config/fishConfig.js: configuración por especie y fórmulas centralizadas de parámetros derivados.
- src/entities/fishData.js: datos persistentes, temporales y referencias de cada pez.
- src/entities/EntityManager.js: registro, ids únicos y consulta de peces activos.
- src/ai/FishAIController.js: coordina comportamiento individual; hoy ejecuta ROAM delegando en movimiento.
- src/ai/behaviorStates.js: estados de comportamiento y prioridades.
- src/ai/systemRoles.js: responsabilidades y dependencias de los sistemas de IA.

## Decisiones

- Las versiones están fijadas en package.json para evitar cambios de API entre instalaciones.
- El HUD es un componente independiente dentro de GameScene.
- La pausa usa una escena paralela: GameScene se detiene y PauseScene mantiene la interfaz activa.
- Los assets son texturas generadas en BootScene, reemplazables sin tocar las escenas.
- UiButton.resize() devuelve 	his para permitir encadenar .setPosition().
- El hitArea de UiButton usa (0, 0, width, height) porque Phaser ya suma el displayOrigin del Container.
- La selección de herramientas es exclusiva y se alterna al volver a pulsar el mismo botón.
- Un Zone interactivo cubre solo el área debajo del HUD, por lo que los clics en el HUD no generan entidades.
- El alimento se administra como una lista de círculos: cae, se detiene en el fondo y se destruye luego de 4 segundos.
- La Billetera centraliza todas las operaciones económicas y el HUD se suscribe a sus cambios.
- Al pausar GameScene, update() deja de ejecutarse y los temporizadores del alimento quedan detenidos.
- El guardado no persiste datos todavía: saveGame devuelve un resultado sin guardar hasta configurar un handler.
- El escalado usa Phaser.Scale.RESIZE; cada layout recalcula posiciones y tamaños.
- Los peces se registran en EntityManager; el surubí inicial y los comprados comparten la misma estructura de datos.
- Los datos del pez se dividen en persistent, 	ransient y 
eferences; las referencias a entidades no se consideran persistibles.
- Los parámetros derivados se calculan con deriveFishStats() y se exponen como getter, sin duplicarlos en el pez.
- La velocidad habitual y de Boost se derivan inversamente proporcionales a la escala individual.
- Los parámetros no definidos quedan en 
ull y los valores necesarios para inicializar están agrupados en PROVISIONAL_FISH_VALUES.
- Los cuatro estadios son larva, juvenil, adulto y viejo; `baseWeightByStage` contempla los cuatro con valores provisionales, sin lógica de crecimiento.
- La evasión tiene la prioridad más alta entre los estados de comportamiento.
- La escala individual se aplica al displaySize; HUD y economía no se modificaron.
- MovementController administra rumbo, velocidad y colisiones simples; FishAIController solo decide ejecutar ROAM mientras no haya comportamientos prioritarios.
- Los límites usan el tamaño visible del pez; la evitación de obstáculos es reactiva con probe adelantado y rumbo aleatorio alternativo, sin pathfinding.
- El movimiento usa valores provisionales por especie para velocidad e intervalo de rumbo, centralizados en FishConfig.js.

## Capas de renderizado

- Fondo: profundidad 0.
- Peces: profundidad 10.
- Alimento: profundidad 20.
- HUD: profundidad 100.
- Menú de pausa: escena separada por encima de GameScene.
