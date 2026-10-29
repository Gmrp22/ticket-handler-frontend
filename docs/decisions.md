# Analysis and decisions

## Findings

What I found in the data and in the API that the frontend has to respect (see `apidoc.md`).

1. Decimal numbers come as text (`"1475.000"`): `quantity`, `price` and `total`.
2. Dates come as `YYYY-MM-DD`.
3. The ticket total is not sent in a request. The API calculates it from the items.
4. There are items with quantity 0, and the API accepts them.
5. The same product can be repeated in the same ticket.
6. The ticket `code` has no single format (5 digits in one, 7 in the rest, and codes like `GPE01`), so it is text.
7. The list of tickets does not include the items. Only `GET /tickets/:id` does.
8. Suppliers, lands and products come as a full list, with no pagination and no search.
9. `PUT /tickets/:id` replaces the ticket and all its items, so the full list of items must be sent.
10. The payments of a week come grouped by supplier, without the items of the tickets.
11. The ISO year of a week can be different from the year of the date (2024-12-30 is week 1 of 2025).
12. The API only accepts requests from `http://localhost:5173`.

## Decisions

### Stack
- React.js is required by the test. The rest is our choice.
- Vite to build and run it. It is the usual tool for a React app and it has hot reload.
- JavaScript, not TypeScript. The test only asks for React.js, and it keeps the project simpler.
- Tailwind CSS for the styles, with no UI library. The test says the design is free.
- `@tanstack/react-query` for the data from the API, `react-hook-form` and `zod` for the forms, `date-fns` for dates and `pino` for logs.
- No more libraries than these. The state of the interface (open modal, current page) uses `useState`.
- We use the latest stable versions, to avoid problems with old ones.

### Screens
- It is a single page (SPA). The home is the tickets table, and create, edit, view and delete open in modals.
- Payments is a second view, chosen with tabs in the header. The tabs are kept in a state, there are no routes. It is simpler, and the test only asks for a functional interface.
- The tabs mark the active one with a border and bold text, not only with color.

### Data layer
- Three levels: `api/client.js` (generic fetch), `api/<resource>.js` (what to ask) and `hooks/use<Resource>.js` (react-query). Each level only knows the one below, so components never know about URLs.
- `client.js` handles what every request needs: the base URL from `VITE_API_URL`, the `Content-Type` header, the `204` without body and the errors.
- Errors become an `ApiError` with the `status` and the message of the API. When the API sends a list of messages, they are joined in one text. If the server does not answer, the message is "Could not reach the server".
- Requests and errors are logged with pino. It writes to the browser console: `debug` in development and `warn` in production.

### Server data with react-query
- It gives loading, error and cache without writing them by hand with `useState` and `useEffect`.
- After creating, editing or deleting a ticket, the lists are invalidated (`invalidateQueries`). Only the page being viewed is requested again, the other cached pages are marked as old and requested when they are visited.
- I do not remove the row by hand. The API paginates, so removing one row leaves a page with 19 rows, wrong totals and shifted pages. The server is the source of truth.
- No optimistic updates. They add complexity the test does not need.
- Changing page keeps the previous one visible while the new one loads (`keepPreviousData`), so the table does not flicker.
- If the only ticket of the last page is deleted, the table goes back one page.

### Tickets table
- 20 per page, as the API sorts them by default (newest first).
- `DataTable` is generic: it receives `columns` and `rows`. It is made so the same table can be used for other lists.
- Row actions (View, Edit, Delete) say which ticket they belong to ("Edit ticket 1115651") for screen readers.
- Delete always asks for confirmation, and shows the error of the API inside the dialog if it fails.

### Ticket form
- One form for create and edit, in a modal. To edit, the full ticket is requested first (`GET /tickets/:id`) because the list has no items.
- The items are a dynamic list (`useFieldArray`). There must be at least one, so the last row cannot be removed.
- Validation is with `zod`: code, date, supplier, land and at least one item with product, quantity and price. `@hookform/resolvers` connects it to `react-hook-form`.
- The form is validated when the user presses Save, and after that each field is checked again while it is corrected. Errors appear in red under each field, with an icon, and the field gets a red border.
- Errors from the API (for example a repeated code, `409`) are shown inside the modal, above the buttons.
- `quantity` and `price` must be greater than 0. The API accepts 0 because the Excel has lines with quantity 0, but for new data a line of 0 adds nothing. This means that editing a ticket that has a line with quantity 0 asks to change or remove that line.
- The number inputs do not accept `-`, `+` or `e`, and have `min="0"`. A pasted negative value is rejected by the validation.
- The subtotal of each item and the total are calculated in the form (`quantity x price`) only to show them while typing. The real total is the one the API calculates.
- The form sends numbers, not text, and uses the same names as the API (`supplierId`, `landId`, `productId`).
- The same product can be added in more than one item, as the API allows it.
- The ticket `code` is free text, because its format is not consistent.

