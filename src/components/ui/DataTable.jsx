// columns: [{ header, render: (row) => node, className, sortKey }]
//   sortKey: the field the API sorts by. Only columns with it can be sorted.
// sort: { key, order } of the active sort, onSort(key): called when a header is clicked
// caption: describes the table for screen readers (not shown)
function DataTable({
  caption,
  columns,
  rows,
  getRowKey,
  sort,
  onSort,
  emptyMessage = 'No records found',
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-300 text-base text-gray-900">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-900">
          <tr>
            {columns.map((column) => {
              const isSorted = sort?.key === column.sortKey
              return (
                <th
                  key={column.header}
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
                      <span aria-hidden="true">
                        {isSorted ? (sort.order === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-700">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getRowKey(row)} className="hover:bg-indigo-50">
                {columns.map((column) => (
                  <td key={column.header} className={`px-4 py-3 ${column.className ?? ''}`}>
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
