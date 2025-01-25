import React from 'react';
import Link from 'next/link';
import Header from './components/header';
import Navbar from './components/navbarStart';
import Footer from './components/footer';

const Home: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Navbar />
      <main style={{ flex: 1, padding: '20px' }}>
        <div className='introtekst'>
          Velkommen til Hvac-Tools.dk
          <p></p>
          HVAC Tools er designet til at forenkle dit arbejde inden for VVS og ventilation.
          <p></p>
          Her finder du en række brugervenlige beregningsprogrammer, designet til at lette din dagligdag og optimere dine projekter.
          <p></p>
          Vi er stadig i gang med at udvikle og finpudse vores hjemmeside, så hold øje med nye værktøjer og opdateringer. Vores mål er at tilbyde pålidelige og effektive løsninger, der gør dit arbejde nemmere og mere effektivt.
          <p></p>
          Inden brug af beregningsværktøjerne henvises brugeren til at gennemlæse{' '}
          <Link href="../nav/betingelser" className="terms-link">
            betingelser og vilkår.
          </Link>
        </div>
        <div className='button-grid-boks'>
          <div className='button-grid'>
            <div className='column'>
              <h2>Ventilation</h2>
              <Link href="../Vent_Apps/Vent_Drejeskive" className='FPKnap'>Rør-/kanal dimensionering<br /> (Drejeskive) <br />
                <span className='beta-text'>(1.1.0)</span>
              </Link>
              <Link href="../Vent_Apps/EffektFlow" className='FPKnap'>Effekt&rarr;Flow (Simpel køl) <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../Vent_Apps/Co2Koncentration" className='FPKnap'>CO2-koncentration <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../Vent_Apps/Vent_Dimensionering_Ark" className='FPKnap'>Rør-/kanal dimensionering Ark <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../Vent_Apps/Danvak" className='FPKnap'>Tryktabsfaktorer for kanalfittings<br />
                <span className='beta-text'>(2.0.0)</span>
              </Link>
              <Link href="../Vent_Apps/DraftRate" className='FPKnap'>Draft Rate <br />
                <span className='beta-text'>(BETA)</span>
              </Link>
              <Link href="../Vent_Apps/Varmefladeeffekt" className='FPKnap'>Varmefladeeffekt <br />
                <span className='beta-text'>(BETA)</span>
              </Link>
              <Link href="/" className='FPKnapU'>- - - <br />
                <span className='beta-textU'>(- - -)</span>
              </Link>
            </div>

            <div className='column'>
              <h2>VVS</h2>
              <Link href="../VVS_Apps/EffektFlow_1" className='FPKnap'>Effekt&rarr;Flow (metode 1)<br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../VVS_Apps/EffektFlow_2" className='FPKnap'>Effekt&rarr;Flow (metode 2)<br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../VVS_Apps/DS439_2009_Vandstroemme" className='FPKnap'>DS 439:2009 Vandstrømme q<sub>f</sub> & q<sub>d</sub> <br />
                <span className='beta-text'>(1.0.1)</span>
              </Link>
              <Link href="../VVS_Apps/DS439_2024_Vandstroemme" className='FPKnap'>DS 439:2024 Vandstrømme q<sub>f</sub> & q<sub>d</sub> <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="../VVS_Apps/Pipe_Dim_Flow" className='FPKnap'>Rør dimensionering [flow] <br />
                <span className='beta-text'>(2.0.0)</span>
              </Link>
              <Link href="/../VVS_Apps/Pipe_Dim_Effekt" className='FPKnap'>Rør dimensionering [kW] <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="/../VVS_Apps/side7" className='FPKnap'>Kv-værdi for reguleringsventiler <br />
                <span className='beta-text'>(BETA)</span>
              </Link>
              <Link href="/" className='FPKnapU'>- - - <br />
                <span className='beta-textU'>(- - -)</span>
              </Link>
              
            
              </div>


              <div className='column'>
              <h2>Diverse</h2>
              <Link href="../Diverse_Apps/EnhedsOmregner" className='FPKnap'>Enheds omregner <br />
                <span className='beta-text'>(1.0.0)</span>
              </Link>
              <Link href="/" className='FPKnapU'>- - - <br />
                <span className='beta-textU'>(- - -)</span>
              </Link>



            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
