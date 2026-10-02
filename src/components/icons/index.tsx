import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  LogOut,
  MapPin,
  Settings,
  TrendingUp,
  Users,
  X,
  XCircle,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

/**
 * Punto unico di accesso alle icone dell'app: le pagine importano SEMPRE da qui,
 * mai direttamente da "lucide-react". Oggi ogni voce è un wrapper placeholder su
 * lucide-react; quando arrivano gli SVG del cliente, si sostituisce l'implementazione
 * di ogni singola icona qui dentro senza toccare nessuna pagina.
 */

const DEFAULT_SIZE = 20;
const DEFAULT_STROKE_WIDTH = 2;

function createIcon(LucideComponent: LucideIcon) {
  function Icon({
    size = DEFAULT_SIZE,
    strokeWidth = DEFAULT_STROKE_WIDTH,
    ...props
  }: LucideProps) {
    return <LucideComponent size={size} strokeWidth={strokeWidth} {...props} />;
  }
  Icon.displayName = `Icon(${LucideComponent.displayName ?? LucideComponent.name})`;
  return Icon;
}

// Iconset brand del cliente (piene, non outline): da usare SEMPRE per i concetti che
// coprono (dashboard, eventi/calendario, workspace, corsi, profilo) in tutta l'app.
// Le voci lucide sotto sono solo per concetti senza un'icona brand equivalente.
export {
  IconDashboard as IconNavDashboard,
  IconEvents as IconNavEvents,
  IconWorkspace as IconNavWorkspace,
  IconCourses as IconNavCourses,
  IconProfile as IconNavProfile,
} from "./brand";

export const IconArrowRight = createIcon(ArrowRight);
export const IconBookOpen = createIcon(BookOpen);
export const IconCheckCircle = createIcon(CheckCircle2);
export const IconClock = createIcon(Clock);
export const IconFileText = createIcon(FileText);
export const IconLogOut = createIcon(LogOut);
export const IconMapPin = createIcon(MapPin);
export const IconSettings = createIcon(Settings);
export const IconTrendingUp = createIcon(TrendingUp);
export const IconUsers = createIcon(Users);
export const IconX = createIcon(X);
export const IconXCircle = createIcon(XCircle);

export type { LucideProps as IconProps };
