'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

type TableRow = {
  stk: number | null;
  Emne: string;
  BrugsvandK: number;
  BrugsvandV: number;
};

const initialData: TableRow[] = [
  { stk: null, Emne: 'Badekar', BrugsvandK: 0.3, BrugsvandV: 0.3 },
  { stk: null, Emne: 'Bidet', BrugsvandK: 0.1, BrugsvandV: 0.1 },
  { stk: null, Emne: 'Brusebad', BrugsvandK: 0.15, BrugsvandV: 0.15 },
  { stk: null, Emne: 'Gård/havevanding', BrugsvandK: 0.2, BrugsvandV: 0 },
  { stk: null, Emne: 'Håndvask', BrugsvandK: 0.1, BrugsvandV: 0.1 },
  { stk: null, Emne: 'Køkkenvask', BrugsvandK: 0.2, BrugsvandV: 0.2 },
  { stk: null, Emne: 'Rengøringsvask', BrugsvandK: 0.2, BrugsvandV: 0.2 },
  { stk: null, Emne: 'Skylleventil til urinal', BrugsvandK: 0.4, BrugsvandV: 0 },
  { stk: null, Emne: 'Skylleventil til wc', BrugsvandK: 1.5, BrugsvandV: 0 },
  { stk: null, Emne: 'Ventil til spuling af gulve o.l.', BrugsvandK: 0.2, BrugsvandV: 0.2 },
  { stk: null, Emne: 'Vaskemaskiner til husholdning', BrugsvandK: 0.15, BrugsvandV: 0.15 },
  { stk: null, Emne: 'Opvaskemaskiner til husholdning og tilsluttet koldt vand', BrugsvandK: 0.2, BrugsvandV: 0 },
  { stk: null, Emne: 'Opvaskemaskiner til husholdning og tilsluttet varmt vand', BrugsvandK: 0, BrugsvandV: 0.2 },
  { stk: null, Emne: 'WC-cisterne', BrugsvandK: 0.1, BrugsvandV: 0 },
 // { stk: null, Emne: 'Slangevinder i henhold til bygningsreglementet', BrugsvandK: 0.33, BrugsvandV: 0 },
];

