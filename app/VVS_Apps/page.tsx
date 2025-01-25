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
            VVS beregningsprogrammer
            </h2>
          <div className={styles.tekstBox}>

            <Link href="../VVS_Apps/EffektFlow_1" className={styles.appTitle}>Effekt&rarr;Flow (metode 1)<span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af volumenstrøm på baggrund af en given effekt, baseret på teorien om varmeoverførsel gennem massetransport, med kendte temperatur i fremløbs- & returtledningen.
            </p>

            <Link href="../VVS_Apps/EffektFlow_2" className={styles.appTitle}>Effekt&rarr;Flow (metode 2)<span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af volumenstrøm på baggrund af en given effekt, baseret på teorien om varmeoverførsel gennem massetransport, med kendt temperatur forskel.
            (Denne metode afviger med cirka -2,3 % fra metode 1 ved temperaturindstillingen 60/30, og med -1,8 % ved 55/25.)
            
            </p>

            <Link href="../VVS_Apps/DS439_2009_Vandstroemme" className={styles.appTitle}>DS 439:2009 Vandstrømme q<sub>f</sub> & q<sub>d</sub> <span className={styles.appTitleVersion}>(1.0.1)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af forudsatte & dimensionsgivende vandstrømme baseret på antallet af brugsvandsinstallationer i henhold til DS 439:2009, afsnit 2.3.3.
            </p>

            <Link href="../VVS_Apps/DS439_2024_Vandstroemme" className={styles.appTitle}>DS 439:2024 Vandstrømme q<sub>f</sub> & q<sub>d</sub> <span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af forudsatte & dimensionsgivende vandstrømme baseret på antallet af brugsvandsinstallationer i henhold til DS 439:2009, afsnit 6.3.4.
            </p>

            <Link href="../VVS_Apps/Pipe_Dim_Flow" className={styles.appTitle}>Rør dimensionering [flow] <span className={styles.appTitleVersion}>(2.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Dimensionering af VVS-rør: 
            Baseret på en given vandmængde/Volumenstrøm finder beregningsprogrammet automatisk den passende rørstørrelse ud fra den ønskede maksimale strømningshastighed (m/s) eller tryktab pr. meter (Pa/m).  <br />
            </p>

            <Link href="../VVS_Apps/Pipe_Dim_Effekt" className={styles.appTitle}>Rør dimensionering [kW] <span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Dimensionering af VVS-rør: Baseret på en given effekt beregner programmet automatisk den optimale rørstørrelse ud fra den ønskede maksimale strømningshastighed (m/s) eller tryktab pr. meter (Pa/m). Dette anvendes blandt andet til dimensionering af varmerør til radiatorer.  <br />
            </p>          

            <Link href="../VVS_Apps/side7" className={styles.appTitle}>Kv-værdi for reguleringsventiler <span className={styles.appTitleVersion}>(BETA)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af Kv-værdi for reguleringsventiler baseret på en given volumenstrøm og tryktab.
            </p>

          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;