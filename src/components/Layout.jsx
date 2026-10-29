function Layout({ nav, children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-20 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-medium"
      >
        Skip to main content
      </a>
      <header className="border-b border-gray-300 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 pt-3">
          <h1 className="pb-2 text-2xl font-bold">Ticket Handler</h1>
          {nav}
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default Layout
