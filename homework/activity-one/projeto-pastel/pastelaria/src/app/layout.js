// Importa o arquivo de estilos globais para todo o app
import "./globals.css";

// Objeto com metadados da aplicação (título e descrição da aba do navegador)
export const metadata = {
  title: "Pastelaria do Chinês",
  description: "Os melhores pastéis da cidade",
};

// Componente de layout raiz que envolve todas as páginas
export default function RootLayout({ children }) {
  // Retorna a estrutura básica de HTML
  return (
    <html lang="pt-BR">
      {/* body é onde o React/Next vai renderizar as páginas */}
      <body className="site-root">
        {/* children é o conteúdo específico de cada página (por exemplo, app/page.js) */}
        {children}
      </body>
    </html>
  );
}