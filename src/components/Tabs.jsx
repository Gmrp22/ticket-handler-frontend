// tabs: [{ id, label }]
function Tabs({ tabs, active, onChange }) {
  return (
    <nav className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`rounded px-3 py-1.5 text-sm font-medium ${
            tab.id === active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default Tabs
