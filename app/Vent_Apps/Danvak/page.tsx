import React from 'react';
import Link from 'next/link';
import styles from './styles.module.css'; // Importer CSS-modulet
import Header from '../../components/header';
import Navbar from '../../components/navbarStart';
import Footer from '../../components/footer';

const Home: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Navbar />
      <div className={styles.navbar}>
        <Link href="/">
          <button className={styles.HKnap}>Startside</button>
        </Link>
      </div>
      <main className={styles.main}>
        <div className={styles.buttonGrid}>

          <Link href="../Vent_Apps/Danvak/side1" className={styles.gridItem}>
            <div className={styles.imageContainer}>
              <img src="/Bøjning.svg" alt="Image 1" className={styles.image} />
            </div>
            <p className={styles.linkText}>
              Tryktab i firkanter bøjning<br />
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/side2" className={styles.gridItem}>
            <div className={styles.imageContainer}>
              <img src="/Reduktion.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
              Reduktion
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/side3" className={styles.gridItem}>
            <div className={styles.imageContainer}>
              <img src="/Udvidelse.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
              Udvidelse
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/side4" className={styles.gridItem}>
            <div className={styles.imageContainer}>
              <img src="/AfgreningGennemløb.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            Afgrening - Gennemløb
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/" className={styles.gridItemU}>
            <div className={styles.imageContainer}>
              <img src="/Afgrening_45_90.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            Afgrening - α=45 & α=90
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/" className={styles.gridItemU}>
            <div className={styles.imageContainer}>
              <img src="/GennemløbTilløb.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            Gennemløb ved tilløb
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/" className={styles.gridItemU}>
            <div className={styles.imageContainer}>
              <img src="/Gennemløb_45_90.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            Tilløb - α=45 & α=90
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/" className={styles.gridItemU}>
            <div className={styles.imageContainer}>
              <img src="/T-fordeling.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            T-stykke fordeling
            </p>
          </Link>

          <Link href="../Vent_Apps/Danvak/" className={styles.gridItemU}>
            <div className={styles.imageContainer}>
              <img src="/T-sammenløb.svg" alt="under udvikling" className={styles.image} />
            </div>
            <p className={styles.linkText}>
            T-stykke sammenløb
            </p>
          </Link>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;