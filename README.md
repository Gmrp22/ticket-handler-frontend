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

## What it does

- **Tickets:** paginated table (20 per page, newest first) with code, date, supplier, land and total.
  - **View:** the detail of a ticket, with its items and subtotals.
  - **New ticket / Edit:** a form with supplier, land and a dynamic list of items. The total is shown while typing.
  - **Delete:** asks for confirmation first.
- **Payments (bonus):** choose an ISO year and week and see what is paid to each supplier, with the tickets that make each payment. Each ticket can be opened to see its items.

The data is saved by the API in the database; the frontend keeps no data of its own.

## Project structure

```
src/
├── api/          Requests to the API: a generic client and one module per resource
├── components/   Screens and reusable pieces (tables, modals, forms)
├── hooks/        react-query hooks on top of api/
├── schemas/      zod validation rules
├── utils/        Formatting, ISO week helpers and the logger
├── App.jsx       Tabs (Tickets / Payments)
└── main.jsx      Entry point
```

## Not included

- Create, edit and delete of suppliers, lands and products. They are only read, to fill the selects of the ticket form.
- Sorting the tickets table from the interface (the API supports it).

See [docs/decisions.md](docs/decisions.md) for the full list and the reasons.
