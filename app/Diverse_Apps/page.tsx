// pages/InfoPage.tsx
import React from 'react';
import styles from './InfoPage.module.css'; // Importer CSS-modulet
import Header from '../components/header';
import Navbar from '../components/navbarStart';
import Footer from '../components/footer';
import Link from 'next/link';

const FAQ: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.heading}>
            Diverse beregningsprogrammer og Excelskabaloner
            </h2>
          <div className={styles.tekstBox}>
            <h3 style={{ color: 'black' }}>Beregningsprogrammer</h3>

            <Link href="../Diverse_Apps/EnhedsOmregner" className={styles.appTitle}>Enheds Omregner<span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Enhedsomregner til Areal, Temperatur, Længde, Hastighed, Rumfang, Flow, Tryk og Energi.
            </p>

            <h3 style={{ color: 'black' }}>Excelskabaloner (Under udvikling)</h3>
            <Link href="../" className={styles.appTitle}>----<span className={styles.appTitleVersion}>(-.-.-)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
           ----
            </p>



          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;