import { useState, type ElementType } from "react";
import {
  BarChart2, ShoppingCart, Package, Users, Truck, LogOut,
  Search, Plus, Minus, Trash2, Eye, EyeOff, Edit2,
  TrendingUp, AlertTriangle, DollarSign,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = "login" | "dashboard" | "pos" | "management";
type ManagementTab = "products" | "users" | "suppliers";
type StockLevel = "high" | "medium" | "low";

interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  stock: number;
  stockLevel: StockLevel;
  image: string;
}

interface CartItem {
  product: Product;
  qty: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MONTHLY_REVENUE = [
  { mes: "Ene", ingresos: 4200000 },
  { mes: "Feb", ingresos: 3800000 },
  { mes: "Mar", ingresos: 5100000 },
  { mes: "Abr", ingresos: 4700000 },
  { mes: "May", ingresos: 6200000 },
  { mes: "Jun", ingresos: 5800000 },
  { mes: "Jul", ingresos: 7100000 },
  { mes: "Ago", ingresos: 6500000 },
  { mes: "Sep", ingresos: 5900000 },
  { mes: "Oct", ingresos: 7800000 },
  { mes: "Nov", ingresos: 9200000 },
  { mes: "Dic", ingresos: 11500000 },
];

const TOP_PRODUCTS = [
  { nombre: "Glenfiddich 18", ventas: 48 },
  { nombre: "Don Julio 1942", ventas: 41 },
  { nombre: "Bacardí Gran Res.", ventas: 37 },
  { nombre: "Moët Chandon", ventas: 29 },
  { nombre: "Grey Goose", ventas: 22 },
];

const PRODUCTS: Product[] = [
  { id: 1, name: "Glenfiddich 18 Años", type: "Whisky", price: 289000, stock: 12, stockLevel: "high", image: "photo-1527281400683-1aae777175f8" },
  { id: 2, name: "Don Julio 1942", type: "Tequila", price: 348000, stock: 4, stockLevel: "medium", image: "photo-1619451683012-c20d0ae7b83b" },
  { id: 3, name: "Bacardí Gran Reserva", type: "Ron", price: 145000, stock: 2, stockLevel: "low", image: "photo-1551538827-9c037cb4f32a" },
  { id: 4, name: "Moët & Chandon Impérial", type: "Champagne", price: 265000, stock: 8, stockLevel: "high", image: "photo-1510812431401-41d2bd2722f3" },
  { id: 5, name: "Grey Goose Vodka", type: "Vodka", price: 178000, stock: 6, stockLevel: "medium", image: "photo-1612528443702-f6741f70a049" },
  { id: 6, name: "Hendrick's Gin", type: "Gin", price: 195000, stock: 1, stockLevel: "low", image: "photo-1558618666-fcd25c85cd64" },
  { id: 7, name: "Johnnie Walker Blue Label", type: "Whisky", price: 520000, stock: 5, stockLevel: "medium", image: "photo-1544145945-f90425340c7e" },
  { id: 8, name: "Diplomatico Reserva", type: "Ron", price: 168000, stock: 14, stockLevel: "high", image: "photo-1485872299829-c673f5194813" },
  { id: 9, name: "Patrón Silver", type: "Tequila", price: 198000, stock: 3, stockLevel: "low", image: "photo-1574349880038-d5c52ce8d8e3" },
];

const USERS = [
  { id: 1, nombre: "Ana García", correo: "ana.garcia@entrecopas.co", rol: "Administrador", estado: "Activo" },
  { id: 2, nombre: "Carlos Mejía", correo: "carlos.mejia@entrecopas.co", rol: "Cajero", estado: "Activo" },
  { id: 3, nombre: "María López", correo: "maria.lopez@entrecopas.co", rol: "Cajero", estado: "Inactivo" },
  { id: 4, nombre: "Juan Herrera", correo: "juan.herrera@entrecopas.co", rol: "Inventario", estado: "Activo" },
];

const SUPPLIERS = [
  { id: 1, nombre: "Diageo Colombia S.A.", contacto: "Roberto Vargas", telefono: "+57 300 456 7890", ciudad: "Bogotá", productos: 12 },
  { id: 2, nombre: "Pernod Ricard Andina", contacto: "Claudia Ríos", telefono: "+57 312 345 6789", ciudad: "Medellín", productos: 8 },
  { id: 3, nombre: "Bacardí Martini SA", contacto: "Felipe Mora", telefono: "+57 315 678 9012", ciudad: "Cali", productos: 5 },
  { id: 4, nombre: "Distribuidora ElCid", contacto: "Patricia Soto", telefono: "+57 304 321 0987", ciudad: "Barranquilla", productos: 21 },
];

const CATEGORIES = ["Todos", "Whisky", "Tequila", "Ron", "Champagne", "Vodka", "Gin"];

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(n);

const STOCK_CONFIG: Record<StockLevel, { text: string; dot: string; label: string }> = {
  high:   { text: "text-emerald-400", dot: "bg-emerald-400", label: "En Stock" },
  medium: { text: "text-amber-400",   dot: "bg-amber-400",   label: "Stock Medio" },
  low:    { text: "text-red-400",     dot: "bg-red-400",     label: "Bajo Stock" },
};

const GOLD = "#BF9B30";

// ── Stock Chip ────────────────────────────────────────────────────────────────

function StockChip({ level, stock }: { level: StockLevel; stock: number }) {
  const { text, dot, label } = STOCK_CONFIG[level];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-body font-medium ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} style={{ boxShadow: `0 0 4px currentColor` }} />
      {label} ({stock})
    </span>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: Screen; label: string; Icon: ElementType }[] = [
  { id: "dashboard", label: "Dashboard", Icon: BarChart2 },
  { id: "pos",       label: "Punto de Venta", Icon: ShoppingCart },
  { id: "management", label: "Gestión", Icon: Package },
];

