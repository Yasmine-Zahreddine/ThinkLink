import { useState } from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../../assets/logos/logo_lighttheme_thinklink.png";
import SearchIcon from "../../assets/search.svg";
import PropTypes from 'prop-types';
import Cookies from "js-cookie";
import { useAuth } from "../../Contexts/Authprovider";
import Pfp from "../pfp/Pfp";
const Menu = ({ closeMenu }) => (

  <>
    <p>
      <NavLink to="/" onClick={closeMenu}>Home</NavLink>
    </p>
    <p>
      <a href="#my_learning" onClick={closeMenu}>My Learning</a>
    </p>
    <p>
      <a href="#about" onClick={closeMenu}>About</a>
    </p>
    <p>
      <a href="#support" onClick={closeMenu}>Support</a>
    </p>
  </>
);

Menu.propTypes = {
  closeMenu: PropTypes.func.isRequired
};

const Navbar = () => {
  const {isLogedIn} = useAuth()
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setToggleMenu(false);
      setIsClosing(false);
    }, 300); 
  };

  return (
    <div className="navbar">
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="navbar-links_container">
          <Menu closeMenu={closeMenu} />
        </div>
      </div>
      <div className="navbar-search">
        <input placeholder="Search" />
        <img src={SearchIcon} alt="search" />
      </div>
      <div className="navbar-sign">
      {!isLogedIn ? (
        <><NavLink to="/signin">
          <p>Sign in</p>
        </NavLink>
        <NavLink to="/signup">
          <button type="button">Sign up</button>
        </NavLink></>) : <Pfp/>}
      </div>
      <div className="navbar-menu">
        {toggleMenu ? (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className={`navbar-menu_container ${isClosing ? 'closing' : ''}`}>
            <div className="navbar-menu_container-close">
              <RiCloseLine
                color="#fff"
                size={27}
                onClick={closeMenu}
              />
            </div>
            <div className="navbar-menu_container-links">
              <Menu closeMenu={closeMenu} />
              <div className="navbar-menu_container-links-sign">
              <>
                <NavLink to="/signin" onClick={closeMenu}>
                  <p>Sign in</p>
                </NavLink>
                <NavLink to="/signup">
                  <button type="button" onClick={closeMenu}>Sign up</button>
                </NavLink>
              </>
            
          </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
