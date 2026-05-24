import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  LayoutDashboard,
  LogOut,
  Mail,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type Screen = "login" | "dashboard" | "users" | "clients" | "providers" | "products" | "reports" | "cashier";
type Role = "admin" | "supervisor" | "cashier";

type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  contrasena?: string;
  rol: string;
};

type Cliente = {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  correo: string;
};

type Proveedor = {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  correo: string;
};

type Producto = {
  id: number;
  nombre: string;
  tipo: string;
  precio: number;
  cantidadStock: number;
  marca: string;
};

type DetalleVenta = {
  idVenta: number;
  fecha: string;
  cliente: string;
  usuario: string;
  producto: string;
  tipo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

type ReporteProducto = {
  producto: string;
  tipo: string;
  totalVendido: number;
  ingresosTotales: number;
  vecesVendido: number;
};

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Error ${response.status}`);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

function money(value: number | undefined) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function normalizeRole(rol: string): Role {
  const cleanRole = rol?.toLowerCase() ?? "";
  if (cleanRole.includes("caj")) return "cashier";
  if (cleanRole.includes("super") || cleanRole.includes("gerente")) return "supervisor";
  return "admin";
}

function roleLabel(role: Role) {
  if (role === "cashier") return "Cajero";
  if (role === "supervisor") return "Supervisor";
  return "Administrador";
}

function allowedScreens(role: Role): Screen[] {
  if (role === "cashier") return ["dashboard", "cashier", "clients"];
  if (role === "supervisor") return ["dashboard", "products", "providers", "reports"];
  return ["dashboard", "users", "clients", "products", "providers", "reports"];
}

function useApiList<T>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api<T[]>(path));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [path]);

  return { data, loading, error, load };
}

function useMessage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (work: () => Promise<void>, success: string) => {
    setMessage(null);
    setError(null);
    try {
      await work();
      setMessage(success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo completar la accion");
    }
  };

  return { message, error, run, clear: () => { setMessage(null); setError(null); } };
}

function LoginScreen({ onLogin }: { onLogin: (usuario: Usuario) => void }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const usuario = await api<Usuario>("/usuarios/login", {
        method: "POST",
        body: JSON.stringify({ correo, contrasena }),
      });
      onLogin(usuario);
    } catch {
      setError("Credenciales incorrectas o backend apagado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-panel">
        <div>
          <p className="eyebrow">Sistema de gestion</p>
          <h1>EntreCopas</h1>
          <p className="muted">Ingresa con tu usuario real para abrir el flujo de trabajo de tu rol.</p>
        </div>
        <form className="stack" onSubmit={submit}>
          <TextInput label="Correo electronico" value={correo} onChange={setCorreo} required type="email" />
          <TextInput label="Contrasena" value={contrasena} onChange={setContrasena} required type="password" />
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" disabled={loading} type="submit">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </section>
    </div>
  );
}

function AppLayout({
  active,
  role,
  user,
  onNavigate,
  onLogout,
  children,
}: {
  active: Screen;
  role: Role;
  user: Usuario | null;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const allLinks = [
    { screen: "dashboard" as Screen, label: "Inicio", icon: LayoutDashboard },
    { screen: "cashier" as Screen, label: "Caja", icon: ShoppingCart },
    { screen: "users" as Screen, label: "Usuarios", icon: Users },
    { screen: "clients" as Screen, label: "Clientes", icon: UserPlus },
    { screen: "products" as Screen, label: "Inventario", icon: Package },
    { screen: "providers" as Screen, label: "Proveedores", icon: Building2 },
    { screen: "reports" as Screen, label: "Reportes", icon: BarChart3 },
  ];
  const links = allLinks.filter((link) => allowedScreens(role).includes(link.screen));

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>EntreCopas</span>
          <small>{roleLabel(role)}</small>
        </div>
        <nav className="side-nav">
          {links.map(({ screen, label, icon: Icon }) => (
            <button className={active === screen ? "nav-item active" : "nav-item"} key={screen} onClick={() => onNavigate(screen)} type="button">
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">{user?.nombre?.slice(0, 1) ?? "U"}</div>
          <div className="min-w-0">
            <p>{user?.nombre ?? "Usuario"}</p>
            <small>{user?.correo}</small>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout} type="button">
          <LogOut size={16} />
          Cerrar sesion
        </button>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}

function DashboardScreen({ role }: { role: Role }) {
  const productos = useApiList<Producto>("/productos");
  const ventas = useApiList<DetalleVenta>("/reportes/detalle-ventas");
  const productosVendidos = useApiList<ReporteProducto>("/reportes/productos-vendidos");
  const clientes = useApiList<Cliente>("/clientes");
  const lowStock = productos.data.filter((producto) => producto.cantidadStock <= 5);
  const totalVentas = ventas.data.reduce((sum, venta) => sum + venta.subtotal, 0);
  const topProduct = productosVendidos.data[0];

  return (
    <Page>
      <PageHeader
        eyebrow={roleLabel(role)}
        title={role === "cashier" ? "Caja lista para vender" : "Panel de control"}
        subtitle={role === "supervisor" ? "Inventario, proveedores y ventas en un solo lugar." : "Resumen rapido para trabajar sin perderte entre tablas."}
      />
      <StatusLine loading={productos.loading || ventas.loading || clientes.loading} error={productos.error || ventas.error || clientes.error} />
      <div className="metrics-grid">
        <Metric label="Ventas reportadas" value={money(totalVentas)} tone="purple" />
        <Metric label="Productos" value={String(productos.data.length)} tone="teal" />
        <Metric label="Stock bajo" value={String(lowStock.length)} tone={lowStock.length ? "red" : "green"} />
        <Metric label="Clientes" value={String(clientes.data.length)} tone="blue" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <PanelTitle icon={<AlertTriangle size={16} />} title="Productos por reponer" />
          <div className="list-stack">
            {lowStock.slice(0, 6).map((producto) => (
              <div className="row-card" key={producto.id}>
                <div>
                  <strong>{producto.nombre}</strong>
                  <small>{producto.marca} · {producto.tipo}</small>
                </div>
                <StockBadge stock={producto.cantidadStock} />
              </div>
            ))}
            {!lowStock.length && <EmptyText text="No hay productos con stock critico." />}
          </div>
        </section>
        <section className="panel">
          <PanelTitle icon={<BarChart3 size={16} />} title="Ventas recientes" />
          <div className="list-stack">
            {ventas.data.slice(0, 6).map((venta) => (
              <div className="row-card" key={`${venta.idVenta}-${venta.producto}`}>
                <div>
                  <strong>{venta.producto}</strong>
                  <small>{venta.cliente} · {new Date(venta.fecha).toLocaleDateString("es-CO")}</small>
                </div>
                <span className="money-pill">{money(venta.subtotal)}</span>
              </div>
            ))}
            {!ventas.data.length && <EmptyText text="No hay ventas para mostrar todavia." />}
          </div>
        </section>
      </div>
      {topProduct && (
        <section className="panel highlight-panel">
          <PanelTitle icon={<Package size={16} />} title="Producto lider" />
          <p>
            {topProduct.producto} tiene {topProduct.totalVendido} unidades vendidas y {money(topProduct.ingresosTotales)} en ingresos.
          </p>
        </section>
      )}
    </Page>
  );
}

function UsersScreen() {
  const usuarios = useApiList<Usuario>("/usuarios");
  const feedback = useMessage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "", rol: "Cajero" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await feedback.run(async () => {
      await api<void>("/usuarios", { method: "POST", body: JSON.stringify(form) });
      setForm({ nombre: "", correo: "", contrasena: "", rol: "Cajero" });
      setOpen(false);
      await usuarios.load();
    }, "Usuario creado correctamente.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Administrador" title="Usuarios" subtitle="Crea empleados y asigna si entran como administrador, supervisor o cajero.">
        <button className="primary-button compact" onClick={() => setOpen(true)} type="button">
          <Plus size={16} />
          Nuevo usuario
        </button>
      </PageHeader>
      <StatusLine loading={usuarios.loading} error={usuarios.error || feedback.error} message={feedback.message} onRetry={usuarios.load} />
      <DataTable headers={["Nombre", "Correo", "Rol"]}>
        {usuarios.data.map((usuario) => (
          <tr key={usuario.id}>
            <Cell strong>{usuario.nombre}</Cell>
            <Cell mono>{usuario.correo}</Cell>
            <Cell><RoleBadge role={normalizeRole(usuario.rol)} label={usuario.rol} /></Cell>
          </tr>
        ))}
      </DataTable>
      <Modal open={open} title="Nuevo usuario" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <TextInput label="Nombre" value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} required />
          <TextInput label="Correo" value={form.correo} onChange={(correo) => setForm({ ...form, correo })} required type="email" />
          <TextInput label="Contrasena" value={form.contrasena} onChange={(contrasena) => setForm({ ...form, contrasena })} required type="password" />
          <Field label="Rol">
            <select className="field" value={form.rol} onChange={(event) => setForm({ ...form, rol: event.target.value })}>
              <option>Administrador</option>
              <option>Supervisor</option>
              <option>Cajero</option>
            </select>
          </Field>
          <button className="primary-button full-span" type="submit">Guardar usuario</button>
        </form>
      </Modal>
    </Page>
  );
}

function ClientsScreen() {
  const clientes = useApiList<Cliente>("/clientes");
  const feedback = useMessage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", documento: "", telefono: "", correo: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await feedback.run(async () => {
      await api<void>("/clientes", { method: "POST", body: JSON.stringify(form) });
      setForm({ nombre: "", documento: "", telefono: "", correo: "" });
      setOpen(false);
      await clientes.load();
    }, "Cliente registrado correctamente.");
  };

  const remove = async (id: number) => {
    await feedback.run(async () => {
      await api<void>(`/clientes/${id}`, { method: "DELETE" });
      await clientes.load();
    }, "Cliente eliminado.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Clientes" title="Base de clientes" subtitle="Los clientes quedan listos para seleccionarlos al registrar una venta.">
        <button className="primary-button compact" onClick={() => setOpen(true)} type="button">
          <Plus size={16} />
          Nuevo cliente
        </button>
      </PageHeader>
      <StatusLine loading={clientes.loading} error={clientes.error || feedback.error} message={feedback.message} onRetry={clientes.load} />
      <DataTable headers={["Nombre", "Documento", "Telefono", "Correo", ""]}>
        {clientes.data.map((cliente) => (
          <tr key={cliente.id}>
            <Cell strong>{cliente.nombre}</Cell>
            <Cell mono>{cliente.documento}</Cell>
            <Cell>{cliente.telefono}</Cell>
            <Cell>{cliente.correo}</Cell>
            <ActionCell>
              <button className="icon-danger" onClick={() => remove(cliente.id)} type="button" title="Eliminar cliente">
                <Trash2 size={15} />
              </button>
            </ActionCell>
          </tr>
        ))}
      </DataTable>
      <Modal open={open} title="Nuevo cliente" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <TextInput label="Nombre" value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} required />
          <TextInput label="Documento" value={form.documento} onChange={(documento) => setForm({ ...form, documento })} required />
          <TextInput label="Telefono" value={form.telefono} onChange={(telefono) => setForm({ ...form, telefono })} />
          <TextInput label="Correo" value={form.correo} onChange={(correo) => setForm({ ...form, correo })} required type="email" />
          <button className="primary-button full-span" type="submit">Guardar cliente</button>
        </form>
      </Modal>
    </Page>
  );
}

function ProvidersScreen() {
  const proveedores = useApiList<Proveedor>("/proveedores");
  const feedback = useMessage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", telefono: "", direccion: "", correo: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await feedback.run(async () => {
      await api<void>("/proveedores", { method: "POST", body: JSON.stringify(form) });
      setForm({ nombre: "", telefono: "", direccion: "", correo: "" });
      setOpen(false);
      await proveedores.load();
    }, "Proveedor registrado correctamente.");
  };

  const remove = async (id: number) => {
    await feedback.run(async () => {
      await api<void>(`/proveedores/${id}`, { method: "DELETE" });
      await proveedores.load();
    }, "Proveedor eliminado.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Supervisor" title="Proveedores" subtitle="Contacto rapido para pedir reposicion cuando el inventario baja.">
        <button className="primary-button compact" onClick={() => setOpen(true)} type="button">
          <Plus size={16} />
          Nuevo proveedor
        </button>
      </PageHeader>
      <StatusLine loading={proveedores.loading} error={proveedores.error || feedback.error} message={feedback.message} onRetry={proveedores.load} />
      <DataTable headers={["Proveedor", "Telefono", "Correo", "Direccion", "Contacto"]}>
        {proveedores.data.map((proveedor) => (
          <tr key={proveedor.id}>
            <Cell strong>{proveedor.nombre}</Cell>
            <Cell mono>{proveedor.telefono}</Cell>
            <Cell>{proveedor.correo}</Cell>
            <Cell>{proveedor.direccion}</Cell>
            <ActionCell>
              <a className="icon-link" href={`tel:${proveedor.telefono}`} title="Llamar proveedor"><Phone size={15} /></a>
              <a className="icon-link" href={`mailto:${proveedor.correo}`} title="Enviar correo"><Mail size={15} /></a>
              <button className="icon-danger" onClick={() => remove(proveedor.id)} type="button" title="Eliminar proveedor">
                <Trash2 size={15} />
              </button>
            </ActionCell>
          </tr>
        ))}
      </DataTable>
      <Modal open={open} title="Nuevo proveedor" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <TextInput label="Nombre" value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} required />
          <TextInput label="Telefono" value={form.telefono} onChange={(telefono) => setForm({ ...form, telefono })} required />
          <TextInput label="Direccion" value={form.direccion} onChange={(direccion) => setForm({ ...form, direccion })} />
          <TextInput label="Correo" value={form.correo} onChange={(correo) => setForm({ ...form, correo })} type="email" />
          <button className="primary-button full-span" type="submit">Guardar proveedor</button>
        </form>
      </Modal>
    </Page>
  );
}

function ProductsScreen() {
  const productos = useApiList<Producto>("/productos");
  const feedback = useMessage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ nombre: "", marca: "", tipo: "", precio: "", cantidadStock: "" });
  const filtered = productos.data.filter((producto) =>
    `${producto.nombre} ${producto.marca} ${producto.tipo}`.toLowerCase().includes(query.toLowerCase())
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await feedback.run(async () => {
      await api<void>("/productos", {
        method: "POST",
        body: JSON.stringify({ ...form, precio: Number(form.precio), cantidadStock: Number(form.cantidadStock) }),
      });
      setForm({ nombre: "", marca: "", tipo: "", precio: "", cantidadStock: "" });
      setOpen(false);
      await productos.load();
    }, "Producto agregado al inventario.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Inventario" title="Productos" subtitle="Stock visible y estado de reposicion para el supervisor.">
        <button className="primary-button compact" onClick={() => setOpen(true)} type="button">
          <Plus size={16} />
          Nuevo producto
        </button>
      </PageHeader>
      <StatusLine loading={productos.loading} error={productos.error || feedback.error} message={feedback.message} onRetry={productos.load} />
      <div className="toolbar">
        <Search size={16} />
        <input placeholder="Buscar por nombre, marca o tipo" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <DataTable headers={["Nombre", "Marca", "Tipo", "Precio", "Stock", "Estado"]}>
        {filtered.map((producto) => (
          <tr key={producto.id}>
            <Cell strong>{producto.nombre}</Cell>
            <Cell>{producto.marca}</Cell>
            <Cell>{producto.tipo}</Cell>
            <Cell mono strong>{money(producto.precio)}</Cell>
            <Cell>{producto.cantidadStock}</Cell>
            <Cell><StockBadge stock={producto.cantidadStock} /></Cell>
          </tr>
        ))}
      </DataTable>
      <Modal open={open} title="Nuevo producto" onClose={() => setOpen(false)}>
        <form className="form-grid" onSubmit={submit}>
          <TextInput label="Nombre" value={form.nombre} onChange={(nombre) => setForm({ ...form, nombre })} required />
          <TextInput label="Marca" value={form.marca} onChange={(marca) => setForm({ ...form, marca })} required />
          <TextInput label="Tipo" value={form.tipo} onChange={(tipo) => setForm({ ...form, tipo })} required />
          <TextInput label="Precio" value={form.precio} onChange={(precio) => setForm({ ...form, precio })} required type="number" />
          <TextInput label="Stock" value={form.cantidadStock} onChange={(cantidadStock) => setForm({ ...form, cantidadStock })} required type="number" />
          <button className="primary-button full-span" type="submit">Guardar producto</button>
        </form>
      </Modal>
    </Page>
  );
}

function ReportsScreen() {
  const sales = useApiList<DetalleVenta>("/reportes/detalle-ventas");
  const products = useApiList<ReporteProducto>("/reportes/productos-vendidos");
  const total = sales.data.reduce((sum, venta) => sum + venta.subtotal, 0);

  return (
    <Page>
      <PageHeader eyebrow="Reportes" title="Ventas y productos" subtitle="Vista para supervisor y administrador con datos calculados desde el backend." />
      <StatusLine loading={sales.loading || products.loading} error={sales.error || products.error} onRetry={() => { void sales.load(); void products.load(); }} />
      <div className="metrics-grid three">
        <Metric label="Transacciones" value={String(sales.data.length)} tone="blue" />
        <Metric label="Ingresos" value={money(total)} tone="purple" />
        <Metric label="Productos vendidos" value={String(products.data.length)} tone="teal" />
      </div>
      <section className="section-block">
        <PanelTitle icon={<Package size={16} />} title="Productos mas vendidos" />
        <DataTable headers={["Producto", "Tipo", "Unidades", "Veces", "Ingresos"]}>
          {products.data.map((item) => (
            <tr key={`${item.producto}-${item.tipo}`}>
              <Cell strong>{item.producto}</Cell>
              <Cell>{item.tipo}</Cell>
              <Cell>{item.totalVendido}</Cell>
              <Cell>{item.vecesVendido}</Cell>
              <Cell mono strong>{money(item.ingresosTotales)}</Cell>
            </tr>
          ))}
        </DataTable>
      </section>
      <section className="section-block">
        <PanelTitle icon={<BarChart3 size={16} />} title="Detalle de ventas" />
        <DataTable headers={["Fecha", "Cliente", "Cajero", "Producto", "Cant.", "Subtotal"]}>
          {sales.data.map((venta) => (
            <tr key={`${venta.idVenta}-${venta.producto}`}>
              <Cell mono>{new Date(venta.fecha).toLocaleDateString("es-CO")}</Cell>
              <Cell strong>{venta.cliente}</Cell>
              <Cell>{venta.usuario}</Cell>
              <Cell>{venta.producto}</Cell>
              <Cell>{venta.cantidad}</Cell>
              <Cell mono strong>{money(venta.subtotal)}</Cell>
            </tr>
          ))}
        </DataTable>
      </section>
    </Page>
  );
}

function CashierScreen({ usuario }: { usuario: Usuario | null }) {
  const productos = useApiList<Producto>("/productos");
  const clientes = useApiList<Cliente>("/clientes");
  const feedback = useMessage();
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [idCliente, setIdCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");

  const selectedProduct = productos.data.find((producto) => producto.id === Number(productoId));
  const selectedClient = clientes.data.find((cliente) => cliente.id === Number(idCliente));
  const total = (selectedProduct?.precio ?? 0) * cantidad;

  const submitSale = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProduct || !usuario || !idCliente) return;

    await feedback.run(async () => {
      await api<void>(`/ventas/registrar?idProducto=${selectedProduct.id}&cantidad=${cantidad}`, {
        method: "POST",
        body: JSON.stringify({
          fecha: new Date().toISOString().slice(0, 10),
          total,
          metodoPago,
          idCliente: Number(idCliente),
          idUsuario: usuario.id,
        }),
      });
      setCantidad(1);
      setProductoId("");
      await productos.load();
    }, "Venta registrada y stock actualizado.");
  };

  return (
    <Page>
      <PageHeader eyebrow="Caja" title="Nueva venta" subtitle="Flujo rapido: producto, cliente, cantidad y metodo de pago." />
      <StatusLine
        loading={productos.loading || clientes.loading}
        error={productos.error || clientes.error || feedback.error}
        message={feedback.message}
        onRetry={() => { void productos.load(); void clientes.load(); }}
      />
      <div className="pos-grid">
        <section className="panel">
          <form className="stack" onSubmit={submitSale}>
            <Field label="Producto">
              <select className="field" onChange={(event) => setProductoId(event.target.value)} required value={productoId}>
                <option value="">Seleccionar producto</option>
                {productos.data.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} · {money(producto.precio)} · stock {producto.cantidadStock}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Cliente">
              <select className="field" onChange={(event) => setIdCliente(event.target.value)} required value={idCliente}>
                <option value="">Seleccionar cliente</option>
                {clientes.data.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} · {cliente.documento}
                  </option>
                ))}
              </select>
            </Field>
            <div className="two-cols">
              <TextInput label="Cantidad" min={1} value={String(cantidad)} onChange={(value) => setCantidad(Number(value))} required type="number" />
              <Field label="Pago">
                <select className="field" onChange={(event) => setMetodoPago(event.target.value)} value={metodoPago}>
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                </select>
              </Field>
            </div>
            <button className="primary-button" type="submit">Finalizar venta</button>
          </form>
        </section>
        <aside className="receipt-panel">
          <p className="eyebrow">Resumen</p>
          <h3>{money(total)}</h3>
          <div className="receipt-lines">
            <div><span>Producto</span><strong>{selectedProduct?.nombre ?? "Sin seleccionar"}</strong></div>
            <div><span>Cliente</span><strong>{selectedClient?.nombre ?? "Sin seleccionar"}</strong></div>
            <div><span>Cantidad</span><strong>{cantidad}</strong></div>
            <div><span>Pago</span><strong>{metodoPago}</strong></div>
          </div>
        </aside>
      </div>
    </Page>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>;
}

function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="muted">{subtitle}</p>
      </div>
      {children}
    </header>
  );
}

function StatusLine({
  loading,
  error,
  message,
  onRetry,
}: {
  loading?: boolean;
  error?: string | null;
  message?: string | null;
  onRetry?: () => void;
}) {
  if (!loading && !error && !message) return null;

  return (
    <div className={error ? "status-line error" : "status-line"}>
      <span>{error ? "No se pudo cargar o guardar. Revisa Spring Boot y PostgreSQL." : loading ? "Cargando datos..." : message}</span>
      {onRetry && (
        <button onClick={onRetry} type="button">
          <RefreshCw size={14} />
          Reintentar
        </button>
      )}
    </div>
  );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <header>
          <h3>{title}</h3>
          <button className="icon-link" onClick={onClose} type="button" title="Cerrar">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field-wrap">
      <span>{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required,
  type = "text",
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: number;
}) {
  return (
    <Field label={label}>
      <input className="field" min={min} onChange={(event) => onChange(event.target.value)} required={required} type={type} value={value} />
    </Field>
  );
}

function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <section className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({ children, mono = false, strong = false }: { children: React.ReactNode; mono?: boolean; strong?: boolean }) {
  return <td className={`${mono ? "mono " : ""}${strong ? "strong" : ""}`}>{children}</td>;
}

function ActionCell({ children }: { children: React.ReactNode }) {
  return <td className="action-cell">{children}</td>;
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "purple" | "teal" | "blue" | "green" | "red" }) {
  return (
    <article className={`metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="panel-title">
      {icon}
      <h3>{title}</h3>
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 5) return <span className="badge red">Reponer · {stock}</span>;
  if (stock <= 12) return <span className="badge amber">Medio · {stock}</span>;
  return <span className="badge green">Disponible · {stock}</span>;
}

