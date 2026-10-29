# Analysis and decisions

## Findings

What I found in the data and in the API (see `apidoc.md`) that the frontend has to respect.

1. Decimals come as text (`"1475.000"`) and dates as `YYYY-MM-DD`.
2. The ticket total is never sent. The API calculates it from the items.
3. There are items with quantity 0, and the API accepts them. The same product can be repeated in a ticket.
4. The ticket `code` has no single format (5 digits, 7 digits, `GPE01`), so it is text.
5. The list of tickets has no items. Only `GET /tickets/:id` has them. `PUT` replaces the ticket and all its items.
6. Suppliers, lands and products come as a full list, with no pagination or search.
7. Payments come grouped by supplier, without the items of the tickets. The ISO year of a week can be different from the year of the date (2024-12-30 is week 1 of 2025).
8. Tickets, payments and catalogs can be sorted with `sort` and `order`, only by a fixed list of fields.
9. The API only accepts requests from `http://localhost:5173`.

## Decisions

### Stack and structure
- React.js is required. Vite to run it, JavaScript and not TypeScript (the test only asks for React.js, and it is simpler).
- Tailwind with no UI library, because the test says the design is free.
- `react-query` for server data, `react-hook-form` and `zod` for forms, `date-fns` for ISO weeks, `pino` for logs. Nothing else: the state of the interface (open modal, page, sort) is `useState`.
- A single page with three tabs (Tickets, Payments, Catalogs) kept in a state, and modals for create, edit, view and delete. No router: the test only asks for a functional interface.
- The data layer has three levels: `api/client.js` (generic fetch), `api/<resource>.js` (what to ask) and `hooks/` (react-query). Components never know about URLs, so a change in the API only touches `api/`.
- `client.js` turns every failure into an `ApiError` with a readable message: the API error (a list is joined in one text), "Could not reach the server", or "Unexpected response from the server" when the answer is not JSON.

### Server data
- After creating, editing or deleting, I invalidate the cached lists instead of removing the row by hand. The API paginates, so removing one row would leave a page with 19 rows, wrong totals and shifted pages. The server is the source of truth.
- No optimistic updates. They add complexity the test does not need.
- Changing page or sort keeps the old data visible while the new one loads, so the table does not flicker.

### Tickets
- The table sorts by **Code** and **Date**, the two fields the API allows besides `id`. The sort is done by the API and not in the frontend, because the data is paginated: sorting only the 20 rows of a page would be wrong. Changing the sort goes back to page 1.
- One form for create and edit. To edit, the full ticket is requested first, because the list has no items.
- The form is validated with `zod` when the user presses Save, and each field is checked again while it is corrected. Errors from the API (for example a repeated code, `409`) are shown inside the modal.
- `quantity` can be 0 and `price` must be greater than 0. The API accepts a quantity of 0 because the Excel has such lines, and the form must be able to save those tickets again when they are edited. A price of 0 has no use, so it is not accepted. Negative numbers are rejected, and the number inputs do not accept `-`, `+` or `e`.
- The subtotals and the total of the form are only a preview while typing (`quantity x price`). The real total is the one the API calculates.
- The form sends numbers, not text, and uses the same names as the API.

### Catalogs (suppliers, lands and products)
- They have the full CRUD. One table, one form and one set of hooks serve the three, because they have the same shape and endpoints.
- A record used in tickets cannot be deleted (`409`), and the message of the API is shown. After an update, the tickets and payments are refreshed too, because they show those names.
- The tables and the selects of the ticket form are sorted by name, which is easier to read than the order of the Excel.
- The selects request the full list. The API has no pagination or search for them, and the lists are small (about 60 suppliers, 11 lands, 12 products) and cached. A native `<select>` is enough to choose one value.
- Pagination or search could be added later, since the backend is ours (for example `?search=` and `?limit=`). Not done for simplicity: it touches two repositories, the lists are small and the test does not ask for it. It would also need a searchable input instead of the `<select>`.

### Weekly payments (bonus)
- The week is chosen with two number fields (year and week) and buttons for the previous and next week, starting in the current ISO week. I did not use `<input type="week">` because it does not work in Firefox or in Safari for desktop.
- `date-fns` handles the change of year and the years with 53 weeks. Year and week are checked with the same limits as the API, and no request is sent if they are wrong.
- The API does not send the items of the tickets, so the button View of each ticket opens the same detail modal of the tickets table. That is the detail of the tickets bought from each supplier that the test asks for.
- The suppliers come in the API order (by name).

### Accessibility
- Dark text on a light background (never lighter than `gray-700`), 16px text, controls at least 36 to 40px high, and a visible focus ring on everything interactive. The whole interface works with the keyboard.
- Modals move the focus inside, keep Tab inside, close with Escape and give the focus back to the button that opened them.
- Errors do not depend on color: they have an icon and text, and each field error is linked to its input (`aria-describedby`, `aria-invalid`). Row buttons say which record they belong to ("Edit ticket 1115651").
- Tables have a hidden caption, and a sortable header tells its order with `aria-sort`. There is a "Skip to main content" link and `prefers-reduced-motion` is respected.

### Testing
- Vitest with React Testing Library, which tests components the way a person uses them. The tests are next to the file they test, and the API is simulated, so no test needs the backend.
- Covered: ISO week helpers, validation rules, requests to the API (success, errors, `204`, network failure, answers that are not JSON, sort in the URL) and the main components (sortable table, pagination, modal focus, form fields, items of a ticket, catalogs form and table).
- Writing them found two real problems that were fixed: a server answer that is not JSON gave a raw syntax error, and a field error was read twice by screen readers.
- Not covered: the hooks alone, `TicketsTable`, `TicketFormModal` and `PaymentsView`, only through the pieces they use.

## Left for later
- Search in the selects, see Catalogs.
- A way to sort the payments from the interface (the API supports it).
- Make Payments start in a week with data. It starts in the current week, and the data of the test is from 2023.
- A check of the small screens: the table scrolls sideways and the items of the form may be tight on a phone.
- Tests of the complete flows (create, edit and delete a ticket).
- Filter by `code`, which the API does not have yet.

## Not added
- A router, a UI library or a state library like Redux. The tabs, `react-query` and `useState` are enough.
- `React.memo`, `useMemo` and `useCallback` by default. With 20 rows a render costs milliseconds. I only use `useMemo` where a stable reference is needed (the columns of the tables).
- Authentication, the test does not ask for it.
