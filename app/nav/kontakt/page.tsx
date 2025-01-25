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
          <h2 className={styles.heading}>Kontakt</h2>
          <div className={styles.question}>
            <p className={styles.answer}>
            Kontakt os gerne via nedenstående email ved fund af fejl på hjemmesiden, forslag til nye beregningsmodeller eller andre henvendelser. <br /> <br />
            Email: hvactoolsdk@gmail.com <br /> <br />
            </p>
          </div>
        </div>
      </main> 
      <Footer />
    </div>
  );
};

export default FAQ;