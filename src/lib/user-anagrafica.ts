export type UserAnagraficaFields = {
  /** PRIVATE o COMPANY: per le aziende il campo taxCode può contenere la partita IVA. */
  userType?: string | null
  name?: string | null
  surname?: string | null
  phone?: string | null
  taxCode?: string | null
  birthDate?: Date | string | null
  addressLine1?: string | null
  addressLine2?: string | null
  addressCity?: string | null
  addressProvince?: string | null
  addressZip?: string | null
  addressCountry?: string | null
  billingSameAsResidence?: boolean | null
  billingLine1?: string | null
  billingLine2?: string | null
  billingCity?: string | null
  billingProvince?: string | null
  billingZip?: string | null
  billingCountry?: string | null
  companyName?: string | null
  sdiPec?: string | null
  shippingLine1?: string | null
  shippingLine2?: string | null
  shippingCity?: string | null
  shippingZip?: string | null
  shippingProvince?: string | null
  diet?: string | null
  mealVouchers?: boolean | null
}

export type UserAnagraficaInput = {
  /** PRIVATE o COMPANY: decide se taxCode può essere una partita IVA. */
  userType?: string
  name: string
  surname: string
  phone: string
  taxCode: string
  birthDate: string
  addressLine1: string
  addressLine2: string
  addressCity: string
  addressProvince: string
  addressZip: string
  addressCountry: string
  billingSameAsResidence: boolean
  billingLine1: string
  billingLine2: string
  billingCity: string
  billingProvince: string
  billingZip: string
  billingCountry: string
}

export function normalizeTaxCode(value: string) {
  return value.replace(/\s/g, "").toUpperCase()
}

/**
 * Partita IVA italiana: 11 cifre, l'ultima è la cifra di controllo (algoritmo ufficiale:
 * cifre in posizione dispari sommate, in posizione pari raddoppiate e ridotte di 9 se > 9).
 */