const TableComponent: React.FC = () => {
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);

  const [data, setData] = useState<TableRow[]>(
    initialData.map((row) => ({
      ...row,
      stk: null, // Start værdien er null
      BrugsvandK: 0, // Start værdien er 0
      BrugsvandV: 0, // Start værdien er 0
    }))
  );

  // Funktion til at håndtere ændring af stk-værdi
  const handleStkChange = (index: number, newStk: string) => {
    const newValue = newStk === '' ? null : parseFloat(newStk);
    const updatedData = data.map((row, i) =>
      i === index
        ? {
            ...row,
            stk: newValue,
            BrugsvandK: newValue !== null ? parseFloat((newValue * initialData[i].BrugsvandK).toFixed(3)) : 0,
            BrugsvandV: newValue !== null ? parseFloat((newValue * initialData[i].BrugsvandV).toFixed(3)) : 0,
          }
        : row
    );
    setData(updatedData);
  };

  // Funktion til at håndtere Enter- og piltaster
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentCell = event.target as HTMLInputElement;
    const allCells = Array.from(document.querySelectorAll(".input-cell")) as HTMLInputElement[];
    const currentIndex = allCells.indexOf(currentCell);

    if (currentIndex > -1) {
      let nextIndex = currentIndex;
      const numCols = 1; // Antal kolonner i din tabel

      switch (event.key) {
        case "Enter":
          event.preventDefault();
          nextIndex = currentIndex + numCols; // Flyt til næste række
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex - numCols; // Flyt en række op
          break;
        case "ArrowDown":
          event.preventDefault();
          nextIndex = currentIndex + numCols; // Flyt en række ned
          break;

      }

      if (nextIndex >= 0 && nextIndex < allCells.length) {
        allCells[nextIndex].focus();
      }
    }
  };

  // Beregning af sum forudsat vandstrøm
  const sumBrugsvandK = data.reduce((sum, row) => sum + row.BrugsvandK, 0);
  const sumBrugsvandV = data.reduce((sum, row) => sum + row.BrugsvandV, 0);
  // Beregning af sum forudsat vandstrøm
  const qdBK = 0.2 + 0.015 * (sumBrugsvandK - 0.2) + 0.12 * Math.sqrt(sumBrugsvandK - 0.2);
  const qdBV = 0.2 + 0.015 * (sumBrugsvandV - 0.2) + 0.12 * Math.sqrt(sumBrugsvandV - 0.2);

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
          Den dimensionsgivende vandstrøm q<sub>d</sub> for fordelingsledninger med største q<sub>f</sub> mindre end eller lig med 0,3 l/s bliver da: <br /> 
          q<sub>d</sub> = 0,2 + 0,015 * (q<sub>f</sub> - 0,2) + 0,12 * √(q<sub>f</sub> - 0,2) [l/s]

          <p></p>
          q<sub>f</sub>, er fundet ud fra værdierne i nedestående tabel, fra DS 439:2009 afsnit. 2.2.4. <br />
          visse tapsteders funktion kan opfyldes med andre vandstrømme end de angivne. <br /> Dette forudsætter, at armaturet ved tapstedet er konstrueret til at kunne fungere tilfredsstillende ved denne vandstrøm.
          <p></p>
          Der er undlandt følgende punkter fra DS439 tabellen.
          <ul>
            <li>Samtidigt benyttede tapventiler til brusere i fabrikker o.l.</li>
            <li>Samtidigt benyttede tapventiler til håndvaske eller vaskerender i fabrikker o.l.</li>
            <li>Slangevinder i henhold til bygningsreglementet</li>
          </ul>
          <br />
          </p>
        </div>
      )}

      <div className={styles.container}>
        <h3> DS 439:2009 <br /> Dimensionsgivende vandstrøm q<sub>d</sub> <br />for forskellige forudsatte vandstrømme
        q<sub>f</sub></h3>
        <table className={styles.tableWrapper}>
          <thead>
            <tr>
              <th className={styles.col1}>stk</th>
              <th className={styles.col2}>Tapsted</th>
              <th className={styles.col3}>Koldt vand</th>
              <th className={styles.col3}>Varmt vand</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className={styles.input1}>
                <input
                    className={`input-cell`}
                    type="number"
                    value={row.stk !== null ? row.stk : ''}
                    onChange={(e) => handleStkChange(index, e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className={styles.input2}>{row.Emne}</td>
                <td className={styles.input3}>{row.BrugsvandK}</td>
                <td className={styles.input3}>{row.BrugsvandV}</td>
              </tr>
            ))}
            <tr>
              <td className={styles.sum1} colSpan={2}>
                <strong>Sum forudsat vandstrøm q<sub>f</sub></strong>
              </td>
              <td className={styles.sum1}>
                <strong>{sumBrugsvandK.toFixed(2)} [l/s]</strong>
              </td>
              <td className={styles.sum1}>
                <strong>{sumBrugsvandV.toFixed(2)} [l/s]</strong>
              </td>
            </tr>
            <tr>
              <td className={styles.sum1} colSpan={2}>
                <strong> Dimensionsgivende vandstrøm q<sub>d</sub> <br />for forskellige forudsatte vandstrømme
                q<sub>f</sub></strong>
              </td>
              <td className={styles.sum1}>
                <strong>{qdBK.toFixed(2)} [l/s]</strong>
              </td>
              <td className={styles.sum1}>
                <strong>{qdBV.toFixed(2)} [l/s]</strong>
              </td>
            </tr>
          </tbody>
        </table>
    </div>
      </main>
      <Footer />
    </div>
  );
};

export default TableComponent;
