import "./globals.css";

export const metadata = {
  title: "A+ Generator",
  description: "Import JSON, generate HTML for Trust Office and GXTrust",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