function Sidebar({
  current,
  onNavigate,
}: {
  current: Screen;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col border-r h-full"
      style={{ background: "#0D1220", borderColor: "rgba(191,155,48,0.12)" }}
    >
      {/* Logo */}
      <div className="px-6 py-7" style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}>
        <h1 className="font-display text-[1.6rem] text-primary tracking-wide leading-none">
          EntreCopas
        </h1>
        <p className="text-[11px] font-body text-muted-foreground mt-1.5 tracking-widest uppercase">
          Tu licorera boutique
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => {
          const active = current === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body font-medium transition-all duration-200 group relative ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: GOLD }}
                />
              )}
              <Icon
                size={16}
                className={`flex-shrink-0 transition-colors duration-200 ${
                  active ? "text-primary" : "group-hover:text-foreground"
                }`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-5" style={{ borderTop: "1px solid rgba(191,155,48,0.12)" }}>
        <div className="flex items-center gap-3 px-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(191,155,48,0.15)" }}
          >
            <span className="text-primary text-[11px] font-bold font-body">AG</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium font-body text-foreground truncate">Ana García</p>
            <p className="text-[11px] text-muted-foreground font-body">Administrador</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate("login")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-body text-muted-foreground hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

// ── Login ─────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("ana.garcia@entrecopas.co");
  const [pwd, setPwd] = useState("secreto123");

  return (
    <div className="h-full flex">
      {/* Left — photo */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1000&h=1080&fit=crop&auto=format"
          alt="Vaso de whisky con hielo y luz cálida"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,14,23,0.55) 0%, rgba(10,14,23,0.15) 60%, transparent 100%)",
          }}
        />
        <div className="absolute bottom-14 left-12 right-16">
          <p
            className="font-display italic text-[1.4rem] leading-[1.6] text-white/85"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            "El buen licor no es un lujo.<br />
            Es una experiencia cuidadosamente curada."
          </p>
          <div
            className="mt-4 w-8 h-px"
            style={{ background: GOLD }}
          />
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 bg-background">
        <div className="w-full max-w-[340px]">
          <div className="mb-10">
            <h1
              className="font-display text-[3rem] leading-none mb-2 tracking-wide"
              style={{ color: GOLD }}
            >
              EntreCopas
            </h1>
            <p className="text-muted-foreground font-body text-[12px] tracking-widest uppercase">
              Sistema de gestión · Acceso seguro
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onLogin();
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-[10px] font-body font-medium text-muted-foreground mb-2 uppercase tracking-[0.12em]">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[10px] font-body font-medium text-muted-foreground mb-2 uppercase tracking-[0.12em]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 pr-11 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full font-body font-semibold py-3 px-6 rounded-xl text-sm tracking-wide transition-all duration-200 active:scale-[0.98] mt-2"
              style={{
                background: GOLD,
                color: "#0A0E17",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#D4AE3C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = GOLD;
              }}
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="mt-10 text-center text-[11px] text-muted-foreground font-body">
            © 2025 EntreCopas · v2.1.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function KPICard({
  title,
  value,
  sub,
  Icon,
  danger,
}: {
  title: string;
  value: string;
  sub: string;
  Icon: ElementType;
  danger?: boolean;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 hover:border-primary/30 transition-colors duration-300">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: danger ? "rgba(155,34,38,0.18)" : "rgba(191,155,48,0.12)",
        }}
      >
        <Icon size={17} className={danger ? "text-red-400" : "text-primary"} />
      </div>
      <div>
        <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.12em] mb-1">
          {title}
        </p>
        <p className="text-[1.25rem] font-body font-semibold text-foreground leading-none mb-1">
          {value}
        </p>
        <p className="text-[11px] text-muted-foreground font-body">{sub}</p>
      </div>
    </div>
  );
}

