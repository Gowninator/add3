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
          <h2 className={styles.heading}>Ofte Stillede Spørgsmål</h2>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Tilbydes der support til brug af beregningsværktøjerne?</h3>
            <p className={styles.answer}>Nej, der tilbydes ingen support til brug af beregningsprogrammerne.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Der er fejl på resultatet?</h3>
            <p className={styles.answer}>Hvis du finder en fejl i resultatet, bedes du kontakte mig hurtigst muligt, så vi kan få det rettet. Send venligst dine indtastede værdier, det opnåede resultat, det korrekte resultat samt et forslag til, hvor fejlen kan være. Sendes til hvactoolsdk@gmail.com</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Vil der blive indført brugerbetaling for brug af beregningsværktøjerne?</h3>
            <p className={styles.answer}>Nej, hjemmesiden vil altid være gratis. Hvis udgifterne til driften bliver for store, kan det dog blive nødvendigt at indføre reklamer, hvilket vil medføre irriterende cookie-meddelelser, medmindre det lykkes at finde sponsorer.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Kommer der flere beregningsværktøjer?</h3>
            <p className={styles.answer}>Ja, der er flere idéer til beregningsværktøjer under udvikling.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Kan jeg foreslå et nyt beregningsværktøj?</h3>
            <p className={styles.answer}>Ja, du er velkommen til at komme med forslag til nye programmer. Send gerne en grundig beskrivelse af programmet/emnet, eller et simpelt Excel-ark, så kan jeg konvertere det til en webapp.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Hvordan fungerer versionsnummer-systemet?</h3>
            <p className={styles.answer}>
              <strong>[Beregningsprogram Navn] X.Y.Z</strong><br />
              X: Øges med ét ved større ændringer.<br />
              Y: Øges med ét ved ændringer, der påvirker resultatet eller ved matematiske ændringer.<br />
              Z: Øges med ét ved kosmetiske ændringer som farver, skrifttyper, stavefejl m.m.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;