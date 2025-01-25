'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const Luftskifte: React.FC = () => {

  const [indblæsningTemp, setIndblæsningTemp] = useState<number | null>(null);
  const [GennemsnitHastighed, setGennemsnitHastighed] = useState<number | null>(null);
  const [TurbolensIntensitet, setTurbolensIntensitet] = useState<number | null>(null);



  const [result, setResult] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const indblæsningTempRef = useRef<HTMLInputElement>(null);
  const GennemsnitHastighedRef = useRef<HTMLInputElement>(null);
  const TurbolensIntensitetRef = useRef<HTMLInputElement>(null);

  const refs = [indblæsningTempRef, GennemsnitHastighedRef, TurbolensIntensitetRef];

  const handleCalculate = () => {
    if (indblæsningTemp && GennemsnitHastighed && TurbolensIntensitet) {

      const Q = ((34-indblæsningTemp)*Math.pow((GennemsnitHastighed-0.05), 0.62))*(0.37*GennemsnitHastighed*TurbolensIntensitet+3.14)
      setResult(Q ); // omregning til m³/h
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, refs: React.RefObject<HTMLInputElement>[], currentIndex: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % refs.length;
      refs[nextIndex].current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + refs.length) % refs.length;
      refs[prevIndex].current?.focus();
    }
  };

  const handleToggleAssumptions = () => {
    setShowAssumptions(!showAssumptions);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header />
    <main style={{ flex: 1, padding: '0.5%' }}>
      <div className={styles.navbar}>
        <Link href="/">
          <button className={styles.HKnap}>Startside</button>
        </Link>
        <button onClick={handleToggleAssumptions} className={styles.HKnap}>Forudsætninger</button>
      </div>

      {showAssumptions && (
        <div className={styles.teoriBox}>
          <h3>Forudsætninger</h3>
      
          Formel: DR =((34 - T<sub>air</sub>) * (V - 0.05)<sup>0.62</sup>) * (0.37 * V * T <sub>U</sub> + 3.14)
            <dd>
              <br />T <sub>air</sub> = Temperatur 
              <br /> V = Gennemsnithastighed 
              <br />T <sub>U</sub> = Turbolensintensitet
            </dd>
        </div>
      )}

      <div className={styles.container}>
        <h2>Trækrisikoen (Draft Rate)</h2>  
        <div className={styles.inputGroup}>

          <div className={styles.inputField}>
            <label htmlFor="indblæsningTemp">Indblæsningstemperatur [°C]: </label>
            <input
              id="indblæsningTemp"
              type="number"
              placeholder='fx. 21'
              value={indblæsningTemp ?? ''}
              onChange={(e) => setIndblæsningTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 0)}
              ref={indblæsningTempRef}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="GennemsnitHastighed">Gennemsnithastighed [m/s]: </label>
            <input
              id="GennemsnitHastighed"
              type="number"
              placeholder='fx. 0,2'
              value={GennemsnitHastighed ?? ''}
              onChange={(e) => setGennemsnitHastighed(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 1)}
              ref={GennemsnitHastighedRef}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="TurbolensIntensitet">TurbolensIntensitet [%]: </label>
            <input
              id="TurbolensIntensitet"
              type="number"
              placeholder='0-100%'
              value={TurbolensIntensitet ?? ''}
              onChange={(e) => setTurbolensIntensitet(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 2)}
              ref={TurbolensIntensitetRef}
            />
          </div>
          <button onClick={handleCalculate} className={styles.calculateButton}>Beregn</button>
          {result !== null && (
            <div className={styles.result}>
              <h2>Draft Rate: {result.toFixed(2)} %</h2>
            </div>
          )}
        </div>
      </div>
    
    </main>
    <Footer />
    </div>
  );
};

export default Luftskifte;
