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

const Menu = ({ closeMenu, isLoggedIn, isSmall, handleLogout, handleHelp }) => (
  <>
    {isSmall && isLoggedIn && (
      <p>
        <NavLink to="/editaccount" onClick={closeMenu}>Profile</NavLink>
      </p>
    )}
    <p><NavLink to="/" onClick={closeMenu}>Home</NavLink></p>
    <p><a href="#my_learning" onClick={closeMenu}>My Learning</a></p>
    <p><NavLink to="/about" onClick={closeMenu}>About</NavLink></p>
    <p><a href="#support" onClick={handleHelp}>Support</a></p>
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
  handleLogout: PropTypes.func.isRequired,
  handleHelp: PropTypes.func.isRequired
};

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [partyMode, setPartyMode] = useState(false);

  const handleHelp = () => {
    closeMenu();
    if(Cookies.get("isLoggedIn")){
      
    setIsActive("Help & Support");
    navigate('/help');
      
    }else{
        navigate("/signin");
    }
  };

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

  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
    if (logoClicks === 4) { // Activate on 5th click
      setPartyMode(true);
      document.body.classList.add('party-time');
      setTimeout(() => {
        setPartyMode(false);
        document.body.classList.remove('party-time');
        setLogoClicks(0);
      }, 3000); // Party lasts for 3 seconds
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 700);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
    const { isActive, setIsActive } = useAuth();
  return (
    <div className="navbar">
      {isLoading && (
          <Loadingspinner />
      )}

      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img 
            src={logo} 
            alt="logo" 
            onClick={handleLogoClick}
            className={partyMode ? 'spin-logo' : ''}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="navbar-links_container">
          <Menu 
            closeMenu={closeMenu} 
            isLoggedIn={isLoggedIn} 
            isSmall={isSmall} 
            handleLogout={handleLogout}
            handleHelp={handleHelp}
          />
        </div>
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
            color="var(--color-dark-blue)"
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
                handleHelp={handleHelp}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;