### Catalogs (suppliers, lands and products)
- They are only read, to fill the selects of the form. One function (`getCatalog`) and one hook (`useCatalog`) serve the three, because they have the same shape and endpoints.
- The full list is requested. The API has no pagination or search for them, and the lists are small (about 60 suppliers, 11 lands and 12 products). The cache keeps the list for 5 minutes, because they rarely change.
- A native `<select>` is enough to choose one value. A table is for managing records, not for choosing one.
- Pagination or search on these endpoints could be added later, since the backend is ours (for example `?search=` and `?limit=`, without breaking the full list). Not done for simplicity: the lists are small, it touches two repositories and the test does not ask for it. It would also need a searchable input with debounce instead of the `<select>`.

### Weekly payments (bonus)
- The week is chosen with two number fields, year and week, and buttons for the previous and next week. It starts in the current ISO week.
- I did not use `<input type="week">` because it does not work in Firefox or in Safari for desktop.
- The previous/next buttons use `date-fns`, so they handle the change of year (week 1 of 2025 goes back to week 52 of 2024) and the years with 53 weeks. The date range of the week is shown under the fields.
- The year and the week are checked with the same limits as the API (1900 to 2100, and 1 to 53). If they are wrong the request is not sent, and the field gets a red border.
- The suppliers come in the order of the API (by name). The frontend does not send `sort` or `order`.
- The API does not send the items of the tickets, so the button View of each ticket opens the same detail modal of the tickets table. That is the detail of the tickets bought from each supplier, which the test asks for.
- A week without tickets shows "No payments this week".

### Formats
- Numbers and currency are formatted in `utils/format.js`. Money is shown in USD and dates as `dd/MM/yyyy`, like the file of the test.
- The values from the API are converted with `Number(...)` before showing them or doing math.

### Accessibility
- The text is at least `gray-700` on a light background, and the main text is `gray-900`. Buttons use dark indigo with white text. The borders of inputs and buttons are dark enough to be seen (contrast 3:1 or more).
- The base text is 16px and inputs and buttons are at least 36 to 40px high.
- Every interactive element has a visible focus ring, and the whole interface can be used with the keyboard.
- Modals move the focus inside when they open, keep Tab inside them, close with Escape and give the focus back to the button that opened them.
- Errors are not shown only with color. Error boxes have an icon and the word "Error", and the error of a field has an icon next to its text.
- Each error of a field is linked to its input (`aria-describedby`, `aria-invalid`). Tables have a hidden caption and `scope="col"`.
- A link "Skip to main content" appears with the first Tab.
- `prefers-reduced-motion` stops the spinner from turning.
- The language of the page is `en`, as the interface is in English.

### Git workflow
- `main` is the stable version and `develop` is where everything is joined. Each feature has its own branch (`feature/...`, `fix/...`, `docs/...`) and is merged into `develop`.
- One commit per finished feature, with messages like `feat: ...`, `fix: ...` and `style: ...`.

### Left for later
- Create, edit and delete suppliers, lands and products. The API supports it, but the test does not need it to create tickets.
- Sorting the tickets table from the interface (`sort` and `order` are in the API).
- Search in the selects, see Catalogs.
- A check of the small screens: the table scrolls sideways and the items of the form may be tight on a phone.
- Tests. The project has none.
- Filter by `code`, which the API does not have yet.

### Not added
- A router. The tabs and modals are enough for a single page.
- A UI library or a state library like Redux. `react-query` and `useState` cover it.
- `React.memo`, `useMemo` and `useCallback` by default. With 20 rows a render costs milliseconds, and memoizing everything adds code. I only use `useMemo` where a stable reference is needed (the columns of the tables).
- Authentication, the test does not ask for it.
