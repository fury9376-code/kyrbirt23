import { useState } from "react";
import { motion } from "framer-motion";

type Props = { action: "enable" | "disable" };

export default function ToggleMaintenance({ action }: Props) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error" | "auth_error">("idle");

  const isEnable = action === "enable";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      // Verify password server-side first
      const verifyRes = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!verifyRes.ok) {
        setStatus("auth_error");
        return;
      }
      // Now toggle maintenance with the verified password
      const res = await fetch(`/api/maintenance/${action}`, {
        method: "POST",
        headers: { "x-admin-password": password },
      });
      const data = await res.json();
      setStatus(data.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center w-full max-w-sm"
      >
        {(status === "idle" || status === "auth_error") && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1
              className="text-3xl text-[#FFFEF7] mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              {isEnable ? "ACTIVAR MANTENIMIENTO" : "DESACTIVAR MANTENIMIENTO"}
            </h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña admin"
              autoComplete="current-password"
              className="w-full bg-transparent border border-white/20 text-white px-4 py-3 text-sm tracking-wider outline-none focus:border-white/50 transition-colors"
            />
            {status === "auth_error" && (
              <p className="text-red-400 text-xs tracking-widest uppercase">Contraseña incorrecta</p>
            )}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 text-sm tracking-widest uppercase font-bold hover:bg-white/90 transition-colors"
            >
              CONFIRMAR
            </button>
            <a
              href="/"
              className="block text-[#FFFEF7]/30 hover:text-[#FFFEF7] text-xs tracking-widest uppercase transition-colors mt-4"
            >
              ← Cancelar
            </a>
          </form>
        )}

        {status === "loading" && (
          <p className="text-[#FFFEF7]/40 tracking-widest uppercase text-sm">Procesando...</p>
        )}

        {status === "done" && (
          <>
            <div className={`w-3 h-3 rounded-full mx-auto mb-6 ${isEnable ? "bg-red-500" : "bg-green-500"}`} />
            <h1
              className="text-4xl text-[#FFFEF7] mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              {isEnable ? "MANTENIMIENTO ACTIVADO" : "MANTENIMIENTO DESACTIVADO"}
            </h1>
            <p className="text-[#FFFEF7]/40 text-xs tracking-widest uppercase mb-8">
              {isEnable
                ? "El sitio ahora muestra la pantalla de mantenimiento"
                : "El sitio está nuevamente disponible al público"}
            </p>
            <a
              href="/"
              className="text-[#FFFEF7]/50 hover:text-[#FFFEF7] text-xs tracking-widest uppercase transition-colors"
            >
              ← Volver al inicio
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1
              className="text-4xl text-red-400 mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
            >
              ERROR
            </h1>
            <p className="text-[#FFFEF7]/40 text-xs tracking-widest uppercase mb-6">
              No se pudo cambiar el estado
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="text-[#FFFEF7]/50 hover:text-[#FFFEF7] text-xs tracking-widest uppercase transition-colors"
            >
              ← Reintentar
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
