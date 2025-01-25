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
          <h2 className={styles.heading}>Betingelser og vilkår</h2>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Ansvarsfraskrivelse</h3>
            <p className={styles.answer}>De online beregningsprogrammer tilgængelige på HVAC-tools.dk tilbydes som gratis værktøjer til vejledning og støtte. Ved brug af disse programmer accepterer brugeren, at de kan indeholde fejl eller mangler. HVAC-tools.dk påtager sig ikke ansvar for eventuelle tab, skader eller fejl, der måtte opstå som følge af anvendelsen af programmerne. Det er vigtigt at bemærke, at beregningsresultaterne altid bør underkastes en ingeniørmæssig vurdering for at sikre korrekt anvendelse.</p>
            <p className={styles.answer}>HVAC-tools.dk fraskriver sig ethvert ansvar for nøjagtigheden af beregningsresultaterne og oplysningerne samt for enhver utilsigtet virkning af deres anvendelse. Denne ansvarsfraskrivelse gælder uanset om brugeren har modtaget skriftlige eller mundtlige instruktioner fra HVAC-tools.dk eller tredjepart.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Rigtighed og opdatering</h3>
            <p className={styles.answer}>HVAC-tools.dk bestræber sig på at sikre, at alle beregningsprogrammer, formler og oplysninger er nøjagtige og opdaterede. Dog kan der opstå fejl som følge af forskelle i brugerens browser eller softwareversioner. HVAC-tools.dk forbeholder sig retten til at ændre beregningsprogrammer og informationer uden forudgående varsel.</p>
          </div>
          <div className={styles.question}>
            <h3 className={styles.questionTitle}>Virus og skadelige programmer</h3>
            <p className={styles.answer}>HVAC-tools.dk fraskriver sig ethvert ansvar for skader forårsaget af virus eller andre skadelige programmer, som måtte ramme brugerens computerudstyr som følge af browsing, download eller andre aktiviteter relateret til brugen af hjemmesiden.</p>
          </div>

        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;