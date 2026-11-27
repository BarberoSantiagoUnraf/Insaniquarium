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

- Agregado MovementController para desplazamiento continuo, rumbo por intervalos, variación progresiva, fluctuación moderada de velocidad, rebote hacia el centro y evitación simple de obstáculos.
- Agregado FishAIController para ejecutar ROAM delegando en movimiento, manteniendo la separación de responsabilidades.
- FishConfig.js incorpora valores provisionales por especie para velocidad habitual e intervalo de cambio de rumbo; la velocidad habitual derivada es inversamente proporcional a la escala.
- GameScene registra peces en el movimiento, actualiza IA en update y expone bounds del área jugable con lista de obstáculos vacía por ahora.
- Verificación:
pm run build y cálculo de velocidad por escala.

## 2026-11-27 - Sistema de visión

- Agregado VisionSystem con cono de 270° (90° ciego posterior), orientación por cabeza (	ransient.orientation), alcance efectivo isionRange * scale.
- Clasificación de contactos: alimento, presa, amenaza y compañero; sin decisiones de comportamiento ni cambios de movimiento.
- Pérdida de contacto conserva lastKnownPosition e inicia ecoveryTimer independiente por contacto; al expirar se descarta.
- ishData incorpora 	ransient.vision.contacts; ishConfig agrega isionRange y isualRecoveryTime provisionales por especie y expone isualRecoveryTime en stats.
- GameScene actualiza visión antes de la IA; alimentos reciben id estable para tracking.
- Verificación: 
pm run build y script Node para detección, pérdida y expiración de contacto.
