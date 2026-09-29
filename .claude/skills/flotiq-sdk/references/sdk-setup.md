# SDK setup

## The client

The SDK (`@flotiq/flotiq-api-sdk`) is installed, and `lib/flotiq-api-client.ts` builds the one shared client, `flotiqApiClient`, from `FLOTIQ_API_KEY`. Import it everywhere; never construct another client.

## Environment variables

* The Factory sets both variables in the project's Vercel environment: `FLOTIQ_API_KEY` (a read-only key the user gives) and `FLOTIQ_CLIENT_AUTH_KEY` (its own secret for draft mode and the revalidation webhook). Agents don't set, print or commit them, and don't rename them.
* Code reads them from `process.env` only; `.env.example` lists them with placeholders. Without `FLOTIQ_API_KEY` the app shows its "Connect your Flotiq space" screen (`isFlotiqConfigured`).
* A new variable the code needs is a question for the user (the lead's `ask`, kind `secret`), not a value to invent.

## Read vs. write keys

The app's `FLOTIQ_API_KEY` is read-only. An app that must write (a form that saves entries) needs its own write-capable key, scoped to those content types: the lead asks the user for it under a separate name, and only server-side code (a route handler) uses it — never the browser, and never the Factory's own read-write key.

See [Flotiq SDK for Node.js/TypeScript](https://flotiq.com/docs/API/generate-package/sdk-nodejs/) and [API key management](https://flotiq.com/docs/) for exact key scoping options.
