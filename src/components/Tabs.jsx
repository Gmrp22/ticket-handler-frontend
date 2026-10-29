// tabs: [{ id, label }]
// The active one is marked with a bottom border and bold text, not only with color
function Tabs({ tabs, active, onChange }) {
  return (
    <nav aria-label="Main" className="flex gap-2">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(tab.id)}
            className={`border-b-4 px-3 py-2 text-base ${
              isActive
                ? 'border-indigo-700 font-semibold text-indigo-900'
                : 'border-transparent font-medium text-gray-700 hover:border-gray-400 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

export default Tabs
