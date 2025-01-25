import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul className="nav-list">
                <li className="nav-item dropdown">
                    <span>Om HVAC-Tools</span>
                    <ul className="dropdown-menu">
                        <li className="dropdown-item"><Link href="../nav/om">Formål</Link></li>
                        <li className="dropdown-item"><Link href="../nav/betingelser">Betingelser og vilkår</Link></li>
                        <li className="dropdown-item"><Link href="../nav/FAQ">FAQ</Link></li>
                        <li className="dropdown-item"><Link href="../nav/nyheder">Nyheder</Link></li>
                        <li className="dropdown-item"><Link href="../nav/kontakt">Kontakt</Link></li>
                    </ul>
                </li>
                <li className="nav-item"><Link href="../Vent_Apps">Ventilation</Link></li>
                <li className="nav-item"><Link href="../VVS_Apps">VVS</Link></li>
                <li className="nav-item"><Link href="../Diverse_Apps">Diverse</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
