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
            Ventilations beregningsprogrammer
            </h2>
          <div className={styles.tekstBox}>

            <Link href="../Vent_Apps/EffektFlow" className={styles.appTitle}>Effekt&rarr;Flow (Simpel køl) <span className={styles.appTitleVersion}> (1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af luftmængde med køling, baseret på teorien om varmeoverførsel gennem massetransport.
            Denne app beregner den nødvendige luftmængde ved køling baseret på varmeoverførsel. Beregningerne forudsætter, lineær varmebalance, konstant temperaturforskel, og ingen andre varmekilder. Luften antages at blande sig jævnt og hurtigt, og beregningen baseres på en stabil tilstand. 
            </p>

            <Link href="../Vent_Apps/Co2Koncentration" className={styles.appTitle}>CO2-koncentration <span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregn CO2-niveauet i et lokale efter 1 timesbelasting, ved hjælp af beregningsmetoden i DS 447:2021, Anneks D, som omfatter dynamisk beregning af koncentrationer af forureninger. Indtast lokalets dimensioner, antal personer, aktivitetsniveauet og luftskifte. 
            </p>

            <Link href="../Vent_Apps/Vent_Dimensionering_Ark" className={styles.appTitle}>Rør-/kanal dimensionering ark <span className={styles.appTitleVersion}>(1.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Dimensionering af ventilationsrør og kanaler: Baseret på en specificeret luftmængde beregner programmet automatisk den optimale rørstørrelse ud fra enten den ønskede maksimale lufthastighed (m/s) eller tryktab pr. meter (Pa/m). Programmet viser desuden den faktiske lufthastighed (m/s), tryktabet (Pa/m) samt den ækvivalente diameter, når man indtaster luftmængden og dimensionerne for en rektangulær kanal.
            </p>
            <Link href="../Vent_Apps/Danvak" className={styles.appTitle}>Tryktabsfaktorer for kanalfittings <span className={styles.appTitleVersion}>(2.0.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregn tryktabet i udvalgte kanalfittingsbaseret på Danvak-tabellen. Beregningerne er udført med udgangspunkt i tabelværdierne fra Danvak Appendiks A.08.07: Tryktabsfaktorer for kanalfittings.
            </p>

            <Link href="../Vent_Apps/Vent_Drejeskive" className={styles.appTitle}>Rør-/kanal dimensionering (Drejeskive) <span className={styles.appTitleVersion}>(1.1.0)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Dimensionering af ventilationsrør og kanaler: Hvor to af følgende er kendt <br />[Diameter, Højde x Bredde, luftmængde, lufthastighed, tryktab pr. meter], der efter beregner programmet automatisk de andre værdier.
            <p></p>Programmet fungerer som et alternativ til den nedlukkede Ølands Drejeskive.
            </p>

            <Link href="../Vent_Apps/DraftRate" className={styles.appTitle}>Trækrisikoen (Draft Rate) <span className={styles.appTitleVersion}>(BETA)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Beregning af trækrisikoen. Indtast lufttemperatur, lufthastighed og turbulensintensitet for at beregne trækrisikoen (Draft Rate). 
            </p>

            <Link href="../Vent_Apps/Varmefladeeffekt" className={styles.appTitle}>Varmeflade effekt <span className={styles.appTitleVersion}>(BETA)</span>
            </Link>
            <p className={styles.appBeskrivelse}>
            Overslagsberegning af nødvendig varmefladeeffekt i ventilationsanlæg, baseret på temperaturforhold, luftmængde, varmetab og varmevekslerens temperaturvirkningsgrad (η).
            </p>

          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;