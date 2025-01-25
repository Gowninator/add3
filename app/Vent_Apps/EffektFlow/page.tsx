'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const Luftskifte: React.FC = () => {

  const [indblæsningTemp, setIndblæsningTemp] = useState<number | null>(null);
  const [maksTemp, setMaksTemp] = useState<number | null>(null);
  const [wattBelasting, setWattBelasting] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const indblæsningTempRef = useRef<HTMLInputElement>(null);
  const maksTempRef = useRef<HTMLInputElement>(null);
  const wattBelastingRef = useRef<HTMLInputElement>(null);

  const refs = [indblæsningTempRef, maksTempRef, wattBelastingRef];

  const handleCalculate = () => {
    if (indblæsningTemp && maksTemp && wattBelasting) {
      const deltaT = maksTemp - indblæsningTemp;
      const c_p = 1005; // specifik varmekapacitet af luft i J/(kg·K)
      const luftDensitet = 1.205; // kg/m³

      const Q = wattBelasting / (c_p * deltaT * luftDensitet); // m³/s
      setResult(Q * 3600); // omregning til m³/h
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
          <p>
          Formel: Q = V&middot;&rho;&middot;c<sub>p</sub>&middot;(T<sub>ind</sub> - T<sub>ud</sub>)
          </p>
          <p>
            De forudsætninger, der er gjort i beregningen af det nødvendige luftskifte, er som følger:
          </p>
          <ol>
            <li>Konstant luftens densitet ρ = 1,205 kg/m³.</li>
            <li>Konstant specifik varmekapacitet c<sub>p</sub> = 1005 J/(kg·°C). </li>
            <li>Ingen andre varmekilder eller -tab: Vi antager, at den eneste varmekilde i rummet er den givne Watt belastning, og at der ikke er andre varmekilder eller varmetab, som påvirker varmebalancen i rummet.</li>
            <li>Stationær tilstand: Beregningen er baseret på en stationær tilstand, hvor varmeproduktionen og varmetransporten er i ligevægt, og temperaturen i rummet derfor er stabil.</li>
          </ol>
        </div>
      )}

      <div className={styles.container}>
        <h2>Simpel køl</h2>
        <h4>Beregning af luftmængde ved køling, baseret på teorien om varmeoverførsel gennem massetransport. </h4>
        <div className={styles.inputGroup}>

          <div className={styles.inputField}>
            <label htmlFor="indblæsningTemp">Indblæsningstemperatur (°C): </label>
            <input
              id="indblæsningTemp"
              type="number"
              value={indblæsningTemp ?? ''}
              onChange={(e) => setIndblæsningTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 2)}
              ref={indblæsningTempRef}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="maksTemp">Maks temperatur (°C): </label>
            <input
              id="maksTemp"
              type="number"
              value={maksTemp ?? ''}
              onChange={(e) => setMaksTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 3)}
              ref={maksTempRef}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="wattBelasting">Watt Belastning (W): </label>
            <input
              id="wattBelasting"
              type="number"
              value={wattBelasting ?? ''}
              onChange={(e) => setWattBelasting(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 4)}
              ref={wattBelastingRef}
            />
          </div>
          <button onClick={handleCalculate} className={styles.calculateButton}>Beregn luftmængde</button>
          {result !== null && (
            <div className={styles.result}>
              <h2>Nødvendige luftmængde: {result.toFixed(2)} m³/h</h2>
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