export function validateVatNumber(value: string): string | null {
  const vat = normalizeTaxCode(value)
  if (!/^\d{11}$/.test(vat)) return "La partita IVA deve essere di 11 cifre."
  let sum = 0
  for (let i = 0; i < 10; i++) {
    let digit = Number(vat[i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  const check = (10 - (sum % 10)) % 10
  if (check !== Number(vat[10])) return "Partita IVA non valida: controlla le cifre."
  return null
}

/**
 * Privati: codice fiscale di 16 caratteri.
 * Aziende: partita IVA di 11 cifre oppure codice fiscale di 16 caratteri (es. ditte individuali).
 */
export function validateTaxCode(value: string, userType?: string | null): string | null {
  const cf = normalizeTaxCode(value)
  const isCompany = userType === "COMPANY"
  if (!cf) {
    return isCompany
      ? "La partita IVA o il codice fiscale è obbligatorio."
      : "Il codice fiscale è obbligatorio."
  }
  if (isCompany && /^\d+$/.test(cf)) return validateVatNumber(cf)
  if (cf.length !== 16) {
    return isCompany
      ? "Inserisci una partita IVA (11 cifre) o un codice fiscale (16 caratteri)."
      : "Il codice fiscale deve essere di 16 caratteri."
  }
  if (!/^[A-Z0-9]{16}$/.test(cf)) {
    return "Formato codice fiscale non valido."
  }
  return null
}

export function validateItalianZip(value: string, country: string): string | null {
  const zip = value.trim()
  if (!zip) return "Il CAP è obbligatorio."
  if (country === "IT" && !/^\d{5}$/.test(zip)) {
    return "Il CAP italiano deve essere di 5 cifre."
  }
  return null
}

export function validateProvince(value: string, country: string): string | null {
  const p = value.trim().toUpperCase()
  if (!p) return "La provincia è obbligatoria."
  if (country === "IT" && !/^[A-Z]{2}$/.test(p)) {
    return "Inserisci la sigla provincia (es. MI)."
  }
  return null
}

export function parseBirthDateInput(value: string): Date | null {
  if (!value.trim()) return null
  const d = new Date(`${value}T12:00:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function formatBirthDateInput(date: Date | string | null | undefined) {
  if (!date) return ""
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function formatAddressBlock(fields: {
  line1?: string | null
  line2?: string | null
  zip?: string | null
  city?: string | null
  province?: string | null
  country?: string | null
}) {
  const parts = [
    fields.line1,
    fields.line2,
    [fields.zip, fields.city, fields.province].filter(Boolean).join(" "),
    fields.country && fields.country !== "IT" ? fields.country : null,
  ].filter((p) => p && String(p).trim())
  return parts.join(", ") || "—"
}

export function getResidenceAddress(user: UserAnagraficaFields) {
  return formatAddressBlock({
    line1: user.addressLine1,
    line2: user.addressLine2,
    zip: user.addressZip,
    city: user.addressCity,
    province: user.addressProvince,
    country: user.addressCountry,
  })
}

export function getBillingAddress(user: UserAnagraficaFields) {
  if (user.billingSameAsResidence !== false) {
    return getResidenceAddress(user)
  }
  return formatAddressBlock({
    line1: user.billingLine1,
    line2: user.billingLine2,
    zip: user.billingZip,
    city: user.billingCity,
    province: user.billingProvince,
    country: user.billingCountry,
  })
}

export function isUserAnagraficaComplete(user: UserAnagraficaFields) {
  if (!user.name?.trim() || !user.surname?.trim()) return false
  if (!user.taxCode?.trim() || validateTaxCode(user.taxCode, user.userType)) return false
  if (!user.birthDate) return false
  const country = user.addressCountry?.trim() || "IT"
  if (!user.addressLine1?.trim() || !user.addressCity?.trim()) return false
  if (validateItalianZip(user.addressZip ?? "", country)) return false
  if (validateProvince(user.addressProvince ?? "", country)) return false
  if (user.billingSameAsResidence === false) {
    const billCountry = user.billingCountry?.trim() || "IT"
    if (!user.billingLine1?.trim() || !user.billingCity?.trim()) return false
    if (validateItalianZip(user.billingZip ?? "", billCountry)) return false
    if (validateProvince(user.billingProvince ?? "", billCountry)) return false
  }
  return true
}

export function userToAnagraficaInput(user: UserAnagraficaFields): UserAnagraficaInput {
  return {
    userType: user.userType ?? undefined,
    name: user.name ?? "",
    surname: user.surname ?? "",
    phone: user.phone ?? "",
    taxCode: user.taxCode ?? "",
    birthDate: formatBirthDateInput(user.birthDate),
    addressLine1: user.addressLine1 ?? "",
    addressLine2: user.addressLine2 ?? "",
    addressCity: user.addressCity ?? "",
    addressProvince: user.addressProvince ?? "",
    addressZip: user.addressZip ?? "",
    addressCountry: user.addressCountry ?? "IT",
    billingSameAsResidence: user.billingSameAsResidence !== false,
    billingLine1: user.billingLine1 ?? "",
    billingLine2: user.billingLine2 ?? "",
    billingCity: user.billingCity ?? "",
    billingProvince: user.billingProvince ?? "",
    billingZip: user.billingZip ?? "",
    billingCountry: user.billingCountry ?? "IT",
  }
}

export function validateAnagraficaInput(
  data: UserAnagraficaInput
): { error?: string; parsed?: Omit<UserAnagraficaInput, "birthDate"> & { birthDate: Date } } {
  const name = data.name.trim()
  const surname = data.surname.trim()
  if (!name || !surname) return { error: "Nome e cognome sono obbligatori." }

  const taxError = validateTaxCode(data.taxCode, data.userType)
  if (taxError) return { error: taxError }

  const birthDate = parseBirthDateInput(data.birthDate)
  if (!birthDate) return { error: "Data di nascita obbligatoria." }

  const addressCountry = data.addressCountry.trim() || "IT"
  if (!data.addressLine1.trim() || !data.addressCity.trim()) {
    return { error: "Indirizzo di residenza incompleto." }
  }
  const zipErr = validateItalianZip(data.addressZip, addressCountry)
  if (zipErr) return { error: zipErr }
  const provErr = validateProvince(data.addressProvince, addressCountry)
  if (provErr) return { error: provErr }

  const billingSameAsResidence = data.billingSameAsResidence
  const billingCountry = data.billingCountry.trim() || "IT"

  if (!billingSameAsResidence) {
    if (!data.billingLine1.trim() || !data.billingCity.trim()) {
      return { error: "Indirizzo di fatturazione incompleto." }
    }
    const bZip = validateItalianZip(data.billingZip, billingCountry)
    if (bZip) return { error: bZip }
    const bProv = validateProvince(data.billingProvince, billingCountry)
    if (bProv) return { error: bProv }
  }

  return {
    parsed: {
      ...data,
      name,
      surname,
      phone: data.phone.trim(),
      taxCode: normalizeTaxCode(data.taxCode),
      birthDate,
      addressLine1: data.addressLine1.trim(),
      addressLine2: data.addressLine2.trim(),
      addressCity: data.addressCity.trim(),
      addressProvince: data.addressProvince.trim().toUpperCase(),
      addressZip: data.addressZip.trim(),
      addressCountry,
      billingSameAsResidence,
      billingLine1: billingSameAsResidence ? "" : data.billingLine1.trim(),
      billingLine2: billingSameAsResidence ? "" : data.billingLine2.trim(),
      billingCity: billingSameAsResidence ? "" : data.billingCity.trim(),
      billingProvince: billingSameAsResidence
        ? ""
        : data.billingProvince.trim().toUpperCase(),
      billingZip: billingSameAsResidence ? "" : data.billingZip.trim(),
      billingCountry: billingSameAsResidence ? "" : billingCountry,
    },
  }
}

export function anagraficaToPrismaData(
  parsed: NonNullable<ReturnType<typeof validateAnagraficaInput>["parsed"]>
) {
  return {
    name: parsed.name,
    surname: parsed.surname,
    phone: parsed.phone || null,
    taxCode: parsed.taxCode,
    birthDate: parsed.birthDate,
    addressLine1: parsed.addressLine1,
    addressLine2: parsed.addressLine2 || null,
    addressCity: parsed.addressCity,
    addressProvince: parsed.addressProvince,
    addressZip: parsed.addressZip,
    addressCountry: parsed.addressCountry,
    billingSameAsResidence: parsed.billingSameAsResidence,
    billingLine1: parsed.billingSameAsResidence ? null : parsed.billingLine1 || null,
    billingLine2: parsed.billingSameAsResidence ? null : parsed.billingLine2 || null,
    billingCity: parsed.billingSameAsResidence ? null : parsed.billingCity || null,
    billingProvince: parsed.billingSameAsResidence ? null : parsed.billingProvince || null,
    billingZip: parsed.billingSameAsResidence ? null : parsed.billingZip || null,
    billingCountry: parsed.billingSameAsResidence ? null : parsed.billingCountry || null,
  }
}

export type UserAppProfileInput = {
  userType: "PRIVATE" | "COMPANY"
  companyName: string
  sdiPec: string
  shippingLine1: string
  shippingLine2: string
  shippingCity: string
  shippingZip: string
  shippingProvince: string
  diet: string
  mealVouchers: boolean
}

export function appProfileToPrismaData(data: UserAppProfileInput) {
  const isCompany = data.userType === "COMPANY"
  return {
    userType: data.userType,
    companyName: isCompany ? data.companyName.trim() || null : null,
    sdiPec: isCompany ? data.sdiPec.trim() || null : null,
    shippingLine1: data.shippingLine1.trim() || null,
    shippingLine2: data.shippingLine2.trim() || null,
    shippingCity: data.shippingCity.trim() || null,
    shippingZip: data.shippingZip.trim() || null,
    shippingProvince: data.shippingProvince.trim().toUpperCase() || null,
    diet: data.diet.trim() || null,
    mealVouchers: data.mealVouchers,
  }
}
