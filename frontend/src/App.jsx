import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import ProductForm from './ProductForm.jsx'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const STOCK_FULL = 1000 // stock level at which the gauge shows full

export default function App() {
  const [filters, setFilters] = useState({ q: '', category: '', status: '', sortBy: 'createdAt', dir: 'desc', page: 0 })
  const [search, setSearch] = useState('')
  const [data, setData] = useState({ items: [], totalPages: 0, totalItems: 0 })
  const [stats, setStats] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState(null) // null | {} (new) | product
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState('')

  // debounce search box
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === search ? f : { ...f, q: search, page: 0 })), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(t)
  }, [toast])

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const [list, s, c] = await Promise.all([api.list({ ...filters, size: 8 }), api.stats(), api.categories()])
      setData(list)
      setStats(s)
      setCategories(c)
    } catch (e) {
      setLoadError(e.message === 'Failed to fetch' ? 'Cannot reach the server. Is the backend running on port 8080?' : e.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const setFilter = (k) => (e) => setFilters((f) => ({ ...f, [k]: e.target.value, page: 0 }))

  const sortBy = (field) =>
    setFilters((f) => ({ ...f, sortBy: field, dir: f.sortBy === field && f.dir === 'asc' ? 'desc' : 'asc', page: 0 }))

  const ariaSort = (field) => (filters.sortBy === field ? (filters.dir === 'asc' ? 'ascending' : 'descending') : 'none')

  const save = async (body) => {
    if (editing.id) await api.update(editing.id, body)
    else await api.create(body)
    setToast(editing.id ? 'Changes saved' : 'Product added')
    setEditing(null)
    load()
  }

  const confirmDelete = async () => {
    try {
      await api.remove(deleting.id)
      setToast('Product deleted')
    } catch (e) {
      setToast(e.message)
    }
    setDeleting(null)
    load()
  }

  const SortTh = ({ field, children, className }) => (
    <th className={className} aria-sort={ariaSort(field)}>
      <button className="sort" onClick={() => sortBy(field)}>
        {children}
        <span aria-hidden="true">{filters.sortBy === field ? (filters.dir === 'asc' ? ' ↑' : ' ↓') : ''}</span>
      </button>
    </th>
  )

  return (
    <>
      <header className="topbar">
        <div className="brand"><span className="mark" aria-hidden="true" />BajriX <span className="brand-sub">Admin</span></div>
        <div className="who">Signed in as Admin</div>
      </header>

      <main className="page">
        <div className="page-head">
          <div>
            <h1>Product catalogue</h1>
            {stats && (
              <p className="summary">
                <b>{stats.total}</b> products <i /> <b>{stats.active}</b> active <i />{' '}
                <b className={stats.outOfStock ? 'warn' : ''}>{stats.outOfStock}</b> out of stock <i /> <b>{stats.categories}</b> categories
              </p>
            )}
          </div>
          <button className="btn primary" onClick={() => setEditing({})}>Add product</button>
        </div>

        <div className="toolbar">
          <input type="search" placeholder="Search by product or brand" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" />
          <select value={filters.category} onChange={setFilter('category')} aria-label="Filter by category">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={filters.status} onChange={setFilter('status')} aria-label="Filter by status">
            <option value="">Any status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {loadError && (
          <p className="banner">{loadError} <button className="link" onClick={load}>Try again</button></p>
        )}

        <div className="table-wrap" aria-busy={loading}>
          <table>
            <thead>
              <tr>
                <SortTh field="name">Product</SortTh>
                <th>Category</th>
                <SortTh field="price" className="num">Price</SortTh>
                <SortTh field="stock">Stock</SortTh>
                <th className="num">Min. order</th>
                <th>Status</th>
                <th><span className="sr">Actions</span></th>
              </tr>
            </thead>
            <tbody className={loading ? 'dim' : ''}>
              {data.items.map((p) => (
                <tr key={p.id}>
                  <td><div className="pname">{p.name}</div><div className="muted">{p.brand}</div></td>
                  <td>{p.category}</td>
                  <td className="num">{inr.format(p.price)}<div className="muted">per {p.unit}</div></td>
                  <td>
                    <div className="gauge" role="img" aria-label={`${p.stock} in stock`}>
                      <span style={{ width: `${Math.min(100, (p.stock / STOCK_FULL) * 100)}%` }} className={p.stock === 0 ? 'empty' : p.stock < 50 ? 'low' : ''} />
                    </div>
                    <span className={p.stock === 0 ? 'warn' : ''}>{p.stock === 0 ? 'Out of stock' : `${p.stock.toLocaleString('en-IN')} ${p.unit}`}</span>
                  </td>
                  <td className="num">{p.minOrderQty}</td>
                  <td><span className={`pill ${p.status.toLowerCase()}`}>{p.status === 'ACTIVE' ? 'Active' : 'Inactive'}</span></td>
                  <td className="row-actions">
                    <button className="link" onClick={() => setEditing(p)}>Edit</button>
                    <button className="link danger" onClick={() => setDeleting(p)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && !loadError && data.items.length === 0 && (
            <div className="empty">
              <p>No products match these filters.</p>
              <button className="btn ghost" onClick={() => { setSearch(''); setFilters((f) => ({ ...f, q: '', category: '', status: '', page: 0 })) }}>Clear filters</button>
            </div>
          )}
          {loading && data.items.length === 0 && <div className="empty"><p>Loading products…</p></div>}
        </div>

        <nav className="pager" aria-label="Pagination">
          <span className="muted">{data.totalItems} results</span>
          <div>
            <button className="btn ghost" disabled={filters.page === 0} onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}>Previous</button>
            <span className="page-num">Page {data.totalPages ? filters.page + 1 : 0} of {data.totalPages}</span>
            <button className="btn ghost" disabled={filters.page + 1 >= data.totalPages} onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}>Next</button>
          </div>
        </nav>
      </main>

      {editing && <ProductForm product={editing.id ? editing : null} categories={categories} onSave={save} onClose={() => setEditing(null)} />}

      {deleting && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setDeleting(null)}>
          <div className="modal small" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
            <h2 id="del-title">Delete this product?</h2>
            <p><b>{deleting.name}</b> by {deleting.brand} will be removed permanently. Mark it inactive instead if you only want to hide it from buyers.</p>
            <div className="actions">
              <button className="btn ghost" onClick={() => setDeleting(null)}>Keep product</button>
              <button className="btn danger-solid" onClick={confirmDelete}>Delete product</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
