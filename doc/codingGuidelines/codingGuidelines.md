# Coding Guidelines

This project uses clear and organized ways to write code so it’s easy to read, change, and grow. The backend is made with Node.js and TypeScript, and it’s split into modules based on features. For example, authentication, reservations, or account stuff each have their own module. Each module has controllers, validation, and helpers all together. This keeps things separate and makes it easy to add new things or change stuff later.

## Design Patterns

The code is made to be modular and each part has its own job. Controllers only handle HTTP requests and responses. The real business logic is done in helper functions outside the controllers. This makes the code easier to read, test, and keep clean.

Every module has its own validator that checks the data before the controller uses it. For example, customer data is checked in `customerValidator.ts` to make sure it follows the rules. If the data is wrong, the system sends back a 400 error with a helpful message.

## Controllers and Routing

Controllers are grouped by feature and connected with one main routing setup. Each controller handles some endpoints and works with a validator. Controllers don’t do complex work—they just get input, send output, and call helper functions.

## Validation

Validation is very important. Instead of checking data inside controllers, each domain has its own validator module. These check request bodies, query params, and headers before the controller runs. This stops errors and keeps data correct.

## Authentication and Session Management

User sessions use `express-session`. To add custom data like `sessionToken`, we extend the session object using TypeScript. Sessions have strict cookie settings: HTTP-only, strict same-site policy, and expiration time. This is secure and easy for developers. Middleware checks if the session is valid before letting users access protected routes.

## Helpers and Utilities

Shared logic that doesn’t fit in controllers—like sending emails, hashing passwords, or special calculations—is put in helper modules. These helpers don’t keep state and can be used anywhere to avoid repeating code. For example, there’s a hashing helper for passwords and a mailer helper for sending emails.

## Environment Variables

Settings that change between environments (like secrets, ports, mail settings) are stored in a `.env` file. There’s a `.env.template` for new devs to start with. The app loads these settings at startup with:

```ts
require('dotenv').config({ path: __dirname + '/../.env' });
```

This keeps sensitive info out of code and easy to change without editing code.

## Email Handling

Emails are sent using `nodemailer`. We set up one transporter, usually connected to a local test mail server like Mailhog on port 1025. This way devs can test emails without sending real ones. The transporter is shared and used by all parts that need to send mail.

## Coding Conventions

The whole project uses TypeScript and modern JavaScript/TypeScript standards. Avoid using `any`—always use clear types. Use `async/await` for async code to keep it clean and consistent.

Naming: variables and functions use `camelCase`, classes use `PascalCase`, constants use `UPPER_SNAKE_CASE`. File names match their content and use `camelCase`.

## Next time we should
* Use ESLint and prettier to automatically insert semicolons "`;`" at the end of each line.
* Normalize line breaks with a `.editorconfig`.
* Use `npm workspaces` for organization and a better developer experience.