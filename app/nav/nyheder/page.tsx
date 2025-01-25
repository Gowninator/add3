// pages/InfoPage.tsx
import React from 'react';
import styles from './InfoPage.module.css'; // Importer CSS-modulet
import Header from '../../components/header';
import Navbar from '../../components/navbarStart';
import Footer from '../../components/footer';
const FAQ: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h2 className={styles.heading}>Nyheder</h2>
          <div className={styles.question}>

          <h4 className={styles.questionTitle}>2025-01</h4>
            <p className={styles.answer}>
            - Små layout ændringer <br />
            - 'DS 439:2024 Vandstrømme q<sub>f</sub> & q<sub>d</sub>' tilføjet <br />
            - 'Draft Rate' tilføjet <br />
            - 'Tryktabsfaktorer for kanalfittings' erstatter 'Tryktab i firkanter bøjning' <br />
            - 'Rør dimensionering [l/h]' hedder nu [flow], og har fået opdateret: tilføjelse funktion af enhedsskift <br />
            - 'Varmeflade effekt' tilføjet <br />
            </p>

          <h4 className={styles.questionTitle}>2024-12</h4>
            <p className={styles.answer}>
            - Små layout ændringer <br />
            - 'Rør dimensionering [kW] & [l/h]' har fået opdatet: Rørserier, Forudsætninger, tilføjelse nye funktioner<br />
            - 'Enheds Omregner' opdatet decimalhåndtering<br />
            - 'Rør-/kanal dimensionering(Drejeskive)' tilføjet, <br />
            - 'Kv-værdi for reguleringsventiler' tilføjet, <br />
            </p>

          <h4 className={styles.questionTitle}>2024-11</h4>
            <p className={styles.answer}>
            - Små layout ændringer <br />
            -'DS 439:2009 Dimensionsgivende vandstrøm q<sub>d</sub>' Tilføjet<br />
            -'CO<sub>2</sub>-koncentration' opdater med Forudsætninger og udvidet tidshorisont<br />
            </p>

          <h4 className={styles.questionTitle}>2024-10</h4>
            <p className={styles.answer}>
            - Generelt layout ændringer  <br />
            -'Tryktab i firkanter bøjning' Tilføjet<br />
            -'Rør dimensionering [kW]' Tilføjet<br />
            -'Rør dimensionering [l/h]' Tilføjet<br />
            -'Enheds Omregner' Tilføjet<br />
            - Inputfelterne er gjort mere mobilvenlige <br />
            - Ny og mere præcis Effekt--&gt;Flow beregner er tilføjet 'Effekt--&gt;Flow (metode 1)'  <br />
            - Ændring i layout i 'CO2-Koncentration'  <br />
            - Fanablad Excel skabeloner er ændret til 'Diverse' <br />
            </p>


          <h4 className={styles.questionTitle}>2024-09</h4>
            <p className={styles.answer}>
            - Ændring i 'simpel køl', ikke nødvendig med rum volumen <br />
            - 'Effekt--&gt;Flow' beregner tilføjet  <br />
            - Faneblad til Excel skabeloner tilføjet <br />
            - Forudsætninger tilføjet i 'ventilations rør-/kanal dimensionering Ark'  <br />
            - Mulighed for at ændre tidshorisont i 'CO2-Koncentration'  <br />
            - 'DS 439:2009 Forudsatte vandstrømme' beregner tilføjet  <br />
            </p>


            <h4 className={styles.questionTitle}>2024-08</h4>
            <p className={styles.answer}>
            - Nyhedes oversigt tilføjet <br />
            - Navigationsbar tilføjet <br />
            - Kontakt oplysninger tilføjet <br />
            - Ventilations og VVS faneblade tilføjet <br />
            </p>
          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;