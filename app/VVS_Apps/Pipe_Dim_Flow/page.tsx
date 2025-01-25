'use client';

import React, { useEffect, useState } from "react";
import styles from "./styles.module.css"; // Importer CSS-modulet
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

//"n_h" er ubrugt i denne kode, 

// Definer en type for rækken
type Row = {
  n_q: string;
  cons_Di: string;
  cons_DN: string;
  sum_A: string;
  sum_v: string;
  r_dP: string;
};
type FlowUnit = "m3/h" | "l/h" | "l/s";
const VVSDim: React.FC = () => {
  // VVS-RØR DEL 1_______________
  type PipeType = {
  name: string;
  cons_r: number;
  cons_Di: number[];
  cons_DN: string[];
  };

  const pipeTypes: PipeType[] = [
    { name: "Geberit - (RSS)", //Navn i dropdwon
      cons_r: 0.000007, // Ruhed [m]
      cons_Di: [13.0, 16.0, 19.6, 25.6, 32.0, 39.0, 51.0, 72.1, 84.9, 104.0],
      cons_DN: ["ø15", "ø18", "ø22", "ø28", "ø35", "ø42", "ø54", "ø76.1", "ø88.9", "Ø108"],
    },
    { name: "Geberit - (FZ)", 
      cons_r: 0.000007, // Ruhed [m]
      cons_Di: [9.6, 12.6, 15.6, 19.0, 25.0, 32.0, 39.0, 51.0, 72.1, 84.9, 104.0],
      cons_DN: ["Ø12", "Ø15", "Ø18", "Ø22", "Ø28", "Ø35", "Ø42", "Ø54", "Ø76.1", "Ø88.9", "Ø108"],
    },
    { name: "Stålrør, middelsvære (ST)",
      cons_r: 0.00005, // Ruhed [m]
      cons_DN: ["DN8", "DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [8.5, 12.8, 16.0, 21.6, 27.2, 35.9, 41.8, 53.0, 68.8, 80.8, 105.3],
    },
    { name: "Stålrør, sorte glatte sømløse (ST)",
      cons_r: 0.00005, // Ruhed [m]
      cons_DN: ["DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100","DN125", "DN150", "DN200", "DN250", "DN300", "DN350", "DN400", "DN450", "DN500"],
      cons_Di: [16.1, 21.7, 28.5, 37.2, 43.1, 54.5, 70.3, 82.5, 107.1, 131.7, 159.3, 206.5, 260.4, 309.7, 339.6, 388.8, 437.0, 486.0 ],
    },
    { name: "Stålrør, galvaniseret (ST)", // Du kan ændre navnet
      cons_r: 0.00005, // Ruhed [m]
      cons_DN: ["DN8", "DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [8.5, 12.8, 16.0, 21.6, 27.2, 35.9, 41.8, 53.0, 68.8, 80.8, 105.3],
    },
    {
      name: "Stålrør, svære gevindrør (ST)", // Du kan ændre navnet
      cons_r: 0.00005, // Ruhed [m]
      cons_DN: ["DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [11.7, 14.8, 20.4, 25.6, 34.3, 40.2, 51.3, 67.1, 84.1, 103.5],
    },
    {
      name: "Kobberrør (Cu)", // Du kan ændre navnet
      cons_r: 0.0000015, //m
      cons_DN: ["Ø6", "Ø8", "Ø10", "Ø12", "Ø15", "Ø18", "Ø22", "Ø28", "Ø35", "Ø42", "Ø54", "Ø76.1", "Ø88.9", "Ø108"],
      cons_Di: [4.4, 6.4, 8.0, 10.0, 13.0, 16.0, 20.0, 25.0, 32.0, 39.0, 50.0, 72.1, 84.9, 103.0],
    },
    {
      name: "Alu-Pex (APX)", // Du kan ændre navnet
      cons_r: 0.000007, // Ruhed [m]
      cons_DN: ["Ø16", "Ø20", "Ø25", "Ø32", "Ø40", "Ø50", "Ø63", "Ø75", "Ø90", "Ø110"],
      cons_Di: [12.0, 15.5, 20.0, 26.0, 32.0, 41.0, 51.0, 60.0, 73.0, 90.0],
    },
    {
      name: "Pex (PEX)", // Du kan ændre navnet
      cons_r: 0.000007, // Ruhed [m]
      cons_DN: ["ø12", "ø15", "ø18", "ø22", "ø28", "ø32", "ø40", "ø50", "ø63", "ø75", "ø90", "ø110"],
      cons_Di: [8.6, 10.0, 13.0, 16.0, 20.0, 23.2, 29.0, 36.2, 45.8, 54.4, 65.4, 79.8],
    },

  ];


  const cons_v = 0.000001300; // vand 10 grader Kinematisk viskositet[m^2/s]
  const cons_p = 0.9997; // vand 10 grader Densitet [kg/m3]
  //const cons_v = 0.0000151000; // luft Kinematisk viskositet[m^2/s]
 // const cons_p = 1.205; // luft Densitet [kg/m3]
  const [autoDim, setAutoDim] = useState<boolean>(true); // Tilføj tilstand for "Autodim"
  const [flowUnit, setFlowUnit] = useState<FlowUnit>("m3/h");

  // Antal af rækker (start med 15 rækker)
  const [rows, setRows] = useState<Row[]>(Array(10).fill({
    n_q: "",
    cons_Di: "",
    cons_DN: "",
    sum_A: "",
    sum_v: "",
    r_dP: "",
  }));

// Funktion til at tilføje en ny række
const addRow = () => {
  setRows(prevRows => [
    ...prevRows,
    { n_q: "", cons_Di: "", cons_DN: "", sum_A: "", sum_v: "", r_dP: "" }
    ]);
  };

  // VVS-DEL2____________________
  const [selectedPipeType, setSelectedPipeType] = useState<PipeType>(pipeTypes[0]);
  const [IC_MaxV, setIC_MaxV] = useState<number>(2); // Eksempelværdi
  const [IC_MaxPD, setIC_MaxPD] = useState<number>(100); // Eksempelværdi
  const [IC_Temp, setIC_Temp] = useState<number>(10); // Eksempelværdi
  

  const handlePipeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = pipeTypes.find(type => type.name === event.target.value);
    if (selectedType) {
      setSelectedPipeType(selectedType); // Opdater PipeType
    }
  };

  // Colebrook-formlen
  const colebrook = (reynolds: number, diameter: number, roughness: number): number => {
    const tolerance = 1e-5;
    let m_f = 0.02;
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
  };

  
  const beregnSum = () => {
    const PI = Math.PI;
  
    setRows((prevRows) =>
      prevRows.map((row) => {
        const cons_Di = parseFloat(row.cons_Di) || 0; 
        const n_q = (parseFloat(row.n_q) || 0) ; // m3/h
        //const n_flow = n_q / 1000; // l/h

        let n_flow = n_q;
        switch (flowUnit) {  // Use flowUnit state instead of hardcoded value
          case "l/h":
            n_flow = n_q/1000;
            break;
          case "l/s":
            n_flow = n_q * 3.6;  // Convert l/s to m3/h
            break;
          case "m3/h":
            n_flow = n_q;
          break;
          default: // m3/h
            n_flow = n_q;
            break;
        }




        const densitet: number | null = IC_Temp !== null ? 1.35445e-11 * Math.pow(IC_Temp, 6)- 1.62661e-9 * Math.pow(IC_Temp, 5)  - 2.8678e-7 * Math.pow(IC_Temp, 4)  + 7.26277e-5 * Math.pow(IC_Temp, 3) - 9.08201e-3 * Math.pow(IC_Temp, 2) + 7.89009e-2 * IC_Temp + 9.99802e2 : null; //kg/m³
        const KVisko: number | null = (4.13193e-12 * Math.pow(IC_Temp, 6)- 1.67443e-9 * Math.pow(IC_Temp, 5) + 2.82484e-7 * Math.pow(IC_Temp, 4)- 2.62224e-5 * Math.pow(IC_Temp, 3)  + 1.52463e-3 * Math.pow(IC_Temp, 2) - 6.16127e-2 * IC_Temp + 1.79794)/1000000;
      
      
        const m_radius = cons_Di / 2 ;  // Radius i mm __OK__
        const sum_A = (PI * Math.pow(m_radius,2)) / 1000000; //Arealet i m^2 __OK__
  
        const sum_v = n_flow > 0 ? ((n_flow / 3600) / (sum_A)) : 0;  // Hastighed i m/s __OK__
        const d_h = n_flow > 0 ? cons_Di / 1000 : 0; //hydraulisk diameter i m
        const p_d = n_flow > 0 && densitet !== null ? 0.5 * densitet * Math.pow(sum_v, 2) : 0; //dyn. tryk i Pa
        const r_re = (d_h * sum_v) / KVisko; // Reynoldstal
        const sum_cole = colebrook(r_re, cons_Di, selectedPipeType.cons_r);
        const r_dP = n_flow > 0 ? sum_cole * p_d / d_h : 0; // Tryktab pr. m i Pa/m
  
        return {
          ...row,
          sum_A: sum_A.toFixed(2),
          sum_v: sum_v.toFixed(2),
          r_dP: r_dP.toFixed(2),
        };
      })
    );
  };
  
  const selectNb = (n_q: number): { Di: number } => {
    const pipeSize = selectedPipeType.cons_Di;
    const PI = Math.PI;
  
    for (let i = 0; i < pipeSize.length; i++) {
      const n_di = pipeSize[i];
        const cons_Di = n_di; 

        //const n_flow = n_q / 1000; // l/h  <-- orginale kode
        let n_flow = n_q;
        switch (flowUnit) {  // Use flowUnit state instead of hardcoded value
          case "l/h":
            n_flow = n_q/1000;
            break;
          case "l/s":
            n_flow = n_q * 3.6;  // Convert l/s to m3/h
            break;
          case "m3/h":
            n_flow = n_q;
          break;
          default: // m3/h
            n_flow = n_q;
            break;
        }

        const densitet: number | null = IC_Temp !== null ? 1.35445e-11 * Math.pow(IC_Temp, 6)- 1.62661e-9 * Math.pow(IC_Temp, 5)  - 2.8678e-7 * Math.pow(IC_Temp, 4)  + 7.26277e-5 * Math.pow(IC_Temp, 3) - 9.08201e-3 * Math.pow(IC_Temp, 2) + 7.89009e-2 * IC_Temp + 9.99802e2 : null; //kg/m³
        const KVisko: number | null = (4.13193e-12 * Math.pow(IC_Temp, 6)- 1.67443e-9 * Math.pow(IC_Temp, 5) + 2.82484e-7 * Math.pow(IC_Temp, 4)- 2.62224e-5 * Math.pow(IC_Temp, 3)  + 1.52463e-3 * Math.pow(IC_Temp, 2) - 6.16127e-2 * IC_Temp + 1.79794)/1000000;
        
        const m_radius = cons_Di / 2 ;  // Radius i mm __OK__
        const sum_A = (PI * Math.pow(m_radius,2)) / 1000000; //Arealet i m^2 __OK__
  
        const sum_v = n_flow > 0 ? ((n_flow / 3600) / (sum_A)) : 0;  // Hastighed i m/s __OK__
        const d_h = n_flow > 0 ? cons_Di / 1000 : 0; //hydraulisk diameter i m
        const p_d = n_flow > 0 && densitet !== null ? 0.5 * densitet * Math.pow(sum_v, 2) : 0; //dyn. tryk i Pa
        const r_re = (d_h * sum_v) / KVisko; // Reynoldstal
        const sum_cole = colebrook(r_re, cons_Di, selectedPipeType.cons_r);
        const r_dP = n_flow > 0 ? sum_cole * p_d / d_h : 0; // Tryktab pr. m i Pa/m

      if (sum_v <= IC_MaxV && r_dP <= IC_MaxPD) {
        return { Di: n_di };
      }
    }
    return { Di: pipeSize[pipeSize.length - 1] };
  };
  
  const AutoDimAlt = () => {
    // Opdater alle rækker med selectNb
    setRows((prevRows) =>
      prevRows.map((row) => {
        const n_q = parseFloat(row.n_q) || 0; // m3/h
  
        if (n_q > 0) {
          const selectedNb = selectNb(n_q); // Beregn ny cons_Di baseret på n_q
          return {
            ...row,
            cons_Di: selectedNb.Di.toString(),
            cons_DN: findDN(selectedNb.Di), // Find DN for den nye cons_Di
          };
        }
  
        return row;
      })
    );
  
    // Efter opdatering af cons_Di, kør beregninger på alle rækker
    beregnSum();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentCell = event.target as HTMLInputElement;
    const allCells = Array.from(document.querySelectorAll(".input-cell")) as HTMLInputElement[];
    const currentIndex = allCells.indexOf(currentCell);
  
    if (currentIndex > -1) {
      let nextIndex = currentIndex;
  
      switch (event.key) {
        case "Enter":
          event.preventDefault();
          nextIndex = currentIndex + 2;
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex - 2;
          break;
        case "ArrowDown":
          event.preventDefault();
          nextIndex = currentIndex + 2;
          break;
        // case "ArrowLeft":
        //   event.preventDefault();
        //   nextIndex = currentIndex - 2;
        //   break;
        // case "ArrowRight":
        //   event.preventDefault();
        //   nextIndex = currentIndex + 2;
        //   break;
      }
  
      if (nextIndex >= 0 && nextIndex < allCells.length) {
        allCells[nextIndex].focus();
      }
    }
  };

  useEffect(() => {
    // Når PipeType ændres, kør selectNb på hver række og opdater 'cons_Di'
    setRows((prevRows) =>
      prevRows.map((row) => {
        const n_q = parseFloat(row.n_q) || 0; // m3/h
  
        if (n_q > 0) {
          const selectedNb = selectNb(n_q); // Beregn ny cons_Di baseret på n_q
          return {
            ...row,
            cons_Di: selectedNb.Di.toString(),
            cons_DN: findDN(selectedNb.Di), // Find DN for den nye cons_Di
          };
        }
  
        return row;
      })
    );
  
    // Efter opdatering af cons_Di, kør beregninger på alle rækker
    beregnSum();
  }, [IC_MaxV, IC_MaxPD, IC_Temp,selectedPipeType, flowUnit]); // Afhængighed af selectedPipeType for at trigge effekten, når PipeType ændres
  
  // Add handler function
const handleFlowUnitChange = (unit: FlowUnit) => {
  setFlowUnit(unit);
  beregnSum(); // Recalculate with new unit
};

  const handleChange = (index: number, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  
    // Kun udfør automatisk valg af cons_Di hvis autoDim er true
    if (autoDim && field === "n_q") {
      const numericValue = parseFloat(value);
      if (numericValue > 0) {
        const selectedNb = selectNb(numericValue);
        setRows((prevRows) =>
          prevRows.map((row, i) =>
            i === index
              ? { ...row, cons_Di: selectedNb.Di.toString(), cons_DN: findDN(selectedNb.Di) }
              : row
          )
        );
      } else {
        setRows((prevRows) =>
          prevRows.map((row, i) => (i === index ? { ...row, cons_Di: "", cons_DN: "" } : row))
        );
      }
    }
  
    // Beregn værdierne igen efter ændringer
    beregnSum();
  };
  
  // Find DN based on Di
  const findDN = (di: number) => {
    const index = selectedPipeType.cons_Di.indexOf(di);
    return index !== -1 ? selectedPipeType.cons_DN[index].toString() : "";
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
          
          ρ & c<sub>p</sub> værdier, er valgt ud fra et funktionsudtryk der er gælende i temperaturintervallet 0-100°C, der er relativ spredning på funktionstilnærmelsene på 0,002% og 0,003%
          <br />
          (Kapitel 9: Varme Ståbi 7. udgave)
          
          <p></p>
            Antager turbulent strømning og bruger Colebrook-formlen til at beregne friktionsfaktoren i en rørledning ved hjælp af Newton-Raphson-metoden. Iterationen fortsætter, indtil forskellen er mindre end en tolerance på 1e-5, hvilket sikrer en præcis løsning. 
          <p></p>
            Ruheder for rørmaterialer:
          <dd>
            <li>Geberit - (RSS): 0.000007 m</li>
            <li>Geberit - (FZ): 0.000007 m</li>
            <li>Stålrør, middelsvære (ST): 0.00005 m</li>
            <li>Stålrør, sorte glatte sømløse (ST): 0.00005 m</li>
            <li>Stålrør, galvaniseret (ST): 0.00005 m</li>
            <li>Stålrør, svære gevindrør (ST): 0.00005 m</li>
            <li>Kobberrør (Cu): 0.0000015 m</li>
            <li>Alu-Pex (APX): 0.000007 m</li>
            <li>Pex (PEX): 0.000007 m</li>
          </dd>
        </div>
      )}



    <h1 className={styles.heading}>VVS rør dimensionering</h1>

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
        <div className={styles.inputMaks}>
          <label htmlFor="IC_Temp">Vand temperatur (°C): </label>
          <input
          className={styles.inputFMaks}
            id="IC_Temp"
            type="number"
            value={IC_Temp ?? ''}
            onChange={(e) => setIC_Temp(parseFloat(e.target.value))}
          />
        </div>
    </div>

    <div className={styles.inputMaksGruppe}>
      <button 
        onClick={() => setAutoDim(!autoDim)} 
        className={`${styles.FKnap} ${autoDim ? styles.greenButton : styles.redButton}`}>
        Auto Dim: {autoDim ? 'On' : 'Off'}
      </button>
       <button 
        onClick={AutoDimAlt}
        className={styles.FKnap}>
        Auto dim: Opdater alle rækker
       </button>
    </div>

    <div className={styles.inputMaksGruppe}>
        <button onClick={addRow} className={styles.FKnap}>
          Tilføj en række mere
        </button>
    </div>

    <div className={styles.inputMaksGruppe}>
    <select className={styles.dropdown1} id="pipeType" value={selectedPipeType.name} onChange={handlePipeTypeChange}>
        {pipeTypes.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
    </div>

    <br />

    <table className={styles.tableWrapper}>
  <thead>
    <tr>
      <th className={styles.col1}>Flow</th>
      <th className={styles.col1}>Diameter<br />Di ; Ø/DN</th>
      <th className={styles.col1}>Hastighed</th>
      <th className={styles.col1}>Tryktab pr. m</th>
    </tr>
    <tr>
      <th className={styles.col2}>
        <select className={styles.dropdown1} 
          value={flowUnit} 
          onChange={(e) => handleFlowUnitChange(e.target.value as FlowUnit)}>
            <option value="m3/h">m³/h</option>
            <option value="l/h">l/h</option>
            <option value="l/s">l/s</option>
          </select>
      </th>
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
        <select
          className={`${styles.input1} input-cell`}
          data-col="cons_Di"
          value={`${row.cons_Di}; ${row.cons_DN}`}  // Viser den kombinerede værdi i dropdown
          onChange={(e) => {
            // Opdaterer kun cons_Di og cons_DN baseret på den valgte værdi
            const [di, dn] = e.target.value.split('; ');
            handleChange(rowIndex, "cons_Di", di);
            handleChange(rowIndex, "cons_DN", dn);
          }}
        >
          {selectedPipeType.cons_Di.map((di, index) => (
            <option key={di} value={`${di}; ${selectedPipeType.cons_DN[index]}`}>
              {`${di};  ${selectedPipeType.cons_DN[index]}`}
            </option>
          ))}
        </select>
      </td>

        <td>
          <input
            type="text"
            className={getClassForValueV(row.sum_v)}
            value={row.sum_v}
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
    </table>

  </main>
  <Footer />
</div>
  );
};

export default VVSDim;

