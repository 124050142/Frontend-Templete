import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShoppingBag, Loader, AlertCircle, Plus, X, Save } from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: 1, // Fijo en 1
    imagen_url: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/productos');
      const datosRecibidos = response.data;
      const listaProductos = datosRecibidos.productos || [];
      setProductos(Array.isArray(listaProductos) ? listaProductos : []);
    } catch (err) {
      console.error("Error en la petición:", err);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      // Ajustamos los nombres de los campos para que coincidan con tu backend
      const response = await api.post('/api/productos', formData);
      
      // Si el back devuelve el producto creado, lo agregamos a la lista
      if (response.data) {
        alert("¡Producto creado con éxito!");
        setShowForm(false);
        setFormData({ nombre: '', precio: '', stock: 1, imagen_url: '', descripcion: '' });
        cargarProductos(); // Recargamos para ver los cambios
      }
    } catch (err) {
      alert("Error al guardar: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="text-blue-600" /> Inventario
          </h1>
          <p className="text-slate-500 text-sm">{productos.length} productos registrados</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
            showForm ? 'bg-red-100 text-red-600' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {showForm ? <><X size={20}/> Cancelar</> : <><Plus size={20}/> Crear Producto</>}
        </button>
      </header>

      {/* Formulario de Creación */}
      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-blue-100 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Detalles del Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Nombre del Producto</label>
              <input 
                required type="text" name="nombre" value={formData.nombre} onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Camiseta de Algodón"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Precio ($)</label>
              <input 
                required type="number" step="0.01" name="precio" value={formData.precio} onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-600 mb-1">URL de la Imagen</label>
              <input 
                type="url" name="imagen_url" value={formData.imagen_url} onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://link-de-la-imagen.com/foto.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1">Stock (Fijo)</label>
              <input 
                readOnly type="number" name="stock" value={formData.stock}
                className="w-full p-2 border border-slate-100 rounded-lg bg-slate-50 text-slate-400 font-bold"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Descripción corta</label>
              <input 
                type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Breve detalle del producto..."
              />
            </div>
            <div className="md:col-span-3 flex justify-end mt-2">
              <button 
                type="submit" disabled={submitLoading}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300 transition"
              >
                {submitLoading ? <Loader className="animate-spin" size={20}/> : <><Save size={20}/> Guardar Producto</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg flex items-center gap-2 mb-6">
          <AlertCircle /> {error}
        </div>
      )}

      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productos.map((prod) => (
          <div key={prod.id || prod._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 overflow-hidden flex flex-col group">
            <div className="h-48 p-4 bg-white flex items-center justify-center border-b border-slate-50 relative overflow-hidden">
              <img 
                src={prod.image || prod.imagen_url || "https://via.placeholder.com/150"} 
                alt={prod.title || prod.nombre} 
                className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-md text-slate-800 line-clamp-1" title={prod.title || prod.nombre}>
                  {prod.title || prod.nombre}
                </h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
                  ${prod.price || prod.precio}
                </span>
              </div>
              
              <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">
                {prod.description || prod.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                  Stock: <span className={(prod.stock || 0) < 1 ? "text-red-500" : "text-blue-600"}>
                    {prod.stock || 0}
                  </span>
                </span>
                <button className="text-xs text-blue-600 hover:underline font-bold">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;