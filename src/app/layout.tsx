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
      <body className="min-h-full flex flex-col text-foreground pb-28">
        <Header />
        <div className="page-shell flex-1 flex flex-col min-w-0">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
