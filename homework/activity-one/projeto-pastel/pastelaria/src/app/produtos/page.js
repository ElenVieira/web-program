// src/app/produtos/page.js

import Link from "next/link";
import styles from "./produtos.module.css";

import pasteis from "./pasteis.json";

export default function Produtos() {
  return (
    <div className={styles.pageWrapper}>

      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.headerLogo}>Pastelaria do Chinês</div>

        <nav className={styles.headerNav}>
          <Link href="/">Home</Link>
          <span>|</span>
          <a href="/sobre">Sobre nós</a>
          <span>|</span>
          <a href="/lojas">Lojas</a>
        </nav>

        <div className={styles.headerButtons}>
          <button className={`${styles.btnPill} ${styles.btnDelivery}`}>
            DELIVERY
          </button>
          <button className={`${styles.btnPill} ${styles.btnProdutos}`}>
            PRODUTOS
          </button>
        </div>
      </header>

      {/* ── CONTEÚDO ── */}
      <main className={styles.main}>

        {/* Botão Carrinho */}
        <div className={styles.carrinhoWrapper}>
          <button className={styles.btnCarrinho}>
            CARRINHO 🛒
          </button>
        </div>

        {/* Grid de pastéis */}
        <div className={styles.grid}>
          {pasteis.map((pastel) => (
            <div key={pastel.id} className={styles.card}>

              {/* Imagem */}
              <div className={styles.cardImgWrapper}>
                <img
                  src={pastel.img}
                  alt={pastel.sabor}
                  className={styles.cardImg}
                />
              </div>

              {/* Nome do sabor */}
              <p className={styles.cardSabor}>{pastel.sabor}</p>

              {/* Botão preço */}
              <button className={styles.cardBtn}>
                {pastel.preco}
              </button>

            </div>
          ))}
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span className={styles.footerText}>Pastelaria do Chinês</span>
      </footer>

    </div>
  );
}