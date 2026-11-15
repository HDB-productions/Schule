// Public task references for formative practice; no API secrets.
const API_BASE = 'https://edulomodularai.hildebrandt.workers.dev';
const LESSON = {
  "id": "stroboskop-v1",
  "version": "1",
  "questions": [
    {
      "id": "ball",
      "number": "Einstieg · Den Ball beobachten",
      "title": "Was verraten die Abstände über das Tempo des Balls? Erkläre auch, wo er bei einem Sprung am langsamsten ist.",
      "reference": "Bei gleichen Zeitabständen bedeuten größere Abstände der Ballmittelpunkte einen größeren Geschwindigkeitsbetrag. Nahe dem höchsten Punkt sind die Abstände am kleinsten und der Ball ist dort am langsamsten. Im dargestellten Modell bewegt er sich auch am Scheitel horizontal weiter; seine Geschwindigkeit ist dort nicht null.",
      "criteria": [
        {
          "id": "ball_distance",
          "label": "Abstand und Tempo",
          "description": "Verknüpft größere zurückgelegte Strecken in gleichen Zeiten mit höherem Tempo."
        },
        {
          "id": "ball_apex",
          "label": "Langsamste Stelle",
          "description": "Erkennt den höchsten Punkt bzw. dessen Umgebung als langsamste Stelle jedes Sprungs. Eine ausdrückliche Behauptung, der gezeigte Ball stehe dort still, ist falsch. Keine Erklärung über Komponenten verlangen."
        }
      ]
    },
    {
      "id": "spur_a",
      "number": "Aufgabe 1a · Eine Bewegung einordnen",
      "title": "Ist Spur A gleichförmig oder beschleunigt? Begründe deine Entscheidung anhand der Positionen.",
      "graphic": "uniform",
      "reference": "Spur A zeigt eine geradlinige gleichförmige Bewegung. Die Abstände der Fahrzeugmittelpunkte sind bei gleichen Zeitabständen gleich groß.",
      "criteria": [
        {
          "id": "a_type",
          "label": "Einordnung A",
          "description": "Ordnet Spur A als gleichförmige Bewegung ein."
        },
        {
          "id": "a_reason",
          "label": "Begründung A",
          "description": "Begründet mit gleichen Abständen der Positionen bei gleichen Zeitabständen. Der gemeinsame Zeitabstand darf aus dem Material vorausgesetzt werden."
        }
      ]
    },
    {
      "id": "spur_b",
      "number": "Aufgabe 1b · Eine Bewegung einordnen",
      "title": "Ist Spur B gleichförmig oder beschleunigt? Begründe deine Entscheidung anhand der Positionen.",
      "graphic": "accelerated",
      "reference": "Spur B zeigt eine beschleunigte Bewegung, das Fahrzeug wird schneller. Die Abstände der Mittelpunkte werden von links nach rechts bei gleichen Zeitabständen größer.",
      "criteria": [
        {
          "id": "b_type",
          "label": "Einordnung B",
          "description": "Ordnet Spur B als beschleunigt bzw. schneller werdend ein."
        },
        {
          "id": "b_reason",
          "label": "Begründung B",
          "description": "Begründet mit zunehmenden Abständen von links nach rechts bei gleichen Zeitabständen."
        }
      ]
    },
    {
      "id": "gleichfoermig",
      "number": "Aufgabe 2 · Ein Muster beschreiben",
      "title": "Beschreibe, wie du eine geradlinige gleichförmige Bewegung in einem Stroboskopbild erkennst.",
      "reference": "Bei gleichen Zeitabständen liegen die Positionen auf einer geraden Linie und sind gleich weit voneinander entfernt. Der Körper legt in gleich langen Zeitabschnitten gleich große Strecken zurück und bewegt sich gleich schnell in gleichbleibender Richtung.",
      "criteria": [
        {
          "id": "u_spacing",
          "label": "Gleiche Abstände",
          "description": "Beschreibt gleich große Abstände benachbarter Positionen."
        },
        {
          "id": "u_time",
          "label": "Gleiche Zeitabschnitte",
          "description": "Stellt ausdrücklich den Bezug zu gleichen Zeitabständen her."
        },
        {
          "id": "u_direction",
          "label": "Geradlinige Spur",
          "description": "Beschreibt eine gerade Linie bzw. gleichbleibende Richtung."
        }
      ]
    },
    {
      "id": "beschleunigt",
      "number": "Aufgabe 3 · Veränderungen erklären",
      "title": "Beschreibe das Stroboskopbild einer geradlinigen beschleunigten Bewegung. Was verändert sich beim Schnellerwerden, was beim Abbremsen?",
      "reference": "Bei gleichen Zeitabständen ändern sich die Abstände benachbarter Positionen: Sie werden beim Schnellerwerden größer und beim Abbremsen kleiner. Auch Abbremsen ist physikalisch eine Beschleunigung. Allgemein zählt auch eine Änderung der Bewegungsrichtung als Beschleunigung, selbst bei konstantem Tempo; hier wird ausdrücklich die geradlinige Bewegung untersucht.",
      "criteria": [
        {
          "id": "c_faster",
          "label": "Schnellerwerden",
          "description": "Beschreibt zunehmende Abstände beim Schnellerwerden bei gleichen Aufnahmeabständen."
        },
        {
          "id": "c_slower",
          "label": "Abbremsen",
          "description": "Beschreibt abnehmende Abstände beim Abbremsen und behandelt dies ebenfalls als beschleunigte Bewegung. Keine Formeln verlangen."
        }
      ]
    },
    {
      "id": "fall",
      "number": "Aufgabe 4 · Filmen und auswerten",
      "title": "Filme mit der Zeitlupenfunktion deiner Tablet-Kamera einen kleinen, weichen Ball, den du fallen lässt. Beschreibe deine Beobachtung im Fallvideo: Wie ändern sich die Positionen in gleich langen Zeitabschnitten? Ordne die Bewegung ein und begründe.",
      "reference": "Ein aus der Ruhe losgelassener kleiner Ball legt während des freien Falls vor dem Aufprall in gleichen Zeitabschnitten immer größere Strecken nach unten zurück. Er wird schneller; die Bewegung ist beschleunigt. Die KI sieht das Video nicht. Sie darf nur die beschriebene Beobachtung und die Schlussfolgerung beurteilen. Andersartige plausible Beobachtungen (z. B. Papier mit starkem Luftwiderstand oder ungeeigneter Bildausschnitt) nicht als erfunden zurückweisen; bei fehlender eindeutiger Beobachtung zur erneuten Auswertung vor dem Aufprall anregen. Zeitlupe verlangsamt die Wiedergabe, nicht die tatsächliche Bewegung.",
      "criteria": [
        {
          "id": "f_observe",
          "label": "Beobachtung",
          "description": "Beschreibt konkret die zunehmenden zurückgelegten Strecken nach unten in gleichen Zeitabschnitten vor dem Aufprall; plausible abweichende Beobachtungen sachlich einordnen."
        },
        {
          "id": "f_classify",
          "label": "Einordnung",
          "description": "Ordnet den typischen Fall eines losgelassenen Balls als beschleunigt/schneller werdend ein."
        },
        {
          "id": "f_reason",
          "label": "Begründung",
          "description": "Verknüpft die Änderung der in gleichen Zeiten zurückgelegten Strecke schlüssig mit der Änderung des Tempos. Keine Messwerte oder Videoanalyse behaupten bzw. verlangen."
        }
      ]
    }
  ]
};
if(typeof module!=='undefined'&&module.exports)module.exports=LESSON;
