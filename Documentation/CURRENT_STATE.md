# Estado actual

## Implementado

- Proyecto base con Phaser 3.90.0 y Vite 8.3.8.
- Pantalla inicial con Jugar y Salir.
- Pantalla de juego con fondo provisional y un surubí centrado debajo del HUD.
- HUD superior del 20 % de la altura con herramientas, contador y pausa.
- Menú de pausa con Continuar, Guardar y Volver al menú; la simulación se detiene al pausar.
- Selección persistente y exclusiva de alimento, mojarritas y surubí; volver a pulsar la misma herramienta la desactiva.
- Colocación de alimento con clic dentro del área de juego y ciclo de caída, espera de 4 segundos y desaparición.
- Generación de mojarritas y surubíes por clic, sin comportamientos autónomos.
- Estructura común de datos de peces con identificador, especie, etapa, escala e instinto individuales, separando datos persistentes, temporales y referencias.
- Registro de todos los peces en `EntityManager`, incluido el surubí inicial.
- Configuración independiente para mojarrita, surubí y dientudo, con parámetros no definidos en `null` y valores provisionales identificados.
- Cálculo centralizado de parámetros derivados desde la configuración y la escala individual.
- Representación de los ocho estados de comportamiento con prioridad máxima para la evasión.
- Mapa de responsabilidades y dependencias de los siete sistemas de IA, sin implementar sus comportamientos.
- Escala individual aplicada al tamaño visual de los peces.
- Billetera inicial de 100 monedas con costos fijos: alimento 2, mojarrita 5 y surubí 20.
- Contador de monedas actualizado en el HUD después de cada compra.
- Saldo nunca negativo: una compra sin fondos no se ejecuta.
- Servicio de guardado preparado con handler configurable.

## Verificación

- `npm run build` ejecutado correctamente.
- `npm audit` sin vulnerabilidades.
- Verificación en Chrome headless a 1280x720 sin errores de página:
  - saldo inicial 100 y contador `Monedas: 100`;
  - selección, desactivación y cambio de herramienta;
  - clics en el HUD sin generar entidades;
  - compras de 2, 5 y 20 monedas con actualización del contador;
  - gasto de 1000 monedas rechazado sin cambiar el saldo;
  - alimento caído hasta el fondo, detenido 4 segundos y desaparecido;
  - pausa congelando la posición del alimento y reanudación reanudando la caída.
- Verificación de datos de peces: ids únicos, tres especies configuradas, escala dentro de 0.7–1.3, instinto entero dentro de 2–8, peso efectivo derivado y evasión con prioridad máxima.
- Verificación en Chrome headless sobre el build: un canvas creado y `data-errors="[]"` después de 2.5 segundos.

## Pendiente

- Sustituir texturas provisionales por arte definitivo.
- Implementar guardado real cuando exista el formato de partida.
- Definir los valores definitivos de los parámetros de peces que hoy son provisionales o `null`.
- Implementar los sistemas de IA y los comportamientos en iteraciones posteriores.
- Incorporar consumo, hambre, crecimiento, depredación y comportamientos autónomos en iteraciones posteriores.
