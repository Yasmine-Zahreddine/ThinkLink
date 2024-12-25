import {useState} from 'react'
import './navbar.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'
import logo from "../../assets/logos/logo_lighttheme_thinklink.png"
import SearchIcon from '../../assets/search.svg';

const Menu = ()=> (
  <>
    <p><a href="#home">Home</a></p>
    <p><a href="#my_learning">My Learning</a></p>
    <p><a href="#about">About</a></p>
    <p><a href="#support">Support</a></p>
  </>
)

const Navbar = () => {
  const[toggleMenu, setToggleMenu] = useState(false)
  return (
    <div className='navbar'>
      <div className='navbar-links'>
        <div className='navbar-links_logo'>
          <img src={logo} alt='logo'/>
        </div>
        <div className='navbar-links_container'>
          <Menu/>
        </div>
      </div>
      <div className='navbar-search'>
          <input
            placeholder='Search'
          />
          <img 
            src={SearchIcon}
            alt='search'
          />
      </div>
      <div className='navbar-sign'>
        <p>Sign in</p>
        <button type='button'>Sign up</button>
      </div>
      <div className='navbar-menu'>
        {toggleMenu ? <RiCloseLine color='#fff' size= {27} onClick={()=>{setToggleMenu(false)}}/> : <RiMenu3Line color='#fff' size={27} onClick={()=>setToggleMenu(true)}/>}
        {toggleMenu && (
          <div className='navbar-menu_container scale-up-center'>
            <div className='navbar-menu_container-links'>
              <Menu/>
              <div className='navbar-menu_container-links-sign'>
                <p>Sign in</p>
                <button type='button'>Sign up</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar