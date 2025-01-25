'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const Luftskifte: React.FC = () => {
  const [deltaT, setDeltaT] = useState<number | null>(null);
  const [wattBelasting, setWattBelasting] = useState<number | null>(null);
  const [resultM3h, setResultM3h] = useState<number | null>(null);
  const [resultLh, setResultLh] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const deltaTRef = useRef<HTMLInputElement>(null);
  const wattBelastingRef = useRef<HTMLInputElement>(null);
  const flowRef = useRef<HTMLInputElement>(null);

  const refs = [deltaTRef, wattBelastingRef, flowRef];

// Fra varmeståbi s.245 

const densitet= deltaT !== null ? 999.850+(0.246893*deltaT)+(-0.065294)*Math.pow(deltaT, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(deltaT,3))+(-0.16524*Math.pow(deltaT,0.5)): null; //kg/m³
const c_p = deltaT !== null ? 4.218103+(-0.0050041*deltaT)+(0.000827196*Math.pow(deltaT,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(deltaT,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(deltaT,3)) : null; //KJ/(kg·K)



  const handleCalculate = () => {
    if (deltaT) {
      
      const Q = wattBelasting !== null && c_p !== null && densitet !== null ? wattBelasting / (c_p * deltaT * densitet) : null; // m³/s
      if (Q !== null) {
        setResultM3h(Q*3600); // Omregning til m³/h
        setResultLh(Q*3600*1000); // Omregning til L/h
      }
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleCalculate();
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
              Formel: q<sub>v</sub> =  	&#x3A6;/(ρ·c<sub>p</sub>·(T<sub>ind</sub> - T<sub>ud</sub>))
            </p>
            q<sub>v</sub> = volumenstrømmen [m³/s] <br />
            &#x3A6; = effekten [W] <br />
            ρ = densitet [kg/m³] <br />
            c<sub>p</sub> = specifik varmekapacitet [J/(kg·K)] <br />
            T<sub>ind</sub> = indgangstemperaturen [°C] <br />
            T<sub>ud</sub> = udgangstemperaturen [°C] <br />
            Densitet og specifik varmekapacitet er valgt ud vandets &#x394;T <br />
            <p></p>
            ρ & c<sub>p</sub> værdier, er for rent vand og er valgt ud fra et funktionsudtryk der er gælende i temperaturintervallet 0-100°C, der er relativ spredning på funktionstilnærmelsene på 0,002% og 0,003%
            <p></p>
            (Kapitel 9: Varme Ståbi 7. udgave)
          </div>
        )}

        <div className={styles.container}>
          <h2>Effekt&rarr;Flow</h2>
          <h4>Volumenstrøm på baggrund af afkølingseffekten. </h4>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label htmlFor="deltaT">Temp. forskel (°C): </label>
              <input
                id="deltaT"
                type="number"
                value={deltaT ?? ''}
                onChange={(e) => setDeltaT(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, refs, 0)}
                ref={deltaTRef}
              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="wattBelasting">Watt Belastning (kW): </label>
              <input
                id="wattBelasting"
                type="number"
                value={wattBelasting ?? ''}
                onChange={(e) => setWattBelasting(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, refs, 1)}
                ref={wattBelastingRef}
              />
            </div>

            <button onClick={handleCalculate} className={styles.calculateButton}>Beregn</button>

            {resultM3h !== null && (
              <div className={styles.result}>
                <h2>{resultM3h?.toFixed(2)} m³/h</h2>
                <h2>{resultLh?.toFixed(2)} L/h</h2>
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
