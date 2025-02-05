import React, { useContext, useEffect, useState, useRef } from "react";
import { dataPage } from "../../assets/data/data";
import "./Header.scss";
import User__foto from "../../assets/image/user.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Context } from "../../assets/Context/Context";

function Header() {
  const userId = window.sessionStorage.getItem("userId");
  const [userData, setUserData] = useState([]);
  const [scrol, setScrol] = useState(false);
  const [menu, setMenu] = useState(false);
  const [language, setLanguage] = useState(window.localStorage.getItem("language") ? window.localStorage.getItem("language") : "ru");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  window.localStorage.getItem("language") ? window.localStorage.getItem("language") : window.localStorage.setItem("language", "ru")
  
  const offSet = 100;
  const getTop = () => window.pageYOffset || document.documentElement.scrollTop;

  const men = useRef();
  const navigate = useNavigate();
  const local = useLocation();

  const { language: contextLanguage, setLanguage: setContextLanguage } = useContext(Context);

  // Обработка скролла для изменения стилей хедера
  useEffect(() => {
    const handleScroll = () => {
      if (getTop() > offSet) {
        setScrol(true);
      } else {
        setScrol(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Загружаем данные пользователя с API
  useEffect(() => {
    if (userId) {
      fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Ошибка при выполнении запроса");
          }
          return res.json();
        })
        .then((data) => {
          setUserData([data]);
        })
        .catch((error) => {
          console.error("Ошибка при выполнении запроса:", error);
        });
    }
  }, [userId]);

  // Перенаправление на главную страницу, если текущий путь "/Home"
  useEffect(() => {
    if (local.pathname === "/Home") {
      navigate("/");
    }
  }, [local, navigate]);

  // Сброс overflow при смене страницы
  useEffect(() => {
    document.body.style.overflow = 'auto';
    setIsMenuOpen(false);
  }, [local.pathname]);

  // Переключение языка
  const select_langu = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setContextLanguage(selectedLanguage);
    window.localStorage.setItem("language", selectedLanguage);
  };

  // Переключение меню на мобильных устройствах
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'auto' : 'hidden';
  };

  // Выход из аккаунта
  const handleLogout = () => {
    window.sessionStorage.removeItem("userId");
    navigate("/signin");
  };

  const user = userData.find((e) => e.id === userId);

  return (
    <div className={scrol ? "active" : "header__sass"}>
      <div className="container">
        <div className="header__inner">
          <h1>FAST & FOOD</h1>

          {/* Десктопное меню */}
          <div className="desktop-menu">
            <div className="nav-links">
              <ul>
                {dataPage?.map((e) => (
                  <Link key={e.en} to={`/${e.en}`}>
                    <strong>{e[`${language}`]}</strong>
                  </Link>
                ))}
              </ul>
            </div>

            <div className="account__login">
              {user ? (
                <div className="account__login__user">
                  <button 
                    onClick={() => navigate('/korzinka')} 
                    className="btn btn-outline-light me-2 basket__btn"
                  >
                    В корзину <i className="bi bi-cart-fill me-1"></i>
                  </button>
                  
                  <div 
                    onClick={() => navigate('/profile')} 
                    className="d-flex align-items-center"
                  >
                    <h4 className="mb-0 me-2">{user.login}</h4>
                    <img src={user.photo || User__foto} alt="User" className="rounded-circle" />
                  </div>
                  
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light ms-2 basket__btn"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <div className="signin__signup">
                  <Link to="/signin">
                    <button className="login-btn">Log In</button>
                  </Link>
                  <Link to="/signup">
                    <button className="login-btn">Sign Up</button>
                  </Link>
                </div>
              )}

              <div className="language-selector">
                <select value={language} onChange={select_langu}>
                  <option value="ru">Ru</option>
                  <option value="en">Eng</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Мобильное меню */}
          <div className={`hamburger ${isMenuOpen ? 'activeee' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`nav-menu ${isMenuOpen ? 'activee' : 'none'}`}>
            <div className="nav-links">
              <ul>
                {dataPage?.map((e) => (
                  <Link 
                    key={e.en} 
                    to={`/${e.en}`} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <strong>{e[`${language}`]}</strong>
                  </Link>
                ))}
              </ul>
            </div>

            <div className="account__login">
              {user ? (
                <div className="account__login__user">
                  <button 
                    onClick={() => {
                      navigate('/korzinka');
                      setIsMenuOpen(false);
                    }} 
                    className="btn btn-outline-light me-2 basket__btn"
                  >
                    В корзину <i className="bi bi-cart-fill me-1"></i>
                  </button>
                  
                  <div 
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }} 
                    className="d-flex align-items-center"
                  >
                    <h4 className="mb-0 me-2">{user.login}</h4>
                    <img src={user.photo || User__foto} alt="User" className="rounded-circle" />
                  </div>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="btn btn-outline-light ms-2 basket__btn"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </div>
              ) : (
                <div className="signin__signup">
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    <button className="login-btn">Log In</button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="login-btn">Sign Up</button>
                  </Link>
                </div>
              )}

              <div className="language-selector">
                <select value={language} onChange={select_langu}>
                  <option value="ru">Ru</option>
                  <option value="en">Eng</option>
                </select>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Header;
