'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../../components/footer';
import Header from '../../../components/header';
import Image from 'next/image';

// JSON data direkte i filen
const tableData = {
  X_Num: [0, 2, 4, 10, 16], // A2/A1 værdier (kolonner)
  Y_Num: [10, 15, 20, 30, 45, 60, 90, 120, 150, 180], // Vinkelværdier (rækker)
  values: [
    [0, 0.11, 0.16, 0.21, 0.21],   // alpha = 10
    [0, 0.13, 0.22, 0.28, 0.29],   // alpha = 15
    [0, 0.19, 0.30, 0.38, 0.38],   // alpha = 20
    [0, 0.32, 0.46, 0.59, 0.60],   // alpha = 30
    [0, 0.33, 0.61, 0.76, 0.84],   // alpha = 45
    [0, 0.33, 0.68, 0.80, 0.88],   // alpha = 60
    [0, 0.32, 0.64, 0.83, 0.88],   // alpha = 90
    [0, 0.31, 0.63, 0.84, 0.88],   // alpha = 120
    [0, 0.30, 0.62, 0.83, 0.88],   // alpha = 150
    [0, 0.30, 0.62, 0.83, 0.88],   // alpha = 180
  ],
};

// Interpolationsfunktion
const interpolate = (x: number, x0: number, x1: number, y0: number, y1: number) => {
  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
};

// Funktion til at slå op i tabellen med interpolation
const lookupValue = (x: number, y: number, table: typeof tableData): number | null => {
  const { X_Num, Y_Num, values } = table;

  // Find de to nærmeste x-værdier
  let x0 = X_Num[0], x1 = X_Num[X_Num.length - 1];
  for (let i = 0; i < X_Num.length - 1; i++) {
    if (x >= X_Num[i] && x <= X_Num[i + 1]) {
      x0 = X_Num[i];
      x1 = X_Num[i + 1];
      break;
    }
  }

  // Find de to nærmeste y-værdier
  let y0 = Y_Num[0], y1 = Y_Num[Y_Num.length - 1];
  for (let i = 0; i < Y_Num.length - 1; i++) {
    if (y >= Y_Num[i] && y <= Y_Num[i + 1]) {
      y0 = Y_Num[i];
      y1 = Y_Num[i + 1];
      break;
    }
  }

  // Find z-værdierne for de fire hjørner af rektanglet
  const z00 = values[Y_Num.indexOf(y0)][X_Num.indexOf(x0)];
  const z01 = values[Y_Num.indexOf(y0)][X_Num.indexOf(x1)];
  const z10 = values[Y_Num.indexOf(y1)][X_Num.indexOf(x0)];
  const z11 = values[Y_Num.indexOf(y1)][X_Num.indexOf(x1)];

  // Interpoler langs x-aksen for de to y-værdier
  const z0 = interpolate(x, x0, x1, z00, z01);
  const z1 = interpolate(x, x0, x1, z10, z11);

  // Interpoler langs y-aksen for de to z-værdier
  return interpolate(y, y0, y1, z0, z1);
};



