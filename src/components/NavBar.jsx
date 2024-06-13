import React from "react";
import "../css/NavBar.css";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <>
      <div className='navigation'>
        <nav>
          <ul>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
            <li>
              <Link to='/contact'>Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="logo">로고</div>
        <div className="button">버튼</div>
      </div>
    </>
  );
}

export default NavBar;
