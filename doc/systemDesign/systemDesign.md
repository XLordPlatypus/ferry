# System Design

## Description
The technologies mentioned below work together in the following manner.
With the Vue.js Framework we create different pages for the client to serve visual content.
It's supported by the Vite framework that provides an easy way to start and reload the client.
In the backend part we use a Node.js server that hosts an Express.js JSON REST API.
All data is written or read to/in an MongoDB.
Everything will be running inside Docker containers.
If we have time we also would like to implement a swagger API documentation, 
as well as Cypress or Vitest for testing the application.

### Frontend-Framework
* [Vue.js v3.5](https://vuejs.org/)
  * [TypeScript v5.7.2](https://www.typescriptlang.org/)
  * [Vite v6.2](https://vite.dev/)

### Server / Backend
* [Node.js v22.13](https://nodejs.org/en)
  * [TypeScript v5.7.2](https://www.typescriptlang.org/)
  * [Express v5.0](https://expressjs.com/)

### Database
* [MongoDB v8.0](https://www.mongodb.com/)
    * JSON

### Other
* [Docker](https://www.docker.com/)
  * Docker Compose
  * Dockerfile

### Testing
* Optional: [Cypress](https://www.cypress.io/) / [Vitest](https://vitest.dev/)

### Documentation
* Optional: [Swagger](https://swagger.io/)
* Markdown
* Figma
* Draw.io
* Excalidraw
