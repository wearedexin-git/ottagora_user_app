import { loginAction } from "@/app/actions/auth-actions";

export default function LoginPage() {
  return (
    <div className="relative isolate flex-1 flex flex-col items-center justify-center py-16 px-4">
      {/* Background glow */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-200 to-orange-200 opacity-20 sm:w-[72.1875rem]"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-xl bg-white/50 border-zinc-200/40">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Accedi a Ottagora</h2>
            <p className="mt-2 text-xs text-zinc-500 font-medium">
              Inserisci la tua email per accedere all'area personale.
            </p>
          </div>

          <form action={loginAction} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Indirizzo Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="nome@esempio.com"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Password <span className="text-zinc-400 font-medium">(Fittizia in questa fase)</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-800 placeholder-zinc-400 text-sm focus:outline-none focus:border-amber-500 transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Accedi
            </button>
          </form>

          {/* Quick-fill accounts for demo */}
          <div className="mt-8 pt-6 border-t border-zinc-150 text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Account di test rapidi
            </p>
            <div className="flex flex-col gap-2">
              <form action={loginAction} className="inline-block">
                <input type="hidden" name="email" value="user@ottagora.com" />
                <button
                  type="submit"
                  className="w-full text-xs text-amber-700 hover:text-amber-800 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 py-2.5 px-3 rounded-xl transition-all font-semibold"
                >
                  Accedi come Utente Standard (Giuseppe Verdi)
                </button>
              </form>
              <form action={loginAction} className="inline-block">
                <input type="hidden" name="email" value="teacher@ottagora.com" />
                <button
                  type="submit"
                  className="w-full text-xs text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/50 py-2.5 px-3 rounded-xl transition-all font-semibold"
                >
                  Accedi come Docente (Chiara Rossi)
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