function RoleBadge({ role, label }: { role: Role; label: string }) {
  return <span className={`badge ${role === "admin" ? "purple" : role === "supervisor" ? "blue" : "green"}`}>{label}</span>;
}

function EmptyText({ text }: { text: string }) {
  return <p className="empty-text">{text}</p>;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role>("admin");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const handleLogin = (loggedUser: Usuario) => {
    const nextRole = normalizeRole(loggedUser.rol);
    setUsuario(loggedUser);
    setRole(nextRole);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setUsuario(null);
    setScreen("login");
  };

  const activeScreen = useMemo(() => {
    if (screen === "login") return screen;
    return allowedScreens(role).includes(screen) ? screen : "dashboard";
  }, [role, screen]);

  if (screen === "login") {
    return (
      <>
        <AppStyles />
        <LoginScreen onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <AppStyles />
      <AppLayout active={activeScreen} role={role} user={usuario} onLogout={handleLogout} onNavigate={setScreen}>
        {activeScreen === "dashboard" && <DashboardScreen role={role} />}
        {activeScreen === "users" && <UsersScreen />}
        {activeScreen === "clients" && <ClientsScreen />}
        {activeScreen === "providers" && <ProvidersScreen />}
        {activeScreen === "products" && <ProductsScreen />}
        {activeScreen === "reports" && <ReportsScreen />}
        {activeScreen === "cashier" && <CashierScreen usuario={usuario} />}
      </AppLayout>
    </>
  );
}

function AppStyles() {
  return (
    <style>{`
      :root {
        color-scheme: dark;
        --bg: #080b12;
        --surface: #101521;
        --surface-2: #151c2b;
        --line: rgba(231, 236, 244, 0.09);
        --text: #eef2f7;
        --muted: #98a2b3;
        --purple: #8b5cf6;
        --teal: #14b8a6;
        --blue: #38bdf8;
        --green: #22c55e;
        --amber: #f59e0b;
        --red: #ef4444;
      }
      * { box-sizing: border-box; }
      body { margin: 0; background: var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
      button, input, select { font: inherit; }
      .login-page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at 20% 15%, rgba(20, 184, 166, 0.14), transparent 30%),
          radial-gradient(circle at 80% 75%, rgba(139, 92, 246, 0.16), transparent 34%),
          var(--bg);
      }
      .login-panel {
        width: min(420px, 100%);
        border: 1px solid var(--line);
        background: rgba(16, 21, 33, 0.86);
        border-radius: 8px;
        padding: 32px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
      }
      .login-panel h1 { margin: 4px 0 8px; font-family: "Playfair Display", serif; font-size: 42px; }
      .app-shell { min-height: 100vh; display: grid; grid-template-columns: 260px 1fr; background: var(--bg); }
      .sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 18px;
        padding: 22px 16px;
        border-right: 1px solid var(--line);
        background: #0b1019;
      }
      .brand { padding: 6px 10px 18px; border-bottom: 1px solid var(--line); }
      .brand span { display: block; font-family: "Playfair Display", serif; font-size: 28px; font-weight: 700; }
      .brand small, .side-user small, .muted, .empty-text { color: var(--muted); }
      .side-nav { display: grid; gap: 6px; }
      .nav-item, .logout-button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: var(--muted);
        padding: 11px 12px;
        cursor: pointer;
        transition: 160ms ease;
      }
      .nav-item:hover, .logout-button:hover { background: rgba(255, 255, 255, 0.05); color: var(--text); }
      .nav-item.active { background: rgba(139, 92, 246, 0.16); color: #ddd6fe; }
      .side-user {
        margin-top: auto;
        min-width: 0;
        display: grid;
        grid-template-columns: 38px 1fr;
        gap: 10px;
        align-items: center;
        padding: 12px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
      }
      .side-user p { margin: 0; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .side-user small { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .avatar {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: rgba(20, 184, 166, 0.16);
        color: #99f6e4;
        font-weight: 800;
      }
      .content { min-width: 0; }
      .page { max-width: 1180px; margin: 0 auto; padding: 32px; }
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: 20px;
        margin-bottom: 22px;
      }
      .page-header h2 { margin: 4px 0 6px; font-size: 30px; line-height: 1.1; letter-spacing: 0; }
      .eyebrow {
        margin: 0;
        color: #a7f3d0;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.14em;
      }
      .muted { margin: 0; line-height: 1.5; }
      .primary-button {
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border: 0;
        border-radius: 8px;
        background: var(--purple);
        color: white;
        padding: 0 16px;
        font-weight: 800;
        cursor: pointer;
        transition: 160ms ease;
      }
      .primary-button:hover { background: #7c3aed; }
      .primary-button.compact { white-space: nowrap; }
      .primary-button.full-span { grid-column: 1 / -1; }
      .metrics-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 18px; }
      .metrics-grid.three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .metric, .panel, .table-card, .receipt-panel {
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
        box-shadow: 0 16px 44px rgba(0, 0, 0, 0.22);
      }
      .metric { padding: 18px; border-left: 4px solid var(--purple); }
      .metric span { display: block; color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; }
      .metric strong { display: block; margin-top: 8px; font-size: 24px; line-height: 1.1; }
      .metric.teal { border-left-color: var(--teal); }
      .metric.blue { border-left-color: var(--blue); }
      .metric.green { border-left-color: var(--green); }
      .metric.red { border-left-color: var(--red); }
      .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .panel { padding: 18px; }
      .panel-title { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; color: #c4b5fd; }
      .panel-title h3 { margin: 0; font-size: 15px; }
      .list-stack { display: grid; gap: 10px; }
      .row-card {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: center;
        border: 1px solid var(--line);
        background: rgba(255, 255, 255, 0.03);
        border-radius: 8px;
        padding: 12px;
      }
      .row-card strong, .row-card small { display: block; }
      .row-card small { margin-top: 3px; color: var(--muted); }
      .money-pill { color: #a7f3d0; font-weight: 800; white-space: nowrap; }
      .highlight-panel { margin-top: 16px; }
      .highlight-panel p { margin: 0; color: var(--muted); }
      .status-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        border: 1px solid rgba(20, 184, 166, 0.24);
        background: rgba(20, 184, 166, 0.08);
        color: #ccfbf1;
        border-radius: 8px;
        padding: 12px 14px;
      }
      .status-line.error { border-color: rgba(239, 68, 68, 0.28); background: rgba(239, 68, 68, 0.08); color: #fecaca; }
      .status-line button { display: inline-flex; gap: 8px; align-items: center; border: 0; background: transparent; color: inherit; cursor: pointer; }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
        border: 1px solid var(--line);
        background: var(--surface);
        border-radius: 8px;
        padding: 0 13px;
        height: 44px;
        color: var(--muted);
      }
      .toolbar input { width: 100%; border: 0; outline: 0; background: transparent; color: white; }
      .table-card { overflow: hidden; }
      .table-scroll { overflow-x: auto; }
      table { width: 100%; min-width: 760px; border-collapse: collapse; }
      th {
        color: var(--muted);
        font-size: 11px;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        padding: 14px 16px;
        background: rgba(255, 255, 255, 0.025);
        border-bottom: 1px solid var(--line);
      }
      td { padding: 15px 16px; color: #cbd5e1; border-bottom: 1px solid var(--line); }
      tr:last-child td { border-bottom: 0; }
      td.strong { color: white; font-weight: 800; }
      .mono { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 13px; }
      .action-cell { display: flex; align-items: center; gap: 7px; }
      .badge {
        display: inline-flex;
        align-items: center;
        min-height: 26px;
        border-radius: 999px;
        padding: 0 10px;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }
      .badge.red { background: rgba(239, 68, 68, 0.13); color: #fca5a5; }
      .badge.amber { background: rgba(245, 158, 11, 0.13); color: #fcd34d; }
      .badge.green { background: rgba(34, 197, 94, 0.13); color: #86efac; }
      .badge.blue { background: rgba(56, 189, 248, 0.13); color: #7dd3fc; }
      .badge.purple { background: rgba(139, 92, 246, 0.16); color: #ddd6fe; }
      .field-wrap { display: grid; gap: 7px; }
      .field-wrap span {
        color: var(--muted);
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .field {
        width: 100%;
        min-height: 42px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface-2);
        color: white;
        outline: 0;
        padding: 0 12px;
      }
      .field:focus { border-color: rgba(20, 184, 166, 0.7); }
      .stack { display: grid; gap: 14px; }
      .two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 80;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(0, 0, 0, 0.58);
      }
      .modal {
        width: min(620px, 100%);
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #0f1522;
        padding: 18px;
        box-shadow: 0 28px 90px rgba(0, 0, 0, 0.48);
      }
      .modal header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
      .modal h3 { margin: 0; }
      .icon-link, .icon-danger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 8px;
        width: 32px;
        height: 32px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        transition: 160ms ease;
      }
      .icon-link:hover { background: rgba(56, 189, 248, 0.12); color: #7dd3fc; }
      .icon-danger:hover { background: rgba(239, 68, 68, 0.12); color: #fca5a5; }
      .section-block { margin-top: 20px; }
      .pos-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr); gap: 16px; align-items: start; }
      .receipt-panel { padding: 22px; position: sticky; top: 28px; }
      .receipt-panel h3 { margin: 8px 0 20px; font-size: 38px; color: #f0abfc; }
      .receipt-lines { display: grid; gap: 12px; }
      .receipt-lines div { display: flex; justify-content: space-between; gap: 14px; border-bottom: 1px solid var(--line); padding-bottom: 10px; }
      .receipt-lines span { color: var(--muted); }
      .receipt-lines strong { text-align: right; }
      .error-text { color: #fecaca; margin: 0; }
      @media (max-width: 920px) {
        .app-shell { grid-template-columns: 1fr; }
        .sidebar { position: static; height: auto; }
        .side-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .page { padding: 22px; }
        .page-header { align-items: stretch; flex-direction: column; }
        .metrics-grid, .metrics-grid.three, .dashboard-grid, .pos-grid { grid-template-columns: 1fr; }
      }
      @media (max-width: 560px) {
        .form-grid, .two-cols { grid-template-columns: 1fr; }
        .side-nav { grid-template-columns: 1fr; }
        .login-panel { padding: 24px; }
        .receipt-panel h3 { font-size: 30px; }
      }
    `}</style>
  );
}
