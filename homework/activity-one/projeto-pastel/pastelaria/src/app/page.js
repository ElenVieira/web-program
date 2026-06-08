import Link from "next/link";

// Lista com os sabores que aparecem na parte de baixo (Tail)
const SABORES = [
  "PIZZA",
  "CARNE",
  "QUEIJO",
  "FRANGO",
  "PERNIL",
  "CALABRESA",
  "BRÓCOLIS",
  "MARGUERITA",
];

// Componente da página inicial (home)
export default function HomePage() {
  return (
    <main className="page">
      {/* HEADER: barra de cima com logo, menu e botões */}
      <header className="header">
        {/* Logo com o nome da pastelaria */}
        <div className="header-logo">
          Pastelaria do Chinês
        </div>

        {/* Menu de navegação com os links do Figma */}
        <nav className="header-nav">
          <a href="#">Home</a>
          <span>|</span>
          <a href="#">Sobre nós</a>
          <span>|</span>
          <a href="#">Lojas</a>
        </nav>

        {/* Botões arredondados de DELIVERY e PRODUTOS */}
        <div className="header-buttons">
          <button className="btn-pill btn-delivery">DELIVERY</button>
          <Link href="/produtos">
            <button className="btn-pill btn-produtos">PRODUTOS</button>
          </Link>
        </div>
      </header>

      {/* HERO: área central com a imagem grande e o texto "PASTEL" */}
      <section className="hero">
        {/* Bloco que recebe a imagem de fundo via CSS */}
        <div className="hero-image" />

        {/* Bloco com o texto por cima da imagem */}
        <div className="hero-text">
          <h1 className="hero-title">PASTEL</h1>
          <p className="hero-subtitle">
            Deliciosamente recheados e com muito sabor, te convido a
            experimentar o melhor pastel de frango da cidade.
          </p>
        </div>
      </section>

      {/* TAIL: faixa de baixo com "Sabores" e os textos de desconto */}
      <section className="tail">
        {/* Esquerda: SABORES + CLÁSSICOS & ESPECIAIS */}
        <div className="tail-left">
          <p className="tail-label">SABORES</p>
          <p className="tail-label-small">CLÁSSICOS &amp; ESPECIAIS</p>
        </div>

        {/* Centro: 2 colunas verticais de sabores (como no Figma) */}
        <div className="tail-center">
          <div className="tail-col1">
            <span>PIZZA</span>
            <span>CARNE</span>
            <span>QUEIJO</span>
            <span>FRANGO</span>
          </div>

          <div className="tail-col2">
            <span>CALABRESA</span>
            <span>MARGUERITA</span>
            <span>BRÓCOLIS</span>
            <span>PERNIL</span>
          </div>
        </div>

        {/* Direita: desconto */}
        <div className="tail-right">
          <div className="tail-discount-block">
            <p className="tail-discount-big">20% DE DESCONTO EM TODO O SITE</p>
          </div>
        </div>
      </section>
    </main>
  );
}