const CUSTOM_TOOLTIP_STYLE = {
  background: "#111827",
  border: "1px solid rgba(191,155,48,0.25)",
  borderRadius: 8,
  fontFamily: "Poppins",
  fontSize: 12,
  color: "#F2F2F2",
};

function DashboardScreen() {
  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="mb-7">
        <h2 className="font-display text-[2rem] text-foreground leading-none">Dashboard</h2>
        <p className="text-muted-foreground font-body text-[12px] mt-2 tracking-widest uppercase">
          Resumen ejecutivo · 15 de mayo de 2025
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
        <KPICard title="Ventas Hoy" value="$2,840,000" sub="↑ 12% vs. ayer" Icon={DollarSign} />
        <KPICard title="Transacciones" value="34" sub="Últimas 24 horas" Icon={ShoppingCart} />
        <KPICard title="Bajo Stock" value="3 productos" sub="Requieren reposición" Icon={AlertTriangle} danger />
        <KPICard title="Ingresos Nov." value="$9,200,000" sub="Meta: $10,000,000" Icon={TrendingUp} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue line */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground leading-none mb-1">
            Ingresos por Mes
          </h3>
          <p className="text-[11px] text-muted-foreground font-body mb-6 tracking-wider uppercase">
            Año fiscal 2025 · COP
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <LineChart data={MONTHLY_REVENUE} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(191,155,48,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="mes"
                tick={{ fill: "#8B9AB3", fontSize: 11, fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8B9AB3", fontSize: 10, fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                width={36}
              />
              <Tooltip
                contentStyle={CUSTOM_TOOLTIP_STYLE}
                labelStyle={{ color: "#F2F2F2", marginBottom: 4 }}
                formatter={(v: number) => [fmt(v), "Ingresos"]}
                cursor={{ stroke: "rgba(191,155,48,0.2)", strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke={GOLD}
                strokeWidth={2}
                dot={{ fill: GOLD, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: GOLD, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top products bar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-display text-lg text-foreground leading-none mb-1">
            Top 5 Más Vendidos
          </h3>
          <p className="text-[11px] text-muted-foreground font-body mb-6 tracking-wider uppercase">
            Unidades · últimos 30 días
          </p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={TOP_PRODUCTS}
              layout="vertical"
              margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(191,155,48,0.08)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#8B9AB3", fontSize: 11, fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="nombre"
                tick={{ fill: "#8B9AB3", fontSize: 10, fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
                width={108}
              />
              <Tooltip
                contentStyle={CUSTOM_TOOLTIP_STYLE}
                labelStyle={{ color: "#F2F2F2", marginBottom: 4 }}
                formatter={(v: number) => [v, "Unidades"]}
                cursor={{ fill: "rgba(191,155,48,0.05)" }}
              />
              <Bar dataKey="ventas" fill={GOLD} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

// ── POS ───────────────────────────────────────────────────────────────────────

function POSScreen() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [customer, setCustomer] = useState("");

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = category === "Todos" || p.type === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleFinalize = () => {
    if (cart.length === 0) return;
    alert("¡Venta registrada exitosamente!");
    setCart([]);
    setCustomer("");
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Product catalog */}
      <div className="flex-1 flex flex-col overflow-hidden p-6">
        <div className="mb-5">
          <h2 className="font-display text-[2rem] text-foreground leading-none mb-4">
            Punto de Venta
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto por nombre..."
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Category tags */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-body font-medium tracking-wide transition-all duration-200 ${
                  category === cat
                    ? "text-[#0A0E17]"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
                style={category === cat ? { background: GOLD } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-xl overflow-hidden group hover:border-primary/35 transition-all duration-300"
                style={{
                  boxShadow: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 32px rgba(191,155,48,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div className="relative overflow-hidden h-36 bg-secondary/40">
                  <img
                    src={`https://images.unsplash.com/${product.image}?w=400&h=260&fit=crop&auto=format`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(17,24,39,0.75) 0%, transparent 55%)",
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 bg-background/75 backdrop-blur-sm text-[10px] font-body px-2 py-0.5 rounded-full text-muted-foreground border border-border">
                    {product.type}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-display text-sm text-foreground leading-snug mb-1.5 line-clamp-2">
                    {product.name}
                  </h4>
                  <StockChip level={product.stockLevel} stock={product.stock} />
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body font-semibold text-[13px]" style={{ color: GOLD }}>
                      {fmt(product.price)}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-1 text-[11px] font-body font-medium px-2.5 py-1.5 rounded-lg border transition-all duration-200 active:scale-95"
                      style={{
                        borderColor: "rgba(191,155,48,0.3)",
                        color: GOLD,
                        background: "rgba(191,155,48,0.08)",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = GOLD;
                        el.style.color = "#0A0E17";
                        el.style.borderColor = GOLD;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(191,155,48,0.08)";
                        el.style.color = GOLD;
                        el.style.borderColor = "rgba(191,155,48,0.3)";
                      }}
                    >
                      <Plus size={11} /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart panel */}
      <div
        className="w-[300px] flex-shrink-0 flex flex-col"
        style={{ background: "#0D1220", borderLeft: "1px solid rgba(191,155,48,0.12)" }}
      >
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}
        >
          <h3 className="font-display text-lg text-foreground leading-none">Venta Actual</h3>
          <p className="text-[11px] text-muted-foreground font-body mt-1">
            {cart.length} ítem{cart.length !== 1 ? "s" : ""} seleccionados
          </p>
        </div>

        {/* Customer */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}
        >
          <label className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.12em] mb-2 block">
            Cliente · Documento
          </label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="CC / NIT del cliente..."
              className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-[12px] font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingCart size={30} className="text-muted-foreground/25 mb-3" />
              <p className="text-sm font-body text-muted-foreground">El carrito está vacío</p>
              <p className="text-[11px] text-muted-foreground/50 font-body mt-1">
                Selecciona productos del catálogo
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-2.5 bg-card rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-body font-medium text-foreground truncate">
                    {item.product.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-body">
                    {fmt(item.product.price)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.product.id, -1)}
                    className="w-6 h-6 rounded-md bg-secondary/60 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Minus size={9} className="text-muted-foreground" />
                  </button>
                  <span className="text-[13px] font-body font-semibold text-foreground w-5 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.product.id, 1)}
                    className="w-6 h-6 rounded-md bg-secondary/60 hover:bg-primary/20 flex items-center justify-center transition-colors"
                  >
                    <Plus size={9} className="text-muted-foreground" />
                  </button>
                </div>
                <p
                  className="text-[12px] font-body font-semibold w-16 text-right flex-shrink-0"
                  style={{ color: GOLD }}
                >
                  {fmt(item.product.price * item.qty)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Total & CTA */}
        <div
          className="px-5 py-5 space-y-4"
          style={{ borderTop: "1px solid rgba(191,155,48,0.12)" }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-body text-muted-foreground uppercase tracking-widest">
              Total
            </span>
            <span className="font-display text-[1.75rem] leading-none" style={{ color: GOLD }}>
              {fmt(total)}
            </span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={handleFinalize}
            className="w-full font-body font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: GOLD, color: "#0A0E17" }}
          >
            Finalizar Venta
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Management ────────────────────────────────────────────────────────────────

const MGMT_TABS: { id: ManagementTab; label: string; Icon: ElementType }[] = [
  { id: "products",  label: "Productos",   Icon: Package },
  { id: "users",     label: "Usuarios",    Icon: Users },
  { id: "suppliers", label: "Proveedores", Icon: Truck },
];

function ManagementScreen() {
  const [tab, setTab] = useState<ManagementTab>("products");

  const newLabel =
    tab === "products" ? "Nuevo Producto" : tab === "users" ? "Nuevo Usuario" : "Nuevo Proveedor";

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-[2rem] text-foreground leading-none">Gestión</h2>
          <p className="text-muted-foreground font-body text-[12px] mt-2 tracking-widest uppercase">
            Administración de datos maestros
          </p>
        </div>
        <button
          className="flex items-center gap-2 font-body font-medium py-2.5 px-5 rounded-xl text-sm transition-all duration-200 active:scale-95"
          style={{ background: GOLD, color: "#0A0E17" }}
        >
          <Plus size={14} />
          {newLabel}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 bg-card rounded-xl p-1 border border-border mb-6 w-fit">
        {MGMT_TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-body font-medium transition-all duration-200 ${
              tab === id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Products table */}
      {tab === "products" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}>
                {["Producto", "Tipo", "Precio", "Stock", "Estado", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-4 text-left text-[10px] font-body font-medium text-muted-foreground uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => (
                <tr
                  key={p.id}
                  className="hover:bg-white/[0.03] transition-colors"
                  style={{
                    borderBottom:
                      i < PRODUCTS.length - 1 ? "1px solid rgba(191,155,48,0.07)" : "none",
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={`https://images.unsplash.com/${p.image}?w=48&h=48&fit=crop&auto=format`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-body text-[13px] text-foreground font-medium">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-body text-muted-foreground">
                    {p.type}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-body font-semibold" style={{ color: GOLD }}>
                    {fmt(p.price)}
                  </td>
                  <td className="px-5 py-4 text-[13px] font-body text-foreground">
                    {p.stock} uds.
                  </td>
                  <td className="px-5 py-4">
                    <StockChip level={p.stockLevel} stock={p.stock} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users table */}
      {tab === "users" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}>
                {["Usuario", "Rol", "Estado", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-4 text-left text-[10px] font-body font-medium text-muted-foreground uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {USERS.map((u, i) => (
                <tr
                  key={u.id}
                  className="hover:bg-white/[0.03] transition-colors"
                  style={{
                    borderBottom:
                      i < USERS.length - 1 ? "1px solid rgba(191,155,48,0.07)" : "none",
                  }}
                >
                  <td className="px-5 py-4">
                    <p className="font-body text-[13px] text-foreground font-medium">{u.nombre}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{u.correo}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[11px] font-body px-2.5 py-1 rounded-full border"
                      style={{
                        color: GOLD,
                        background: "rgba(191,155,48,0.1)",
                        borderColor: "rgba(191,155,48,0.2)",
                      }}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-body font-medium ${
                        u.estado === "Activo" ? "text-emerald-400" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.estado === "Activo" ? "bg-emerald-400" : "bg-muted-foreground"
                        }`}
                      />
                      {u.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Suppliers table */}
      {tab === "suppliers" && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(191,155,48,0.12)" }}>
                {["Proveedor", "Contacto", "Ciudad", "Productos", ""].map((h, i) => (
                  <th
                    key={i}
                    className="px-5 py-4 text-left text-[10px] font-body font-medium text-muted-foreground uppercase tracking-[0.12em]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SUPPLIERS.map((s, i) => (
                <tr
                  key={s.id}
                  className="hover:bg-white/[0.03] transition-colors"
                  style={{
                    borderBottom:
                      i < SUPPLIERS.length - 1 ? "1px solid rgba(191,155,48,0.07)" : "none",
                  }}
                >
                  <td className="px-5 py-4">
                    <p className="font-body text-[13px] text-foreground font-medium">{s.nombre}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-body text-[13px] text-foreground">{s.contacto}</p>
                    <p className="text-[11px] text-muted-foreground font-body">{s.telefono}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] font-body text-muted-foreground">
                    {s.ciudad}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-body font-semibold text-foreground">
                      {s.productos}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-body"> SKUs</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-900/20 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  if (screen === "login") {
    return (
      <div className="dark h-screen bg-background overflow-hidden">
        <LoginScreen onLogin={() => setScreen("dashboard")} />
      </div>
    );
  }

  return (
    <div className="dark flex h-screen bg-background overflow-hidden">
      <Sidebar current={screen} onNavigate={setScreen} />
      <div className="flex-1 flex overflow-hidden">
        {screen === "dashboard" && <DashboardScreen />}
        {screen === "pos" && <POSScreen />}
        {screen === "management" && <ManagementScreen />}
      </div>
    </div>
  );
}
