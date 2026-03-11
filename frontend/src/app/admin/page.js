"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function Admin() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { userInfo } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products")
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  const addProduct = async () => {
    if (!userInfo || !userInfo.token) {
      alert("Bu işlem için giriş yapmalısınız.")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          name,
          price
        })
      })
      if (res.ok) {
        alert("Ürün başarıyla eklendi!")
        setName("")
        setPrice("")
        fetchProducts() // Refresh list
      } else {
        const data = await res.json()
        alert(`Hata: ${data.message || "Ürün eklenirken bir hata oluştu."}`)
      }
    } catch (error) {
      console.error(error)
      alert("Bağlantı hatası!")
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) return

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      })
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id))
      } else {
        alert("Silme işlemi başarısız.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
            Admin Command Center
          </h1>
          <div className="flex gap-4">
            <Link href="/admin/dashboard" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/admin/orderlist" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
              Orders
            </Link>
            <Link href="/admin/userlist" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
              Users
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Add Product Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Yeni Ürün Ekle
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 block font-bold">Ürün İsmi</label>
                  <input
                    value={name}
                    placeholder="Örn: AirPods Max"
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 block font-bold">Fiyat ($)</label>
                  <input
                    value={price}
                    placeholder="0.00"
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all placeholder:text-gray-700 text-sm"
                  />
                </div>

                <button
                  onClick={addProduct}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-lg shadow-purple-600/20 mt-4 cursor-pointer"
                >
                  Ürünü Yayınla
                </button>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Mevcut Ürünler</h2>
                <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                  {products.length} Ürün
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                      <th className="p-6 font-bold">Ürün</th>
                      <th className="p-6 font-bold text-right">Fiyat</th>
                      <th className="p-6 font-bold text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <tr key={i}>
                          <td colSpan="3" className="p-10 text-center animate-pulse text-gray-600">Yükleniyor...</td>
                        </tr>
                      ))
                    ) : (
                      products.map((product) => (
                        <tr key={product._id} className="group hover:bg-white/[0.02] transition-all">
                          <td className="p-6">
                            <div className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[10px] text-gray-600 mt-1 font-mono uppercase tracking-tight">
                              ID: {product._id}
                            </div>
                          </td>
                          <td className="p-6 text-right font-bold text-indigo-400">
                            ${product.price}
                          </td>
                          <td className="p-6 text-right">
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all inline-flex items-center justify-center border border-red-500/20 hover:border-red-500 cursor-pointer"
                              title="Sil"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
