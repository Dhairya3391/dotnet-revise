import { useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:5000/api'

function App() {
  const [activeTab, setActiveTab] = useState('products')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  // Products state
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' })

  // Auth state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [user, setUser] = useState(null)

  // Utility state
  const [calcForm, setCalcForm] = useState({ a: '', b: '', operation: 'add' })

  const showResponse = (data) => {
    setResponse(JSON.stringify(data, null, 2))
  }

  // ============ PRODUCTS API ============
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/products`)
      const data = await res.json()
      setProducts(data)
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const fetchProductById = async (id) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/products/${id}`)
      const data = await res.json()
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const createProduct = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category,
          stock: parseInt(newProduct.stock)
        })
      })
      const data = await res.json()
      showResponse(data)
      setNewProduct({ name: '', price: '', category: '', stock: '' })
      fetchProducts()
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const deleteProduct = async (id) => {
    setLoading(true)
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
      showResponse({ message: `Product ${id} deleted` })
      fetchProducts()
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  // ============ AUTH API ============
  const login = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
      }
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    setLoginForm({ username: '', password: '' })
    showResponse({ message: 'Logged out' })
  }

  // ============ UTILITY API ============
  const healthCheck = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/utility/health`)
      const data = await res.json()
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const getServerTime = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/utility/time`)
      const data = await res.json()
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const getRandom = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/utility/random?min=1&max=100`)
      const data = await res.json()
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  const calculate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/utility/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          a: parseFloat(calcForm.a),
          b: parseFloat(calcForm.b),
          operation: calcForm.operation
        })
      })
      const data = await res.json()
      showResponse(data)
    } catch (err) {
      showResponse({ error: err.message })
    }
    setLoading(false)
  }

  return (
    <div className="app">
      <h1>🚀 API Practice App</h1>
      
      <div className="tabs">
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
        <button className={activeTab === 'auth' ? 'active' : ''} onClick={() => setActiveTab('auth')}>Auth</button>
        <button className={activeTab === 'utility' ? 'active' : ''} onClick={() => setActiveTab('utility')}>Utility</button>
      </div>

      <div className="content">
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="section">
            <h2>Products API</h2>
            
            <div className="api-group">
              <h3>GET Requests</h3>
              <button onClick={fetchProducts}>GET /products (All)</button>
              <button onClick={() => fetchProductById(1)}>GET /products/1</button>
              <button onClick={() => fetchProductById(2)}>GET /products/2</button>
            </div>

            <div className="api-group">
              <h3>POST Request - Create Product</h3>
              <div className="form">
                <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                <button onClick={createProduct}>POST /products</button>
              </div>
            </div>

            {products.length > 0 && (
              <div className="api-group">
                <h3>Products List (Click to DELETE)</h3>
                <div className="list">
                  {products.map(p => (
                    <div key={p.id} className="list-item">
                      <span>{p.name} - ${p.price} ({p.category})</span>
                      <button className="delete" onClick={() => deleteProduct(p.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUTH TAB */}
        {activeTab === 'auth' && (
          <div className="section">
            <h2>Auth API</h2>
            
            {user ? (
              <div className="api-group">
                <h3>Logged in as: {user.username}</h3>
                <p>Email: {user.email}</p>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <div className="api-group">
                <h3>Login</h3>
                <p className="hint">Try: admin/admin123, user/user123, or demo/demo</p>
                <div className="form">
                  <input placeholder="Username" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
                  <input placeholder="Password" type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                  <button onClick={login}>POST /auth/login</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* UTILITY TAB */}
        {activeTab === 'utility' && (
          <div className="section">
            <h2>Utility API</h2>
            
            <div className="api-group">
              <h3>GET Requests</h3>
              <button onClick={healthCheck}>GET /utility/health</button>
              <button onClick={getServerTime}>GET /utility/time</button>
              <button onClick={getRandom}>GET /utility/random</button>
            </div>

            <div className="api-group">
              <h3>POST Request - Calculator</h3>
              <div className="form">
                <input placeholder="A" type="number" value={calcForm.a} onChange={e => setCalcForm({...calcForm, a: e.target.value})} />
                <select value={calcForm.operation} onChange={e => setCalcForm({...calcForm, operation: e.target.value})}>
                  <option value="add">Add</option>
                  <option value="subtract">Subtract</option>
                  <option value="multiply">Multiply</option>
                  <option value="divide">Divide</option>
                </select>
                <input placeholder="B" type="number" value={calcForm.b} onChange={e => setCalcForm({...calcForm, b: e.target.value})} />
                <button onClick={calculate}>POST /utility/calculate</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Response Panel */}
      <div className="response-panel">
        <h3>API Response {loading && '⏳'}</h3>
        <pre>{response || 'Click a button to see the API response'}</pre>
      </div>
    </div>
  )
}

export default App
