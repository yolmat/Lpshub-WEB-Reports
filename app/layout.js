import Providers from "@/components/providers";
import "./globals.css";
import { AuthProvider } from "@/contexts/authContext";

export const metadata = {
  title: {
    default: "LpsHub | Central de Relatórios",
    template: "%s | LpsHub",
  },
  description:
    "Plataforma corporativa de relatórios integrada ao SAP Business One. Centralize, consulte e analise informações financeiras, contábeis e operacionais das unidades do Grupo Lopes.",
  applicationName: "LpsHub Reports",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
}


export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body className="min-h-full flex flex-col h-full antialiased">
        <AuthProvider >
          <Providers>
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
