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
          <h2 className={styles.heading}>Formål</h2>
          <div className={styles.tekst}>
              <p>
                Er at levere en serie brugervenlige beregningsprogrammer, designet til at lette din dagligdag og optimere dine projekter. Selvom mange større virksomheder inden for dette område anvender deres egne Excel-ark til omfattende og detaljerede beregninger, er der et identificeret behov for værktøjer, der hurtigt kan levere præcise overslagsberegninger baseret på fagbøger, Dansk Standard, SBI-anvisninger og traditionelle tommelfingerregler.
              </p>
              <p>
              Platformen er skabt som et vidensdelingsværktøj inden for ventilations- og VVS-branchen. Den henvender sig til ingeniører, installatører, teknikere og studerende, som arbejder med beregning og dimensionering af spiralfalsede ventilationsrør og -kanaler, VVS-installationer og -anlæg. Det er vigtigt at bemærke, at beregningsresultaterne altid bør underkastes en ingeniørmæssig vurdering.
              </p>
              <p>
                Inden brug af beregningsværktøjerne henvises brugeren til at gennemlæse betingelser og vilkår, herunder ansvarsfraskrivelsen.
              </p>
          
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;