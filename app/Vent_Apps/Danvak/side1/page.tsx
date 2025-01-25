'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../../components/footer';
import Header from '../../../components/header';
import Image from 'next/image';

// JSON data direkte i filen
const tableData = {
  X_Num: [0.5, 0.75, 1, 1.5, 2], // r/b værdier (kolonner)
  Y_Num: [0.25, 0.5, 0.75, 1, 1.5, 2, 4], // h/b værdier (rækker)
  values: [
    [1.53, 0.57, 0.27, 0.22, 0.2],   // h/b = 0.25
    [1.38, 0.52, 0.25, 0.2, 0.18],   // h/b = 0.5
    [1.29, 0.48, 0.23, 0.19, 0.16],  // h/b = 0.75
    [1.18, 0.44, 0.21, 0.17, 0.15],  // h/b = 1
    [1.06, 0.4, 0.19, 0.15, 0.14],   // h/b = 1.5
    [1, 0.39, 0.18, 0.14, 0.13],     // h/b = 2
    [1.06, 0.4, 0.19, 0.15, 0.14],   // h/b = 4
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
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [højde1, setHøjde1] = useState<number | null>(null);
  const [bredde1, setBredde1] = useState<number | null>(null);
  const [radius1, setRadius1] = useState<number>(100);
  const [flow1, setFlow1] = useState<number | null>(null);
  const [vinkel, setVinkel] = useState<number>(90);

  const højde1Ref = useRef<HTMLInputElement>(null);
  const bredde1Ref = useRef<HTMLInputElement>(null);
  const radius1Ref = useRef<HTMLInputElement>(null);
  const flow1Ref = useRef<HTMLInputElement>(null);

  const refs = [højde1Ref, bredde1Ref, radius1Ref, flow1Ref];

  const handelBeregner = () => {
    if (højde1 !== null && bredde1 !== null && radius1 !== null && flow1 !== null) {
      const areal1 = (højde1 * bredde1) / 1000000; // Areal i m2
      const hastighed1 = (flow1/3600) / areal1; // Hastighed i m/s
      const rOb = (bredde1 / 2 + radius1) / bredde1; // r/b
      const hOb = højde1 / bredde1; // h/b

      const vinkelElement = document.getElementById('vinkel') as HTMLSelectElement;
      const vinkel = parseFloat(vinkelElement.value);
      let K = 1; // Default value for 90 degrees

      if (vinkel === 30) {
        K = 0.45;
      } else if (vinkel === 45) {
        K = 0.6;
      } else if (vinkel === 60) {
        K = 0.78;
      }


      const zeta = lookupValue(rOb, hOb, tableData) ?? 0;
      const sum = zeta !== null ? (zeta*K) * 0.5 * 1.2 * Math.pow(hastighed1, 2) : null; // Tryktab i Pa


      console.log('rOb:', rOb); // Skal være mellem 0.5 og 2
      console.log('hOb:', hOb); // Skal være mellem 0.25 og 4
      console.log('zeta:', zeta); // Skal være mellem 0.13 og 1.53
      console.log('sum:', sum); 
      console.log('areal1:', areal1); 
      console.log('hastighed1:', hastighed1); 
      console.log('flow1:', flow1); 
      console.log('vinkel:', vinkel);
      console.log('K:', K);

      setResult(sum !== null ? parseFloat(sum.toFixed(2)) : null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
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
     <main style={{flex: 1, padding: '0.5%'}}>
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
          <p></p>
           <li>Bukke radius er normalt 100mm. <br /></li>
          </p>
        </div>
      )}

        <div className={styles.container}>
          <h2>Firkantet bøjning</h2>
          <div className={styles.inputGroup}>

          <div className={styles.imageContainer}>
            <Image
              src="/Bøjning.svg"
              alt="Bøjning"
              width={252}
              height={323}

              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="højde1">Højde [mm]: </label>
              <input
                id="højde1"
                type="number"
                value={højde1 ?? ''}
                onChange={(e) => setHøjde1(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                ref={højde1Ref}
              />
            </div>


            <div className={styles.inputField}>
              <label htmlFor="bredde1">Bredde [mm]: </label>
              <input
                id="bredde1"
                type="number"
                value={bredde1 ?? ''}
                onChange={(e) => setBredde1(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                ref={bredde1Ref}
              />
            </div>

            <div className={styles.inputField}>
              <label htmlFor="radius1">Bukke radius(R1)[mm]: </label>
              <input
                id="radius1"
                type="number"
                value={radius1 ?? ''}
                onChange={(e) => setRadius1(parseFloat(e.target.value))}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                ref={radius1Ref}
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
              <select
                id="vinkel"
                value={vinkel}
                onChange={(e) => setVinkel(parseFloat(e.target.value))}              >
                <option value={30}>30°</option>
                <option value={45}>45°</option>
                <option value={60}>60°</option>
                <option value={90}>90°</option>
              </select>
            </div>

            <button onClick={handelBeregner} className={styles.calculateButton}>Beregn</button>

            {result !== null && (
              <div className={styles.result}>
                <h2>Tryktab {result} [pa]</h2>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LookupTool;
