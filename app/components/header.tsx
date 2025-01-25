import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="header">
           <Link href="../">HVAC-Tools.dk</Link>
        </header>
    );
};

export default Header;