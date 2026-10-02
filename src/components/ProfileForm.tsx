"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  formatAddressBlock,
  formatBirthDateInput,
  isUserAnagraficaComplete,
  validateItalianZip,
  validateProvince,
  validateTaxCode,
  type UserAnagraficaInput,
  type UserAppProfileInput,
} from "@/lib/user-anagrafica";
import { updateUserProfile } from "@/app/actions/auth-actions";
import { Button, Alert, Badge } from "@/components/ui";
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
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    const anagrafica: UserAnagraficaInput = {
      // Il tipo scelto ora (non quello salvato) decide se accettare la partita IVA.
      userType,
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

    setMessage(null);
    startTransition(async () => {
      try {
        await updateUserProfile(anagrafica, appProfile);
        setMessage({ type: "success", text: "Modifiche salvate." });
        setTimeout(() => setMessage(null), 3000);
        // Ricarica i dati server per aggiornare il riepilogo "profilo completo".
        router.refresh();
      } catch (error) {
        setMessage({
          type: "danger",
          text: error instanceof Error ? error.message : "Errore durante il salvataggio del profilo.",
        });
      }
    });
  };

  const u = initialUser;
  const isComplete = isUserAnagraficaComplete(u);
  const isCompany = userType === "COMPANY";

  // Campi obbligatori mancanti nei dati SALVATI, per sezione (stesse regole di isUserAnagraficaComplete).
  const missingAddress = (a: { line1?: string | null; city?: string | null; zip?: string | null; province?: string | null }) =>
    [
      !a.line1?.trim() && "Indirizzo",
      !a.city?.trim() && "Città",
      validateItalianZip(a.zip ?? "", "IT") && "CAP",
      validateProvince(a.province ?? "", "IT") && "Provincia",
    ].filter((x): x is string => Boolean(x));
  const residence = { line1: u.addressLine1, line2: u.addressLine2, city: u.addressCity, zip: u.addressZip, province: u.addressProvince };
  const billing = { line1: u.billingLine1, line2: u.billingLine2, city: u.billingCity, zip: u.billingZip, province: u.billingProvince };
  const shipping = { line1: u.shippingLine1, line2: u.shippingLine2, city: u.shippingCity, zip: u.shippingZip, province: u.shippingProvince };
  const missing = {
    personal: [
      !u.name?.trim() && "Nome",
      !u.surname?.trim() && "Cognome",
      !u.birthDate && "Data di nascita",
      validateTaxCode(u.taxCode ?? "", u.userType) && (u.userType === "COMPANY" ? "Partita IVA o codice fiscale" : "Codice fiscale"),
    ].filter((x): x is string => Boolean(x)),
    residence: missingAddress(residence),
    billing: u.billingSameAsResidence === false ? missingAddress(billing) : [],
  };
  const allMissing = [...missing.personal, ...missing.residence, ...missing.billing];

  // Le sezioni con dati mancanti partono aperte, le altre mostrano solo il riepilogo.
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({
    personal: missing.personal.length > 0,
    company: false,
    residence: missing.residence.length > 0,
    billing: missing.billing.length > 0,
    shipping: false,
    preferences: false,
  }));
  const toggle = (key: string) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  const [dirty, setDirty] = useState(false);
  const [prevMessage, setPrevMessage] = useState(message);
  if (message !== prevMessage) {
    setPrevMessage(message);
    if (message?.type === "success") setDirty(false);
  }

  const formatAddress = (a: typeof residence) =>
    a.line1?.trim() ? formatAddressBlock({ ...a, province: a.province ? `(${a.province})` : null }) : null;

  return (
    // onSubmit invece di action: con action React 19 resetta il form dopo l'invio,
    // e in caso di errore l'utente perderebbe tutto quello che ha scritto.
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(new FormData(e.currentTarget));
      }}
      onChange={() => setDirty(true)}
      // Un campo obbligatorio vuoto in una sezione chiusa non sarebbe raggiungibile: la apriamo.
      onInvalidCapture={(e) => {
        const key = (e.target as HTMLElement).closest<HTMLElement>("[data-section]")?.dataset.section;
        if (key && !open[key]) setOpen((o) => ({ ...o, [key]: true }));
      }}
      className="space-y-6"
    >
      {isComplete ? (
        <Alert variant="success">
          Il tuo profilo è completo: puoi prenotare tavoli e workspace e candidarti ai corsi.
        </Alert>
      ) : (
        <Alert variant="warning">
          Per prenotare e candidarti ai corsi completa questi dati:{" "}
          <strong>{allMissing.join(", ")}</strong>.
        </Alert>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-zinc-700">Tipo di profilo</p>
        <div role="radiogroup" aria-label="Tipo di profilo" className="grid grid-cols-2 gap-3">
          {(["PRIVATE", "COMPANY"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={userType === t}
              onClick={() => {
                setUserType(t);
                setDirty(true);
                if (t === "COMPANY") setOpen((o) => ({ ...o, company: true }));
              }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-semibold transition-all cursor-pointer",
                userType === t
                  ? "border-primary bg-primary/10 text-ink"
                  : "border-zinc-200 bg-surface text-zinc-500 hover:bg-zinc-50"
              )}
            >
              {t === "PRIVATE" ? "Privato" : "Azienda"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <ProfileSection
          id="personal"
          title="Dati personali"
          summary={[[u.name, u.surname].filter(Boolean).join(" "), u.taxCode].filter(Boolean).join(" · ")}
          incomplete={missing.personal.length > 0}
          open={open.personal}
          onToggle={toggle}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nome" required>
              <input type="text" name="name" required autoComplete="given-name" defaultValue={u.name ?? ""} className={INPUT} />
            </Field>
            <Field label="Cognome" required>
              <input type="text" name="surname" required autoComplete="family-name" defaultValue={u.surname ?? ""} className={INPUT} />
            </Field>
            <Field label="Data di nascita" required>
              <input type="date" name="birthDate" required autoComplete="bday" defaultValue={formatBirthDateInput(u.birthDate)} className={INPUT} />
            </Field>
            <Field label="Telefono">
              <input type="tel" name="phone" autoComplete="tel" placeholder="es. 333 123 4567" defaultValue={u.phone ?? ""} className={INPUT} />
            </Field>
            <Field
              label={isCompany ? "Partita IVA o codice fiscale" : "Codice fiscale"}
              required
              hint={
                isCompany
                  ? "Partita IVA di 11 cifre, oppure codice fiscale di 16 caratteri."
                  : "16 caratteri, lettere e numeri."
              }
              className="sm:col-span-2"
            >
              <input
                type="text"
                name="taxCode"
                required
                maxLength={16}
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                defaultValue={u.taxCode ?? ""}
                className={cn(INPUT, "uppercase")}
              />
            </Field>
          </div>
        </ProfileSection>

        {isCompany && (
          <ProfileSection
            id="company"
            title="Dati aziendali"
            summary={[u.companyName, u.sdiPec].filter(Boolean).join(" · ")}
            open={open.company}
            onToggle={toggle}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Ragione sociale">
                <input type="text" name="companyName" autoComplete="organization" defaultValue={u.companyName ?? ""} className={INPUT} />
              </Field>
              <Field label="Codice SDI o PEC" hint="Per la fatturazione elettronica.">
                <input type="text" name="sdiPec" defaultValue={u.sdiPec ?? ""} className={INPUT} />
              </Field>
            </div>
          </ProfileSection>
        )}

        <ProfileSection
          id="residence"
          title="Residenza"
          summary={formatAddress(residence)}
          incomplete={missing.residence.length > 0}
          open={open.residence}
          onToggle={toggle}
        >
          <AddressFields prefix="address" required values={residence} />
          <input type="hidden" name="addressCountry" value={u.addressCountry ?? "IT"} />
        </ProfileSection>

        <ProfileSection
          id="billing"
          title="Fatturazione"
          summary={u.billingSameAsResidence === false ? formatAddress(billing) : "Uguale alla residenza"}
          incomplete={missing.billing.length > 0}
          open={open.billing}
          onToggle={toggle}
        >
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={billingSameAsResidence}
              onChange={(e) => setBillingSameAsResidence(e.target.checked)}
              className="h-5 w-5 rounded border-zinc-300 accent-[var(--primary)]"
            />
            Usa l&apos;indirizzo di residenza
          </label>
          {!billingSameAsResidence && (
            <>
              <AddressFields prefix="billing" required values={billing} />
              <input type="hidden" name="billingCountry" value={u.billingCountry ?? "IT"} />
            </>
          )}
        </ProfileSection>

        <ProfileSection
          id="shipping"
          title="Spedizione"
          summary={formatAddress(shipping)}
          emptySummary="Facoltativo"
          open={open.shipping}
          onToggle={toggle}
        >
          <p className="text-xs text-zinc-500">Dove ricevere eventuali materiali.</p>
          <AddressFields prefix="shipping" values={shipping} />
        </ProfileSection>

        <ProfileSection
          id="preferences"
          title="Preferenze"
          summary={[
            DIETS[u.diet ?? ""] ?? "Nessuna esigenza alimentare",
            u.mealVouchers ? "usa buoni pasto" : "senza buoni pasto",
          ].join(" · ")}
          open={open.preferences}
          onToggle={toggle}
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Alimentazione">
              <select name="diet" defaultValue={u.diet ?? ""} className={INPUT}>
                <option value="">Nessuna esigenza particolare</option>
                {Object.entries(DIETS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Buoni pasto">
              <select name="mealVouchers" defaultValue={u.mealVouchers ? "true" : "false"} className={INPUT}>
                <option value="false">Non li uso</option>
                <option value="true">Sì, li uso</option>
              </select>
            </Field>
          </div>
        </ProfileSection>
      </div>

      {/* Barra di salvataggio fissa sopra la bottom nav, visibile solo quando c'è qualcosa da salvare
          o un esito da mostrare: così è sempre raggiungibile ma non copre la pagina quando non serve. */}
      {(dirty || isPending || message) && (
        <div className="sticky bottom-28 z-30 space-y-2 pt-2">
          {message && (
            <Alert variant={message.type} className="font-semibold">
              {message.text}
            </Alert>
          )}
          {(dirty || isPending) && (
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={isPending} className="shadow-lg">
              {isPending ? "Salvataggio..." : "Salva modifiche"}
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

const DIETS: Record<string, string> = {
  VEGAN: "Vegana",
  VEGETARIAN: "Vegetariana",
  GLUTEN_FREE: "Senza glutine",
};

/**
 * Sezione richiudibile: chiusa mostra titolo + riepilogo dei dati salvati, aperta i campi.
 * Il contenuto resta nel DOM (hidden) così i valori vengono comunque inviati col form.
 */
function ProfileSection({
  id,
  title,
  summary,
  emptySummary = "Non indicato",
  incomplete,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  summary?: string | null;
  emptySummary?: string;
  incomplete?: boolean;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <section
      data-section={id}
      className={cn(
        "rounded-2xl border bg-surface transition-colors",
        incomplete ? "border-primary/40" : "border-zinc-200/70"
      )}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`section-${id}`}
        onClick={() => onToggle(id)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="text-base font-bold text-zinc-900">{title}</span>
            {incomplete && <Badge variant="primary">Da completare</Badge>}
          </span>
          {!open && (
            <span className="mt-0.5 block truncate text-sm text-zinc-500">
              {summary?.trim() || emptySummary}
            </span>
          )}
        </span>
        <span className="shrink-0 text-xs font-bold text-primary">{open ? "Chiudi" : "Modifica"}</span>
      </button>
      <div id={`section-${id}`} hidden={!open} className="space-y-4 border-t border-zinc-100 px-5 pt-4 pb-5">
        {children}
      </div>
    </section>
  );
}

const INPUT =
  "w-full rounded-xl border border-zinc-200 bg-surface px-4 py-3 text-sm text-zinc-800 transition-all placeholder:text-zinc-400 focus:border-primary focus:outline-none";

function Field({
  label,
  required,
  hint,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-primary"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
    </label>
  );
}

/** Indirizzo con etichette sempre visibili: via, dettagli, città a tutta riga, poi CAP e provincia affiancati. */
function AddressFields({
  prefix,
  required,
  values,
}: {
  prefix: "address" | "billing" | "shipping";
  required?: boolean;
  values: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    zip?: string | null;
    province?: string | null;
  };
}) {
  const section = prefix === "billing" ? "billing" : prefix === "shipping" ? "shipping" : "";
  const ac = (field: string) => [section, field].filter(Boolean).join(" ");

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
      <Field label="Indirizzo" required={required} className="col-span-2 sm:col-span-4">
        <input
          type="text"
          name={`${prefix}Line1`}
          required={required}
          autoComplete={ac("address-line1")}
          placeholder="Via e numero civico"
          defaultValue={values.line1 ?? ""}
          className={INPUT}
        />
      </Field>
      <Field label="Interno, scala" className="col-span-2 sm:col-span-4">
        <input
          type="text"
          name={`${prefix}Line2`}
          autoComplete={ac("address-line2")}
          defaultValue={values.line2 ?? ""}
          className={INPUT}
        />
      </Field>
      <Field label="Città" required={required} className="col-span-2">
        <input
          type="text"
          name={`${prefix}City`}
          required={required}
          autoComplete={ac("address-level2")}
          defaultValue={values.city ?? ""}
          className={INPUT}
        />
      </Field>
      <Field label="CAP" required={required}>
        <input
          type="text"
          name={`${prefix}Zip`}
          required={required}
          inputMode="numeric"
          maxLength={5}
          autoComplete={ac("postal-code")}
          defaultValue={values.zip ?? ""}
          className={INPUT}
        />
      </Field>
      <Field label="Provincia" required={required}>
        <input
          type="text"
          name={`${prefix}Province`}
          required={required}
          maxLength={2}
          autoCapitalize="characters"
          placeholder="MI"
          autoComplete={ac("address-level1")}
          defaultValue={values.province ?? ""}
          className={cn(INPUT, "uppercase")}
        />
      </Field>
    </div>
  );
}
