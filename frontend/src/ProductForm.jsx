import { useEffect, useState } from 'react'

const EMPTY = { name: '', category: '', brand: '', unit: '', price: '', stock: '', minOrderQty: '1', status: 'ACTIVE' }

export default function ProductForm({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState(product ? { ...product } : EMPTY)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.category.trim()) e.category = 'Category is required'
    if (!form.brand.trim()) e.brand = 'Brand is required'
    if (!form.unit.trim()) e.unit = 'Unit is required'
    if (!(Number(form.price) > 0)) e.price = 'Price must be greater than 0'
    if (form.stock === '' || Number(form.stock) < 0) e.stock = 'Stock cannot be negative'
    if (!(Number(form.minOrderQty) >= 1)) e.minOrderQty = 'Minimum order must be at least 1'
    return e
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    setFormError('')
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        stock: parseInt(form.stock, 10),
        minOrderQty: parseInt(form.minOrderQty, 10),
      })
    } catch (err) {
      setErrors(err.fieldErrors || {})
      setFormError(err.message)
      setSaving(false)
    }
  }

  const Field = ({ id, label, type = 'text', hint, ...rest }) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={form[id]} onChange={set(id)} aria-invalid={!!errors[id]} {...rest} />
      {errors[id] ? <span className="error">{errors[id]}</span> : hint && <span className="hint">{hint}</span>}
    </div>
  )

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title" onSubmit={submit} noValidate>
        <h2 id="form-title">{product ? 'Edit product' : 'Add product'}</h2>
        {formError && <p className="banner">{formError}</p>}

        <Field id="name" label="Product name" autoFocus placeholder="PPC Cement 50 kg" />
        <div className="row">
          <div className="field">
            <label htmlFor="category">Category</label>
            <input id="category" list="category-list" value={form.category} onChange={set('category')} aria-invalid={!!errors.category} />
            <datalist id="category-list">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>
          <Field id="brand" label="Brand" />
        </div>
        <div className="row">
          <Field id="price" label="Price (₹)" type="number" min="0" step="0.01" />
          <Field id="unit" label="Sold per" placeholder="bag, kg, tonne" />
        </div>
        <div className="row">
          <Field id="stock" label="Stock" type="number" min="0" step="1" />
          <Field id="minOrderQty" label="Minimum order" type="number" min="1" step="1" />
        </div>
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" value={form.status} onChange={set('status')}>
            <option value="ACTIVE">Active - visible to buyers</option>
            <option value="INACTIVE">Inactive - hidden from buyers</option>
          </select>
        </div>

        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary" disabled={saving}>
            {saving ? 'Saving…' : product ? 'Save changes' : 'Add product'}
          </button>
        </div>
      </form>
    </div>
  )
}
