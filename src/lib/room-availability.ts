export type TimeSlot = { from: string; to: string }

export type WeeklyDayAvailability = {
  day: string
  slots: TimeSlot[]
}

export type CalendarException = {
  id: string
  date: string // YYYY-MM-DD
  type: "CLOSED" | "CUSTOM"
  reason?: string
  slots?: TimeSlot[]
}

export type RoomAvailabilityConfig = {
  weekly: WeeklyDayAvailability[]
  exceptions: CalendarException[]
}

export const WEEK_DAYS = [
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
  "Domenica",
] as const

export function defaultWeeklySchedule(): WeeklyDayAvailability[] {
  return WEEK_DAYS.map((day) => ({
    day,
    slots: [{ from: "09:00", to: "18:00" }],
  }))
}

export function defaultAvailabilityConfig(): RoomAvailabilityConfig {
  return {
    weekly: defaultWeeklySchedule(),
    exceptions: [],
  }

}

export function parseRoomAvailability(raw: string | null | undefined): RoomAvailabilityConfig {
  if (!raw) return defaultAvailabilityConfig()
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return { weekly: parsed, exceptions: [] }
    }
    if (parsed && typeof parsed === "object") {
      const exceptions = Array.isArray(parsed.exceptions)
        ? parsed.exceptions.map((ex: CalendarException & { id?: string }) => ({
            ...ex,
            id: ex.id || newExceptionId(),
            slots: ex.type === "CUSTOM" ? ex.slots || [{ from: "09:00", to: "18:00" }] : ex.slots,
          }))
        : []
      return {
        weekly: Array.isArray(parsed.weekly) ? parsed.weekly : defaultWeeklySchedule(),
        exceptions,
      }
    }
  } catch {
    /* ignore */
  }
  return defaultAvailabilityConfig()
}

export function serializeRoomAvailability(config: RoomAvailabilityConfig): string {
  return JSON.stringify({
    weekly: config.weekly,
    exceptions: config.exceptions.map(({ id, ...rest }) => rest),
  })
}

export function formatWeeklySummary(weekly: WeeklyDayAvailability[]): string {
  if (weekly.length === 0) return "Chiuso"
  return weekly
    .map((a) => `${a.day.substring(0, 3)}: ${a.slots.map((s) => `${s.from}-${s.to}`).join(", ")}`)
    .join(" | ")
}

export function formatAvailabilitySummary(config: RoomAvailabilityConfig): string {
  const weekly = formatWeeklySummary(config.weekly)
  if (config.exceptions.length === 0) return weekly
  return `${weekly} · ${config.exceptions.length} eccez.`
}

const DAY_ABBREVS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"] as const

function slotsSignature(slots: TimeSlot[]): string {
  return slots.map((s) => `${s.from}-${s.to}`).join("|")
}

function slotsLabel(slots: TimeSlot[]): string {
  return slots.map((s) => `${s.from}–${s.to}`).join(", ")
}

/** Riepilogo compatto per select e card (es. «Lun–Sab 07:00–23:00, Dom 09:00–22:00»). */
export function formatCompactOpeningHours(weekly: WeeklyDayAvailability[]): string {
  if (weekly.length === 0) return "Chiuso"

  const ordered = WEEK_DAYS.map((day) => weekly.find((w) => w.day === day)).filter(
    Boolean
  ) as WeeklyDayAvailability[]
  if (ordered.length === 0) return "Chiuso"

  const groups: { from: number; to: number; signature: string; label: string }[] = []

  for (const entry of ordered) {
    const idx = WEEK_DAYS.indexOf(entry.day as (typeof WEEK_DAYS)[number])
    const signature = slotsSignature(entry.slots)
    const label = slotsLabel(entry.slots)
    const last = groups[groups.length - 1]
    if (last && last.signature === signature && last.to === idx - 1) {
      last.to = idx
    } else {
      groups.push({ from: idx, to: idx, signature, label })
    }
  }

  return groups
    .map((g) => {
      const dayRange =
        g.from === g.to ? DAY_ABBREVS[g.from] : `${DAY_ABBREVS[g.from]}–${DAY_ABBREVS[g.to]}`
      return `${dayRange} ${g.label}`
    })
    .join(", ")
}

export function formatRoomCapacityAndHours(room: {
  capacity?: number | null
  availability?: string | null
}): string {
  const config = parseRoomAvailability(room.availability)
  const hours = formatCompactOpeningHours(config.weekly)
  const cap = room.capacity ?? 0
  return `${cap} posti · ${hours}`
}

export function formatRoomSelectLabel(room: {
  name: string
  capacity?: number | null
  availability?: string | null
}): string {
  return `${room.name} (${formatRoomCapacityAndHours(room)})`
}

export function newExceptionId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const JS_DAY_TO_ITALIAN: Record<number, string> = {
  0: "Domenica",
  1: "Lunedì",
  2: "Martedì",
  3: "Mercoledì",
  4: "Giovedì",
  5: "Venerdì",
  6: "Sabato",
}

export function italianWeekdayName(date: Date): string {
  return JS_DAY_TO_ITALIAN[date.getDay()]
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + (m || 0)
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const mo = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${mo}-${d}`
}

/** Slot effettivi per una data (eccezioni sovrascrivono il weekly). null = chiuso. */
export function getSlotsForDate(
  config: RoomAvailabilityConfig,
  date: Date
): TimeSlot[] | null {
  const dateKey = formatDateKey(date)
  const exception = config.exceptions.find((ex) => ex.date === dateKey)
  if (exception?.type === "CLOSED") return null
  if (exception?.type === "CUSTOM") return exception.slots?.length ? exception.slots : null

  const dayName = italianWeekdayName(date)
  const weekly = config.weekly.find((w) => w.day === dayName)
  if (!weekly?.slots?.length) return null
  return weekly.slots
}

export function validateRoomBooking(
  availabilityRaw: string | null | undefined,
  start: Date,
  end: Date
): { valid: boolean; error?: string } {
  if (end <= start) {
    return { valid: false, error: "L'orario di fine deve essere successivo all'inizio." }
  }

  const config = parseRoomAvailability(availabilityRaw)
  const slots = getSlotsForDate(config, start)
  if (!slots) {
    return {
      valid: false,
      error: "La data selezionata non corrisponde a un giorno di apertura programmato per questa sala.",
    }
  }

  const startMin = start.getHours() * 60 + start.getMinutes()
  const endMin = end.getHours() * 60 + end.getMinutes()
  const withinSlot = slots.some((slot) => {
    const from = timeToMinutes(slot.from)
    const to = timeToMinutes(slot.to)
    return startMin >= from && endMin <= to
  })

  if (!withinSlot) {
    return {
      valid: false,
      error: "L'orario selezionato non rientra nelle fasce di apertura configurate per questo giorno.",
    }
  }

  return { valid: true }
}

/** Costo riunione: costo orario × durata in ore (US.HM.2.3). */
export function calculateMeetingCost(hourlyCost: number, durationMinutes: number): number {
  const hours = Math.max(durationMinutes, 15) / 60
  return Math.round(hourlyCost * hours * 100) / 100
}
