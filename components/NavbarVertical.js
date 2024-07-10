import React from 'react';

const NavbarVertical = ({ showMenu, onClick }) => {
  return (
    <nav>
      {/* Add your vertical navbar content here */}
      <button onClick={() => onClick(!showMenu)}>
        {showMenu ? 'Hide Menu' : 'Show Menu'}
      </button>
    </nav>
  );
};

export default NavbarVertical;
