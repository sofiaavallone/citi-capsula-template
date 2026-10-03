import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Cápsula do tempo",
  description: "Cartas para o seu eu do futuro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
