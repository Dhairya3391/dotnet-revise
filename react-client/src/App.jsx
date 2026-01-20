import { useState } from 'react'
import './App.css'

const API = 'http://localhost:5000/api'

function App() {
  const [tab, setTab] = useState('products')
  const [res, setRes] = useState(null)
  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({})

  const api = async (url, opts) => {
    try {
      const r = await fetch(API + url, opts?.body ? {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts.body)
      } : opts)
      return await r.json()
    } catch (e) { return { error: e.message } }
  }

  const show = (data) => setRes(JSON.stringify(data, null, 2))

  const call = async (url, opts, cb) => {
    const data = await api(url, opts)
    show(data)
    cb?.(data)
  }

  const loadProducts = () => call('/products', null, setProducts)

  return (
    <div className="app">
      <h1>🚀 API Practice App</h1>
      
      <div className="tabs">
        {['products', 'auth', 'utility'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="content">
        {tab === 'products' && (
          <div className="section">
            <h2>Products API</h2>
            <div className="api-group">
              <button onClick={loadProducts}>GET All</button>
              <button onClick={() => call('/products/1')}>GET #1</button>
              <button onClick={() => call('/products/2')}>GET #2</button>
            </div>
            <div className="api-group">
              <h3>Create Product</h3>
              <div className="form">
                {['name', 'price', 'category', 'stock'].map(f => (
                  <input key={f} placeholder={f} type={f === 'price' || f === 'stock' ? 'number' : 'text'}
                    value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />
                ))}
                <button onClick={() => call('/products', {
                  body: { ...form, price: +form.price, stock: +form.stock }
                }, () => { setForm({}); loadProducts() })}>Create</button>
              </div>
            </div>
            {products.length > 0 && (
              <div className="api-group">
                <h3>Products</h3>
                {products.map(p => (
                  <div key={p.id} className="list-item">
                    <span>{p.name} - ${p.price}</span>
                    <button className="delete" onClick={() => call(`/products/${p.id}`, { method: 'DELETE' }, loadProducts)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'auth' && (
          <div className="section">
            <h2>Auth API</h2>
            {user ? (
              <div className="api-group">
                <p>Logged in: <b>{user.username}</b> ({user.email})</p>
                <button onClick={() => { setUser(null); show({ message: 'Logged out' }) }}>Logout</button>
              </div>
            ) : (
              <div className="api-group">
                <p className="hint">Try: admin/admin123</p>
                <div className="form">
                  <input placeholder="Username" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} />
                  <input placeholder="Password" type="password" value={form.password || ''} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button onClick={() => call('/auth/login', { body: form }, d => d.success && setUser(d.user))}>Login</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'utility' && (
          <div className="section">
            <h2>Utility API</h2>
            <div className="api-group">
              <button onClick={() => call('/utility/health')}>Health</button>
              <button onClick={() => call('/utility/time')}>Time</button>
              <button onClick={() => call('/utility/random?min=1&max=100')}>Random</button>
            </div>
            <div className="api-group">
              <h3>Calculator</h3>
              <div className="form">
                <input placeholder="A" type="number" value={form.a || ''} onChange={e => setForm({ ...form, a: e.target.value })} />
                <select value={form.op || 'add'} onChange={e => setForm({ ...form, op: e.target.value })}>
                  {['add', 'subtract', 'multiply', 'divide'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <input placeholder="B" type="number" value={form.b || ''} onChange={e => setForm({ ...form, b: e.target.value })} />
                <button onClick={() => call('/utility/calculate', { body: { a: +form.a, b: +form.b, operation: form.op || 'add' } })}>Calculate</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="response-panel">
        <h3>Response</h3>
        <pre>{res || 'Click a button to see response'}</pre>
      </div>
    </div>
  )
}

export default App
