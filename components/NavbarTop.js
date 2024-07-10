import React from 'react';

const NavbarTop = ({ data }) => {
    return (
        <nav>
            {/* Add your top navbar content here */}
            <button onClick={data.SidebarToggleMenu}>
                {data.showMenu ? 'Hide Sidebar' : 'Show Sidebar'}
            </button>
        </nav>
    );
};

export default NavbarTop;
