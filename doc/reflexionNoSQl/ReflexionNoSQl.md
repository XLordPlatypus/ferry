# Reflexion: NoSQL Datenbanken - Erkenntnisse aus der Praxis

## Einleitung
In diesem Projekt haben wir mit einem Vue.js Frontend und Node.js Backend eine Fähren-App gebaut. Und haben das erstmal intensiv mit NoSQL-Datenbanken gearbeitet. Als verwaltungstool haben wir MongoDB Compass als Verwaltungstool verwendet damit wir nicht alles durch die Konsole machen müssen. Damit wir nicht selber queries für die Mongo DB schreiben müssen haben wir Mongoose als ORM verwendet.

## Wesentliche Erkenntnisse zu NoSQL und MongoDB

### Flexibilität bei Datenstrukturen
Die größte Erkenntnis war die Flexibilität von MongoDB bei der Datenmodellierung. Während relationale Datenbanken ein striktes Schema erzwingen, erlaubt MongoDB das Hinzufügen neuer Felder ohne eine Schema anzupassen. Dies ist vor allem in der Entwicklung praktisch da man Felder einfach hinzufügen oder löschen kann.

### Mongoose
Mongoose war ein hilfreiches Tool im Backend. Die Möglichkeit, Schemas zu definieren und Validierungen durchzuführen, brachte Struktur in der MongoDB. Besonders hilfreich waren:
- Schema-Definitionen für Konsistenz
- Built-in Validierungen

### Herausforderungen und Lernkurve
Die größten Herausforderungen lagen in:
- Umdenken bei Datenmodellierung
- Neue Optionen mit null Feldern
- Optimierung von Abfragen ohne JOIN
- Beziehungen mit Subdocuments oder ID Arrays

## Fazit
MongoDB bietet für moderne Web-Anwendungen Vorteile, insbesondere bei der Entwicklung von JSON-basierten APIs. Die Kombination aus MongoDB, Mongoose und Compass waren sehr hilfreich und entwicklerfreundlich. Allerdings erfordern sie ein Umdenken bei der Datenmodellierung und sind nicht für alle Anwendungsfälle optimal geeignet. Wir denken das in den meisten Fällen eine Traditionelle SQL-Datenbank einfacher zu verwenden ist, da Felder löschen und hinzufügen eine sehr heikle Sache sein kann gerade wenn man es auf Produktiven System betreibt.

---

## Vergleichstabelle: MongoDB vs. MariaDB

| Merkmal                                 | MongoDB (NoSQL)                           | MariaDB (relational, SQL)                          |
| --------------------------------------- | ----------------------------------------- | -------------------------------------------------- |
| **Datenmodell**                         | Dokumentenbasiert (JSON)             | Tabellenbasiert (relational)                       |
| **Schema**                              | Schemafrei oder optional mit Mongoose     | Strenges, vordefiniertes Schema                    |
| **Joins**                               | Eingeschränkt (via Aggregation Framework) | Vollständig und leistungsfähig mit JOIN-Statements |
| **Flexibilität**                        | Datenstruktur kann sich ändern     | Änderungen erfordern oft Migrationen     |
| **Abfragesprache**                      | MongoDB Query Language (MQL)              | Structured Query Language (SQL)                    |
| **Performance bei grossen Datenmengen** | Gut bei skalierbaren, verteilten Systemen | Gut bei strukturierten Daten und Abfragen          |
| **Integration mit Node.js**             | Sehr gut (z.B. mit Mongoose)             | Möglich (z.B. mit Sequelize oder TypeORM)         |
| **Visualisierung/Tooling**              | MongoDB Compass                           | z.B. phpMyAdmin, HeidiSQL                         |
| **Ideal für**                           | Unstrukturierte oder dynamische Daten     | Strukturierte, relationale Daten                   |

