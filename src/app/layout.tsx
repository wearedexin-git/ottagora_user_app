import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Ottagora - Hub Multidisciplinare",
  description: "Area utente di Ottagora: prenota tavoli, aule meeting, candidati ai corsi e altro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="relative isolate min-h-full flex flex-col text-foreground pb-28">
        {/* Sfumatura arancio decorativa in cima a ogni pagina (dietro header e contenuto). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-primary opacity-15 sm:w-[72.1875rem]" />
        </div>
        <Header />
        <div className="page-shell flex-1 flex flex-col min-w-0">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
