Game Overview

Concepto del juego
El videojuego es una experiencia cozy incremental centrada en el cuidado y desarrollo de un pequeño ecosistema de peces dentro de una pileta doméstica. El jugador administra los recursos del ecosistema mediante la compra y suministro de alimento, la incorporación de nuevos peces y la adquisición de decoraciones que modifican el ambiente y el comportamiento de sus habitantes.
La experiencia se desarrolla en un único escenario persistente, cuya evolución depende de las acciones del jugador y del comportamiento autónomo de los peces. Estos agentes cuentan con necesidades, capacidades e interacciones propias, que determinan su movimiento, alimentación, crecimiento y relación con otros habitantes del ecosistema.
El juego busca generar una experiencia relajada, donde el progreso no está condicionado por la superación de niveles o desafíos, sino por la observación del ecosistema, su mantenimiento y su expansión gradual.
La simulación combina mecánicas incrementales con sistemas de inteligencia artificial que permiten que los peces actúen de manera autónoma, generando una dinámica de interacción entre el jugador, el ambiente y los agentes.
1.2 Premisa y contexto narrativo
La historia comienza con un hombre que regresa de una jornada de pesca acompañado por un pequeño pez que ha capturado. Al intentar devolverlo al agua, descubre que el pez no parece querer regresar. Decide conservarlo y utilizar una pileta Pelopincho de su casa como espacio para criarlo.
Con el paso del tiempo, el hombre acondiciona la pileta, incorpora alimento y comienza a reunir otros peces, transformando un objeto doméstico en un pequeño ecosistema.
El contexto narrativo funciona como justificación para la existencia del escenario, el crecimiento del ecosistema y la progresión del jugador, sin necesidad de desarrollar una narrativa extensa o introducir objetivos externos a la experiencia de cuidado y observación.
1.3 Género
El juego se clasifica dentro de los siguientes géneros:
Cozy Game: prioriza una experiencia relajada, sin presión constante ni situaciones de estrés para el jugador.
Incremental: permite generar y acumular recursos progresivamente, utilizándolos para expandir y mejorar el ecosistema.
Simulación de ecosistema: presenta agentes autónomos cuyas necesidades y comportamientos interactúan dentro de un entorno compartido.
La combinación de estos géneros define una experiencia centrada en el progreso gradual y la observación de sistemas autónomos.
1.4 Público objetivo
El juego está dirigido a jugadores que disfrutan de experiencias relajadas, de gestión ligera y observación de entornos virtuales, donde el progreso se produce de manera gradual y las acciones del jugador contribuyen a modificar el escenario.
Se busca que la experiencia pueda disfrutarse tanto mediante intervenciones activas —alimentar peces, recolectar monedas y realizar compras— como durante períodos de observación pasiva, en los que los agentes continúan desarrollando sus comportamientos autónomos.
1.5 Pilares de diseño
Los pilares de diseño establecen los principios que orientan las decisiones de gameplay, contenido, comportamiento y desarrollo.
Pilar 1 — Relajación y observación
El juego debe ofrecer un entorno visualmente agradable que permita observar el comportamiento de los peces y la evolución del ecosistema sin exigir atención constante ni imponer presión al jugador.
Pilar 2 — Crecimiento y progresión
Las acciones del jugador deben generar resultados progresivos y perceptibles. El crecimiento de los peces, la incorporación de nuevos habitantes y la adquisición de decoraciones deben contribuir a la evolución del ecosistema.
Pilar 3 — Autonomía de los agentes
Los peces deben ser capaces de tomar decisiones y ejecutar comportamientos sin intervención directa del jugador. Sus necesidades, características y estímulos ambientales deben determinar sus acciones.
Pilar 4 — Ecosistema interactivo
El entorno no debe funcionar únicamente como un escenario decorativo. Los peces, el alimento y las decoraciones deben establecer relaciones que influyan en el funcionamiento y comportamiento del ecosistema.
1.6 Objetivos del proyecto
El proyecto tiene dos objetivos que deben coexistir, pero no confundirse.
Objetivo de diseño del videojuego
Desarrollar una experiencia incremental y relajada que permita al jugador cuidar, expandir y observar un ecosistema de peces, utilizando sus recursos para mejorar progresivamente las condiciones del entorno.

Objetivo académico y técnico
Implementar un conjunto de agentes autónomos mediante programación asistida por IA, utilizando patrones de comportamiento y sistemas de toma de decisiones que puedan identificarse, justificarse y evaluarse dentro del gameplay.
El desarrollo deberá priorizar sistemas de IA funcionales, comprensibles y demostrables, manteniendo un alcance compatible con las limitaciones de tiempo y complejidad de un trabajo práctico universitario.

