import { useEffect, useState } from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import logo from "../../assets/logos/logo_lighttheme_thinklink.png";
import SearchIcon from "../../assets/search.svg";
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { useAuth } from "../../context/AuthProvider";
import Pfp from "../pfp/Pfp";
import Loadingspinner from "../loading-spinner/Loadingspinner";

const Menu = ({ closeMenu, isLoggedIn, isSmall, handleLogout }) => (
  <>
    {isSmall && isLoggedIn && (
      <p>
        <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
      </p>
    )}
    <p><NavLink to="/" onClick={closeMenu}>Home</NavLink></p>
    <p><a href="#my_learning" onClick={closeMenu}>My Learning</a></p>
    <p><a href="#about" onClick={closeMenu}>About</a></p>
    <p><a href="#support" onClick={closeMenu}>Support</a></p>
    {isSmall && !isLoggedIn && (
      <>
        <p><NavLink to="/signin" onClick={closeMenu}>Sign in</NavLink></p>
        <p><NavLink to="/signup" onClick={closeMenu}>Sign up</NavLink></p>
      </>
    )}
    {isSmall && isLoggedIn && (
      <p><NavLink onClick={handleLogout}>Logout</NavLink></p>
    )}
  </>
);

Menu.propTypes = {
  closeMenu: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
};

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setToggleMenu(false);
      setIsClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    setIsLoading(true);
    closeMenu(); 
    
    setTimeout(() => {
      Cookies.remove("isLoggedIn", { path: '/' });
      Cookies.remove("userData", { path: '/' });
      setIsLoggedIn(false);
      setIsLoading(false);
      navigate("/signin");
    }, 2500); 
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="navbar">
      {isLoading && (
          <Loadingspinner />
        
      )}

      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="navbar-links_container">
          <Menu 
            closeMenu={closeMenu} 
            isLoggedIn={isLoggedIn} 
            isSmall={isSmall} 
            handleLogout={handleLogout}
          />
        </div>
      </div>

      <div className="navbar-search">
        <input placeholder="Search" />
        <img src={SearchIcon} alt="search" />
      </div>

      <div className="navbar-sign">
        {!isLoggedIn ? (
          <>
            <NavLink to="/signin"><p>Sign in</p></NavLink>
            <NavLink to="/signup"><button type="button">Sign up</button></NavLink>
          </>
        ) : (
          <Pfp />
        )}
      </div>

      <div className="navbar-menu">
        {!toggleMenu && (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className={`navbar-menu_container ${isClosing ? "closing" : ""}`}>
            <div className="navbar-menu_container-close">
              <RiCloseLine color="#fff" size={27} onClick={closeMenu} />
            </div>
            <div className="navbar-menu_container-links">
              <Menu 
                closeMenu={closeMenu} 
                isLoggedIn={isLoggedIn} 
                isSmall={isSmall} 
                handleLogout={handleLogout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;