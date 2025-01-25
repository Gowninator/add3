'use client';

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css"; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

// Definer en type for rækken
type Row = {
  n_q: string;
  n_b: string;
  n_h: string;
  sum_A: string;
  sum_q: string;
  r_dP: string;
  d_h: string;
};


const VentDim: React.FC = () => {
  const cons_r = 0.00015; // Ruhed [m]
  const cons_v = 0.0000151000; // Kinematisk viskositet[m^2/s]
  const cons_p = 1.205; // Densitet [kg/m3]
  const Ross = 18072024;


  const [IC_MaxV, setIC_MaxV] = useState<number>(5);
  const [IC_MaxPD, setIC_MaxPD] = useState<number>(0.5);
  const [autoDim, setAutoDim] = useState<boolean>(true); // Tilføj tilstand for "Autodim"
  const pipeSize = [63, 80, 100, 125, 160, 200, 250, 315, 355, 400, 450, 500, 560, 630, 710, 800, 1000, 1250, 1400, 1500, 1600];

// Antal af rækker (start med 15 rækker)
const [rows, setRows] = useState<Row[]>(Array(10).fill({
  n_q: "",
  n_b: "",
  n_h: "",
  sum_A: "",
  sum_q: "",
  r_dP: "",
  d_h: "",
}));


const calculateTotals = () => {
  let totalFlow = 0;

  rows.forEach((row) => {
    const flow = parseFloat(row.n_q) || 0; // Flow i m³/h

    totalFlow += flow;
  });

  const T_selectedNB = selectNb(totalFlow); // Automatisk valgt rørstørrelse baseret på totalFlow
  const T_radius = (T_selectedNB / 1000) / 2; // Radius i meter
  const T_area = Math.PI * Math.pow(T_radius, 2); // Tværsnitsareal i m²
  const T_totalVelocity = (totalFlow / 3600) / T_area; // Samlet hastighed i m/s (flow fra m³/h -> m³/s)

  // Beregn tryktab pr. meter for den samlede flow
  const T_d_h = T_selectedNB / 1000; // Rørdiameter i meter
  const T_p_d = 0.5 * cons_p * Math.pow(T_totalVelocity, 2); // Dynamisk tryk
  const T_r_re = (T_d_h * T_totalVelocity) / cons_v; // Reynoldstal
  const T_sum_cole = colebrook(T_r_re, T_d_h, cons_r); // Colebrook-friktion
  const T_totalPressureDropPerMeter = (T_sum_cole * T_p_d) / T_d_h; // Tryktab pr. meter

  return {
    totalFlow,
    T_totalVelocity,
    T_totalPressureDropPerMeter,
    T_selectedNB,
  };
};


// Funktion til at tilføje en ny række
const addRow = () => {
  setRows(prevRows => [
    ...prevRows,
    { n_q: "", n_b: "", n_h: "", sum_A: "", sum_q: "", r_dP: "", d_h: "" }
  ]);
};

  // ColeBrooks formel___________OK______________________
  function colebrook(reynolds: number, diameter: number, roughness: number): number {
    const tolerance = 1e-5; // Tolerance for løsningen
    let m_f = 0.02; // Initialt gæt for friktionsfaktoren
    let diff: number;

    function g(m_f: number): number {
      return 1 / Math.sqrt(m_f) + 2 * Math.log10((roughness / diameter) / 3.7 + 2.51 / (reynolds * Math.sqrt(m_f)));
    }

    function gPrime(m_f: number): number {
      const term1 = -1 / (2 * Math.pow(m_f, 1.5));
      const term2 = (2 * 2.51) / (Math.LN10 * reynolds * Math.pow(m_f, 1.5) * ((roughness / diameter) / 3.7 + 2.51 / (reynolds * Math.sqrt(m_f))));
      return term1 - term2;
    }

    do {
      const m_gf = g(m_f);
      const m_gPrimef = gPrime(m_f);
      diff = m_gf / m_gPrimef;
      m_f -= diff;
    } while (Math.abs(diff) > tolerance);

    return m_f;
  }

  // Funktion til at beregne rækker__________________________________
  const beregnSum = () => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        
        //input constant
        const n_b = parseFloat(row.n_b) || 0;
        const n_h = parseFloat(row.n_h) || 0;
        const n_q = parseFloat(row.n_q) || 0;
        


        // Areal [m2]__OK__
        let sum_A = 0;
        if (n_b > 0 && n_h > 0) {
          sum_A = (n_b * n_h) / 1000000;
        } else if (n_b > 0) {
          const radius = n_b / 2;
          sum_A = (Math.PI * Math.pow(radius, 2)) / 1000000;
        }

        // Hastighed (Flow) [m/s] __OK__
        let sum_q = 0;
        if (n_q > 0 && n_b > 0 && n_h > 0) {
          sum_q = (n_q / 3600) / (n_b * n_h / 1000000);
        } else if (n_q > 0 && n_b > 0) {
          const radius = n_b / 2;
          sum_q = (n_q / 3600) / (Math.PI * Math.pow(radius, 2) / 1000000);
        }

        // Hydraulisk diameter [m]__OK__
        let d_h = 0;
        if (n_b > 0 && n_h > 0) {
          d_h = (2 * n_b * n_h) / (n_b + n_h) / 1000;
        } else if (n_b > 0) {
          d_h = n_b / 1000;
        }

        // Dynamisk tryk [Pa]___OK___
        const p_d = 0.5 * cons_p * Math.pow(sum_q, 2);

        // Renoldstal __ OK__
        const r_re = d_h * sum_q/cons_v;

        // ColeBrooks formel__OK__
        const sum_cole = colebrook(r_re, d_h, cons_r);

        // Tryktabsgradient i lige rør/kanal________OK___________
        let r_dP = 0;
        if (n_b > 0 && n_h > 0) {
          r_dP = sum_cole*p_d/d_h;
        } else if (n_b > 0) {
          r_dP = sum_cole*p_d/d_h;
        }
        

        //Retunere tallet med ønsket dicimaler
        return {
          ...row,
          sum_A: sum_A.toFixed(3),
          sum_q: sum_q.toFixed(2),
          r_dP: r_dP.toFixed(2),
          d_h: d_h.toFixed(3),
          
        };
      })
    );
  };

  // Funktion til at vælge n_b baseret på n_q, IC_MaxV og IC_MaxPD
  const selectNb = (n_q: number): number => {
    for (let i = 0; i < pipeSize.length; i++) {
      const nb = pipeSize[i];
      const radius = nb / 2 / 1000;
      const area = Math.PI * radius * radius;
      const velocity = (n_q / 3600) / area;
      const d_h = nb / 1000; // Antag cirkulær rørform
      const p_d = 0.5 * cons_p * Math.pow(velocity, 2);
      const r_re = d_h * velocity / cons_v;
      const sum_cole = colebrook(r_re, d_h, cons_r);
      const r_dP = sum_cole * p_d / d_h;

      if (velocity <= IC_MaxV && r_dP <= IC_MaxPD) {
        return nb;
      }
    }
    return pipeSize[pipeSize.length - 1]; // Returner den største værdi, hvis ingen matcher
  };

  // Funktion til at håndtere Enter- og piltaster________________________________________________________
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentCell = event.target as HTMLInputElement;
    const allCells = Array.from(document.querySelectorAll(".input-cell")) as HTMLInputElement[];
    const currentIndex = allCells.indexOf(currentCell);

    if (currentIndex > -1) {
      let nextIndex = currentIndex;
      
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          nextIndex = currentIndex + 3; // Flyt til næste række
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex - 3; // Flyt en række op
          break;
        case "ArrowDown":
          event.preventDefault();
          nextIndex = currentIndex + 3; // Flyt en række ned
          break;
        case "ArrowLeft":
          event.preventDefault();
          nextIndex = currentIndex - 1; // Flyt en kolonne til venstre
          break;
        case "ArrowRight":
          event.preventDefault();
          nextIndex = currentIndex + 1; // Flyt en kolonne til højre
          break;
      }

      if (nextIndex >= 0 && nextIndex < allCells.length) {
        allCells[nextIndex].focus();
      }
    }
  };

  useEffect(() => {
    beregnSum();
  }, []);

  const handleChange = (index: number, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  
    // Hvis autoDim er slået til og feltet er "n_q", skal vi beregne og opdatere rørstørrelsen
    if (autoDim && field === "n_q") {
      const numericValue = parseFloat(value);
      if (numericValue > 0) {
        const selectedNb = selectNb(numericValue); // Brug funktionen til at finde den rigtige rørstørrelse
        setRows((prevRows) =>
          prevRows.map((row, i) =>
            i === index ? { ...row, n_b: selectedNb.toString() } : row
          )
        );
      } else {
        setRows((prevRows) =>
          prevRows.map((row, i) => (i === index ? { ...row, n_b: "" } : row))
        );
      }
    }
  
    beregnSum(); // Genberegn alle rækker
  };

