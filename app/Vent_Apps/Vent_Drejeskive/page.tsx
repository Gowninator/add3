'use client';

import React, { useState } from 'react';
import styles from './styles.module.css'; // Import CSS module
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const MyComponent = () => {
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [valueA, setValueA] = useState<number | null>(null);
  const [valueB, setValueB] = useState<number | null>(null);
  const [results, setResults] = useState<{ label: string; value: number | null }[]>([]);
  const [showAssumptions, setShowAssumptions] = useState<boolean>(false);
  const [valueC_DIA, setValueC_DIA] = useState<number | null>(null);
  const [valueC_DP, setValueC_DP] = useState<number | null>(null);
  const [valueC_Q, setValueC_Q] = useState<number | null>(null);
  const [valueC_V, setValueC_V] = useState<number | null>(null);
 


  // Mapping between internal values and display names
  const buttonLabels: { [key: string]: string } = {
    'C_DIA': 'Diameter [mm]',
    'C_DP': 'Tryktab [Pa/m]',
    'C_Q': 'Luftmængde [m³/h]',
    'C_V': 'Hastighed [m/s]',
    'C_AB': 'AxB  [mm]',
  };

  // Knap til at vise og skjule forudsætninger
  const handleToggleAssumptions = () => {
    setShowAssumptions(!showAssumptions);
  };

  const handleButtonClick = (value: string) => {
    setSelectedButtons((prev) => {
       // Hvis 'C_DIA' og 'C_AB' ikke kan vælges sammen
       if ((value === 'C_DIA' && prev.includes('C_AB')) || (value === 'C_AB' && prev.includes('C_DIA'))) {
        // Hvis det modsatte er valgt, fjerner vi den
        return [value]; // Kun den valgte knap bliver markeret
      } else

      if (prev.includes(value)) {
        // Fjern knappen, hvis den allerede er valgt
        resetValuesForButton(value); // Nulstil værdier for denne knap
        return prev.filter((button) => button !== value);
      } else if (prev.length < 2) {
        // Tilføj knappen, hvis der er færre end 2 knapper valgt
        return [...prev, value];
      }
      return prev; // Hvis 2 knapper allerede er valgt, gør ingenting
    });
  };
  
  // Funktion til at nulstille værdier for en specifik knap
  const resetValuesForButton = (button: string) => {
    switch (button) {
      case 'C_DIA': // Diameter
        setValueC_DIA(null);
        setValueC_DP(null);
        setValueC_Q(null);
        setValueC_V(null);
        setResults([]);
        break;
      case 'C_DP': // Tryktab
        setValueC_DIA(null);
        setValueC_DP(null);
        setValueC_Q(null);
        setValueC_V(null);
        setResults([]);
        break;
      case 'C_Q': // Luftmængde
        setValueC_DIA(null);
        setValueC_DP(null);
        setValueC_Q(null);
        setValueC_V(null);
        setResults([]);
        break;
      case 'C_V': // Hastighed
        setValueC_DIA(null);
        setValueC_DP(null);
        setValueC_Q(null);
        setValueC_V(null);
        setResults([]);
        break;
      case 'C_AB': // AxB
        setValueA(null);
        setValueB(null);
        setResults([]);
        break;
      default:
        break;
    }
  };
  
  // Funktion til at nulstille alle værdier (valgfri til generelle scenarier)----UBRUGT
  const resetAllValues = () => {
    setValueA(null);
    setValueB(null);
    
  };
  

  //Konstanter 
  const C_Ruhed = 0.00015; // Ruhed [m]
  const C_Visko = 0.0000151000; // Kinematisk viskositet[m^2/s]
  const C_Densitet = 1.205; // Densitet [kg/m3]

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

    //const term2 = (-1 / (2 * Math.pow(m_f, 1.5))) - ((2 * 2.51) / (Math.LN10 * reynolds * Math.pow(m_f, 1.5) * ((roughness / diameter) / 3.7 + 2.51 / (reynolds * Math.sqrt(m_f)))));
    

    // Funktion til at beregne resultater baseret på valgte knapper og værdier unden konstanter og Colebrook
    const calculate = () => {
      if (selectedButtons.length === 2) {
        const calculations: { label: string; value: number }[] = [];
        const [first, second] = selectedButtons;
    
        // Deklarer variabler én gang uden for switch-blokken
        let DIA: number | null = null;
        let Q: number | null = null;
        let DP: number | null = null;
        let V: number | null = null;
        let A: number | null = null;
        let B: number | null = null;
        let reynolds: number;
        let frictionFactor: number;
        let dynamicPressure: number;
        let Areal: number;
        let R_DP: number = 0;
        let R_V: number;
        let R_Q: number;
        let f: number;
        let tolerance: number;
        let maxIterations: number;
        let velocity: number = 0;
        let converged: boolean;
        let DIA_Equivalent: number;
        let re : number;
        let reynoldsNumber: number;
    
        // Brug kombinationen af de valgte knapper til at bestemme beregningerne
        // Ved at bruge ! fortæller vi TypeScript, at værdien ikke er null
        switch (`${[first, second].sort().join('|')}`) {
          case 'C_DIA|C_Q': // __________OK______________________
            DIA = valueC_DIA!;
            Q = valueC_Q!;
            Areal = Math.PI * Math.pow(DIA!/ 2, 2)/1000000; //m^2
            R_V = Q!/3600 / Areal; //m/s

            reynolds = (DIA! / 1000) * R_V! / C_Visko;
            frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
            dynamicPressure = 0.5 * C_Densitet * Math.pow(R_V!, 2);
            R_DP = frictionFactor * dynamicPressure / (DIA!/1000);
    
            calculations.push({ label: 'Tryktab [Pa/m]', value: parseFloat(R_DP.toFixed(2)) }); // Beregning for C_DP
            calculations.push({ label: 'Hastighed [m/s]', value: parseFloat(R_V.toFixed(2)) }); // Beregning for C_V
            break;
            
          case 'C_DIA|C_DP': // ____________OK?____________________
            DIA = valueC_DIA!;
            DP = valueC_DP!; // Ønsket tryktab pr. meter
            Areal = Math.PI * Math.pow(DIA! / 2, 2) / 1000000; // Areal i m²
          
            //Q = 1; // Start med et gæt for luftmængden i m³/h
            // Beregn hastighed vha. Darcy-Weisbach-ligningen
            velocity = Math.sqrt((2 * DP) / (0.02* C_Densitet * DIA!));
            Q = velocity * Areal * 3600; // Beregn luftmængden baseret på hastigheden
            R_DP = 0; // Initialiser beregnet tryktab
            tolerance = 0.005; // Tolerance for forskellen i tryktab (Pa/m)
            maxIterations = 0; // Iterationscounter for debugging
          
            while (Math.abs(R_DP - DP) > tolerance) {
              // Beregn hastighed baseret på gættet Q
              R_V = Q / 3600 / Areal; // Hastighed i m/s
          
              // Beregn Reynolds-tal
              reynolds = (DIA! / 1000) * R_V / C_Visko;
          
              // Beregn friktionsfaktor
              frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
          
              // Beregn dynamisk tryk
              dynamicPressure = 0.5 * C_Densitet * Math.pow(R_V, 2);
          
              // Beregn tryktab pr. meter
              R_DP = frictionFactor * dynamicPressure / (DIA! / 1000);
          
              // Juster gættet luftmængde baseret på fejl
              Q += (DP - R_DP) * 2; // 5 er læringsraten
          
              // Undgå uendelig løkke
              maxIterations++;
              if (maxIterations > 7000000) {
                throw new Error('Iterationen kunne ikke konvergere. Kontrollér inddata.');
              }
            }
          
            R_V = Q / 3600 / Areal; // Hastighed i m/s


            // Når loopet er afsluttet, gem resultaterne
            calculations.push({label: 'Luftmængde [m³/h]',value: parseFloat(Q.toFixed(0)),});// Flow
            calculations.push({label: 'Hastighed [m/s]',value: parseFloat(R_V.toFixed(2)),});// Hastighed
            
            break;
          
          case 'C_DIA|C_V': // __________OK______________________
            DIA = valueC_DIA!; //mm
            V = valueC_V!; //m3/h
                      
            R_Q = (Math.PI * Math.pow(DIA! / 1000, 2) / 4) * V! * 3600;
  
            reynolds = (DIA! / 1000) * V! / C_Visko;
            frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
            dynamicPressure = 0.5 * C_Densitet * Math.pow(V!, 2);

            R_DP = frictionFactor * dynamicPressure / (DIA!/1000);
            
            calculations.push({ label: 'Luftmængde [m³/h]', value: parseFloat(R_Q.toFixed(2))}); // Beregning for C_Q
            calculations.push({ label: 'Tryktab [Pa/m]', value: parseFloat(R_DP.toFixed(2)) }); // Beregning for C_DP
            break;
            
          case 'C_DP|C_Q': //__________OK______________________
            DP = valueC_DP!; // Tryktab
            Q = valueC_Q!/3600; // m³/h

            // Konstantparametre
            const minDiameter = 0.005; // Startværdi for diameter (i meter, Ø50mm)
            const maxDiameter = 6.0;  // Maksimal diameter (i meter, Ø3000mm)
            const step = 0.001;       // Trin på 1mm (i meter)
            tolerance = 1e-6;   // Tolerance for konvergens
        
            converged = false;        // Konvergensindikator
            let finalDiameter = 0;    // Fundne diameter
            f = 0.02;                 // Startværdi for friktionsfaktor
        
            // Iterer over mulige diametre
            for (let dia = minDiameter; dia <= maxDiameter; dia += step) {
                // Beregn hastighed baseret på flow og diameter
                velocity = (4 * Q) / (Math.PI * Math.pow(dia, 2));
        
                // Beregn Reynolds-tal
                reynolds = (velocity * dia) / C_Visko;
        
                // Opdater friktionsfaktoren vha. Tor Wadmarks formel
                f = 1 / Math.pow(-2 * Math.log10((C_Ruhed / (3.7 * dia)) + (5.74 / Math.pow(reynolds, 0.9))),2);
        
                // Beregn tryktabet for denne diameter
                R_DP = f * (C_Densitet * Math.pow(velocity, 2)) / (2 * dia);
        
                // Kontroller, om tryktabet er inden for grænsen
                if (R_DP <= DP) {
                    converged = true;
                    finalDiameter = dia;
                    break;
                }
            }
            finalDiameter * 1000
            console.log(`Diameter: ${parseFloat((finalDiameter * 1000).toFixed(2))} mm`);
            console.log(`Hastighed: ${parseFloat(velocity.toFixed(2))} m/s`);
            console.log(`Tryktab: ${parseFloat(R_DP.toFixed(2))} Pa/m`);
            console.log(DP);
            console.log(Q);
            // Resultater
            if (converged) {
                calculations.push({ label: 'Diameter [mm]', value: parseFloat((finalDiameter * 1000).toFixed(2)) }); // Diameter i mm
                calculations.push({ label: 'Hastighed [m/s]', value: parseFloat(velocity .toFixed(2)) });              // Hastighed i m/s
                calculations.push({ label: 'Tryktab [Pa/m]', value: parseFloat(R_DP.toFixed(2)) }); // Beregning for C_DP
            } else {
                console.error("Ingen passende diameter fundet indenfor det tilladte interval");
                calculations.push({ label: "Ingen passende diameter fundet indenfor det tilladte interval (Ø50-Ø6000)", value: null! });
            }
            break;

          case 'C_AB|C_Q'://__________OK______________________
            A = valueA;
            B = valueB;

            DIA = (2 * A! * B!) / (A! + B!); //Hydraulisk diameter
            DIA_Equivalent = (1.3 * Math.pow(valueA! * valueB!, 0.625)) / Math.pow(valueA! + valueB!, 0.25); //Ækvivalent diameter ASHRAR Handbook of Fundamentals 1948
            

            Q = valueC_Q!; //m³/h
            Areal = A! * B!/1000000; //m^2
            R_V = Q!/3600 / Areal; //m/s

            reynolds = (DIA! / 1000) * R_V! / C_Visko;
            frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
            dynamicPressure = 0.5 * C_Densitet * Math.pow(R_V!, 2);
            R_DP = frictionFactor * dynamicPressure / (DIA!/1000);
    
            calculations.push({ label: 'Tryktab [Pa/m]', value: parseFloat(R_DP .toFixed(2)) }); // Beregning for C_DP
            calculations.push({ label: 'Hastighed [m/s]', value: parseFloat(R_V .toFixed(2)) }); // Beregning for C_V
            calculations.push({ label: 'Hydraulisk diameter [mm]', value: parseFloat(DIA.toFixed(2)) }); // Beregning for C_DIA
            calculations.push({ label: 'Ækvivalent diameter [mm]', value: parseFloat(DIA_Equivalent.toFixed(2)) }); // Beregning for C_DIA
            break;
          case 'C_AB|C_DP': //__________OK ?______________________
            A = valueA; //mm
            B = valueB; //mm
            DIA = ((2 * A! * B!) / (A! + B!)); //Hydraulisk diameter i meter
            DIA_Equivalent = (1.3 * Math.pow(valueA! * valueB!, 0.625)) / Math.pow(valueA! + valueB!, 0.25); //[mm] Ækvivalent diameter ASHRAR Handbook of Fundamentals 1948
            DP = valueC_DP!; // Ønsket tryktab pr. meter
            Areal = A! * B!/1000000; //m^2 
          
            //Q = 10; // Start med et gæt for luftmængden i m³/h
            // Beregn hastighed vha. Darcy-Weisbach-ligningen
            velocity = Math.sqrt((2 * DP) / (0.02* C_Densitet * DIA!));
            Q = velocity * Areal * 3600; // Beregn luftmængden baseret på hastigheden
            R_DP = 0; // Initialiser beregnet tryktab
            tolerance = 0.005; // Tolerance for forskellen i tryktab (Pa/m)
            maxIterations = 0; // Iterationscounter for debugging
          
            while (Math.abs(R_DP - DP) > tolerance) {
              // Beregn hastighed baseret på gættet Q
              R_V = Q / 3600 / Areal; // Hastighed i m/s
          
              // Beregn Reynolds-tal
              reynolds = (DIA! / 1000) * R_V / C_Visko;
          
              // Beregn friktionsfaktor
              frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
          
              // Beregn dynamisk tryk
              dynamicPressure = 0.5 * C_Densitet * Math.pow(R_V, 2);
          
              // Beregn tryktab pr. meter
              R_DP = frictionFactor * dynamicPressure / (DIA! / 1000);
          
              // Juster gættet luftmængde baseret på fejl
              Q += (DP - R_DP) * 10; // 10 er læringsraten
          
              // Undgå uendelig løkke
              maxIterations++;
              if (maxIterations > 7000000) {
                throw new Error('Iterationen kunne ikke konvergere. Kontrollér inddata.');
              }
            }
          
            R_V = Q / 3600 / Areal; // Hastighed i m/s


            // Når loopet er afsluttet, gem resultaterne
            calculations.push({label: 'Luftmængde [m³/h]',value: parseFloat(Q.toFixed(0)),});// Flow
            calculations.push({label: 'Hastighed [m/s]',value: parseFloat(R_V.toFixed(2)),});// Hastighed
            
            calculations.push({ label: 'Hydraulisk diameter [mm]', value: parseFloat((DIA!).toFixed(2)) }); // Beregning for C_DIA
            calculations.push({ label: 'Ækvivalent diameter [mm]', value: parseFloat(DIA_Equivalent.toFixed(2)) }); // Beregning for C_DIA
            break;
          case 'C_AB|C_V': //__________OK______________________
            A = valueA; //mm  
            B = valueB; //mm
            V = valueC_V!; //m3/h;
            DIA = (2 * A! * B!) / (A! + B!); //Hydraulisk diameter
            DIA_Equivalent = (1.3 * Math.pow(valueA! * valueB!, 0.625)) / Math.pow(valueA! + valueB!, 0.25); //Ækvivalent diameter ASHRAR Handbook of Fundamentals 1948
            
            Areal = A! * B!/1000000; //m^2          
            R_Q = Areal * V! * 3600;
  
            reynolds = (DIA! / 1000) * V! / C_Visko;
            frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
            dynamicPressure = 0.5 * C_Densitet * Math.pow(V!, 2);

            R_DP = frictionFactor * dynamicPressure / (DIA!/1000);
            
            calculations.push({ label: 'Luftmængde [m³/h]', value: parseFloat(R_Q.toFixed(2)) }); // Beregning for C_Q
            calculations.push({ label: 'Tryktab [pa/m]', value: parseFloat(R_DP.toFixed(2)) }); // Beregning for C_DP
            calculations.push({ label: 'Hydraulisk diameter [mm]', value: parseFloat(DIA.toFixed(2)) }); // Beregning for C_DIA
            calculations.push({ label: 'Ækvivalent diameter [mm]', value: parseFloat(DIA_Equivalent.toFixed(2)) }); // Beregning for C_DIA
            break;
          case 'C_DP|C_V': // __________OK______________________
          DIA = valueC_DIA!;
          Q = valueC_Q!;
          Areal = Math.PI * Math.pow(DIA!/ 2, 2)/1000000; //m^2
          R_V = Q!/3600 / Areal; //m/s

          reynolds = (DIA! / 1000) * R_V! / C_Visko;
          frictionFactor = colebrook(reynolds, DIA! / 1000, C_Ruhed);
          dynamicPressure = 0.5 * C_Densitet * Math.pow(R_V!, 2);
          R_DP = frictionFactor * dynamicPressure / (DIA!/1000);
  
            calculations.push({ label: 'Wow wow, der er jo en hel galakse af løsninger til den her kombination!   -  ', value: Infinity }); // Beregning for C_DP"});
          break;

        }
    
        // Gem resultater med beregnede værdier
        setResults(calculations);
      }
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
          De forudsætninger, der er gjort i beregningen af det nødvendige luftskifte, er som følger:
              </p>
              <ul>
                <li>Tør luft ved 1 atm og 20°C (101325 Pa)</li>
                <li>Luftens densitet er konstant og sat til 1,205 kg/m³.</li>
                <li>Antager turbulent strømning og bruger Colebrook-formlen til at beregne friktionsfaktoren i en rørledning ved hjælp af Newton-Raphson-metoden. Iterationen fortsætter, indtil forskellen er mindre end en tolerance på 1e-5, hvilket sikrer en præcis løsning. </li>
                <li>Ved valgt "Tryktab" og "Luftmængde" er friktionsfaktoren fundet vha. Tor Wadmarks formel </li>
                <li>Kinematiske viskositet har en værdi på 0.0000151000 m<sup>2</sup>/s.</li>
              </ul>
            </div>
          )}


          <div className={styles.AppContainer}>
            <h1>Rør-/Kanal dimensionering</h1>
            <div className={styles.buttonBox}>
              {/* Section for button selection */}
              <div>
                {Object.keys(buttonLabels).map((button) => (
                  <button
                    key={button}
                    onClick={() => handleButtonClick(button)}
                    className={`${styles.button} ${selectedButtons.includes(button) ? styles.selected : ''}`}>
                    {buttonLabels[button]}
                  </button>
                ))}
              </div>
             </div>
    
            <div className={styles.inputBox}>
            {selectedButtons.includes('C_DIA') && (
            <div className={styles.inputGroup}>
              <label htmlFor="valueC_DIA">Diameter [mm]</label>
              <input
                id="valueC_DIA"
                className={styles.input}
                type="number"
                value={valueC_DIA !== null ? valueC_DIA.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueC_DIA(input === '' ? null : parseFloat(input));
                }}
                placeholder="0-3000 mm"
              />
            </div>
          )}

          {selectedButtons.includes('C_DP') && (
            <div className={styles.inputGroup}>
              <label htmlFor="valueC_DP">Tryktab [Pa/m]</label>
              <input
                id="valueC_DP"
                className={styles.input}
                type="number"
                value={valueC_DP !== null ? valueC_DP.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueC_DP(input === '' ? null : parseFloat(input));
                }}
                placeholder="Værdi"
              />
            </div>
          )}

          {selectedButtons.includes('C_Q') && (
            <div className={styles.inputGroup}>
              <label htmlFor="valueC_Q">Luftmængde [m³/h]</label>
              <input
                id="valueC_Q"
                className={styles.input}
                type="number"
                value={valueC_Q !== null ? valueC_Q.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueC_Q(input === '' ? null : parseFloat(input));
                }}
                placeholder="Værdi"
              />
            </div>
          )}

          {selectedButtons.includes('C_V') && (
            <div className={styles.inputGroup}>
              <label htmlFor="valueC_V">Hastighed [m/s]</label>
              <input
                id="valueC_V"
                className={styles.input}
                type="number"
                value={valueC_V !== null ? valueC_V.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueC_V(input === '' ? null : parseFloat(input));
                }}
                placeholder="Værdi"
              />
            </div>
          )}

          {selectedButtons.includes('C_AB') && (
            <div className={styles.inputGroup}>
              <label htmlFor="valueA">A (Bredde) [mm]</label>
              <input
                id="valueA"
                className={styles.input}
                type="number"
                value={valueA !== null ? valueA.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueA(input === '' ? null : parseFloat(input));
                }}
                placeholder="0-3000 mm"
              />
              <br />
              <label htmlFor="valueB">B (Højde) [mm]</label>
              <input
                id="valueB"
                className={styles.input}
                type="number"
                value={valueB !== null ? valueB.toString() : ''}
                onChange={(e) => {
                  const input = e.target.value;
                  setValueB(input === '' ? null : parseFloat(input));
                }}
                placeholder="0-3000 mm"
              />
            </div>
          )}






            </div>
          
            
            <button className={`${styles.button} ${styles.calculate}`} onClick={calculate}>
              Beregn
            </button>
            
          {/* Display results */}
          <div className={styles.results}>
            {results.map((result, index) => (
              <p key={index}>
                {result.label} {result.value !== null ? result.value : ''}
              </p>
            ))}
          </div>
          </div>
        </main>
        <Footer />
      </div>
    );
    
  };
  
  export default MyComponent;