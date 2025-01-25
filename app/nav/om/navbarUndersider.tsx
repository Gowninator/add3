import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">Startside</Link>
                </li>
                <li>
                    <Link href="/FAQ">FAQ</Link>
                </li>
                <li>
                    <Link href="/betingelser">Betingelser og vilkår</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
