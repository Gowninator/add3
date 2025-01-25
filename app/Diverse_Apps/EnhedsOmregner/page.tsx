'use client';

import React, { useState, useRef } from 'react';
import styles from './styles.module.css'; // Reuse your existing CSS
import Link from 'next/link';
import Footer from '../../components/footer';
import Header from '../../components/header';

const UnitConverter: React.FC = () => {
  const [values, setValues] = useState({
    mm2: '',
    cm2: '',
    m2: '',
    km2: '',
    mm: '',
    cm: '',
    m: '',
    km: '',
    mm3Volume: '',
    cm3: '',
    m3: '',
    lps: '',
    lph: '',
    lpm: '',
    m3ps: '',
    m3ph: '',
    Pa: '',
    kPa: '',
    MPa: '',
    bar: '',
    atm: '',
    mH2O: '',
    C: '',
    F: '',
    K: '',
    mps: '',
    kmph: '',
    mph: '',
    cal: '',
    J: '',
    W: '',
    kWh: '',
    MJ: '',

  });
  const [activeField, setActiveField] = useState('');

  const refs = {
    mm2: useRef<HTMLInputElement>(null),
    cm2: useRef<HTMLInputElement>(null),
    m2: useRef<HTMLInputElement>(null),
    km2: useRef<HTMLInputElement>(null),
    mm: useRef<HTMLInputElement>(null),
    cm: useRef<HTMLInputElement>(null),
    m: useRef<HTMLInputElement>(null),
    km: useRef<HTMLInputElement>(null),
    mm3Volume: useRef<HTMLInputElement>(null),
    cm3: useRef<HTMLInputElement>(null),
    m3: useRef<HTMLInputElement>(null),
    lps: useRef<HTMLInputElement>(null),
    lph: useRef<HTMLInputElement>(null),
    lpm: useRef<HTMLInputElement>(null),
    m3ps: useRef<HTMLInputElement>(null),
    m3ph: useRef<HTMLInputElement>(null),
    Pa: useRef<HTMLInputElement>(null),
    kPa: useRef<HTMLInputElement>(null),
    MPa: useRef<HTMLInputElement>(null),
    bar: useRef<HTMLInputElement>(null),
    atm: useRef<HTMLInputElement>(null),
    mH2O: useRef<HTMLInputElement>(null),
    C: useRef<HTMLInputElement>(null),
    F: useRef<HTMLInputElement>(null),
    K: useRef<HTMLInputElement>(null),
    mps: useRef<HTMLInputElement>(null),
    kmph: useRef<HTMLInputElement>(null),
    mph: useRef<HTMLInputElement>(null),
    cal: useRef<HTMLInputElement>(null),
    J: useRef<HTMLInputElement>(null),
    W: useRef<HTMLInputElement>(null),
    kWh: useRef<HTMLInputElement>(null),
    MJ: useRef<HTMLInputElement>(null),
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, refKeys: (keyof typeof refs)[], currentIndex: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % refKeys.length;
      refs[refKeys[nextIndex]].current?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + refKeys.length) % refKeys.length;
      refs[refKeys[prevIndex]].current?.focus();
    }
  };

  const convertValues = (value: string, unit: string, group: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      const emptyGroup = Object.keys(values).reduce((acc: { [key: string]: string }, key) => {
        if (key.includes(group)) acc[key] = '';
        return acc;
      }, {});
      return emptyGroup;
    }

    let conversions = {};

    switch (group) {
      case 'area':
        if (unit === 'mm2') conversions = { mm2: num, cm2: num / 100, m2: num * 1e-6, km2: num * 1e-12 };
        else if (unit === 'cm2') conversions = { mm2: num * 100, cm2: num, m2: num * 1e-4, km2: num * 1e-10 };
        else if (unit === 'm2') conversions = { mm2: num * 1e6, cm2: num * 1e4, m2: num, km2: num * 1e-6 };
        else if (unit === 'km2') conversions = { mm2: num * 1e12, cm2: num * 1e10, m2: num * 1e6, km2: num };
        break;

      case 'length':
        if (unit === 'mm') conversions = { mm: num, cm: num / 10, m: num / 1000, km: num / 1e6 };
        else if (unit === 'cm') conversions = { mm: num * 10, cm: num, m: num / 100, km: num / 1e5 };
        else if (unit === 'm') conversions = { mm: num * 1000, cm: num * 100, m: num, km: num / 1000 };
        else if (unit === 'km') conversions = { mm: num * 1e6, cm: num * 1e5, m: num * 1000, km: num };
        break;

      case 'volume':
        if (unit === 'mm3Volume') conversions = { mm3Volume: num, cm3: num / 1000, m3: num / 1e9 };
        else if (unit === 'cm3') conversions = { mm3Volume: num * 1000, cm3: num, m3: num / 1e6 };
        else if (unit === 'm3') conversions = { mm3Volume: num * 1e9, cm3: num * 1e6, m3: num };
        break;

      case 'speed':
        if (unit === 'mps') conversions = { mps: num, kmph: num * 3.6, mph: num * 2.23694 };
        else if (unit === 'kmph') conversions = { mps: num / 3.6, kmph: num, mph: num / 1.60934 };
        else if (unit === 'mph') conversions = { mps: num / 2.23694, kmph: num * 1.60934, mph: num };
        break;

      case 'flow':
        if (unit === 'lps') conversions = { lps: num, lpm: num * 60, lph: num * 3600, m3ps: num / 1000, m3pm: (num / 1000) * 60, m3ph: (num / 1000) * 3600 };
        else if (unit === 'lpm') conversions = { lps: num / 60, lpm: num, lph: num * 60, m3ps: (num / 60) / 1000, m3pm: num / 1000, m3ph: (num / 1000) * 60 };
        else if (unit === 'lph') conversions = { lps: num / 3600, lpm: num / 60, lph: num, m3ps: (num / 3600) / 1000, m3pm: (num / 60) / 1000, m3ph: num / 1000 };
        else if (unit === 'm3ps') conversions = { lps: num * 1000, lpm: (num * 1000) * 60, lph: (num * 1000) * 3600, m3ps: num, m3pm: num * 60, m3ph: num * 3600 };
        else if (unit === 'm3pm') conversions = { lps: (num / 60) * 1000, lpm: num * 1000, lph: (num * 1000) * 60, m3ps: num / 60, m3pm: num, m3ph: num * 60 };
        else if (unit === 'm3ph') conversions = { lps: (num / 3600) * 1000, lpm: (num / 60) * 1000, lph: num * 1000, m3ps: num / 3600, m3pm: num / 60, m3ph: num };
        break;

      case 'pressure':
        if (unit === 'Pa') conversions = { Pa: num, kPa: num / 1000, MPa: num / 1e6, bar: num / 1e5, atm: num / 101325, mH2O: num / 9806.65 };
        else if (unit === 'kPa') conversions = { Pa: num * 1000, kPa: num, MPa: num / 1000, bar: num / 100, atm: num / 101.325, mH2O: num / 9.80665 };
        else if (unit === 'MPa') conversions = { Pa: num * 1e6, kPa: num * 1000, MPa: num, bar: num * 10, atm: num / 0.101325, mH2O: num * 101.9716 };
        else if (unit === 'bar') conversions = { Pa: num * 1e5, kPa: num * 100, MPa: num / 10, bar: num, atm: num / 1.01325, mH2O: num * 10.1972 };
        else if (unit === 'atm') conversions = { Pa: num * 101325, kPa: num * 101.325, MPa: num * 0.101325, bar: num * 1.01325, atm: num, mH2O: num * 10.3323 };
        else if (unit === 'mH2O') conversions = { Pa: num * 9806.65, kPa: num * 9.80665, MPa: num * 0.00980665, bar: num * 0.0980665, atm: num / 10.3323, mH2O: num };
        break;
        
        
      case 'temperature':
        if (unit === 'C') conversions = { C: num, F: ((num * 9) / 5 + 32), K: (num + 273.15) };
        else if (unit === 'F') conversions = { C: ((num - 32) * 5 / 9), F: num, K: (((num - 32) * 5 / 9) + 273.15) };
        else if (unit === 'K') conversions = { C: (num - 273.15), F: (((num - 273.15) * 9 / 5) + 32), K: num };
        break;
    
      case 'energy':
        if (unit === 'cal') conversions = { cal: num, J: num * 4.184, W: num / 860.421, kWh: num / 860421, MJ: num / 239.006 };
        else if (unit === 'J') conversions = { cal: num / 4.184, J: num, W: num / 3600, kWh: num / 3.6e6, MJ: num / 1e6 };
        else if (unit === 'W') conversions = { cal: num * 860.421, J: num * 3600, W: num, kWh: num / 1000, MJ: num / 1000 };
        else if (unit === 'kWh') conversions = { cal: num * 860421, J: num * 3.6e6, W: num * 1000, kWh: num, MJ: num * 3.6 };
        else if (unit === 'MJ') conversions = { cal: num * 239.006, J: num * 1e6, W: num * 1000, kWh: num / 3.6, MJ: num };
        break;

    }
    return conversions;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, unit: string, group: string) => {
    const value = e.target.value;
  
    setActiveField(unit);
  
    if (value === '') {
      // Hvis input er tomt, sæt kun denne værdi til en tom streng
      setValues((prev) => ({
        ...prev,
        [unit]: '',
      }));
      return;
    }
  
    // Hvis der er en værdi, udfør konverteringerne
    setValues((prev) => ({
      ...prev,
      ...convertValues(value, unit, group),
    }));
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
        <h2>Enheds omregner</h2>
        <div className={styles.container}>
          {/* Area Conversion Group */}
          <div className={styles.inputGroup}>
            <h3>Areal</h3>
            <div className={styles.inputField}>
              <label htmlFor="mm2">mm²: </label>
              <input
                id="mm2"
                type="number"
                value={values.mm2}
                onChange={(e) => handleChange(e, 'mm2', 'area')}
                onKeyDown={(e) => handleKeyDown(e, ['mm2', 'cm2', 'm2', 'km2'], 0)}
                ref={refs.mm2}
                className={activeField === 'mm2' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="cm2">cm²: </label>
              <input
                id="cm2"
                type="number"
                value={values.cm2}
                onChange={(e) => handleChange(e, 'cm2', 'area')}
                onKeyDown={(e) => handleKeyDown(e, ['mm2', 'cm2', 'm2', 'km2'], 1)}
                ref={refs.cm2}
                className={activeField === 'cm2' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="m2">m²: </label>
              <input
                id="m2"
                type="number"
                value={values.m2}
                onChange={(e) => handleChange(e, 'm2', 'area')}
                onKeyDown={(e) => handleKeyDown(e, ['mm2', 'cm2', 'm2', 'km2'], 2)}
                ref={refs.m2}
                className={activeField === 'm2' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="km2">km²: </label>
              <input
                id="km2"
                type="number"
                value={values.km2}
                onChange={(e) => handleChange(e, 'km2', 'area')}
                onKeyDown={(e) => handleKeyDown(e, ['mm2', 'cm2', 'm2', 'km2'], 3)}
                ref={refs.km2}
                className={activeField === 'km2' ? styles.active : styles.inactive}
              />
            </div>
          </div>

        {/* Temperature Conversion Group */}
        <div className={styles.inputGroup}>
          <h3>Temperatur</h3>
          {['C', 'F', 'K'].map((unit, index) => (
          <div key={unit} className={styles.inputField}>
            <label htmlFor={unit}>{unit}: </label>
            <input
              id={unit}
              type="number"
              value={values[unit as keyof typeof values]} // Type assertion
              onChange={(e) => handleChange(e, unit, 'temperature')}
              onKeyDown={(e) => handleKeyDown(e, ['C', 'F', 'K'], index)}
              ref={refs[unit as keyof typeof refs]} // Type assertion
              className={activeField === unit ? styles.active : styles.inactive}
            />
          </div>
          ))} 
        </div>

          {/* Length Conversion Group */}
          <div className={styles.inputGroup}>
            <h3>Længde</h3>
            <div className={styles.inputField}>
              <label htmlFor="mm">mm: </label>
              <input
                id="mm"
                type="number"
                value={values.mm}
                onChange={(e) => handleChange(e, 'mm', 'length')}
                onKeyDown={(e) => handleKeyDown(e, ['mm', 'cm', 'm', 'km'], 0)}
                ref={refs.mm}
                className={activeField === 'mm' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="cm">cm: </label>
              <input
                id="cm"
                type="number"
                value={values.cm}
                onChange={(e) => handleChange(e, 'cm', 'length')}
                onKeyDown={(e) => handleKeyDown(e, ['mm', 'cm', 'm', 'km'], 1)}
                ref={refs.cm}
                className={activeField === 'cm' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="m">m: </label>
              <input
                id="m"
                type="number"
                value={values.m}
                onChange={(e) => handleChange(e, 'm', 'length')}
                onKeyDown={(e) => handleKeyDown(e, ['mm', 'cm', 'm', 'km'], 2)}
                ref={refs.m}
                className={activeField === 'm' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="km">km: </label>
              <input
                id="km"
                type="number"
                value={values.km}
                onChange={(e) => handleChange(e, 'km', 'length')}
                onKeyDown={(e) => handleKeyDown(e, ['mm', 'cm', 'm', 'km'], 3)}
                ref={refs.km}
                className={activeField === 'km' ? styles.active : styles.inactive}
              />
            </div>
          </div>
            
            {/* Speed Conversion Group */}
            <div className={styles.inputGroup}>
            <h3>Hastighed</h3>
            <div className={styles.inputField}>
              <label htmlFor="mps">m/s: </label>
              <input
                id="mps"
                type="number"
                value={values.mps}
                onChange={(e) => handleChange(e, 'mps', 'speed')}
                onKeyDown={(e) => handleKeyDown(e, ['mps', 'kmph', 'mph'], 0)}
                ref={refs.mps}
                className={activeField === 'mps' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="kmph">km/h: </label>
              <input
                id="kmph"
                type="number"
                value={values.kmph}
                onChange={(e) => handleChange(e, 'kmph', 'speed')}
                onKeyDown={(e) => handleKeyDown(e, ['mps', 'kmph', 'mph'], 1)}
                ref={refs.kmph}
                className={activeField === 'kmph' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="mph">mph: </label>
              <input
                id="mph"
                type="number"
                value={values.mph}
                onChange={(e) => handleChange(e, 'mph', 'speed')}
                onKeyDown={(e) => handleKeyDown(e, ['mps', 'kmph', 'mph'], 2)}
                ref={refs.mph}
                className={activeField === 'mph' ? styles.active : styles.inactive}
              />
            </div>
          </div>

          {/* Volume Conversion Group */}
          <div className={styles.inputGroup}>
            <h3>Rumfang</h3>
            <div className={styles.inputField}>
              <label htmlFor="mm3Volume">mm³: </label>
              <input
                id="mm3Volume"
                type="number"
                value={values.mm3Volume}
                onChange={(e) => handleChange(e, 'mm3Volume', 'volume')}
                onKeyDown={(e) => handleKeyDown(e, ['mm3Volume', 'cm3', 'm3'], 0)}
                ref={refs.mm3Volume}
                className={activeField === 'mm3Volume' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="cm3">cm³: </label>
              <input
                id="cm3"
                type="number"
                value={values.cm3}
                onChange={(e) => handleChange(e, 'cm3', 'volume')}
                onKeyDown={(e) => handleKeyDown(e, ['mm3Volume', 'cm3', 'm3'], 1)}
                ref={refs.cm3}
                className={activeField === 'cm3' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="m3">m³: </label>
              <input
                id="m3"
                type="number"
                value={values.m3}
                onChange={(e) => handleChange(e, 'm3', 'volume')}
                onKeyDown={(e) => handleKeyDown(e, ['mm3Volume', 'cm3', 'm3'], 2)}
                ref={refs.m3}
                className={activeField === 'm3' ? styles.active : styles.inactive}
              />
            </div>
          </div>

          {/* Flow Conversion Group */}
          <div className={styles.inputGroup}>
            <h3>Flow</h3>
            <div className={styles.inputField}>
              <label htmlFor="lps">L/s: </label>
              <input
                id="lps"
                type="number"
                value={values.lps}
                onChange={(e) => handleChange(e, 'lps', 'flow')}
                onKeyDown={(e) => handleKeyDown(e, ['lps', 'lpm', 'lph', 'm3ps', 'm3ph'], 0)}
                ref={refs.lps}
                className={activeField === 'lps' ? styles.active : styles.inactive}
              />
            </div>
             <div className={styles.inputField}>
              <label htmlFor="lpm">L/m: </label>
              <input
                id="lpm"
                value={values.lpm}
                onChange={(e) => handleChange(e, 'lpm', 'flow')}
                onKeyDown={(e) => handleKeyDown(e, ['lps', 'lpm', 'lph', 'm3ps', 'm3ph'], 1)}
                ref={refs.lpm}
                className={activeField === 'lpm' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="lph">L/h: </label>
              <input
                id="lph"
                type="number"
                value={values.lph}
                onChange={(e) => handleChange(e, 'lph', 'flow')}
                onKeyDown={(e) => handleKeyDown(e, ['lps', 'lpm', 'lph', 'm3ps', 'm3ph'], 2)}
                ref={refs.lph}
                className={activeField === 'lph' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="m3ps">m³/s: </label>
              <input
                id="m3ps"
                type="number"
                value={values.m3ps}
                onChange={(e) => handleChange(e, 'm3ps', 'flow')}
                onKeyDown={(e) => handleKeyDown(e, ['lps', 'lpm', 'lph', 'm3ps', 'm3ph'], 3)}
                ref={refs.m3ps}
                className={activeField === 'm3ps' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="m3ph">m³/h: </label>
              <input
                id="m3ph"
                type="number"
                value={values.m3ph}
                onChange={(e) => handleChange(e, 'm3ph', 'flow')}
                onKeyDown={(e) => handleKeyDown(e, ['lps', 'lpm', 'lph', 'm3ps', 'm3ph'], 4)}
                ref={refs.m3ph}
                className={activeField === 'm3ph' ? styles.active : styles.inactive}
              />
            </div>
          </div>

          {/* Pressure Conversion Group */}
          <div className={styles.inputGroup}>
            <h3>Tryk</h3>

            <div className={styles.inputField}>
              <label htmlFor="atm">atm: </label>
              <input
                id="atm"
                type="number"
                value={values.atm}
                onChange={(e) => handleChange(e, 'atm', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 0)}
                ref={refs.atm}
                className={activeField === 'atm' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="Pa">Pa: </label>
              <input
                id="Pa"
                type="number"
                value={values.Pa}
                onChange={(e) => handleChange(e, 'Pa', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 1)}
                ref={refs.Pa}
                className={activeField === 'Pa' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="kPa">kPa: </label>
              <input
                id="kPa"
                type="number"
                value={values.kPa}
                onChange={(e) => handleChange(e, 'kPa', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 2)}
                ref={refs.kPa}
                className={activeField === 'kPa' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="MPa">MPa: </label>
              <input
                id="MPa"
                type="number"
                value={values.MPa}
                onChange={(e) => handleChange(e, 'MPa', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 3)}
                ref={refs.MPa}
                className={activeField === 'MPa' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="bar">bar: </label>
              <input
                id="bar"
                type="number"
                value={values.bar}
                onChange={(e) => handleChange(e, 'bar', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 4)}
                ref={refs.bar}
                className={activeField === 'bar' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
                <label htmlFor="mH2O">mH<sub>2</sub>O: </label>
              <input
                id="mH2O"
                type="number"
                value={values.mH2O}
                onChange={(e) => handleChange(e, 'mH2O', 'pressure')}
                onKeyDown={(e) => handleKeyDown(e, ['atm', 'Pa', 'kPa', 'MPa', 'bar', 'mH2O'], 5)}
                ref={refs.mH2O}
                className={activeField === 'mH2O' ? styles.active : styles.inactive}
              />
            </div>
         </div>
          
          {/* Energi Conversion Group */}

          <div className={styles.inputGroup}>
            <h3>Energi</h3>
            <div className={styles.inputField}>
              <label htmlFor="cal">cal: </label>
              <input
                id="cal"
                type="number"
                value={values.cal}
                onChange={(e) => handleChange(e, 'cal', 'energy')}
                onKeyDown={(e) => handleKeyDown(e, ['cal', 'J', 'W', 'kWh', 'MJ'], 0)}
                ref={refs.cal}
                className={activeField === 'cal' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="J">J: </label>
              <input
                id="J"
                type="number"
                value={values.J}
                onChange={(e) => handleChange(e, 'J', 'energy')}
                onKeyDown={(e) => handleKeyDown(e, ['cal', 'J', 'W', 'kWh', 'MJ'], 1)}
                ref={refs.J}
                className={activeField === 'J' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="W">W: </label>
              <input
                id="W"
                type="number"
                value={values.W}
                onChange={(e) => handleChange(e, 'W', 'energy')}
                onKeyDown={(e) => handleKeyDown(e, ['cal', 'J', 'W', 'kWh', 'MJ'], 2)}
                ref={refs.W}
                className={activeField === 'W' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="kWh">kWh: </label>
              <input
                id="kWh"
                type="number"
                value={values.kWh}
                onChange={(e) => handleChange(e, 'kWh', 'energy')}
                onKeyDown={(e) => handleKeyDown(e, ['cal', 'J', 'W', 'kWh', 'MJ'], 3)}
                ref={refs.kWh}
                className={activeField === 'kWh' ? styles.active : styles.inactive}
              />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="MJ">MJ: </label>
              <input
                id="MJ"
                type="number"
                value={values.MJ}
                onChange={(e) => handleChange(e, 'MJ', 'energy')}
                onKeyDown={(e) => handleKeyDown(e, ['cal', 'J', 'W', 'kWh', 'MJ'], 4)}
                ref={refs.MJ}
                className={activeField === 'MJ' ? styles.active : styles.inactive}
              />
            </div>
          </div>
          
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};
export default UnitConverter;