02. Gameplay
2.1 Descripción general del gameplay
El gameplay se desarrolla en un único escenario persistente que representa una pileta doméstica habitada por diferentes especies de peces. El jugador administra este ecosistema mediante acciones de alimentación, adquisición de nuevos habitantes y compra de decoraciones.
Los peces funcionan como agentes autónomos que desarrollan sus propias actividades dentro del entorno. El jugador no controla directamente sus movimientos, sino que interviene proporcionando recursos y modificando las condiciones del ambiente para favorecer su desarrollo.
La experiencia combina períodos de observación pasiva con intervenciones activas del jugador. Mientras los peces desarrollan sus comportamientos, el jugador puede recolectar monedas, adquirir nuevos recursos y modificar el ecosistema.
El progreso se produce de manera continua, sin una estructura de niveles o etapas obligatorias. La evolución del escenario y de sus habitantes constituye la principal representación del avance del jugador.
2.2 Core Gameplay Loop
El ciclo principal de gameplay representa la secuencia de acciones que sostiene la experiencia y permite la progresión del jugador.
El ciclo no representa una secuencia obligatoria de pasos. Las acciones pueden realizarse en diferentes momentos y el jugador puede alternar libremente entre observar, alimentar, recolectar y comprar.
2.3 Acciones del jugador
El jugador interactúa con el ecosistema mediante acciones directas sobre el escenario y mediante interfaces de gestión.
Se identifican las siguientes acciones principales:
Acción	Descripción
Preparar alimento	Obtener o elaborar alimento disponible para suministrar a los peces.
Alimentar	Distribuir alimento dentro de la pileta.
Recolectar monedas	Recoger las monedas generadas por los peces.
Comprar peces	Incorporar nuevos habitantes al ecosistema.
Comprar alimento	Adquirir recursos necesarios para alimentar a determinadas especies.
Comprar decoraciones	Adquirir objetos que modifican el entorno o los comportamientos de los agentes.

Estas acciones constituyen las principales formas de intervención del jugador. No se contempla el control directo de los peces mediante movimiento o comandos individuales.
2.4 Alimentación
El sistema de alimentación constituye una de las principales interacciones entre el jugador y los agentes autónomos.

El jugador debe disponer de alimento para mantener a los peces y favorecer su crecimiento. Para ello, podrá comprar alimento y distribuirlo dentro de la pileta.

Una vez introducido en el escenario, el alimento pasa a formar parte del entorno y puede ser detectado por los peces. Estos deberán identificarlo como un recurso disponible, desplazarse hacia él y consumirlo cuando se encuentren dentro de las condiciones necesarias.

La alimentación presenta dos modalidades principales:
- Alimentación convencional: Forma básica e inicial la cual alimentará a todos los peces en su fase de infante.
- Alimentación mediante presas: destinada a las especies carnívoras, que necesitan capturar otros peces para alimentarse.
La compatibilidad entre alimento, tamaño y especie se definirá en el apartado correspondiente al sistema de alimentación y comportamiento de los peces.
2.5 Crecimiento de los peces
Los peces presentan un sistema de crecimiento individual que representa su desarrollo a lo largo de la partida.

El crecimiento estará condicionado por la cantidad de alimento consumido, utilizando parámetros ajustables durante el desarrollo.

El aumento de tamaño tendrá consecuencias tanto visuales como funcionales. A medida que un pez crezca, podrán modificarse sus capacidades de alimentación, su relación con otras especies y los comportamientos que puede desarrollar.

En consecuencia, el crecimiento no representa únicamente una mejora estética, sino una modificación progresiva de las características del agente y de su participación dentro del ecosistema.
2.6 Depredación y relación entre especies
El ecosistema contempla relaciones de depredador y presa entre determinadas especies.

Los peces carnívoros deberán obtener alimento mediante la captura de otros peces de tamaño menor a si mismo. Para mantenerlos, el jugador podrá adquirir peces pequeños destinados a funcionar como alimento.

La depredación introduce una interacción autónoma entre agentes: el depredador deberá detectar posibles presas, seleccionar un objetivo y ejecutar un comportamiento de persecución y captura.

La posibilidad de que un pez sea depredado dependerá de las características de ambas especies y de su tamaño actual.

Este sistema establece una relación entre crecimiento, alimentación y supervivencia, haciendo que las decisiones del jugador sobre qué especies incorporar tengan consecuencias en el funcionamiento del ecosistema.
2.7 Economía y progresión
El sistema económico permite transformar los resultados del cuidado del ecosistema en nuevas posibilidades de desarrollo.

Los peces generan monedas que el jugador puede recolectar y utilizar para adquirir recursos en la tienda.

Las monedas funcionan como recurso principal de progresión y permiten acceder a nuevos peces, alimento y decoraciones.

La progresión no está estructurada mediante niveles, objetivos obligatorios o desbloqueos asociados a una campaña. Se desarrolla a través de la acumulación y reinversión de recursos, permitiendo que el jugador determine cómo desea expandir y mejorar su ecosistema.

Los valores económicos, costos y cantidades de generación serán provisionales durante la implementación y podrán ajustarse mediante pruebas de balance.
2.8 Interacción con el entorno y decoraciones
El jugador podrá adquirir e incorporar decoraciones a la pileta.

Estos objetos cumplen una doble función: contribuyen a la evolución visual del escenario y pueden modificar las condiciones en las que se desarrollan los comportamientos de los peces.

Las decoraciones podrán funcionar como estímulos ambientales, puntos de interés o elementos que favorezcan determinados comportamientos.

Su influencia concreta dependerá de cada objeto y de las especies presentes en el ecosistema. Las reglas específicas se documentarán individualmente en el apartado de decoraciones.
2.9 Estructura de progresión
El juego presenta una estructura de progresión continua y no lineal.

El escenario permanece disponible durante toda la partida y evoluciona a partir de las adquisiciones y modificaciones realizadas por el jugador.

No existen niveles independientes, reinicios obligatorios ni una secuencia fija de objetivos. La progresión está determinada por la capacidad del jugador para generar recursos, mantener a sus peces y reinvertir sus ganancias.

El crecimiento individual de los peces y la incorporación de nuevas especies permiten que el ecosistema se transforme progresivamente, generando nuevas interacciones y comportamientos.
