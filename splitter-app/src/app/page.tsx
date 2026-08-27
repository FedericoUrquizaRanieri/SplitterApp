"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  Check, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Wallet, 
  Percent, 
  Scan, 
  Shield, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  Plus, 
  Trash2, 
  Lock, 
  PieChart, 
  Bell,
  Sparkles,
  Info
} from "lucide-react";

// Types for splitter calculator
type SplitMethod = "equal" | "shares" | "percentage";

export default function LandingPage() {
  // Navigation active state for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- Waitlist Form State ---
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistError, setWaitlistError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState(4829);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setWaitlistError("Por favor, ingresa tu correo electrónico.");
      setWaitlistStatus("error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setWaitlistError("Ingresa un correo electrónico válido.");
      setWaitlistStatus("error");
      return;
    }

    setWaitlistStatus("loading");
    setWaitlistError("");

    // Simulate API request
    setTimeout(() => {
      setWaitlistStatus("success");
      setWaitlistCount(prev => prev + 1);
    }, 1200);
  };

  // --- Bill Splitter Widget State ---
  const [billTitle, setBillTitle] = useState("Cena de Bienvenida");
  const [billAmount, setBillAmount] = useState<number>(120);
  const [members, setMembers] = useState<string[]>(["Tú", "Sofía", "Lucas", "Mateo"]);
  const [newMemberName, setNewMemberName] = useState("");
  const [paidBy, setPaidBy] = useState<number>(0); // Index of payer (default 0 i.e. "Tú")
  const [splitMethod, setSplitMethod] = useState<SplitMethod>("equal");
  
  // Custom shares/percentages inputs
  const [customShares, setCustomShares] = useState<number[]>([1, 1, 1, 1]);
  const [customPercentages, setCustomPercentages] = useState<number[]>([25, 25, 25, 25]);

  const addMember = () => {
    if (!newMemberName.trim()) return;
    if (members.length >= 8) {
      alert("Para la demo, el límite es de 8 personas.");
      return;
    }
    const name = newMemberName.trim();
    setMembers([...members, name]);
    setCustomShares([...customShares, 1]);
    setCustomPercentages([...customPercentages, Math.round(100 / (members.length + 1))]);
    setNewMemberName("");
  };

  const removeMember = (indexToRemove: number) => {
    if (members.length <= 2) {
      alert("Se necesitan al menos 2 personas para dividir un gasto.");
      return;
    }
    setMembers(members.filter((_, idx) => idx !== indexToRemove));
    setCustomShares(customShares.filter((_, idx) => idx !== indexToRemove));
    setCustomPercentages(customPercentages.filter((_, idx) => idx !== indexToRemove));
    if (paidBy >= members.length - 1) {
      setPaidBy(0);
    }
  };

  const handleShareChange = (index: number, val: number) => {
    const updated = [...customShares];
    updated[index] = Math.max(0, val);
    setCustomShares(updated);
  };

  const handlePercentageChange = (index: number, val: number) => {
    const updated = [...customPercentages];
    updated[index] = Math.max(0, Math.min(100, val));
    setCustomPercentages(updated);
  };

  // Split calculation results
  const [splits, setSplits] = useState<{ name: string; amount: number }[]>([]);
  const [pctTotal, setPctTotal] = useState(100);

  useEffect(() => {
    const validAmount = Number(billAmount) || 0;
    const n = members.length;
    let tempSplits: { name: string; amount: number }[] = [];

    if (splitMethod === "equal") {
      const share = validAmount / n;
      tempSplits = members.map(m => ({ name: m, amount: share }));
      setPctTotal(100);
    } else if (splitMethod === "shares") {
      const totalShares = customShares.reduce((a, b) => a + b, 0) || 1;
      tempSplits = members.map((m, idx) => ({
        name: m,
        amount: (validAmount * (customShares[idx] || 0)) / totalShares
      }));
      setPctTotal(100);
    } else if (splitMethod === "percentage") {
      const totalPct = customPercentages.reduce((a, b) => a + b, 0);
      setPctTotal(totalPct);
      tempSplits = members.map((m, idx) => ({
        name: m,
        amount: (validAmount * (customPercentages[idx] || 0)) / 100
      }));
    }

    setSplits(tempSplits);
  }, [billAmount, members, splitMethod, customShares, customPercentages]);

  // --- Dynamic Budget Slider State (Bento Card 1) ---
  const [budgetLimit, setBudgetLimit] = useState<number>(500);
  const spentAmount = 310;
  const budgetPercentage = Math.min(100, Math.round((spentAmount / budgetLimit) * 100));
  
  const getBudgetStatusColor = () => {
    if (budgetPercentage < 70) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (budgetPercentage <= 100) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  const getBudgetProgressColor = () => {
    if (budgetPercentage < 70) return "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]";
    if (budgetPercentage <= 100) return "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]";
    return "bg-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]";
  };

  // --- Simulated OCR Receipt Scanner State (Bento Card 3) ---
  const [ocrState, setOcrState] = useState<"idle" | "scanning" | "done">("idle");
  const [ocrProgress, setOcrProgress] = useState(0);

  const startOcrSimulation = () => {
    if (ocrState !== "idle") return;
    setOcrState("scanning");
    setOcrProgress(0);

    const interval = setInterval(() => {
      setOcrProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setOcrState("done"), 200);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const resetOcrSimulation = () => {
    setOcrState("idle");
    setOcrProgress(0);
  };

  // --- Interactive Insights Filter (Bento Card 4) ---
  const [selectedInsightCategory, setSelectedInsightCategory] = useState<"comida" | "hogar" | "ocio">("comida");
  const insightDetails = {
    comida: { percentage: 42, spent: 340, trend: "Estable respecto al mes pasado", items: ["Supermercados: $210", "Restaurantes: $130"] },
    hogar: { percentage: 38, spent: 300, trend: "Incremento por cuentas de servicios", items: ["Alquiler/Expensas: $220", "Servicios: $80"] },
    ocio: { percentage: 20, spent: 160, trend: "Redujiste un 15% este mes", items: ["Cine & Teatro: $60", "Suscripciones: $100"] }
  };

  // --- Feature Request Poll State ---
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState<number[]>([432, 289, 512, 180]);
  const pollOptions = [
    "Sincronización bancaria automatizada",
    "Escaneo y OCR de tiques con IA",
    "Soporte inteligente para múltiples monedas",
    "Estadísticas y metas de ahorro personalizadas"
  ];

  const handleVote = (idx: number) => {
    if (selectedPollOption !== null) return;
    setSelectedPollOption(idx);
    const updated = [...pollVotes];
    updated[idx] += 1;
    setPollVotes(updated);
  };

  const getPollPercentage = (idx: number) => {
    const total = pollVotes.reduce((a, b) => a + b, 0);
    return Math.round((pollVotes[idx] / total) * 100);
  };

  // --- FAQ Accordion State ---
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqs = [
    {
      q: "¿Cómo funciona la división inteligente de gastos?",
      a: "El sistema consolida todos los gastos del grupo y calcula las transferencias mínimas necesarias para saldar las deudas. En lugar de hacer diez transferencias cruzadas, la app simplifica todo para que se resuelva con los mínimos movimientos posibles."
    },
    {
      q: "¿Es seguro conectar mis cuentas de gastos?",
      a: "Absolutamente. Usaremos encriptación AES-256 de nivel bancario y conexiones de lectura segura. Tus credenciales nunca se almacenan directamente en nuestros servidores y tienes control absoluto sobre los permisos en todo momento."
    },
    {
      q: "¿Qué significa que la app esté en fase de preparación?",
      a: "Actualmente estamos desplegando la infraestructura en la nube y finalizando el diseño de la interfaz móvil. Al unirte a la lista de espera, garantizas acceso prioritario a la versión beta cerrada y un descuento de fundador cuando se lance."
    },
    {
      q: "¿Puedo usarlo en diferentes monedas?",
      a: "Sí, uno de nuestros pilares es el soporte multidivisa en tiempo real. Podrás registrar gastos en euros, dólares o pesos y convertirlos instantáneamente según el tipo de cambio oficial del día."
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden font-sans text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Background Grids and ambient glows */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full ambient-glow-green animate-glow-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full ambient-glow-blue animate-glow-pulse pointer-events-none z-0" style={{ animationDelay: "-3s" }} />
      <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full ambient-glow-purple animate-glow-pulse pointer-events-none z-0" style={{ animationDelay: "-6s" }} />

      {/* Decorative vertical/horizontal divider lines for premium tech style */}
      <div className="absolute left-[8%] top-0 bottom-0 w-[1px] bg-white/[0.02] hidden md:block pointer-events-none z-0" />
      <div className="absolute right-[8%] top-0 bottom-0 w-[1px] bg-white/[0.02] hidden md:block pointer-events-none z-0" />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/[0.06] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-mono text-lg font-black text-slate-950 tracking-tighter">[L]</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              [BRAND_NAME]
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Características</a>
            <a href="#demo" className="hover:text-white transition-colors">Simulador En Vivo</a>
            <a href="#voting" className="hover:text-white transition-colors">Votar Funciones</a>
            <a href="#faqs" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
          </nav>

          {/* Call to Action Navbar */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#waitlist" 
              className="px-4 py-2 rounded-xl bg-white text-slate-950 font-semibold text-sm hover:bg-slate-200 transition-all shadow-md shadow-white/5 active:scale-95"
            >
              Unirse a la Espera
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-300 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`h-0.5 w-full bg-current rounded transform transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`h-0.5 w-full bg-current rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-full bg-current rounded transform transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-18 left-0 right-0 glass-panel border-b border-white/[0.06] py-6 px-6 flex flex-col gap-4 animate-fade-in-up">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white py-1"
            >
              Características
            </a>
            <a 
              href="#demo" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white py-1"
            >
              Simulador En Vivo
            </a>
            <a 
              href="#voting" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white py-1"
            >
              Votar Funciones
            </a>
            <a 
              href="#faqs" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white py-1"
            >
              Preguntas Frecuentes
            </a>
            <hr className="border-white/5 my-2" />
            <a 
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold hover:opacity-90 transition-opacity"
            >
              Registrarse en Waitlist
            </a>
          </div>
        )}
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/[0.08] text-xs font-semibold text-slate-300 mb-8 animate-fade-in-up shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Fase de infraestructura iniciada</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 animate-fade-in-up">
          Administra tus gastos y{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            divide cuentas sin dramas
          </span>
        </h1>

        {/* Paragraph */}
        <p className="max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed mb-10 animate-fade-in-up [animation-delay:200ms]">
          Llega la herramienta definitiva para tus finanzas compartidas y personales. Controla presupuestos dinámicos, escanea tiques y liquida saldos en segundos. Prepárate para el lanzamiento.
        </p>

        {/* Waitlist Form Component */}
        <div id="waitlist" className="w-full max-w-md animate-fade-in-up [animation-delay:300ms] mb-12">
          {waitlistStatus === "success" ? (
            <div className="glass-panel p-6 rounded-2xl border-emerald-500/30 text-left relative overflow-hidden shadow-[0_8px_32px_rgba(16,185,129,0.08)]">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">¡Ya estás en la lista!</h3>
                  <p className="text-xs text-emerald-400/90 font-medium">Lugar reservado con éxito</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">
                Te hemos asignado el puesto <strong className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">#{waitlistCount.toLocaleString("es-ES")}</strong>. Te informaremos de cada avance en el desarrollo y del lanzamiento beta.
              </p>
              <button 
                onClick={() => { setEmail(""); setWaitlistStatus("idle"); }}
                className="text-xs font-semibold text-slate-400 hover:text-white underline transition-colors"
              >
                Registrar otro correo
              </button>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={waitlistStatus === "loading"}
                  className="w-full h-13 px-4 rounded-xl glass-panel text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50 transition-all"
                />
                {waitlistStatus === "error" && (
                  <span className="absolute left-1 -bottom-6 text-xs text-rose-400 font-medium">
                    {waitlistError}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={waitlistStatus === "loading"}
                className="h-13 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/10 active:scale-98 disabled:opacity-50"
              >
                {waitlistStatus === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Acceso Prioritario</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Live Waitlist Statistics */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 animate-fade-in-up [animation-delay:400ms] text-slate-400 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span><strong className="text-white font-mono">{waitlistCount.toLocaleString("es-ES")}</strong> registrados</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Encriptación AES-256</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Próximo Release: Q3 2026</span>
          </div>
        </div>
      </section>

      {/* --- LIVE SPLITTER DEMO WIDGET --- */}
      <section id="demo" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Simula un gasto compartido en vivo
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg">
            Prueba cómo calcula la app los importes instantáneamente. Añade personas, define quién pagó y elige el método de reparto.
          </p>
        </div>

        {/* Calculator Widget Wrapper */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Card background effect */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Form Settings (7 Cols) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            <div className="border-b border-white/5 pb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Configuración del Gasto
              </span>
              <span className="text-xs text-slate-400 font-mono">Simulador 1.0</span>
            </div>

            {/* Bill Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Concepto</label>
                <input 
                  type="text" 
                  value={billTitle}
                  onChange={(e) => setBillTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500/40"
                  placeholder="Ej. Cena, Supermercado..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Monto Total ($)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input 
                    type="number" 
                    value={billAmount}
                    onChange={(e) => setBillAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono focus:outline-none focus:border-emerald-500/40"
                  />
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Participantes ({members.length})
                </label>
                <span className="text-[10px] text-slate-500">Haz clic en la cruz para eliminar</span>
              </div>
              
              {/* Member pills wrap */}
              <div className="flex flex-wrap gap-2 mb-3">
                {members.map((name, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium"
                  >
                    <span>{name}</span>
                    <button 
                      onClick={() => removeMember(idx)} 
                      className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3 h-3 text-slate-400 hover:text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add member input */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Agregar amigo..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMember()}
                  className="flex-1 h-10 px-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500/40"
                />
                <button 
                  onClick={addMember}
                  className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Sumar</span>
                </button>
              </div>
            </div>

            {/* Payer Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">¿Quién pagó?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {members.map((name, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPaidBy(idx)}
                    className={`h-9 px-3 rounded-lg text-xs font-medium border transition-all text-left truncate flex items-center justify-between ${
                      paidBy === idx 
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{name}</span>
                    {paidBy === idx && <Check className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Split Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Forma de División</label>
              <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 gap-1">
                <button
                  onClick={() => setSplitMethod("equal")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    splitMethod === "equal" 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Equitativo</span>
                </button>
                <button
                  onClick={() => setSplitMethod("shares")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    splitMethod === "shares" 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Por Partes</span>
                </button>
                <button
                  onClick={() => setSplitMethod("percentage")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    splitMethod === "percentage" 
                      ? "bg-white/10 text-white" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Porcentaje</span>
                </button>
              </div>
            </div>

            {/* Custom split input fields depending on selection */}
            {splitMethod !== "equal" && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-fade-in-up">
                <h4 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">
                  {splitMethod === "shares" ? "Asignar Partes Proporcionales" : "Definir Porcentajes (Suma total debe dar 100%)"}
                </h4>
                <div className="flex flex-col gap-3">
                  {members.map((name, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-300 truncate">{name}</span>
                      
                      {splitMethod === "shares" ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleShareChange(idx, (customShares[idx] || 0) - 1)}
                            className="w-7 h-7 rounded bg-white/10 hover:bg-white/15 flex items-center justify-center text-sm font-bold"
                          >-</button>
                          <span className="text-xs font-mono w-8 text-center">{customShares[idx]}</span>
                          <button 
                            onClick={() => handleShareChange(idx, (customShares[idx] || 0) + 1)}
                            className="w-7 h-7 rounded bg-white/10 hover:bg-white/15 flex items-center justify-center text-sm font-bold"
                          >+</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input 
                            type="range"
                            min="0"
                            max="100"
                            value={customPercentages[idx] || 0}
                            onChange={(e) => handlePercentageChange(idx, parseInt(e.target.value) || 0)}
                            className="w-24 sm:w-32"
                          />
                          <span className="text-xs font-mono w-10 text-right">{customPercentages[idx]}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {splitMethod === "percentage" && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[11px] font-medium">
                    <span className="text-slate-400">Total acumulado:</span>
                    <span className={pctTotal === 100 ? "text-emerald-400" : "text-amber-400 font-bold animate-pulse"}>
                      {pctTotal}% / 100% {pctTotal !== 100 && "(El saldo no coincide)"}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Calculations & Settle Overview (5 Cols) */}
          <div className="md:col-span-5 flex flex-col justify-between bg-slate-900/60 border border-white/10 rounded-2xl p-6 relative">
            
            {/* Top overview */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Resumen del Gasto</span>
                <h3 className="text-lg font-bold text-white truncate max-w-[220px]">{billTitle || "Gasto sin título"}</h3>
                <span className="text-2xl font-black text-white font-mono mt-1">${billAmount.toFixed(2)}</span>
              </div>

              <hr className="border-white/5" />

              {/* Balances detailed view */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cuentas Claras</span>
                
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {splits.map((split, idx) => {
                    const isPayer = paidBy === idx;
                    const amountToSettle = split.amount;

                    return (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between text-xs p-2 rounded-lg ${
                          isPayer 
                            ? "bg-emerald-500/5 border border-emerald-500/10 text-emerald-400" 
                            : "bg-white/[0.02] border border-white/5 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isPayer ? "bg-emerald-400" : "bg-slate-600"}`} />
                          <span className="font-semibold truncate max-w-[100px]">{split.name}</span>
                          {isPayer && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 rounded font-normal">Pagó</span>}
                        </div>
                        
                        <div className="text-right">
                          <span className="font-mono font-bold">${amountToSettle.toFixed(2)}</span>
                          <p className="text-[9px] text-slate-500">
                            {isPayer 
                              ? "recupera" 
                              : `le debe a ${members[paidBy]}`
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom summary and settled result */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Resolución de Deudas
                </span>
                
                <div className="flex flex-col gap-1 text-slate-300 font-medium">
                  {splits.map((split, idx) => {
                    if (idx === paidBy) return null;
                    if (split.amount === 0) return null;
                    
                    const payerName = members[paidBy];
                    const debtorName = split.name;
                    
                    return (
                      <p key={idx}>
                        👉 <strong>{debtorName}</strong> le transfiere <strong>${split.amount.toFixed(2)}</strong> a <strong>{payerName}</strong>.
                      </p>
                    );
                  })}
                  
                  {splits.every((s, i) => i === paidBy || s.amount === 0) && (
                    <p className="text-slate-400 italic">No hay transferencias pendientes.</p>
                  )}
                </div>
              </div>
              
              <a 
                href="#waitlist" 
                className="w-full mt-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Guardar este gasto</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* --- BENTO GRID FEATURE DISPLAY --- */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Una infraestructura robusta para tus finanzas
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-base md:text-lg">
            Estamos diseñando la app con las últimas herramientas de optimización para ofrecerte una experiencia instantánea.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1: Dynamic Budgets (Large - 2 cols on md) */}
          <div className="md:col-span-2 glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group min-h-[300px]">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Wallet className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Presupuestos Dinámicos Activos</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Configura límites por categoría y observa cómo se reajustan según tu ritmo de gasto. Visualiza alertas interactivas en tiempo real antes de salirte de tu plan mensual.
                </p>
              </div>

              {/* Interactive Widget Inside Card */}
              <div className="w-full md:w-64 bg-slate-900/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shrink-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400">Límite Mensual</span>
                  <span className="font-mono font-bold text-white">${budgetLimit}</span>
                </div>
                
                {/* Custom Slider */}
                <input 
                  type="range" 
                  min="200" 
                  max="1000" 
                  step="50"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(parseInt(e.target.value) || 500)}
                  className="w-full"
                />

                {/* Progress bar visual indicator */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>Consumido: <strong>${spentAmount}</strong></span>
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${getBudgetStatusColor()}`}>
                      {budgetPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${getBudgetProgressColor()}`}
                      style={{ width: `${budgetPercentage}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight text-center">
                  Desliza para ajustar tu presupuesto mensual y simular los límites.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Optimizado para finanzas personales</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                React Reactive States <Zap className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Debt Simplification (1 col) */}
          <div className="glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Liquidación Simplificada</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Adiós a los traspasos infinitos. Nuestro motor minimiza las transferencias agrupando saldos, garantizando que pagues lo justo con el menor esfuerzo.
              </p>

              {/* Settlement Visual */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 flex flex-col gap-2 font-mono text-[10px] text-slate-300">
                <div className="flex justify-between items-center line-through opacity-40">
                  <span>Sofía a Lucas</span>
                  <span>$25.00</span>
                </div>
                <div className="flex justify-between items-center line-through opacity-40">
                  <span>Lucas a Mateo</span>
                  <span>$15.00</span>
                </div>
                <div className="h-[1px] bg-white/10 my-1" />
                <div className="flex justify-between items-center text-emerald-400 font-bold">
                  <span>Resultado: Sofía a Mateo</span>
                  <span>$10.00</span>
                </div>
              </div>
            </div>

            <span className="text-xs text-slate-500 mt-6 block">Net Settlement Algorithm</span>
          </div>

          {/* Card 3: Scan Receipts (1 col) */}
          <div className="glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Scan className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Escáner Inteligente</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Haz una foto a cualquier factura y deja que la IA extraiga los conceptos y los asigne directamente a cada participante.
              </p>

              {/* Interactive OCR Demo */}
              <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 flex flex-col gap-3 relative min-h-[85px] justify-center">
                {ocrState === "idle" && (
                  <button 
                    onClick={startOcrSimulation}
                    className="w-full py-1.5 px-3 rounded-lg bg-purple-500/15 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[11px] font-bold transition-all text-center"
                  >
                    Probar escáner simulado
                  </button>
                )}

                {ocrState === "scanning" && (
                  <div className="flex flex-col gap-1.5 animate-pulse">
                    <div className="flex justify-between text-[10px] text-purple-400 font-bold">
                      <span>Procesando imagen...</span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                      <div className="h-full bg-purple-500 transition-all duration-75" style={{ width: `${ocrProgress}%` }} />
                      <div className="absolute inset-y-0 w-3 bg-white/30 blur-xs animate-ping" />
                    </div>
                  </div>
                )}

                {ocrState === "done" && (
                  <div className="flex flex-col gap-1 animate-fade-in-up text-[10px]">
                    <div className="flex justify-between text-purple-400 font-bold border-b border-white/5 pb-1">
                      <span>🧾 Ticket Escaneado</span>
                      <button onClick={resetOcrSimulation} className="text-slate-500 hover:text-slate-300">Reiniciar</button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">🍕 1x Pizza Gigante</span>
                      <span className="font-mono text-white">$42.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-white mt-1">
                      <span>Total Extraído</span>
                      <span className="font-mono">$42.00</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <span className="text-xs text-slate-500 mt-6 block">OCR & AI Extraction Engine</span>
          </div>

          {/* Card 4: Advanced Insights & Statistics (Large - 2 cols on md) */}
          <div className="md:col-span-2 glass-panel-interactive rounded-3xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden relative group min-h-[300px]">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Estadísticas y Análisis de Consumo</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Entiende a dónde se va tu dinero. Categorización automatizada, gráficas interactivas y reportes mensuales detallados para mejorar tu capacidad de ahorro mes a mes.
                </p>
              </div>

              {/* Interactive Insights Widget */}
              <div className="w-full md:w-64 bg-slate-900/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shrink-0">
                <div className="flex gap-1.5">
                  {(["comida", "hogar", "ocio"] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedInsightCategory(cat)}
                      className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all capitalize ${
                        selectedInsightCategory === cat
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-white/5 text-slate-400 hover:bg-white/8"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex justify-between items-end border-b border-white/5 pb-2">
                    <span className="text-slate-400 font-medium">Porcentaje total:</span>
                    <span className="text-base font-bold text-white font-mono">{insightDetails[selectedInsightCategory].percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total gastado:</span>
                    <span className="font-mono text-white font-semibold">${insightDetails[selectedInsightCategory].spent}</span>
                  </div>
                  
                  {/* Category breakdown sublist */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-lg p-2 flex flex-col gap-1 text-[10px] font-mono text-slate-300 mt-1">
                    {insightDetails[selectedInsightCategory].items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.split(":")[0]}</span>
                        <span className="text-white font-semibold">{item.split(":")[1]}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-[9px] text-slate-400 italic leading-tight text-center mt-1">
                    📈 {insightDetails[selectedInsightCategory].trend}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
              <span>Informes inteligentes de tendencias</span>
              <span className="flex items-center gap-1 text-blue-400 font-semibold">
                Categorización Automática <PieChart className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURE REQUEST POLL SECTION --- */}
      <section id="voting" className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Poll info text (5 Cols) */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Votación de Comunidad
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                ¿Qué funcionalidad priorizamos?
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Queremos construir esto junto a ti. Vota por la característica que consideres más útil y determinaremos el orden de implementación en nuestra infraestructura.
              </p>
              {selectedPollOption !== null && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>¡Voto registrado! Gracias por ayudarnos a dar forma al proyecto.</span>
                </div>
              )}
            </div>

            {/* Poll choices (7 Cols) */}
            <div className="md:col-span-7 flex flex-col gap-3">
              {pollOptions.map((opt, idx) => {
                const hasVoted = selectedPollOption !== null;
                const isSelected = selectedPollOption === idx;
                const percentage = getPollPercentage(idx);

                return (
                  <button
                    key={idx}
                    disabled={hasVoted}
                    onClick={() => handleVote(idx)}
                    className={`relative w-full text-left p-4 rounded-xl border text-sm font-medium transition-all group overflow-hidden ${
                      hasVoted
                        ? isSelected
                          ? "border-teal-500/40 text-white bg-slate-900/80"
                          : "border-white/5 text-slate-400 bg-slate-900/40"
                        : "border-white/10 text-slate-200 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 active:scale-99 cursor-pointer"
                    }`}
                  >
                    {/* Voting progress fill bar */}
                    {hasVoted && (
                      <div 
                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                          isSelected ? "bg-teal-500/10" : "bg-white/[0.02]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    )}

                    <div className="relative z-10 flex justify-between items-center gap-4">
                      <span className="truncate pr-4">{opt}</span>
                      {hasVoted ? (
                        <span className="font-mono font-bold text-teal-400 shrink-0">{percentage}%</span>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:border-white/40">
                          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* --- FAQS SECTION (ACCORDION) --- */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-6 py-20 border-t border-white/[0.04]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Resolvemos tus dudas iniciales antes de lanzar las primeras versiones.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div 
                key={idx}
                className="glass-panel rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-white hover:bg-white/[0.01] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-slate-400 text-sm leading-relaxed border-t border-white/5 bg-slate-900/20 animate-fade-in-up">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* --- INFO / ROADMAP TEASER SECTION --- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 border-t border-white/[0.04] bg-radial from-emerald-500/[0.02] to-transparent">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-1">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Estado de la Infraestructura</h3>
              <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                Actualmente estamos configurando la estructura inicial del proyecto. Hemos completado la configuración del ORM de base de datos con Prisma y estamos preparando los contenedores Docker y Nginx para el entorno de staging.
              </p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <a 
              href="#waitlist" 
              className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Registrar Email
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
        
        {/* Brand placeholder */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-slate-800 border border-white/10 flex items-center justify-center font-mono font-black text-slate-400 text-[10px]">
            [L]
          </div>
          <span className="font-bold text-slate-300 tracking-tight">
            [BRAND_NAME]
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <a href="#features" className="hover:text-slate-300 transition-colors">Características</a>
          <a href="#demo" className="hover:text-slate-300 transition-colors">Simulador</a>
          <a href="#voting" className="hover:text-slate-300 transition-colors">Votaciones</a>
          <a href="#faqs" className="hover:text-slate-300 transition-colors">FAQs</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Privacidad [Placeholder]</a>
        </div>

        {/* Copyright */}
        <div>
          <span>© {new Date().getFullYear()} [BRAND_NAME]. Todos los derechos reservados.</span>
        </div>

      </footer>

    </div>
  );
}
