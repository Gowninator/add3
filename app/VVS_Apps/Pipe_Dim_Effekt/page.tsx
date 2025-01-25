'use client';

import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles.module.css";
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';


type Row = {
  I_Watt: string;
  cons_Di: string;
  cons_DN: string;
  n_flow2: string;
  sum_v: string;
  r_dP: string;
};


const VVSDim: React.FC = () => {
  type PipeType = {
  name: string;
  cons_r: number;
  cons_Di: number[];
  cons_DN: string[];
  };

  const pipeTypes: PipeType[] = [
    { name: "Geberit - (RSS)",
      cons_r: 0.000007,
      cons_Di: [13.0, 16.0, 19.6, 25.6, 32.0, 39.0, 51.0, 72.1, 84.9, 104.0],
      cons_DN: ["ø15", "ø18", "ø22", "ø28", "ø35", "ø42", "ø54", "ø76.1", "ø88.9", "Ø108"],
    },
    { name: "Geberit - (FZ)",
      cons_r: 0.000007,
      cons_Di: [9.6, 12.6, 15.6, 19.0, 25.0, 32.0, 39.0, 51.0, 72.1, 84.9, 104.0],
      cons_DN: ["Ø12", "Ø15", "Ø18", "Ø22", "Ø28", "Ø35", "Ø42", "Ø54", "Ø76.1", "Ø88.9", "Ø108"],
    },
    { name: "Stålrør, middelsvære (ST)",
      cons_r: 0.00005,
      cons_DN: ["DN8", "DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [8.5, 12.8, 16.0, 21.6, 27.2, 35.9, 41.8, 53.0, 68.8, 80.8, 105.3],
    },
    { name: "Stålrør, sorte glatte sømløse (ST)",
      cons_r: 0.00005,
      cons_DN: ["DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100","DN125", "DN150", "DN200", "DN250", "DN300", "DN350", "DN400", "DN450", "DN500"],
      cons_Di: [16.1, 21.7, 28.5, 37.2, 43.1, 54.5, 70.3, 82.5, 107.1, 131.7, 159.3, 206.5, 260.4, 309.7, 339.6, 388.8, 437.0, 486.0 ],
    },
    { name: "Stålrør, galvaniseret (ST)",
      cons_r: 0.00005,
      cons_DN: ["DN8", "DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [8.5, 12.8, 16.0, 21.6, 27.2, 35.9, 41.8, 53.0, 68.8, 80.8, 105.3],
    },
    {
      name: "Stålrør, svære gevindrør (ST)",
      cons_r: 0.00005,
      cons_DN: ["DN10", "DN15", "DN20", "DN25", "DN32", "DN40", "DN50", "DN65", "DN80", "DN100"],
      cons_Di: [11.7, 14.8, 20.4, 25.6, 34.3, 40.2, 51.3, 67.1, 84.1, 103.5],
    },
    {
      name: "Kobberrør (Cu)",
      cons_r: 0.0000015,
      cons_DN: ["Ø6", "Ø8", "Ø10", "Ø12", "Ø15", "Ø18", "Ø22", "Ø28", "Ø35", "Ø42", "Ø54", "Ø76.1", "Ø88.9", "Ø108"],
      cons_Di: [4.4, 6.4, 8.0, 10.0, 13.0, 16.0, 20.0, 25.0, 32.0, 39.0, 50.0, 72.1, 84.9, 103.0],
    },
    {
      name: "Alu-Pex (APX)",
      cons_r: 0.000007,
      cons_DN: ["Ø16", "Ø20", "Ø25", "Ø32", "Ø40", "Ø50", "Ø63", "Ø75", "Ø90", "Ø110"],
      cons_Di: [12.0, 15.5, 20.0, 26.0, 32.0, 41.0, 51.0, 60.0, 73.0, 90.0],
    },
    {
      name: "Pex (PEX)",
      cons_r: 0.000007,
      cons_DN: ["ø12", "ø15", "ø18", "ø22", "ø28", "ø32", "ø40", "ø50", "ø63", "ø75", "ø90", "ø110"],
      cons_Di: [8.6, 10.0, 13.0, 16.0, 20.0, 23.2, 29.0, 36.2, 45.8, 54.4, 65.4, 79.8],
    },

  ];


  const [autoDim, setAutoDim] = useState<boolean>(true);
  const [rows, setRows] = useState<Row[]>(Array(10).fill({
    I_Watt: "",
    cons_Di: "",
    cons_DN: "",
    n_flow2: "",
    sum_v: "",
    r_dP: "",
  }));

const addRow = () => {
  setRows(prevRows => [
    ...prevRows,
    { I_Watt: "", cons_Di: "", cons_DN: "", n_flow2: "", sum_v: "", r_dP: "" }
    ]);
  };

  const [selectedPipeType, setSelectedPipeType] = useState<PipeType>(pipeTypes[0]);
  const [IC_MaxV, setIC_MaxV] = useState<number>(2);
  const [IC_MaxPD, setIC_MaxPD] = useState<number>(400);
  const [IC_Tf, setIC_Tf] = useState<number>(60);
  const [IC_Tr, setIC_Tr] = useState<number>(30);
  const IC_Temp = (IC_Tf + IC_Tr) / 2;


  const handlePipeTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = pipeTypes.find(type => type.name === event.target.value);
    if (selectedType) {
      setSelectedPipeType(selectedType);
    }
  };


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
  
  const beregnSum = useCallback(() => {
    const PI = Math.PI;
  
    setRows((prevRows) =>
      prevRows.map((row) => {
        const cons_Di = parseFloat(row.cons_Di) || 0; 
        const I_Watt = (parseFloat(row.I_Watt) || 0) ;
        

        const con_DensitetF = IC_Tf !== null ? 999.850+(0.246893*IC_Tf)+(-0.065294)*Math.pow(IC_Tf, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(IC_Tf,3))+(-0.16524*Math.pow(IC_Tf,0.5)) : null;
        const con_DensitetR = IC_Tr !== null ? 999.850+(0.246893*IC_Tr)+(-0.065294)*Math.pow(IC_Tr, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(IC_Tr,3))+(-0.16524*Math.pow(IC_Tr,0.5)) : null;
  
        const con_SpecVarmF = IC_Tf !== null ? 4.218103+(-0.0050041*IC_Tf)+(0.000827196*Math.pow(IC_Tf,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(IC_Tf,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(IC_Tf,3)) : null;
        const con_SpecVarmR = IC_Tr !== null ? 4.218103+(-0.0050041*IC_Tr)+(0.000827196*Math.pow(IC_Tr,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(IC_Tr,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(IC_Tr,3)) : null;
  
        const m_flow = I_Watt !== null && con_DensitetF !== null && con_SpecVarmF !== null && con_SpecVarmR !==null && con_DensitetR !== null ?
        (I_Watt / Math.abs(con_DensitetF*con_SpecVarmF*IC_Tf-con_DensitetR*con_SpecVarmR*IC_Tr) ): null;
        
        
        const n_flow = m_flow !== null ? m_flow *3600 : 0;
        const n_flow2 = m_flow !== null ? m_flow * 3600 * 1000 : 0;

        const densitet: number | null = IC_Temp !== null ? 1.35445e-11 * Math.pow(IC_Temp, 6)- 1.62661e-9 * Math.pow(IC_Temp, 5)  - 2.8678e-7 * Math.pow(IC_Temp, 4)  + 7.26277e-5 * Math.pow(IC_Temp, 3) - 9.08201e-3 * Math.pow(IC_Temp, 2) + 7.89009e-2 * IC_Temp + 9.99802e2 : null;
        const KVisko: number | null = (4.13193e-12 * Math.pow(IC_Temp, 6)- 1.67443e-9 * Math.pow(IC_Temp, 5) + 2.82484e-7 * Math.pow(IC_Temp, 4)- 2.62224e-5 * Math.pow(IC_Temp, 3)  + 1.52463e-3 * Math.pow(IC_Temp, 2) - 6.16127e-2 * IC_Temp + 1.79794)/1000000;
      
      
        const m_radius = cons_Di / 2 ;
        const sum_A = (PI * Math.pow(m_radius,2)) / 1000000;
  
        const sum_v = n_flow > 0 ? ((n_flow / 3600) / (sum_A)) : 0;
        const d_h = n_flow > 0 ? cons_Di / 1000 : 0;
        const p_d = n_flow > 0 && densitet !== null ? 0.5 * densitet * Math.pow(sum_v, 2) : 0;
        const r_re = (d_h * sum_v) / KVisko;
        const sum_cole = colebrook(r_re, cons_Di, selectedPipeType.cons_r);
        const r_dP = n_flow > 0 ? sum_cole * p_d / d_h : 0;
  
        return {
          ...row,
          n_flow2: n_flow2.toFixed(2),
          sum_v: sum_v.toFixed(2),
          r_dP: r_dP.toFixed(2),
        };
      })
    );
  }, [IC_Tf, IC_Tr, selectedPipeType, rows, IC_Temp, colebrook]);
  
  const selectNb = useCallback((I_Watt: number): { Di: number } => {
    const pipeSize = selectedPipeType.cons_Di;
    const PI = Math.PI;
  
    for (let i = 0; i < pipeSize.length; i++) {
      const n_di = pipeSize[i];
        const cons_Di = n_di; 

        const con_DensitetF = IC_Tf !== null ? 999.850+(0.246893*IC_Tf)+(-0.065294)*Math.pow(IC_Tf, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(IC_Tf,3))+(-0.16524*Math.pow(IC_Tf,0.5)) : null;
        const con_DensitetR = IC_Tr !== null ? 999.850+(0.246893*IC_Tr)+(-0.065294)*Math.pow(IC_Tr, 1.5)+(7.7770*Math.pow(10,-7)*Math.pow(IC_Tr,3))+(-0.16524*Math.pow(IC_Tr,0.5)) : null;
  
        const con_SpecVarmF = IC_Tf !== null ? 4.218103+(-0.0050041*IC_Tf)+(0.000827196*Math.pow(IC_Tf,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(IC_Tf,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(IC_Tf,3)) : null;
        const con_SpecVarmR = IC_Tr !== null ? 4.218103+(-0.0050041*IC_Tr)+(0.000827196*Math.pow(IC_Tr,1.5))+(-7.44273*Math.pow(10,-6)*Math.pow(IC_Tr,2.5))+(4.15557*Math.pow(10,-7)*Math.pow(IC_Tr,3)) : null;
  
        const m_flow = I_Watt !== null && con_DensitetF !== null && con_SpecVarmF !== null && con_SpecVarmR !==null && con_DensitetR !== null ?
        (I_Watt / Math.abs(con_DensitetF*con_SpecVarmF*IC_Tf-con_DensitetR*con_SpecVarmR*IC_Tr) ): null;

        
        const n_flow = m_flow !== null ? m_flow * 3600: 0;
        const n_flow2 = m_flow !== null ? m_flow * 3600 * 1000 : 0;

        const densitet: number | null = IC_Temp !== null ? 1.35445e-11 * Math.pow(IC_Temp, 6)- 1.62661e-9 * Math.pow(IC_Temp, 5)  - 2.8678e-7 * Math.pow(IC_Temp, 4)  + 7.26277e-5 * Math.pow(IC_Temp, 3) - 9.08201e-3 * Math.pow(IC_Temp, 2) + 7.89009e-2 * IC_Temp + 9.99802e2 : null;
        const KVisko: number | null = (4.13193e-12 * Math.pow(IC_Temp, 6)- 1.67443e-9 * Math.pow(IC_Temp, 5) + 2.82484e-7 * Math.pow(IC_Temp, 4)- 2.62224e-5 * Math.pow(IC_Temp, 3)  + 1.52463e-3 * Math.pow(IC_Temp, 2) - 6.16127e-2 * IC_Temp + 1.79794)/1000000;
      
        const m_radius = cons_Di / 2 ;
        const sum_A = (PI * Math.pow(m_radius,2)) / 1000000;
  
        const sum_v = n_flow > 0 ? ((n_flow / 3600) / (sum_A)) : 0;
        const d_h = n_flow > 0 ? cons_Di / 1000 : 0;
        const p_d = n_flow > 0 && densitet !== null ? 0.5 * densitet * Math.pow(sum_v, 2) : 0;
        const r_re = (d_h * sum_v) / KVisko;
        const sum_cole = colebrook(r_re, cons_Di, selectedPipeType.cons_r);
        const r_dP = n_flow > 0 ? sum_cole * p_d / d_h : 0;

      if (sum_v <= IC_MaxV && r_dP <= IC_MaxPD) {
        return { Di: n_di };
      }
    }
    return { Di: pipeSize[pipeSize.length - 1] };
  }, [IC_Tf, IC_Tr, selectedPipeType, IC_Temp, colebrook, IC_MaxV, IC_MaxPD]);
  
  const AutoDimAlt = () => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        const I_Watt = parseFloat(row.I_Watt) || 0;
  
        if (I_Watt > 0) {
          const selectedNb = selectNb(I_Watt);
          return {
            ...row,
            cons_Di: selectedNb.Di.toString(),
            cons_DN: findDN(selectedNb.Di),
          };
        }
  
        return row;
      })
    );
  
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
      }
  
      if (nextIndex >= 0 && nextIndex < allCells.length) {
        allCells[nextIndex].focus();
      }
    }
  };
 
  useEffect(() => {
      setRows((prevRows) =>
          prevRows.map((row) => {
            const I_Watt = parseFloat(row.I_Watt) || 0;
      
            if (I_Watt > 0) {
              const selectedNbResult = selectNb(I_Watt);
              return {
                ...row,
                cons_Di: selectedNbResult.Di.toString(),
                cons_DN: findDN(selectedNbResult.Di),
              };
            }
      
            return row;
          })
      );
      beregnSum();
  }, [IC_MaxV, IC_MaxPD, IC_Temp,selectedPipeType, beregnSum, selectNb]);
  
  const handleChange = (index: number, field: keyof Row, value: string) => {
    setRows((prevRows) =>
      prevRows.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );

    if (autoDim && field === "I_Watt") {
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
    beregnSum();
  };
  
  const findDN = (di: number) => {
    const index = selectedPipeType.cons_Di.indexOf(di);
    return index !== -1 ? selectedPipeType.cons_DN[index].toString() : "";
  };


  const getClassForValueV = (value: string) => {
    const numericValue = parseFloat(value);
    return numericValue > IC_MaxV ? styles.highValue : styles.lowValue;
  };

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
          
          Formel: q<sub>v</sub> =  	&#x3A6;/(ρ<sub>f</sub>·c<sub>pf</sub>·T<sub>f</sub> - ρ<sub>r</sub>·c<sub>pr</sub>·T<sub>r</sub>)
      
          <dd>
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
            <br />
            (Kapitel 9: Varme Ståbi 7. udgave)
          </dd>
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



    <h1 className={styles.heading}>VVS rør dimensionering </h1>

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
          <label htmlFor="IC_Tf">Vand temperatur frem (°C): </label>
          <input
          className={styles.inputFMaks}
            id="IC_Tf"
            type="number"
            value={IC_Tf ?? ''}
            onChange={(e) => setIC_Tf(parseFloat(e.target.value))}
          />
        </div>
        <div className={styles.inputMaks}>
          <label htmlFor="IC_Tr">Vand temperatur retur (°C): </label>
          <input
          className={styles.inputFMaks}
            id="IC_Tr"
            type="number"
            value={IC_Tr ?? ''}
            onChange={(e) => setIC_Tr(parseFloat(e.target.value))}
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
    <select id="pipeType" value={selectedPipeType.name} onChange={handlePipeTypeChange}>
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
      <th className={styles.col1}>Effekt</th>
      <th className={styles.col1}>Diameter<br />Di ; Ø/DN</th>
      <th className={styles.col1}>Flow</th>
      <th className={styles.col1}>Hastighed</th>
      <th className={styles.col1}>Tryktab pr. m</th>
    </tr>
    <tr>
      <th className={styles.col2}>[kW]</th>
      <th className={styles.col2}>[mm]</th>

      <th className={styles.col2}>[L/h;]</th>
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
            data-col="I_Watt"
            value={row.I_Watt}
            onChange={(e) => handleChange(rowIndex, "I_Watt", e.target.value)}
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
            className={`${styles.input2} sum-cell`}
            value={row.n_flow2}
            readOnly
          />
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