// Farve skifter til CCS koden, Hastighed 
  const getClassForValueV = (value: string) => {
    const numericValue = parseFloat(value);
    return numericValue > IC_MaxV ? styles.highValue : styles.lowValue;
  };

// Farve skifter til CCS koden, tryktab
const getClassForValueP = (value: string) => {
  const numericValue = parseFloat(value);
  return numericValue > IC_MaxPD ? styles.highValue : styles.lowValue;
};

const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
const handleToggleAssumptions = () => {
  setShowAssumptions(!showAssumptions);
};

return (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <Header />
  <main style={{  flex: 1, padding: '0.5%' }}>
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
          De forudsætninger, der er gjort i beregningen af det nødvendige luftskifte, er som følger:
        </p>
        <ol>
          <li>Tør luft ved 1 atm og 20°C (101325 Pa)</li>
          <li>Luftens densitet er konstant og sat til 1,205 kg/m³.</li>
          <li>Antager turbulent strømning og bruger Colebrook-formlen til at beregne friktionsfaktoren i en rørledning ved hjælp af Newton-Raphson-metoden. Iterationen fortsætter, indtil forskellen er mindre end en tolerance på 1e-5, hvilket sikrer en præcis løsning. </li>
          <li>Kinematiske viskositet har en værdi på 0.0000151000 m<sup>2</sup>/s.</li>
        </ol>
      </div>
    )}

  <div className={styles.container}>

  <h1 className={styles.heading}>Ventilations rør-/kanal dimensionering</h1>

    <div className={styles.inputMaksGruppe}>
      <div className={styles.inputMaks}>
          <label htmlFor="IC_MaxV">Maks Hastighed (m/s): </label>
          <input
            className={styles.inputFMaks}
            id="IC_MaxV"
            type="number"
            value={IC_MaxV ?? ''}
            onChange={(e) => setIC_MaxV(parseFloat(e.target.value))}
          />
        </div>
        <div className={styles.inputMaks}>
          <label htmlFor="IC_MaxPD">Maks Tryktab (pa/m): </label>
          <input
          className={styles.inputFMaks}
            id="IC_MaxPD"
            type="number"
            value={IC_MaxPD ?? ''}
            onChange={(e) => setIC_MaxPD(parseFloat(e.target.value))}
          />
        </div>
    </div>

    <div className={styles.inputMaksGruppe}>
      <button 
        onClick={() => setAutoDim(!autoDim)} 
        className={`${styles.FKnap} ${autoDim ? styles.greenButton : styles.redButton}`}>
        Auto Dim: {autoDim ? 'On' : 'Off'}
      </button>
    </div>

    <div className={styles.inputMaksGruppe}>
        <button onClick={addRow} className={styles.FKnap}>
          Tilføj en række mere
        </button>
    </div>

    <br />

    <table className={styles.tableWrapper}>
  <thead>
    <tr>
      <th className={styles.col1}>Flow</th>
      <th className={styles.col1}>Ø<br />(Bredde)</th>
      <th className={styles.col1}><br />(Højde)</th>
      <th className={styles.col1}>Areal</th>
      <th className={styles.col1}>Hydraulisk diameter</th>
      <th className={styles.col1}>Hastighed</th>
      <th className={styles.col1}>Tryktab pr. m</th>
    </tr>
    <tr>
      <th className={styles.col2}>[m³/h]</th>
      <th className={styles.col2}>[mm]</th>
      <th className={styles.col2}>[mm]</th>
      <th className={styles.col2}>[㎡]</th>
      <th className={styles.col2}>[mm]</th>
      <th className={styles.col2}>[m/s]</th>
      <th className={styles.col2}>[pa/m]</th>
    </tr>
  </thead>
  <tbody>
    {rows.map((row, rowIndex) => (
      <tr key={rowIndex}>
        <td>
          <input
            type="number"
            className={`${styles.input1} input-cell`}
            data-col="n_q"
            value={row.n_q}
            onChange={(e) => handleChange(rowIndex, "n_q", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </td>
        <td>
          <input
            type="number"
            className={`${styles.input1} input-cell`}
            data-col="n_b"
            value={row.n_b}
            onChange={(e) => handleChange(rowIndex, "n_b", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </td>
        <td>
          <input
            type="number"
            className={`${styles.input1} input-cell`}
            data-col="n_h"
            value={row.n_h}
            onChange={(e) => handleChange(rowIndex, "n_h", e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </td>
        <td>
          <input
            type="text"
            className={`${styles.input2} sum-cell`}
            value={row.sum_A}
            readOnly
          />
        </td>
        <td>
          <input
            type="text"
            className={`${styles.input2} sum-cell`}
            value={row.d_h}
            readOnly
          />
        </td>
        <td>
          <input
            type="text"
            className={getClassForValueV(row.sum_q)}
            value={row.sum_q}
            readOnly
          />
        </td>
        <td>
          <input
            type="text"
            className={getClassForValueP(row.r_dP)}
            value={row.r_dP}
            readOnly
          />
        </td>
      </tr>
    ))}
      </tbody>
      <tfoot>
      <tr>
        <td className={styles.footerCell}>Σ {calculateTotals().totalFlow.toFixed(0)}</td>

        {/* Kun vis rørstørrelse hvis totalFlow > 0 */}
        {calculateTotals().totalFlow > 0 && (
          <td className={styles.footerCell}>
            Ø {selectNb(calculateTotals().totalFlow)}
          </td>
        )}

        <td className={styles.footerCell} colSpan={3}></td>

        {/* Kun vis hastighed og tryktab hvis totalFlow > 0 */}
        {calculateTotals().totalFlow > 0 && (
          <>
            <td className={styles.footerCell}>
              {calculateTotals().T_totalVelocity.toFixed(2)} m/s
            </td>
            <td className={styles.footerCell}>
              {calculateTotals().T_totalPressureDropPerMeter.toFixed(2)} Pa/m
            </td>
          </>
        )}
      </tr>
    </tfoot>
    </table>
    </div>
  </main>
  <Footer />
</div>
  );
};

export default VentDim;

