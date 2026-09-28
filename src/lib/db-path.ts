import path from "path";

/** Risolve il path del DB SQLite da DATABASE_URL o fallback locale. */
export function resolveDbPath(): string {
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    const raw = url.replace(/^file:/, "");
    return path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
  }
  return path.join(process.cwd(), "dev.db");
}
