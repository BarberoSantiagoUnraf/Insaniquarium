# Changelog

## 0.3.0

- Incorporación de la estructura común de datos de peces y del `EntityManager`.
- Incorporación de configuraciones por especie, parámetros provisionales y cálculo centralizado de parámetros derivados.
- Incorporación de los estados de comportamiento y del mapa de responsabilidades de los sistemas de IA.
- Aplicación de la escala individual al tamaño visual de los peces.
- Corrección de la velocidad de Boost: ahora es inversamente proporcional a la escala individual.
- Incorporación del estadio Viejo y revisión de los pesos base para los cuatro estadios, sin implementar crecimiento.
- Verificación del build, de los datos de peces y de la carga del juego en Chrome headless.

## 0.2.0

- Implementación de selección persistente y exclusiva de herramientas.
- Implementación de colocación de alimento con caída, espera de 4 segundos y desaparición.
- Implementación de generación de mojarritas y surubíes por clic.
- Incorporación de Billetera, costos fijos y contador en el HUD.
- Prevención de saldo negativo en compras sin fondos.
- Verificación en navegador de las instrucciones 03 y 04.

## 0.1.0

- Creación de la base del proyecto con Phaser 3.90.0 y Vite 8.3.8.
- Incorporación de pantallas Boot, Menú, Juego y Pausa.
- Implementación del HUD superior y su menú de pausa.
- Implementación del escenario inicial con fondo y un surubí.
- Incorporación del servicio de guardado preparado para futura integración.
- Corrección del `hitArea` de `UiButton` y del retorno de `resize()`.

## 2026-11-27 - Movimiento habitual

- Agregado `MovementController` para desplazamiento continuo, rumbo por intervalos, variación progresiva, fluctuación moderada de velocidad, rebote hacia el centro y evitación simple de obstáculos.
- Agregado `FishAIController` para ejecutar ROAM delegando en movimiento, manteniendo la separación de responsabilidades.
- `fishConfig.js` incorpora valores provisionales por especie para velocidad habitual e intervalo de cambio de rumbo; la velocidad habitual derivada es inversamente proporcional a la escala.
- `GameScene` registra peces en el movimiento, actualiza IA en `update` y expone bounds del área jugable con lista de obstáculos vacía por ahora.
- Verificación: `npm run build` y cálculo de velocidad por escala.

## 2026-11-27 - Sistema de visión

- Agregado `VisionSystem` con cono de 270° (90° ciego posterior), orientación por cabeza (`transient.orientation`), alcance efectivo `visionRange * scale`.
- Clasificación de contactos: alimento, presa, amenaza y compañero; sin decisiones de comportamiento ni cambios de movimiento.
- Pérdida de contacto conserva `lastKnownPosition` e inicia `recoveryTimer` independiente por contacto; al expirar se descarta.
- `fishData` incorpora `transient.vision.contacts`; `fishConfig` agrega `visionRange` y `visualRecoveryTime` provisionales por especie y expone `visualRecoveryTime` en stats.
- `GameScene` actualiza visión antes de la IA; alimentos reciben `id` estable para tracking.
- Verificación: `npm run build` y script Node para detección, pérdida y expiración de contacto.

## 2026-11-27 - Correcciones visión (Instrucción 03)

- Clasificación presa/amenaza basada en `FISH_DIETS` por especie y etapa (`canConsumeFish`), fuente única en `fishConfig.js`; eliminado uso de peso/escala para depredación.
- Dietas implementadas según etapa: mojarrita solo alimento base/presa siempre; dientudo y surubí con tablas por etapa e inclusión "hasta" etapa indicada.
- Orientación visual: se mantiene `transient.orientation` (horizontal izquierda/derecha) acorde a la representación actual; limitación documentada en arquitectura.
- `FishAIController` ya no recibe dependencia no usada de `VisionSystem`; `GameScene` actualiza visión directamente.
- Verificación: `npm run build` y scripts Node para dietas/etapas y no-regresión por peso.

## 2026-11-27 - Corrección final visión (Instrucción 03)

- Documentación: reparados caracteres de control/escapes en `ARCHITECTURE.md` y `CHANGELOG.md`; restaurados términos técnicos.
- Orientación desacoplada del movimiento: `MovementController.syncFish()` ya no calcula orientación desde `heading`; se agregó `setFacingOrientation()` y actualización explícita de facing desde heading objetivo al cambiar rumbo. Retroceder conserva orientación.
- Alimento: `VisionSystem` usa `canConsumeBaseFood()`; contactos de comida incluyen `consumable` según dieta/etapa, sin duplicar reglas ni implementar consumo.
- Verificación: `npm run build` y scripts Node para consumibilidad por especie/etapa y orientación independiente del movimiento.
## 2026-11-27 - Instrucción 04: Sistema de evasión

- FishAIController: activa evasión ante amenaza visible (VISION_CATEGORIES.THREAT) con comprobación de instinct (2-8, persistente). Regla Instinct->probabilidad pendiente (EVASION_INSTINCT_CHANCE = null); provisionalmente no se bloquea la activación y se reporta.
- Prioridad: EVADE mantiene máxima prioridad; interrumpe ROAM. No se reinicia por detectar el mismo depredador; si la amenaza se pierde, continúa hasta agotar temporizador.
- Duración: evadeDuration = EvasionDurationBase * Scale por especie (bases provisionales mojarrita 2500, surubí 3000, dientudo 2800 ms). Temporizador independiente de recuperación visual.
- MovementController: updateEvade calcula rumbo opuesto a la amenaza, reacciona si amenaza está adelante/trayectoria (~60°), mantiene huida con última posición conocida; usa boost si oostSpeed disponible. Al finalizar no recupera rumbo anterior.
- Orientación visual no cambia por evasión; respeta desacople heading/orientation.
- Verificación: 
pm run build; scripts Node para activación, duración por escala, continuidad sin visión, no-reinicio por redetección, boost activo y orientación preservada.
