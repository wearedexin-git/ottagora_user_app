import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/40 bg-white/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-lg font-bold tracking-widest text-transparent uppercase">
                OTTAGORA
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/events" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Eventi
            </Link>
            <Link href="/menus" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Menù
            </Link>
            <Link href="/courses" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Corsi
            </Link>
            <Link href="/workspace" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Workspace
            </Link>
            <Link href="/quote-request" className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
              Richiedi Preventivo
            </Link>
          </nav>

          {/* Clean minimal layout - buttons removed as they are present in the Bottom Bar */}
          <div className="w-10"></div>
        </div>
      </div>
    </header>
  );
}
