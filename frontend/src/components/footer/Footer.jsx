import './footer.css'
import logo from '../../assets/logos/logo_darktheme_thinklink.png'
const Footer = () => {
  return (
    <div className='footer section_padding'>
      <div className='footer-links'>
        <div className='footer-links_logo'>
          <img src={logo} alt='logo'/>
        </div>
        <div className='footer-links_div'>
          <h4>Links</h4>
          <p>Home</p>
          <p>My Learning</p>
          <p>Support</p>
          <p>About</p>
        </div>
        <div className='footer-links_div'>
          <h4>Contributers</h4>
          <p><a href='https://www.linkedin.com/in/majed-shmait' target='_blank'>Majed Shmait</a></p>
          <p><a href='https://www.linkedin.com/in/moussa-farhat' target='_blank'>Moussa Farhat</a></p>
          <p><a href='https://www.linkedin.com/in/yasmine-zd' target='_blank'>Yasmine Zahreddine</a></p>
        </div>
        <div className='footer-links_div'>
          <h4>Get in touch</h4>
          <p><a href='mailto::majedshmaitlu@gmail.com'>majedshmaitlu@gmail.com</a></p>
          <p><a href='mailto::mrmfrht20@gmail.com'>mrmfrht20@gmail.com</a></p>
          <p><a href='mailto::zahreddineyasmine@gmail.com'>zahreddineyasmine@gmail.com</a></p>
        </div>
      </div>
      <div className='footer-copyright'>
        <p>© 2024 ThinkLink. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer