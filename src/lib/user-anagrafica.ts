export type UserAnagraficaFields = {
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

export function validateTaxCode(value: string): string | null {
  const cf = normalizeTaxCode(value)
  if (!cf) return "Il codice fiscale è obbligatorio."
  if (cf.length !== 16) return "Il codice fiscale deve essere di 16 caratteri."
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
  if (!user.taxCode?.trim() || validateTaxCode(user.taxCode)) return false
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

  const taxError = validateTaxCode(data.taxCode)
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
