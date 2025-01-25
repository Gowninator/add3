'use client';

import React, { useState } from 'react';
import styles from './co2-kon.module.css';
import Link from 'next/link';
import Header from '../../components/header';
import Footer from '../../components/footer';

const Luftskifte: React.FC = () => {
  //1418151919
  // Input konstanter------------------------------------------------------
  const [I_Personer, setI_Personer] = useState<number | null>(null);
  const [I_MET, setI_MET] = useState<number | null>(null);
  const [I_StartPPM, setI_StartPPM] = useState<number | null>(400); // Startværdi 400 ppm
  const [I_Areal, setI_Areal] = useState<number | null>(null);
  const [I_Rumhøjde, setI_Rumhøjde] = useState<number | null>(null);
  const [I_Luftmængde, setI_Luftmængde] = useState<number | null>(null);
  const [I_LuftmængdeEnhed, setI_LuftmængdeEnhed] = useState<string>('m3/h'); // Ny state til enhed
  const [I_Tid, setI_Tid] = useState<number | null>(1); // Startværdi 1 time
  const [I_Tid_2, setI_Tid_2] = useState<number | null>(null); // Startværdi 2 time
  const [I_Tid_3, setI_Tid_3] = useState<number | null>(null); // Startværdi 3 time

  // Resultat------------------------------------------------------
  const [result, setResult] = useState<number | null>(null);
  const [R_co2_1, setR_co2_1] = useState<number | null>(null);
  const [R_co2_2, setR_co2_2] = useState<number | null>(null);
  const [R_co2_3, setR_co2_3] = useState<number | null>(null);

  // Piltaster------------------------------------------------------
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    const inputs = document.querySelectorAll<HTMLInputElement>(`.${styles['input-field']} input`);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % inputs.length;
      inputs[nextIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + inputs.length) % inputs.length;
      inputs[prevIndex].focus();
    }
  };

  // Beregninger------------------------------------------------------
  const handleCalculate = () => {
    if (I_Tid && I_Areal && I_MET && I_StartPPM && I_Personer && I_Rumhøjde && I_Luftmængde) {
      //1418151919
      // Konverter I_Luftmængde til m³/h baseret på den valgte enhed
            let M_luftmaengde = I_Luftmængde;
      switch (I_LuftmængdeEnhed) {
        case 'm3/s':
          M_luftmaengde = I_Luftmængde * 3600;
          break;
        case 'l/s':
          M_luftmaengde = I_Luftmængde * 3.6;
          break;
        case 'l/min':
          M_luftmaengde = I_Luftmængde * 0.06;
          break;
        case 'cfm':
          M_luftmaengde = I_Luftmængde * 1.699;
          break;
        case 'l/s.m2':
          M_luftmaengde = I_Luftmængde *3.6 * I_Areal;
          break;
        case 'h-1':
          M_luftmaengde = I_Luftmængde * I_Areal * I_Rumhøjde
          break;
        default:
          break;
      }

      const M_Co2 = (17 * I_MET / 1000); // [m3/h pr. per]
      const M_Volumen = (I_Areal * I_Rumhøjde);
      const M_LuftSkift = (M_luftmaengde / M_Volumen);
      
      const C_co2 = 400;
      
      const I_Tid_2 = I_Tid+1;
      const I_Tid_3 = I_Tid+2;

      const R_co2_1 = (
        (M_Co2 * I_Personer / (M_LuftSkift * M_Volumen) * (1 - (Math.exp(-M_LuftSkift * I_Tid))) + (I_StartPPM / 1000000 - C_co2 / 1000000) *
          Math.exp(-M_LuftSkift * I_Tid)) * 1000000 + C_co2
      );
  
      const R_co2_2 = (
        (M_Co2 * I_Personer / (M_LuftSkift * M_Volumen) * (1 - (Math.exp(-M_LuftSkift * I_Tid_2))) + (I_StartPPM / 1000000 - C_co2 / 1000000) *
          Math.exp(-M_LuftSkift * I_Tid_2)) * 1000000 + C_co2
      );
      const R_co2_3 = (
        (M_Co2 * I_Personer / (M_LuftSkift * M_Volumen) * (1 - (Math.exp(-M_LuftSkift * I_Tid_3))) + (I_StartPPM / 1000000 - C_co2 / 1000000) *
          Math.exp(-M_LuftSkift * I_Tid_3)) * 1000000 + C_co2
      );

      setResult(R_co2_1);
      setR_co2_1(R_co2_1);
      setR_co2_2(R_co2_2);
      setR_co2_3(R_co2_3);
      setI_Tid(I_Tid);
      setI_Tid_2(I_Tid_2);
      setI_Tid_3(I_Tid_3);
    }
  };

  // toggle assumptions------------------------------------------------------
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
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
            Jf. BR18 kan begyndelseskoncentrationen af CO2 i rummet sættes til 400 ppm. <br />
            Aktivitetsniveau på ~1,2 met giver CO<sub>2</sub>-produktion mCO<sub>2</sub> = 20,4 l/h pr. person
            <p></p>
            Formel: <br />
            C<sub>rum</sub> = m·(1 - e^(-n·t))/(n·V) + (C<sub>0</sub> - C<sub>i</sub>)·e^(-n·t) + C<sub>i</sub> <br/><br/>
            Hvor:<br/>

            C<sub>rum</sub> = er koncentrationen af en forurening i rummet[m³/m³ Luft] <br/>
            m = er tilførsel af forurening [m³/h]<br/>
            n = Luftskifte [h⁻¹]<br/>
            V = Rumvolumen [m³]<br/>
            C<sub>0</sub> = er begyndelseskoncentrationen i rummet  [PPM]<br/>
            C<sub>i</sub> = er koncentrationen af en forurening i den tilførte luft  [PPM]<br/>
            t = Tid [h]
            </p>
            MET: <br/>
            <dd>
              <dt>- Liggende - 0,8 </dt>
              <dt>- Siddende, afslappet - 1,0 </dt>
              <dt>- Siddende, Kontor/skole - 1,2 </dt>
              <dt>- Stående, forretning, let industri - 1,8 </dt>
              <dt>- Stående, husarbejde, arbejde ved maskine - 2,0 </dt>
              <dt>- Middelstor fysik aktivitet, tungt arbejde, værksted- 2,8 </dt>
              <dt>- Elitesportsaktivitet - 15,0 </dt>
            </dd>
        </div>
      )}

        
        <div className={styles.luftskifteContainer}>
          <h1>CO2-koncentration</h1>
          <h4>Beregningsmetode efter DS 447:2021 Anneks D: <br />
            Dynamisk beregning af koncentrationer af forureninger <br />
          </h4>
          <div className={styles['input-group']}>
            <div className={styles['input-field']}>
              <label htmlFor="I_Personer">Antal Voksne (stk): </label>
              <input
                id="I_Personer"
                type="number"
                value={I_Personer ?? ''}
                onChange={(e) => setI_Personer(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_MET">Aktivitetsniveau (MET): </label>
              <input
                id="I_MET"
                type="number"
                value={I_MET ?? ''}
                onChange={(e) => setI_MET(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_StartPPM">Begyndelseskoncentration (PPM): </label>
              <input
                id="I_StartPPM"
                type="number"
                value={I_StartPPM ?? ''}
                onChange={(e) => setI_StartPPM(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 2)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_Areal">Areal (m²): </label>
              <input
                id="I_Areal"
                type="number"
                value={I_Areal ?? ''}
                onChange={(e) => setI_Areal(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 3)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_Rumhøjde">Rumhøjde (m): </label>
              <input
                id="I_Rumhøjde"
                type="number"
                value={I_Rumhøjde ?? ''}
                onChange={(e) => setI_Rumhøjde(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 4)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_Luftmængde">Luftmængde: </label>
              <select className={styles.dropdown1} value={I_LuftmængdeEnhed} onChange={(e) => setI_LuftmængdeEnhed(e.target.value)}>
                <option value="m3/h">m³/h</option>
                <option value="m3/s">m³/s</option>
                <option value="l/s">l/s</option>
                <option value="l/min">l/min</option>
                <option value="cfm">cfm</option>
                <option value="l/s.m2">l/s·m²</option>
                <option value="h-1">h⁻¹</option>
              </select>
              <input
                id="I_Luftmængde"
                type="number"
                value={I_Luftmængde ?? ''}
                onChange={(e) => setI_Luftmængde(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 5)}
              />
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="I_Tid">Tidshorisont(t): </label>
              <input
                id="I_Tid"
                type="number"
                value={I_Tid ?? ''}
                onChange={(e) => setI_Tid(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 6)}
              />
            </div>

            {/* Beregnknap og resultat */}
            <button onClick={handleCalculate} className={styles['calculate-button']}>Beregn</button>
            {result !== null && (
              <div className={styles.resultBox}>
                <h2>CO2-koncentration efter: <br /></h2>
                <div className={styles.result1}> {I_Tid} time: {result.toFixed(0)} ppm </div>
                <div className={styles.result2}> {I_Tid_2} time: {R_co2_1?.toFixed(0)} ppm</div>  
                <div className={styles.result2}> {I_Tid_3} time: {R_co2_2?.toFixed(0)} ppm</div>
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
