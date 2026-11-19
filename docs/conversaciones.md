# Conversaciones

## Qué fallaba

- **Saludo repetido:** después de la primera charla, cada persona saludaba siempre con la misma frase.
- **Temas como fichas de preguntas y respuestas:** la respuesta era siempre igual y el tema no desaparecía aunque ya estuviera agotado.
- **Nadie recordaba nada:** lo que sabías por otros no cambiaba de qué podías hablar.
- **Tu carácter no influía:** el prólogo definía cinco rasgos que nunca se notaban al hablar.
- **Sin hora ni lugar:** decían lo mismo a las ocho de la mañana que a medianoche.

## Estrategia

1. **Una voz por persona.** Cada personaje tiene su forma de hablar:
   - Marla corta y esquiva;
   - Corso entusiasta y con preguntas;
   - Brin lento, con refranes de mar;
   - Dorne burlón;
   - Lin curiosa y precisa.

   Frases cortas, castellano de España, nada de explicaciones largas.
2. **Tu pregunta suena como sos vos.** Cada tema se pregunta según tu rasgo más marcado. Si sos temerario, preguntás de frente. Si sos cauto o compasivo, preguntás con cuidado. La respuesta cambia según cómo preguntaste.
3. **La confianza cuenta.** Cada persona guarda una confianza con vos, que no se muestra en números. Sube o baja según cómo le hablás. Algunas respuestas solo aparecen cuando la confianza es alta.
4. **Lo que sabés abre temas.** Lo que anotás en el diario habilita temas nuevos con otras personas. Las pistas se cruzan:
   - lo que dice Dorne lo podés llevar a Marla;
   - lo que dice Lin, a Brin;
   - lo que vende Gaspar, al ancla de la plaza.
5. **Los temas se agotan.** Un tema que ya dio lo que tenía desaparece o deja paso a otro más profundo. No hay respuestas idénticas repetidas.
6. **Hora y contexto.**
   - Los saludos y los comentarios cambian a la mañana, a la tarde y a la noche.
   - Los saludos nunca repiten la última frase.
   - Quien te ve por primera vez se presenta, y quien ya te conoce no.
7. **Sin carteles.** No hay avisos de "dato nuevo" ni barras de confianza. El juego habla por los personajes y por el diario.

## Cómo está armado (`docs/juego/juego.js`)

- Cada persona tiene:
  - `greet(ctx)`: el saludo según la hora, cuántas veces hablaron y la confianza;
  - `topics`: los temas de conversación;
  - `barks`: los comentarios en el aire, por momento del día.
- Cada tema tiene:
  - `ask`: la pregunta, con variantes según tu rasgo;
  - `a`: la respuesta, según la cantidad de veces que lo preguntaste, tu tono y la confianza;
  - `need`: qué tenés que saber para que aparezca;
  - `once`: si desaparece después de preguntarlo;
  - `aff`: cuánto cambia la confianza;
  - `learn`: qué anota en el diario.
