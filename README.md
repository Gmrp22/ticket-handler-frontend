# Ticket Handler - Frontend

Web interface to manage purchase tickets. It is the frontend of the technical test; it consumes the API of the backend repository.

The analysis and the decisions behind the project are in [docs/decisions.md](docs/decisions.md).

## Stack

- React.js (required by the test), with Vite
- Tailwind CSS
- `@tanstack/react-query` for the data from the API
- `react-hook-form` and `zod` for the forms and their validation
- `date-fns` for dates and ISO weeks
- `pino` for logs
- Vitest and React Testing Library for the tests

## Requirements

- Node.js 22 (developed with v22.21.1)
- The backend running at `http://localhost:3000`, with its database loaded (see the backend README)

## How to run it

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Check the `.env` file. It has the URL of the API, and the default value works with the backend running on its default port:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173`.

> The backend only accepts requests from `http://localhost:5173` (CORS, `CORS_ORIGIN` in the backend). If Vite starts on another port because 5173 is busy, the requests will fail.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with oxlint |
| `npm test` | Runs the unit tests once |
| `npm run test:watch` | Runs the unit tests again every time a file is saved |

## What it does

The page has three tabs.

- **Tickets:** paginated table (20 per page) with code, date, supplier, land and total. It starts with the newest first, and the **Code** and **Date** headers sort it.
  - **View:** the detail of a ticket, with its items and subtotals.
  - **New ticket / Edit:** a form with supplier, land and a dynamic list of items. The total is shown while typing.
  - **Delete:** asks for confirmation first.
- **Payments (bonus):** choose an ISO year and week and see what is paid to each supplier, with the tickets that make each payment. Each ticket can be opened to see its items. The data of the test is from January and February 2023, so use for example week 3 of 2023; the current week has no tickets.
- **Catalogs:** create, edit and delete **suppliers**, **lands** and **products**, with a sub-tab for each. The tables start sorted by name, and the **Code** and **Name** headers sort them. A record used in tickets cannot be deleted, and the message of the API is shown.

The data is saved by the API in the database; the frontend keeps no data of its own.

## Tests

```bash
npm test
```

They cover the validation rules, the helpers for dates and ISO weeks, the requests to the API (success, errors, `204`, network failure) and the main components (sortable table, pagination, modal with focus, form fields and the items of a ticket). More in [docs/decisions.md](docs/decisions.md).

## Project structure

```
src/
├── api/             All the requests to the API: a generic client and one module per resource
├── components/
│   ├── ui/          Reusable pieces with no business logic (Button, DataTable, Modal...)
│   └── layout/      The page layout
├── features/        One folder per functionality
│   ├── tickets/     components/, hooks/ and schema.js
│   ├── catalogs/    components/, hooks/, schema.js and constants.js
│   └── payments/    components/, hooks/ and week.js (ISO week helpers)
├── lib/             Generic code: logger, formatters and toast context
├── App.jsx          Tabs (Tickets / Payments / Catalogs)
└── main.jsx         Entry point

tests/               Same shape as src/ (api/, components/ui, features/..., lib/) and the setup
```

## Not included

- Search or pagination in the lists of suppliers, lands and products. The selects of the ticket form show the full list, sorted by name.
- Sorting the payments from the interface (they come sorted by supplier name).

See [docs/decisions.md](docs/decisions.md) for the reasons.
