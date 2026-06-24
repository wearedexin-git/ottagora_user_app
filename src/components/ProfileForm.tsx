"use client";

import { useState } from "react";
import { updateUserAnagrafica } from "@/app/actions/auth-actions";

export default function ProfileForm({ initialUser }: { initialUser: any }) {
  const [type, setType] = useState(initialUser.type || "PRIVATE");
  const [billingSameAsResidence, setBillingSameAsResidence] = useState(
    initialUser.billingSameAsResidence ?? true
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const data = {
      type,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      phone: formData.get("phone") as string,
      taxCode: formData.get("taxCode") as string,
      companyName: formData.get("companyName") as string,
      sdiPec: formData.get("sdiPec") as string,
      
      residenceAddress: formData.get("residenceAddress") as string,
      residenceCity: formData.get("residenceCity") as string,
      residenceZip: formData.get("residenceZip") as string,
      residenceProvince: formData.get("residenceProvince") as string,
      
      billingAddress: billingSameAsResidence
        ? (formData.get("residenceAddress") as string)
        : (formData.get("billingAddress") as string),
      billingCity: billingSameAsResidence
        ? (formData.get("residenceCity") as string)
        : (formData.get("billingCity") as string),
      billingZip: billingSameAsResidence
        ? (formData.get("residenceZip") as string)
        : (formData.get("billingZip") as string),
      billingProvince: billingSameAsResidence
        ? (formData.get("residenceProvince") as string)
        : (formData.get("billingProvince") as string),
      billingSameAsResidence,
      
      shippingAddress: formData.get("shippingAddress") as string,
      shippingCity: formData.get("shippingCity") as string,
      shippingZip: formData.get("shippingZip") as string,
      shippingProvince: formData.get("shippingProvince") as string,
      
      diet: formData.get("diet") as string,
      mealVouchers: formData.get("mealVouchers") === "true",
    };

    try {
      await updateUserAnagrafica(data);
      setMessage("Profilo aggiornato con successo!");
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage("Errore durante l'aggiornamento del profilo.");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {message && (
        <div className="p-4 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 text-sm font-semibold">
          {message}
        </div>
      )}

      {/* User Type selector */}
      <div className="glass rounded-2xl p-6 bg-white/50 border-zinc-200/40 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 mb-4">Tipologia Profilo</h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setType("PRIVATE")}
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              type === "PRIVATE"
                ? "border-amber-500 bg-amber-500/10 text-amber-600 shadow-sm"
                : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            🧑‍💼 Privato
          </button>
          <button
            type="button"
            onClick={() => setType("COMPANY")}
            className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              type === "COMPANY"
                ? "border-amber-500 bg-amber-500/10 text-amber-600 shadow-sm"
                : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            🏢 Azienda
          </button>
        </div>
      </div>

      {/* Personal/Company Details */}
      <div className="glass rounded-2xl p-6 bg-white/50 border-zinc-200/40 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 mb-4">Informazioni Generali</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nome</label>
            <input
              type="text"
              name="name"
              defaultValue={initialUser.name || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Cognome</label>
            <input
              type="text"
              name="surname"
              defaultValue={initialUser.surname || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Telefono</label>
            <input
              type="text"
              name="phone"
              defaultValue={initialUser.phone || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>

          {type === "PRIVATE" ? (
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Codice Fiscale</label>
              <input
                type="text"
                name="taxCode"
                defaultValue={initialUser.taxCode || ""}
                placeholder="Codice Fiscale a 16 caratteri"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          ) : (
            <>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Ragione Sociale</label>
                <input
                  type="text"
                  name="companyName"
                  defaultValue={initialUser.companyName || ""}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Partita IVA</label>
                <input
                  type="text"
                  name="taxCode"
                  defaultValue={initialUser.taxCode || ""}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Codice SDI / PEC</label>
                <input
                  type="text"
                  name="sdiPec"
                  defaultValue={initialUser.sdiPec || ""}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="glass rounded-2xl p-6 bg-white/50 border-zinc-200/40 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 mb-4">Indirizzo di Residenza</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Indirizzo</label>
            <input
              type="text"
              name="residenceAddress"
              defaultValue={initialUser.residenceAddress || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Città</label>
            <input
              type="text"
              name="residenceCity"
              defaultValue={initialUser.residenceCity || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">CAP</label>
            <input
              type="text"
              name="residenceZip"
              defaultValue={initialUser.residenceZip || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Provincia</label>
            <input
              type="text"
              name="residenceProvince"
              defaultValue={initialUser.residenceProvince || ""}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Billing Address */}
      <div className="glass rounded-2xl p-6 bg-white/50 border-zinc-200/40 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-zinc-900">Fatturazione</h3>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-500 cursor-pointer">
            <input
              type="checkbox"
              checked={billingSameAsResidence}
              onChange={(e) => setBillingSameAsResidence(e.target.checked)}
              className="rounded border-zinc-200 bg-white text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            Uguale alla residenza
          </label>
        </div>

        {!billingSameAsResidence && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-4 animate-in fade-in duration-200">
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Indirizzo di Fatturazione</label>
              <input
                type="text"
                name="billingAddress"
                defaultValue={initialUser.billingAddress || ""}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Città</label>
              <input
                type="text"
                name="billingCity"
                defaultValue={initialUser.billingCity || ""}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">CAP</label>
              <input
                type="text"
                name="billingZip"
                defaultValue={initialUser.billingZip || ""}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Provincia</label>
              <input
                type="text"
                name="billingProvince"
                defaultValue={initialUser.billingProvince || ""}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preferences & Dietary */}
      <div className="glass rounded-2xl p-6 bg-white/50 border-zinc-200/40 shadow-sm">
        <h3 className="text-base font-bold text-zinc-900 mb-4">Preferenze Alimentari & Buoni Pasto</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Regime Alimentare / Dieta</label>
            <select
              name="diet"
              defaultValue={initialUser.diet || "standard"}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-850 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            >
              <option value="standard">Standard</option>
              <option value="VEGAN">Vegano</option>
              <option value="VEGETARIAN">Vegetariano</option>
              <option value="GLUTEN_FREE">Senza Glutine</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Buoni Pasto</label>
            <select
              name="mealVouchers"
              defaultValue={initialUser.mealVouchers ? "true" : "false"}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-850 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
            >
              <option value="false">No</option>
              <option value="true">Sì (Possiedo buoni pasto)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
      >
        Salva Modifiche
      </button>
    </form>
  );
}