const LookupTool: React.FC = () => {
  // Add state at the top of your component
  const [selectedShape, setSelectedShape] = useState<'round' | 'square'>('round'); // Default value is 'round'
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
  const [højde1, setHøjde1] = useState<number | null>(null);
  const [højde2, setHøjde2] = useState<number | null>(null);
  const [bredde1, setBredde1] = useState<number | null>(null);
  const [bredde2, setBredde2] = useState<number | null>(null);
  const [dia1, setDia1] = useState<number | null>(null);
  const [dia2, setDia2] = useState<number | null>(null);
  const [flow1, setFlow1] = useState<number | null>(null);
  const [flow2] = useState<number | null>(null);
  const [vinkel, setVinkel] = useState<number | null>(null);

  const højde1Ref = useRef<HTMLInputElement>(null);
  const højde2Ref = useRef<HTMLInputElement>(null);
  const bredde1Ref = useRef<HTMLInputElement>(null);
  const bredde2Ref = useRef<HTMLInputElement>(null);
  const dia1Ref = useRef<HTMLInputElement>(null);
  const dia2Ref = useRef<HTMLInputElement>(null);
  const flow1Ref = useRef<HTMLInputElement>(null);
  const flow2Ref = useRef<HTMLInputElement>(null);
  const vinkelRef = useRef<HTMLInputElement>(null);

  // Add type for ref object
type InputRef = {
  ref: React.RefObject<HTMLInputElement>;
  index: number;
};

  const getRefs = (): InputRef[] => {
    if (selectedShape === 'square') {
      return [
        { ref: flow1Ref, index: 0 },
        { ref: vinkelRef, index: 1 },
        { ref: højde1Ref, index: 2 },
        { ref: bredde1Ref, index: 3 },
        { ref: højde2Ref, index: 4 },
        { ref: bredde2Ref, index: 5 },
      ].filter(item => item.ref.current !== null);
    } else {
      return [
        { ref: flow1Ref, index: 0 },
        { ref: vinkelRef, index: 1 },
        { ref: dia1Ref, index: 2 },
        { ref: dia2Ref, index: 3 },
      ].filter(item => item.ref.current !== null);
    }
  };

  const handelBeregner = () => {
    if (selectedShape === 'square') {
      const areal1 = (højde1! * bredde1!) / 1000000; // Areal1 i m2
      const areal2 = (højde2! * bredde2!) / 1000000; // Areal2 i m2

      // Check if A2 > A1
      if (areal2 <= areal1) {
        setErrorMessage("A2 skal være større end A1");
        setResult(null);
        setResult2(null);
        return;
      }
      setErrorMessage(null);

      const hastighed1 = (flow1!/3600) / areal1; // Hastighed i m/s
      const A1OA2 = areal2/areal1; // A1/A2
      const zeta = lookupValue(A1OA2, vinkel!, tableData) ?? 0;
      const sum = zeta !== null ? (zeta) * 0.5 * 1.2 * Math.pow(hastighed1, 2) : null; // Tryktab i Pa


      console.log('A1OA2:', A1OA2); // Skal være mellem 0.5 og 2
      console.log('zeta:', zeta); // Skal være mellem 0.13 og 1.53
      console.log('sum:', sum); 
      console.log('areal1:', areal1); 
      console.log('hastighed1:', hastighed1); 
      console.log('flow1:', flow1); 
      console.log('vinkel:', vinkel);

      setResult(sum !== null ? parseFloat(sum.toFixed(2)) : null);
      setResult2(sum !== null ? parseFloat(zeta.toFixed(2)) : null);
    }
    else {
      const areal1 = (Math.PI * Math.pow(dia1!/2, 2)) / 1000000; // Areal1 i m2
      const areal2 = (Math.PI * Math.pow(dia2!/2, 2)) / 1000000; // Areal2 i m2
            // Check if A2 > A1
            if (areal2 <= areal1) {
              setErrorMessage("A2 skal være større end A1");
              setResult(null);
              setResult2(null);
              return;
            }
            setErrorMessage(null);
      
      const hastighed1 = (flow1!/3600) / areal1; // Hastighed i m/s

      const A1OA2 = areal2/areal1; // A1/A2

      const zeta = lookupValue(A1OA2, vinkel!, tableData) ?? 0;
      const sum = zeta !== null ? (zeta) * 0.5 * 1.2 * Math.pow(hastighed1, 2) : null; // Tryktab i Pa

      console.log('A1OA2:', A1OA2); // Skal være mellem 0.5 og 2
      console.log('zeta:', zeta); // Skal være mellem 0.13 og 1.53
      console.log('sum:', sum); 
      console.log('areal1:', areal1); 
      console.log('areal2:', areal2);
      console.log('hastighed1:', hastighed1); 
      console.log('flow1:', flow1); 
      console.log('vinkel:', vinkel);

      setResult(sum !== null ? parseFloat(sum.toFixed(2)) : null);
      setResult2(sum !== null ? parseFloat(zeta.toFixed(2)) : null);
    }

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    const refs = getRefs();
    if (!refs.length) return;
  
    const currentRefIndex = refs.findIndex(ref => ref.index === currentIndex);
    if (currentRefIndex === -1) return;
  
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextIndex = (currentRefIndex + 1) % refs.length;
      refs[nextIndex].ref.current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentRefIndex - 1 + refs.length) % refs.length;
      refs[prevIndex].ref.current?.focus();
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
          <Link href="/Vent_Apps/Danvak">
            <button className={styles.HKnap}>Tilbage</button>
          </Link>
          <button onClick={handleToggleAssumptions} className={styles.HKnap}>Forudsætninger</button>
        </div>
  
        {showAssumptions && (
          <div className={styles.teoriBox}>
            <h3>Forudsætninger</h3>
            <p>
              Beregningerne er baseret på tabelværdierne fra Danvak Appendiks A.08.07: Tryktabsfaktorer for kanalfittings. <br />
            </p>
          </div>
        )}
  
        <div className={styles.container}>
          <h2>Udvidelse</h2>

          <div className={styles.inputGroup}>
            <div className={styles.imageContainer}>
              <Image
                src="/Udvidelse.svg"
                alt="Bøjning"
                width={300}
                height={300}
              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="flow1">Flow [m³/h]: </label>
              <input
                id="flow1"
                type="number"
                value={flow1 ?? ''}
                onChange={(e) => setFlow1(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                ref={flow1Ref}
              />
            </div>
  
            <div className={styles.inputField}>
              <label htmlFor="vinkel">Vinkel [°]: </label>
              <input
                id="vinkel"
                type="number"
                placeholder='10°-180°'
                value={vinkel ?? ''}
                onChange={(e) => setVinkel(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                ref={vinkelRef}
              />
            </div>
  
            <div className={styles.buttonGroup}>
              {[
                { id: 'round', label: 'Rund' },
                { id: 'square', label: 'Firkantet' },
              ].map(shape => (
                <button
                  key={shape.id}
                  className={`${styles.shapeButton} ${
                    selectedShape === shape.id ? styles.active : ''
                  }`}
                  onClick={() => setSelectedShape(shape.id as 'square' | 'round')}
                >
                  {shape.label}
                </button>
              ))}
            </div> 
  
            {/* Conditional rendering of input fields */}
            {selectedShape === 'square' ? (
              <>
                <div className={styles.inputField}>
                  <label htmlFor="højde1">Højde 1 [mm]: </label>
                  <input
                    id="højde1"
                    type="number"
                    value={højde1 ?? ''}
                    onChange={(e) => setHøjde1(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    ref={højde1Ref}
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="bredde1">Bredde 1 [mm]: </label>
                  <input
                    id="bredde1"
                    type="number"
                    value={bredde1 ?? ''}
                    onChange={(e) => setBredde1(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    ref={bredde1Ref}
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="højde2">Højde 2 [mm]: </label>
                  <input
                    id="højde2"
                    type="number"
                    value={højde2 ?? ''}
                    onChange={(e) => setHøjde2(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                    ref={højde2Ref}
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="bredde2">Bredde 2 [mm]: </label>
                  <input
                    id="bredde2"
                    type="number"
                    value={bredde2 ?? ''}
                    onChange={(e) => setBredde2(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                    ref={bredde2Ref}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.inputField}>
                  <label htmlFor="dia1">Diameter 1 [mm]: </label>
                  <input
                    id="dia1"
                    type="number"
                    value={dia1 ?? ''}
                    onChange={(e) => setDia1(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                    ref={dia1Ref}
                  />
                </div>
                <div className={styles.inputField}>
                  <label htmlFor="dia2">Diameter 2 [mm]: </label>
                  <input
                    id="dia2"
                    type="number"
                    value={dia2 ?? ''}
                    onChange={(e) => setDia2(parseFloat(e.target.value))}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                    ref={dia2Ref}
                  />
                </div>
              </>
            )}
  
  
            <button onClick={handelBeregner} className={styles.calculateButton}>
              Beregn
            </button>
  
            {errorMessage ? 
            (<div className={styles.error}>
                <h2>{errorMessage}</h2>
              </div>
            ) : result !== null && 
            (<div className={styles.result}>
                <h2>Tryktab {result} [Pa]</h2>
                <h4>ζ = {result2}</h4>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LookupTool;
