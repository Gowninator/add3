'use client';

import React, { useState } from 'react';
import styles from './styles.module.css';
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const KvCalculator: React.FC = () => {
  const [values, setValues] = useState({
    q1: '', // q [l/h]
    dP1: '', // dP [kPa]

    q2: '', // q [m³/h]
    dP2: '', // dP [kPa]

    q3: '', // q [m³/h]
    Kv3: '', // Kv [m³/h]

    q4: '', // q [m³/h]
    dP4: '', // dP [bar]

    q5: '', // q [m³/h]
    kv5: '', // Kv [m³/h]

    q6: '', // q [m³/h]
    dP6: '', // dP [bar]

    q7: '', // q [m³/h]
    dP7: '', // dP [bar]

    q8: '', // q [m³/h]
    Kv8: '', // Kv [m³/h]

    Kv9: '', // Kv [m³/h]
    dP9: '', // dP [bar]

    Kv10: '', // Kv [m³/h]
    dP10: '', // dP [bar]



  });

  const calculateResult = (group: string): string => {
    const parsedValues = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
    );
  
    switch (group) {
      case 'formula1': {
        const { q1, dP1 } = parsedValues;
        if (q1 > 0 && dP1 > 0) {
          return ((0.01 * q1) / Math.sqrt(dP1)).toFixed(2);
        }
        return ''; // Returnér en tom streng, hvis en af værdierne mangler
      }
      case 'formula2': {
        const { q2, dP2 } = parsedValues;
        if (q2 > 0 && dP2 > 0) {
          return ((10 * q2) / Math.sqrt(dP2)).toFixed(2);
        }
        return '';
      }
      case 'formula3': {
        const { q3, Kv3 } = parsedValues;
        if (q3 > 0 && Kv3 > 0) {
          return ((100 * Math.pow(q3, 2)) / Math.pow(Kv3, 2)).toFixed(2);
        }
        return '';
      }
      case 'formula4': {
        const { q4, dP4 } = parsedValues;
        if (q4 > 0 && dP4 > 0) {
          return ((q4) / Math.sqrt(dP4)).toFixed(2);
        }
        return '';
      }
      case 'formula5': {
        const { q5, kv5 } = parsedValues;
        if (q5 > 0 && kv5 > 0) {
          return ((Math.pow(q5,2)) / Math.pow(kv5,2)).toFixed(2);
        }
        return '';
      }
      case 'formula6': {
        const { q6, dP6 } = parsedValues;
        if (q6 > 0 && dP6 > 0) {
          return ((36 * q6) / Math.sqrt(dP6)).toFixed(2);
        }
        return '';
      }
      case 'formula7': {
        const { q6, dP6 } = parsedValues;
        if (q6 > 0 && dP6 > 0) {
          return (q6 / Math.sqrt(dP6 / 10)).toFixed(2);
        }
        return '';
      }
      case 'formula8': {
        const { q8, Kv8 } = parsedValues;
        if (q8 > 0 && Kv8 > 0) {
          return ((10 * Math.pow(q8, 2)) / Math.pow(Kv8, 2)).toFixed(2);
        }
        return '';
      }
      case 'formula9': {
        const { Kv9, dP9 } = parsedValues;
        if (Kv9 > 0 && dP9 > 0) {
          return (Kv9 * Math.sqrt(dP9)).toFixed(2);
        }
        return '';
      }
      case 'formula10': {
        const { Kv10, dP10 } = parsedValues;
        if (Kv10 > 0 && dP10 > 0) {
          return (Kv10 * Math.sqrt(dP10 / 100)).toFixed(2);
        }
        return '';
      }

      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const { value } = e.target;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, padding: '0.5%' }}>
        <div className={styles.navbar}>
          <Link href="/">
            <button className={styles.HKnap}>Startside</button>
          </Link>
        </div>

        <div className={styles.container1}>
          <h2>Beregning af Kv-værdi for reguleringsventiler <br /> (BETA)</h2>
          <div className={styles.container2}>
          {/* Formel 1 */}
          <div className={styles.inputGroup}>
            <h3>Kv = 0.01 · q / √dP</h3>
            <div className={styles.inputField}>
              <label htmlFor="q1">q [l/h]</label>
              <input
              id="q1"
              type="number"
              step="any"
              placeholder="[l/h]"
              value={values.q1}
              onChange={(e) => handleChange(e, 'q1')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="dP1">dP [kPa]</label>
              <input
              id="dP1"
              type="number"
              step="any"
              placeholder="[kPa]"
              value={values.dP1}
              onChange={(e) => handleChange(e, 'dP1')}
              /></div>
            <h4>
            Kv: {calculateResult('formula1') !== '' ? `${calculateResult('formula1')} m³/h` : ''}
            </h4>
          </div>


          {/* Formel 2 */}
          <div className={styles.inputGroup}>
            <h3>Kv = 10 · q / √dP</h3>
            <div className={styles.inputField}>
              <label htmlFor="q2">q [m³/h]</label>
              <input
              id="q2"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.q2}
              onChange={(e) => handleChange(e, 'q2')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="dP2">dP [kPa]</label>
              <input
              id="dP2"
              type="number"
              step="any"
              placeholder="[kPa]"
              value={values.dP2}
              onChange={(e) => handleChange(e, 'dP2')}
              /></div>
            <h4>
            Kv: {calculateResult('formula2') !== '' ? `${calculateResult('formula2')} m³/h` : ''}
            </h4>
          </div>

          {/* Formel 3 */}
          <div className={styles.inputGroup}>
            <h3>dP = 100 · q² / Kv²</h3>
            <div className={styles.inputField}>
              <label htmlFor="q3">q [m³/h]</label>
              <input
              id="q3"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.q3}
              onChange={(e) => handleChange(e, 'q3')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="Kv3">Kv [m³/h]</label>
              <input
              id="Kv3"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.Kv3}
              onChange={(e) => handleChange(e, 'Kv3')}
              /></div>
            <h4>
            Kv: {calculateResult('formula3') !== '' ? `${calculateResult('formula3')} kPa` : ''}
            </h4>
          </div>

          {/* Formel 4 */}
          <div className={styles.inputGroup}>
            <h3>Kv = q / √dP</h3>
            <div className={styles.inputField}>
              <label htmlFor="q4">q [m³/h]</label>
              <input
              id="q4"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.q4}
              onChange={(e) => handleChange(e, 'q4')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="dP4">dP [bar]</label>
              <input
              id="dP4"
              type="number"
              step="any"
              placeholder="bar"
              value={values.dP4}
              onChange={(e) => handleChange(e, 'dP4')}
              /></div>
            <h4>
            Kv: {calculateResult('formula4') !== '' ? `${calculateResult('formula4')} m³/h` : ''}
            </h4>
          </div>

          {/* Formel 5 */}
          <div className={styles.inputGroup}>
            <h3>Kv = q² / Kv²</h3>
            <div className={styles.inputField}>
              <label htmlFor="q5">q [m³/h]</label>
              <input
              id="q5"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.q5}
              onChange={(e) => handleChange(e, 'q5')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="kv5">Kv [m³/h]</label>
              <input
              id="kv5"
              type="number"
              step="any"
              placeholder="[m³/h]"
              value={values.kv5}
              onChange={(e) => handleChange(e, 'kv5')}
              /></div>
            <h4>
            Kv: {calculateResult('formula5') !== '' ? `${calculateResult('formula5')} bar` : ''}
            </h4>
          </div>

          {/* Formel 6 */}
          <div className={styles.inputGroup}>
            <h3>Kv = 36 · q / √dP</h3>
            <div className={styles.inputField}>
              <label htmlFor="q6">q [l/s]</label>
              <input
              id="q6"
              type="number"
              step="any"
              placeholder="[l/s]"
              value={values.q6}
              onChange={(e) => handleChange(e, 'q6')}
              /></div>
              <div className={styles.inputField}>
              <label htmlFor="dP6">dP [kPa]</label>
              <input
              id="dP6"
              type="number"
              step="any"
              placeholder="kPa"
              value={values.dP6}
              onChange={(e) => handleChange(e, 'dP6')}
              /></div>
            <h4>
            Kv: {calculateResult('formula6') !== '' ? `${calculateResult('formula6')} m³/h` : ''}
            </h4>
            </div>
            {/* Formel 7 */}
            <div className={styles.inputGroup}>
              <h3>Kv = q / √(dP/10)</h3>
              <div className={styles.inputField}>
                <label htmlFor="q7">q [m³/h]</label>
                <input
                  id="q7"
                  type="number"
                  step="any"
                  placeholder="[m³/h]"
                  value={values.q7}
                  onChange={(e) => handleChange(e, 'q7')}
                />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="dP7">dP [mVs]</label>
                <input
                  id="dP7"
                  type="number"
                  step="any"
                  placeholder="mVs"
                  value={values.dP7}
                  onChange={(e) => handleChange(e, 'dP7')}
                />
              </div>
              <h4>
                Kv: {calculateResult('formula7') !== '' ? `${calculateResult('formula7')} m³/h` : ''}
              </h4>
            </div>

            {/* Formel 8 */}
            <div className={styles.inputGroup}>
              <h3>dP = 10 · q² / Kv²</h3>
              <div className={styles.inputField}>
                <label htmlFor="q8">q [m³/h]</label>
                <input
                  id="q8"
                  type="number"
                  step="any"
                  placeholder="[m³/h]"
                  value={values.q8}
                  onChange={(e) => handleChange(e, 'q8')}
                />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="Kv8">Kv [m³/h]</label>
                <input
                  id="Kv8"
                  type="number"
                  step="any"
                  placeholder="[m³/h]"
                  value={values.Kv8}
                  onChange={(e) => handleChange(e, 'Kv8')}
                />
              </div>
              <h4>
                dP: {calculateResult('formula8') !== '' ? `${calculateResult('formula8')} bar` : ''}
              </h4>
            </div>

            {/* Formel 9 */}
            <div className={styles.inputGroup}>
              <h3>q = Kv · √dP</h3>
              <div className={styles.inputField}>
                <label htmlFor="Kv9">Kv [m³/h]</label>
                <input
                  id="Kv9"
                  type="number"
                  step="any"
                  placeholder="[m³/h]"
                  value={values.Kv9}
                  onChange={(e) => handleChange(e, 'Kv9')}
                />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="dP9">dP [bar]</label>
                <input
                  id="dP9"
                  type="number"
                  step="any"
                  placeholder="bar"
                  value={values.dP9}
                  onChange={(e) => handleChange(e, 'dP9')}
                />
              </div>
              <h4>
                q: {calculateResult('formula9') !== '' ? `${calculateResult('formula9')} m³/h` : ''}
              </h4>
            </div>

            {/* Formel 10 */}
            <div className={styles.inputGroup}>
              <h3>q = Kv · √(dP/100)</h3>
              <div className={styles.inputField}>
                <label htmlFor="Kv10">Kv [m³/h]</label>
                <input
                  id="Kv10"
                  type="number"
                  step="any"
                  placeholder="[m³/h]"
                  value={values.Kv10}
                  onChange={(e) => handleChange(e, 'Kv10')}
                />
              </div>
              <div className={styles.inputField}>
                <label htmlFor="dP10">dP [kPa]</label>
                <input
                  id="dP10"
                  type="number"
                  step="any"
                  placeholder="kPa"
                  value={values.dP10}
                  onChange={(e) => handleChange(e, 'dP10')}
                />
              </div>
              <h4>
                q: {calculateResult('formula10') !== '' ? `${calculateResult('formula10')} m³/h` : ''}
              </h4>
            </div>








          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KvCalculator;
