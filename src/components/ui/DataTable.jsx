import Button from './Button'

// columns: [{ header, render: (row) => node, className, sortKey, mobileLabel }]
//   sortKey: the field the API sorts by. Only columns with it can be sorted.
//   mobileLabel: false to not show the header as a label on small screens (for the buttons of a row)
// sort: { key, order } of the active sort, onSort(key): called when a header is clicked
// caption: describes the table for screen readers (not shown)
//
// From the `md` size it is a table. On small screens each row is a card: the headers are hidden,
// every cell shows its header as a label, and the sort buttons go above the cards.
// The roles are written because a table that is not displayed as a table loses them.
function DataTable({
  caption,
  columns,
  rows,
  getRowKey,
  sort,
  onSort,
  emptyMessage = 'No records found',
}) {
  const sortableColumns = columns.filter((column) => column.sortKey)
  const arrow = (column) => (sort?.key === column.sortKey ? (sort.order === 'asc' ? '▲' : '▼') : '↕')

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow-sm md:overflow-x-auto">
      {onSort && sortableColumns.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-300 p-3 md:hidden">
          <span className="text-sm text-gray-700">Sort by</span>
          {sortableColumns.map((column) => (
            <Button key={column.sortKey} size="sm" onClick={() => onSort(column.sortKey)}>
              {column.header} <span aria-hidden="true">{arrow(column)}</span>
            </Button>
          ))}
        </div>
      )}
      <table
        role="table"
        className="block w-full text-base text-gray-900 md:table md:min-w-full md:divide-y md:divide-gray-300"
      >
        <caption className="sr-only">{caption}</caption>
        <thead
          role="rowgroup"
          className="hidden bg-gray-100 text-left text-sm font-semibold text-gray-900 md:table-header-group"
        >
          <tr role="row">
            {columns.map((column) => {
              const isSorted = sort?.key === column.sortKey
              return (
                <th
                  key={column.header}
                  role="columnheader"
                  scope="col"
                  aria-sort={
                    column.sortKey && isSorted
                      ? sort.order === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                  className={`px-4 py-3 ${column.className ?? ''}`}
                >
                  {column.sortKey && onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.sortKey)}
                      className="inline-flex items-center gap-1 font-semibold hover:underline"
                    >
                      {column.header}
                      <span aria-hidden="true">{arrow(column)}</span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody role="rowgroup" className="block divide-y divide-gray-200 md:table-row-group">
          {rows.length === 0 ? (
            <tr role="row" className="block md:table-row">
              <td
                role="cell"
                colSpan={columns.length}
                className="block px-4 py-8 text-center text-gray-700 md:table-cell"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowKey(row)}
                role="row"
                className="block px-4 py-3 hover:bg-indigo-50 md:table-row md:p-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.header}
                    role="cell"
                    data-label={column.mobileLabel === false ? undefined : column.header}
                    className={`flex items-center justify-between gap-4 py-1 before:font-semibold before:text-gray-700 before:content-[attr(data-label)] md:table-cell md:px-4 md:py-3 md:before:content-none ${column.className ?? ''}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
