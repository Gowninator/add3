'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const Luftskifte: React.FC = () => {

  const [indblæsningTemp, setIndblæsningTemp] = useState<number | null>(null);
  const [udsugningTemp, setUdsugningTemp] = useState<number | null>(null);
  const [luftmængde, setLuftmængde] = useState<number | null>(null);
  const [indtagsTemp, setindtagsTemp] = useState<number | null>(null);
  const [afkastTemp, setAfkastTemp] = useState<number | null>(null);
  const [Temperturvirkningsgrad, setTemperturvirkningsgrad] = useState<number | null>(null);
  const [wattBelasting, setWattBelasting] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);
  const [result3, setResult3] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const indblæsningTempRef = useRef<HTMLInputElement>(null);
  const udsugningTempRef = useRef<HTMLInputElement>(null);
  const maksTempRef = useRef<HTMLInputElement>(null);
  const wattBelastingRef = useRef<HTMLInputElement>(null);
  const luftmængdeRef = useRef<HTMLInputElement>(null);
  const TemperturvirkningsgradRef = useRef<HTMLInputElement>(null);
  const indtagsTempRef = useRef<HTMLInputElement>(null);


  const refs = [
    luftmængdeRef,
    TemperturvirkningsgradRef, 
    indtagsTempRef,
    indblæsningTempRef,
    udsugningTempRef,
    maksTempRef,
    wattBelastingRef
  ];
  const handleCalculate = () => {
    if (indblæsningTemp !== null && udsugningTemp !== null && wattBelasting !== null) {
      
      // Calculate t2 using the formula: t2 = ηt·(t3 - t1) + t1
      const t2 = Temperturvirkningsgrad!/100 * (udsugningTemp - indtagsTemp!)+indtagsTemp! ;
      // Calculate t4 using the formula: t4 = t3 - ηt·t3
      const t4 = udsugningTemp - (Temperturvirkningsgrad!/100 * udsugningTemp);

      // Calculate heating power E using the formula: E = qv·cp·(t5 + (Φdim/(cp * qv)) - t2)
      const cp = 1005; // specific heat capacity of air [J/(kg·K)]
      const cd = 1.205; // air density [kg/m³]
      const qv = luftmængde! / 3600; // convert m³/h to m³/s

      const E = qv * (cd * cp) * (indblæsningTemp + (wattBelasting / ((cd * cp) * qv)) - t2)/1000;
      
      setResult(E); // omregning til m³/h
      setResult2(t2);
      setResult3(t4);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, refs: React.RefObject<HTMLInputElement>[], currentIndex: number) => {
    if (currentIndex < 0 || currentIndex >= refs.length) return;
  
    const findNextFocusableRef = (startIndex: number, direction: 'up' | 'down'): number => {
      const step = direction === 'down' ? 1 : -1;
      let nextIndex = startIndex;
      
      // Try to find next focusable input within one full cycle
      for (let i = 0; i < refs.length; i++) {
        nextIndex = (nextIndex + step + refs.length) % refs.length;
        const ref = refs[nextIndex].current;
        if (ref && !ref.disabled && ref.offsetParent !== null) {
          return nextIndex;
        }
      }
      return startIndex;
    };
  
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = findNextFocusableRef(currentIndex, 'down');
      refs[nextIndex].current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = findNextFocusableRef(currentIndex, 'up');
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
          
            <li>Konstant luftens densitet ρ = 1,205 kg/m³.</li>
            <li>Konstant specifik varmekapacitet c<sub>p</sub> = 1005 J/(kg·°C). </li>
            
            <li>Stationær tilstand: Beregningen er baseret på en stationær tilstand, hvor varmeproduktionen og varmetransporten er i ligevægt, og temperaturen i rummet derfor er stabil.</li>
        </div>
      )}

      <div className={styles.container}>
        <h2>Overslags beregning af nødvendig Varmeflade effekt</h2>
        <div className={styles.inputGroup}>

          <div className={styles.inputField}>
            <label htmlFor="luftmængde">Dimensionerende luftskifte [m³/h]: </label>
            <input
              id="luftmængde"
              type="number"
              value={luftmængde ?? ''}
              onChange={(e) => setLuftmængde(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 0)}
              ref={luftmængdeRef}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor='Temperturvirkningsgrad'>Veksler temperturvirkningsgrad: [%] </label>
            <input
              id='Temperturvirkningsgrad'
              type='number'
              placeholder='fx. 80%'
              value={Temperturvirkningsgrad ?? ''}
              onChange={(e) => setTemperturvirkningsgrad(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 1)}
              ref={TemperturvirkningsgradRef}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor='indtagsTemp'>Udeluftens temperatur før veksleren [˚C] : </label>
            <input
              id='indtagsTemp'
              type='number'
              placeholder='fx. -12°C'
              value={indtagsTemp ?? ''}
              onChange={(e) => setindtagsTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 2)}
              ref={indtagsTempRef}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="indblæsningTemp">Indblæsningstemperatur [°C]: </label>
            <input
              id="indblæsningTemp"
              type="number"
              placeholder='fx. 18°C'
              value={indblæsningTemp ?? ''}
              onChange={(e) => setIndblæsningTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 3)}
              ref={indblæsningTempRef}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor='udsugningTemp'>Udsugningstemperatur før veksler [°C]: </label>
            <input
              id='udsugningTemp'
              type='number'
              placeholder='fx. 22°C'
              value={udsugningTemp ?? ''}
              onChange={(e) => setUdsugningTemp(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 4)}
              ref={udsugningTempRef}
            />
          </div>

          <div className={styles.inputField}>
            <label htmlFor="wattBelasting">Dimensionerende varmetab [W]: </label>
            <input
              id="wattBelasting"
              type="number"
              value={wattBelasting ?? ''}
              onChange={(e) => setWattBelasting(parseFloat(e.target.value))}
              onKeyDown={(e) => handleKeyDown(e, refs, 5)}
              ref={wattBelastingRef}
            />
          </div>
    
          <button onClick={handleCalculate} className={styles.calculateButton}>Beregn</button>
          {result !== null && (
            <div className={styles.result}>
              <h2>Nødvendig effekt på varmefladen: {result.toFixed(2)} kW</h2>
              <h4>Udeluftens temperatur efter veksleren {result2?.toFixed(2)}°C</h4>
              <h4>Afkastningsluftens temperatur efter veksleren : {result3?.toFixed(2)}°C</h4>
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
