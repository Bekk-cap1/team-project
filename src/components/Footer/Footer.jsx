import React from 'react'
import './Footer.scss'

import Logo from '../../assets/image/logo.png'
import { useLocation } from 'react-router-dom'

function Footer({style}) {
  const local = useLocation()
  

  return (
    <div className='footer' style={local.pathname == '/korzinka' ? {display: "none"} : {display: "block"}}>
      <div className="footer__container">
        <div className="footer__container__inner">
          <div className="right">
            <h2>FAST & FOOD</h2>
          </div>
          <div className="left">
            <h4>Мы в соц.сетях</h4>
            <ul>
              <li><a href="https://instagram.com/aisha_safiyem" target='_blank'><i class="bi bi-instagram"></i></a></li>
              <li><a href="https://t.me/aisha_safiyem" target='_blank'><i class="bi bi-telegram"></i></a></li>
            </ul>
            <h4>Связаться с нами:</h4>
            <a href="tel:998944692509">+998 (94) 469-25-09</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer