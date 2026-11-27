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
