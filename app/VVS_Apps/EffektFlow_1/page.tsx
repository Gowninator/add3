'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const Luftskifte: React.FC = () => {
  const [I_Tf, setI_Tf] = useState<number | null>(null);
  const [I_Tr, setI_Tr] = useState<number | null>(null);
  const [wattBelasting, setWattBelasting] = useState<number | null>(null);
  const [resultM3h, setResultM3h] = useState<number | null>(null);
  const [resultLh, setResultLh] = useState<number | null>(null);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);


  const I_TfRef = useRef<HTMLInputElement>(null);
  const I_TrRef = useRef<HTMLInputElement>(null);
  const wattBelastingRef = useRef<HTMLInputElement>(null);

  const refs = [I_TfRef, I_TrRef, wattBelastingRef];

// Fra varmeståbi s.245 
  const con_DensitetF = I_Tf !== null ? 999.850+(0.246893*I_Tf)+(-0.065294)*Math.pow(I_Tf, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(I_Tf,3))+(-0.16524*Math.pow(I_Tf,0.5)) : null; //kg/m³
  const con_DensitetR = I_Tr !== null ? 999.850+(0.246893*I_Tr)+(-0.065294)*Math.pow(I_Tr, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(I_Tr,3))+(-0.16524*Math.pow(I_Tr,0.5)) : null; //kg/m³
  
  const con_SpecVarmF = I_Tf !== null ? 4.218103+(-0.0050041*I_Tf)+(0.000827196*Math.pow(I_Tf,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(I_Tf,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(I_Tf,3)) : null; //KJ/(kg·K)
  const con_SpecVarmR = I_Tr !== null ? 4.218103+(-0.0050041*I_Tr)+(0.000827196*Math.pow(I_Tr,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(I_Tr,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(I_Tr,3)) : null; //KJ/(kg·K)
  

  const handleCalculate = () => {
    if (I_Tf && I_Tr) {

      const Q = wattBelasting !== null && con_DensitetF !== null && con_SpecVarmF !== null && con_SpecVarmR !==null && con_DensitetR !== null ? // Sørge for at værdierne ikke er 0
      (wattBelasting / (con_DensitetF*con_SpecVarmF*I_Tf-con_DensitetR*con_SpecVarmR*I_Tr) ): null; // m³/s
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
              Formel: q<sub>v</sub> =  	&#x3A6;/(ρ<sub>f</sub>·c<sub>pf</sub>·T<sub>f</sub> - ρ<sub>r</sub>·c<sub>pr</sub>·T<sub>r</sub>)
            </p>
            q<sub>v</sub> = volumenstrømmen [m³/s] <br />
            &#x3A6; = effekten [kW] <br />
            ρ<sub>f</sub> = densitet, frem [kg/m³] <br />
            ρ<sub>r</sub> = densitet, retur [kg/m³] <br />
            c<sub>pf</sub> = specifik varmekapacitet, frem [J/(kg·K)] <br />
            c<sub>pr</sub> = specifik varmekapacitet, retur [J/(kg·K)] <br />
            T<sub>f</sub> = indgangstemperaturen [°C] <br />
            T<sub>r</sub> = udgangstemperaturen [°C] <br />
            <br />
            ρ & c<sub>p</sub> værdier, er for rent vand og er valgt ud fra et funktionsudtryk der er gælende i temperaturintervallet 0-100°C, der er relativ spredning på funktionstilnærmelsene på 0,002% og 0,003%
            <p></p>
            (Kapitel 9: Varme Ståbi 7. udgave)
          </div>
        )}

        <div className={styles.container}>
          <h2>Effekt&rarr;Flow</h2>
          <h4>Volumenstrøm på baggrund af afkølingseffekten, med kendte temperatur i fremløbs- & returtledningen </h4>

          <div className={styles.inputGroup}>
            <div className={styles.inputField}>
              <label htmlFor="I_Tf">Temp. frem (°C): </label>
              <input
                id="I_Tf"
                type="number"
                value={I_Tf ?? ''}
                onChange={(e) => setI_Tf(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, refs, 0)}
                ref={I_TfRef}
              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="I_Tr">Temp. retur (°C): </label>
              <input
                id="I_Tr"
                type="number"
                value={I_Tr ?? ''}
                onChange={(e) => setI_Tr(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, refs, 1)}
                ref={I_TrRef}
              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="wattBelasting">Watt Belastning (kW): </label>
              <input
                id="wattBelasting"
                type="number"
                value={wattBelasting ?? ''}
                onChange={(e) => setWattBelasting(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, refs, 2)}
                ref={wattBelastingRef}
              />
            </div>

            <button onClick={handleCalculate} className={styles.calculateButton}>Beregn</button>

            {resultM3h !== null && (
              <div className={styles.result}>
                <h2>{resultM3h?.toFixed(2)} m³/h</h2>
                <h2>{resultLh?.toFixed(0)} L/h</h2>
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
