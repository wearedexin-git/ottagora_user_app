import { Button, Card, Badge, Alert } from "@/components/ui";
import {
  IconArrowRight,
  IconAward,
  IconBookOpen,
  IconBriefcase,
  IconCalendar,
  IconCheckCircle,
  IconClock,
  IconFileText,
  IconHome,
  IconLogOut,
  IconMapPin,
  IconSettings,
  IconTrendingUp,
  IconUser,
  IconUsers,
  IconXCircle,
  IconNavDashboard,
  IconNavEvents,
  IconNavWorkspace,
  IconNavCourses,
  IconNavProfile,
} from "@/components/icons";
import { DiagonalPattern, ChevronPattern } from "@/components/patterns";

const navIcons = [
  { name: "Dashboard", Icon: IconNavDashboard },
  { name: "Eventi", Icon: IconNavEvents },
  { name: "Workspace", Icon: IconNavWorkspace },
  { name: "Corsi", Icon: IconNavCourses },
  { name: "Profilo", Icon: IconNavProfile },
];

export const metadata = {
  title: "Design System — Ottagora (interno)",
};

const icons = [
  { name: "ArrowRight", Icon: IconArrowRight },
  { name: "Award", Icon: IconAward },
  { name: "BookOpen", Icon: IconBookOpen },
  { name: "Briefcase", Icon: IconBriefcase },
  { name: "Calendar", Icon: IconCalendar },
  { name: "CheckCircle", Icon: IconCheckCircle },
  { name: "Clock", Icon: IconClock },
  { name: "FileText", Icon: IconFileText },
  { name: "Home", Icon: IconHome },
  { name: "LogOut", Icon: IconLogOut },
  { name: "MapPin", Icon: IconMapPin },
  { name: "Settings", Icon: IconSettings },
  { name: "TrendingUp", Icon: IconTrendingUp },
  { name: "User", Icon: IconUser },
  { name: "Users", Icon: IconUsers },
  { name: "XCircle", Icon: IconXCircle },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</h2>
      {children}
    </section>
  );
}

function Swatch({ label, varName }: { label: string; varName: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-12 w-12 rounded-xl border border-zinc-200/60 shadow-sm shrink-0"
        style={{ background: `var(${varName})` }}
      />
      <div>
        <p className="text-xs font-bold text-zinc-800">{label}</p>
        <p className="text-[10px] text-zinc-400 font-mono">{varName}</p>
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <div>
        <span className="text-xs font-bold text-primary uppercase tracking-widest">
          Pagina interna — non linkata in nav
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">
          Design System Ottagora
        </h1>
        <p className="text-zinc-500 text-sm mt-1 max-w-2xl">
          I colori sono quelli definitivi del cliente. Font, logo e icone SVG sono ancora PLACEHOLDER
          in attesa degli asset. Quando arrivano, si aggiornano i token in{" "}
          <code className="text-xs bg-zinc-100 px-1.5 py-0.5 rounded">src/app/theme.css</code> e questa
          pagina (insieme a tutta l&apos;app) si aggiorna da sola.
        </p>
      </div>

      <Section title="Colori">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Swatch label="Primary (arancio)" varName="--primary" />
          <Swatch label="Ink (marrone)" varName="--ink" />
          <Swatch label="Accent (giallo)" varName="--accent" />
          <Swatch label="Success" varName="--success" />
          <Swatch label="Danger" varName="--danger" />
        </div>
      </Section>

      <Section title="Tipografia">
        <Card>
          <p className="font-heading text-3xl font-extrabold text-zinc-900">Titolo — font-heading</p>
          <p className="font-body text-sm text-zinc-600 mt-2">
            Testo di corpo — font-body. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </Card>
      </Section>

      <Section title="Icone brand (bottom nav)">
        <Card>
          <div className="grid grid-cols-5 gap-6">
            {navIcons.map(({ name, Icon }) => (
              <div key={name} className="flex flex-col items-center gap-2 text-center">
                <Icon size={28} className="text-primary" />
                <span className="text-[10px] text-zinc-500 font-semibold leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Icone (lucide, placeholder)">
        <Card>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
            {icons.map(({ name, Icon }) => (
              <div key={name} className="flex flex-col items-center gap-1.5 text-center">
                <Icon className="h-5 w-5 text-zinc-700" />
                <span className="text-[9px] text-zinc-400 font-medium leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Bottoni">
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="outline" href="/design-system">
              Come link <IconArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </Section>

      <Section title="Badge">
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="primary">In attesa</Badge>
            <Badge variant="success" dot>
              Confermata
            </Badge>
            <Badge variant="danger">
              <IconXCircle className="h-3 w-3" /> Rifiutata
            </Badge>
            <Badge variant="neutral">Standard</Badge>
          </div>
        </Card>
      </Section>

      <Section title="Alert">
        <div className="space-y-3">
          <Alert variant="danger">Errore: campo obbligatorio mancante.</Alert>
          <Alert variant="warning">Completa l&apos;anagrafica prima di prenotare.</Alert>
          <Alert variant="success">Prenotazione confermata con successo.</Alert>
        </div>
      </Section>

      <Section title="Card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm font-bold text-zinc-800">Card standard</p>
            <p className="text-xs text-zinc-500 mt-1">glass, non interattiva</p>
          </Card>
          <Card interactive>
            <p className="text-sm font-bold text-zinc-800">Card interattiva</p>
            <p className="text-xs text-zinc-500 mt-1">hover + cursore</p>
          </Card>
          <Card selected>
            <p className="text-sm font-bold text-zinc-800">Card selezionata</p>
            <p className="text-xs text-zinc-500 mt-1">ring primary</p>
          </Card>
        </div>
      </Section>

      <Section title="Pattern (da Pattern.pdf del cliente)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative h-48 rounded-2xl overflow-hidden border border-zinc-200/60 shadow-sm">
              <DiagonalPattern className="absolute inset-0 h-full w-full" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Diagonale — in uso su Login/Register (ink/primary)
            </p>
          </div>
          <div>
            <div className="relative h-48 rounded-2xl overflow-hidden border border-zinc-200/60 shadow-sm">
              <ChevronPattern className="absolute inset-0 h-full w-full" />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Chevron — non ancora applicato (accent/background)
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
