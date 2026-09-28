"use client";

import { useState, useTransition } from "react";
import {
  formatBirthDateInput,
  type UserAnagraficaInput,
  type UserAppProfileInput,
} from "@/lib/user-anagrafica";
import { updateUserProfile } from "@/app/actions/auth-actions";
import { Card, Button, Alert } from "@/components/ui";
import { cn } from "@/lib/cn";

type ProfileUser = {
  userType?: string | null;
  name?: string | null;
  surname?: string | null;
  phone?: string | null;
  taxCode?: string | null;
  birthDate?: Date | string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressCity?: string | null;
  addressZip?: string | null;
  addressProvince?: string | null;
  addressCountry?: string | null;
  billingSameAsResidence?: boolean | null;
  billingLine1?: string | null;
  billingLine2?: string | null;
  billingCity?: string | null;
  billingZip?: string | null;
  billingProvince?: string | null;
  billingCountry?: string | null;
  companyName?: string | null;
  sdiPec?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingZip?: string | null;
  shippingProvince?: string | null;
  diet?: string | null;
  mealVouchers?: boolean | null;
};

export default function ProfileForm({ initialUser }: { initialUser: ProfileUser }) {
  const [userType, setUserType] = useState(initialUser.userType || "PRIVATE");
  const [billingSameAsResidence, setBillingSameAsResidence] = useState(
    initialUser.billingSameAsResidence !== false
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const anagrafica: UserAnagraficaInput = {
      name: String(formData.get("name") ?? ""),
      surname: String(formData.get("surname") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      taxCode: String(formData.get("taxCode") ?? ""),
      birthDate: String(formData.get("birthDate") ?? ""),
      addressLine1: String(formData.get("addressLine1") ?? ""),
      addressLine2: String(formData.get("addressLine2") ?? ""),
      addressCity: String(formData.get("addressCity") ?? ""),
      addressProvince: String(formData.get("addressProvince") ?? ""),
      addressZip: String(formData.get("addressZip") ?? ""),
      addressCountry: String(formData.get("addressCountry") ?? "IT"),
      billingSameAsResidence,
      billingLine1: billingSameAsResidence
        ? String(formData.get("addressLine1") ?? "")
        : String(formData.get("billingLine1") ?? ""),
      billingLine2: billingSameAsResidence
        ? String(formData.get("addressLine2") ?? "")
        : String(formData.get("billingLine2") ?? ""),
      billingCity: billingSameAsResidence
        ? String(formData.get("addressCity") ?? "")
        : String(formData.get("billingCity") ?? ""),
      billingProvince: billingSameAsResidence
        ? String(formData.get("addressProvince") ?? "")
        : String(formData.get("billingProvince") ?? ""),
      billingZip: billingSameAsResidence
        ? String(formData.get("addressZip") ?? "")
        : String(formData.get("billingZip") ?? ""),
      billingCountry: billingSameAsResidence
        ? String(formData.get("addressCountry") ?? "IT")
        : String(formData.get("billingCountry") ?? "IT"),
    };

    const appProfile: UserAppProfileInput = {
      userType: userType as "PRIVATE" | "COMPANY",
      companyName: String(formData.get("companyName") ?? ""),
      sdiPec: String(formData.get("sdiPec") ?? ""),
      shippingLine1: String(formData.get("shippingLine1") ?? ""),
      shippingLine2: String(formData.get("shippingLine2") ?? ""),
      shippingCity: String(formData.get("shippingCity") ?? ""),
      shippingZip: String(formData.get("shippingZip") ?? ""),
      shippingProvince: String(formData.get("shippingProvince") ?? ""),
      diet: String(formData.get("diet") ?? ""),
      mealVouchers: formData.get("mealVouchers") === "true",
    };

    startTransition(async () => {
      try {
        await updateUserProfile(anagrafica, appProfile);
        setMessage("Profilo aggiornato con successo!");
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Errore durante l'aggiornamento del profilo."
        );
      }
    });
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 text-sm focus:outline-none focus:border-primary transition-all shadow-sm";

  return (
    <form action={handleSubmit} className="space-y-8">
      {message && (
        <Alert variant={message.includes("successo") ? "success" : "danger"} className="font-semibold">
          {message}
        </Alert>
      )}

      <Card>
        <h3 className="text-base font-bold text-zinc-900 mb-4">Tipologia Profilo</h3>
        <div className="flex gap-4">
          {(["PRIVATE", "COMPANY"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setUserType(t)}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer",
                userType === t
                  ? "border-primary bg-primary/10 text-ink shadow-sm"
                  : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-50"
              )}
            >
              {t === "PRIVATE" ? "Privato" : "Azienda"}
            </button>
          ))}
        </div>
      </Card>

      <Card className="space-y-6">
        <h3 className="text-base font-bold text-zinc-900">Anagrafica</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Nome *</label>
            <input type="text" name="name" required defaultValue={initialUser.name ?? ""} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Cognome *</label>
            <input type="text" name="surname" required defaultValue={initialUser.surname ?? ""} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Telefono</label>
            <input type="text" name="phone" defaultValue={initialUser.phone ?? ""} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Data di nascita *</label>
            <input
              type="date"
              name="birthDate"
              required
              defaultValue={formatBirthDateInput(initialUser.birthDate)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">
              {userType === "COMPANY" ? "Partita IVA / CF" : "Codice Fiscale"} *
            </label>
            <input type="text" name="taxCode" required defaultValue={initialUser.taxCode ?? ""} className={inputClass} />
          </div>
          {userType === "COMPANY" && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">Ragione Sociale</label>
                <input type="text" name="companyName" defaultValue={initialUser.companyName ?? ""} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-2">SDI / PEC</label>
                <input type="text" name="sdiPec" defaultValue={initialUser.sdiPec ?? ""} className={inputClass} />
              </div>
            </>
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-bold text-zinc-900">Residenza *</h3>
        <input type="text" name="addressLine1" required placeholder="Indirizzo" defaultValue={initialUser.addressLine1 ?? ""} className={inputClass} />
        <input type="text" name="addressLine2" placeholder="Interno / scala" defaultValue={initialUser.addressLine2 ?? ""} className={inputClass} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <input type="text" name="addressCity" required placeholder="Città" defaultValue={initialUser.addressCity ?? ""} className={inputClass} />
          <input type="text" name="addressZip" required placeholder="CAP" defaultValue={initialUser.addressZip ?? ""} className={inputClass} />
          <input type="text" name="addressProvince" required placeholder="Prov." defaultValue={initialUser.addressProvince ?? ""} className={inputClass} />
          <input type="hidden" name="addressCountry" value={initialUser.addressCountry ?? "IT"} />
        </div>
      </Card>

      <Card className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-zinc-600">
          <input
            type="checkbox"
            checked={billingSameAsResidence}
            onChange={(e) => setBillingSameAsResidence(e.target.checked)}
            className="rounded border-zinc-200"
          />
          Fatturazione uguale alla residenza
        </label>
        {!billingSameAsResidence && (
          <div className="space-y-4">
            <input type="text" name="billingLine1" placeholder="Indirizzo fatturazione" defaultValue={initialUser.billingLine1 ?? ""} className={inputClass} />
            <input type="text" name="billingLine2" placeholder="Interno" defaultValue={initialUser.billingLine2 ?? ""} className={inputClass} />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <input type="text" name="billingCity" placeholder="Città" defaultValue={initialUser.billingCity ?? ""} className={inputClass} />
              <input type="text" name="billingZip" placeholder="CAP" defaultValue={initialUser.billingZip ?? ""} className={inputClass} />
              <input type="text" name="billingProvince" placeholder="Prov." defaultValue={initialUser.billingProvince ?? ""} className={inputClass} />
            </div>
            <input type="hidden" name="billingCountry" value={initialUser.billingCountry ?? "IT"} />
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h3 className="text-base font-bold text-zinc-900">Spedizione e preferenze</h3>
        <input type="text" name="shippingLine1" placeholder="Indirizzo spedizione" defaultValue={initialUser.shippingLine1 ?? ""} className={inputClass} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <input type="text" name="shippingCity" placeholder="Città" defaultValue={initialUser.shippingCity ?? ""} className={inputClass} />
          <input type="text" name="shippingZip" placeholder="CAP" defaultValue={initialUser.shippingZip ?? ""} className={inputClass} />
          <input type="text" name="shippingProvince" placeholder="Prov." defaultValue={initialUser.shippingProvince ?? ""} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select name="diet" defaultValue={initialUser.diet ?? ""} className={inputClass}>
            <option value="">Nessuna preferenza</option>
            <option value="VEGAN">Vegano</option>
            <option value="VEGETARIAN">Vegetariano</option>
            <option value="GLUTEN_FREE">Senza glutine</option>
          </select>
          <select name="mealVouchers" defaultValue={initialUser.mealVouchers ? "true" : "false"} className={inputClass}>
            <option value="false">No buoni pasto</option>
            <option value="true">Sì, uso buoni pasto</option>
          </select>
        </div>
      </Card>

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={isPending}>
        {isPending ? "Salvataggio..." : "Salva Modifiche"}
      </Button>
    </form>
  );
}
