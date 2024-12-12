import { React, useContext, useEffect, useRef, useState } from 'react';
import './Home.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { dataPage, dataPoisk, dataSearch } from '../../assets/data/data';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../assets/Context/Context';
import jsonFile1 from "../../assets/data/listEvos.json";
import jsonFile2 from "../../assets/data/listMaxway.json";
import jsonFile3 from "../../assets/data/listOqtepa.json";
import evoslogo from "../../assets/image/evoslogo.jpg"
import maxway_logo from "../../assets/image/maxwaylogo3.png"
import oqtepa_logo from "../../assets/image/oqtepalogo1.jpg"

function Home() {

  const listData = [...jsonFile1, ...jsonFile2, ...jsonFile3]

  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  const navigate = useNavigate();
  const lan = window.localStorage.getItem('language');
  const userId = window.sessionStorage.getItem("userId");
  const [userData, setUserData] = useState([]);

  const user = userData.find((e) => e.id === userId);

  useEffect(() => {
    fetch("https://638208329842ca8d3c9f7558.mockapi.io/user_data", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при выполнении запроса");
        }
        return res.json();
      })
      .then((data) => {
        setUserData(data); // Логируем полученные данные
      })
      .catch((error) => {
        console.error("Ошибка при выполнении запроса:", error);
      });
  }, []);

  const [searchData, setSearchData] = useState([]);

  const search__item = (e) => {
    e.preventDefault();
    const elSearch = e.target.elements.inp.value.toLowerCase();
  
    let result;
  
    if (elSearch.trim() == "") {
      // Если инпут пустой, возвращаем первые элементы из каждой базы
      result = [
        ...jsonFile1,
        ...jsonFile2,
        ...jsonFile3,
      ].filter(Boolean); // Убираем undefined, если базы могут быть пустыми
    } else {
      // Фильтруем данные из каждой базы
      const filteredData1 = jsonFile1.filter((item) =>
        item.category.toLowerCase().includes(elSearch) ||
        item[`list_name_${lan}`]?.toLowerCase().includes(elSearch) ||
        item[`list_text_${lan}`]?.toLowerCase().includes(elSearch)
      );
  
      const filteredData2 = jsonFile2.filter((item) =>
        item.category.toLowerCase().includes(elSearch) ||
        item[`list_name_${lan}`]?.toLowerCase().includes(elSearch) ||
        item[`list_text_${lan}`]?.toLowerCase().includes(elSearch)
      );
  
      const filteredData3 = jsonFile3.filter((item) =>
        item.category.toLowerCase().includes(elSearch) ||
        item[`list_name_${lan}`]?.toLowerCase().includes(elSearch) ||
        item[`list_text_${lan}`]?.toLowerCase().includes(elSearch)
      );
  
      // Получаем по одному элементу из каждого списка
      result = [
        filteredData1[0],
        filteredData2[0],
        filteredData3[0],
      ].filter(Boolean); // Убираем undefined, если в одном из списков нет подходящих элементов
    }
  
    // Сохраняем результат
    console.log(result);
    setSearchData(result.length == 3 ? result : result.slice(-10,-1));
  };



  const listHome = searchData.length ? searchData : listData.slice(-10, -1);

  const { korzinka, setKorzinka } = useContext(Context); // Инициализация как пустого массива
  const pushKorzinka = (id) => {
    // Проверяем, есть ли элемент в корзине
    const itemExists = korzinka.some((item) => item.id === id);
    if (itemExists) {
      console.log("Этот элемент уже существует в корзине");
    } else {
      const itemToAdd = listHome.find((item) => item.id === id);
      if (itemToAdd) {
        // Добавляем элемент с полем quantity
        setKorzinka((prevKorzinka) => [
          ...prevKorzinka,
          { ...itemToAdd, quantity: 1 }
        ]);
        console.log("Элемент добавлен в корзину:", itemToAdd);
      }
    }
    console.log("Текущая корзина:", korzinka);
  };
  useEffect(() => {
    try {
      const savedKorzinka = JSON.parse(localStorage.getItem('korzinka')) || [];
      setKorzinka(savedKorzinka);
    } catch (error) {
      console.error('Ошибка чтения из localStorage:', error);
    }
  }, [setKorzinka]);

  useEffect(() => {
    if (korzinka.length > 0) {
      localStorage.setItem('korzinka', JSON.stringify(korzinka));
    }
  }, [korzinka]);

  return (
    <div className='home'>
      <div className="home__container">
        <div className="home__container__inner">
          <div className="swipper">
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              onAutoplayTimeLeft={onAutoplayTimeLeft}
              className="mySwiper"
            >
              <SwiperSlide> </SwiperSlide>
              <SwiperSlide> </SwiperSlide>
              <SwiperSlide> </SwiperSlide>
              <div className="autoplay-progress" slot="container-end">
                <svg viewBox="0 0 48 48" ref={progressCircle}>
                  <circle cx="24" cy="24" r="20"></circle>
                </svg>
                <span ref={progressContent}></span>
              </div>
            </Swiper>
          </div>

          <div className="search">
            <form action="#" onSubmit={search__item}>
              <input name='inp' id='inp_search' placeholder={dataSearch[0][`name_${lan}`]} />
              <button type='submit'>{dataPoisk[0][`name_${lan}`]}</button>
            </form>
          </div>

          <div className="list">
            <h2 className='assort'>Ассортимент</h2>
            <hr />
            <ul>
              {listHome.map((e) => (
                <li key={e.id} className={listHome.length == 3 ? "three_items" : ''} onClick={() => navigate(`/products/${e.id}`)}>
                  <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                  >
                    {e.images?.map((t) => (
                      <SwiperSlide key={t.image_id}><img src={t.image_url} alt="" /></SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="about_product">
                    <h6>{e[`stock_${lan}`]} : {e.stock}</h6>
                    <h2>{e[`list_name_${lan}`]}</h2>
                    <p>{e[`list_text_${lan}`]}</p>
                    <img src={e.name_fastfood == 'evos' ? evoslogo : e.name_fastfood == 'maxway' ? maxway_logo : oqtepa_logo} alt="" className='fastfood_logo' />

                    <div className={listHome.length === 3 ? "progress-bar" : "none"}>
                      <div className="progress-fill" style={{ width: `${(e.height / Math.max(...listHome.map((el) => el.height))) * 100}%` }}>
                      </div>
                    </div>
                    <div className={listHome.length == 3 ? 'indikator' : 'none'}>
                      <span className={listHome.length === 3 ? "" : "none"}>{e.height}гр
                        {
                          Math.round((Math.max(...listHome.map((el) => el.height))) - e.height) !== 0 ?
                            <strong>
                              <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.height))) - e.height)}
                            </strong> : ''
                        }
                      </span>
                      <span className={listHome.length === 3 ? "" : "none"}>{Math.round((e.height / Math.max(...listHome.map((el) => el.height))) * 100)}%</span>
                    </div>

                    <div className={listHome.length === 3 ? "progress-bar" : "none"}>
                      <div className="progress-fill" style={{ width: `${(e.price / Math.max(...listHome.map((el) => el.price))) * 100}%` }}>
                      </div>
                    </div>
                    <div className={listHome.length == 3 ? 'indikator' : 'none'}>
                      <span className={listHome.length === 3 ? "" : "none"}>{e.price}сум
                        {
                          Math.round((Math.max(...listHome.map((el) => el.price))) - e.price) !== 0 ?
                            <strong>
                              <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.price))) - e.price)}
                            </strong> : ''
                        }
                      </span>
                      <span className={listHome.length === 3 ? "" : "none"}>{Math.round((e.price / Math.max(...listHome.map((el) => el.price))) * 100)}%</span>
                    </div>

                    <div className={listHome.length === 3 ? "progress-bar" : "none"}>
                      <div className="progress-fill" style={{ width: `${(e.recall / Math.max(...listHome.map((el) => el.recall))) * 100}%` }}>
                      </div>
                    </div>
                    <div className={listHome.length == 3 ? 'indikator' : 'none'}>
                      <span className={listHome.length === 3 ? "" : "none"}>Оценка: {e.recall}
                        {
                          Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall) !== 0 ?
                            <strong>
                              <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall)}
                            </strong> : ''
                        }
                      </span>
                      <span className={listHome.length === 3 ? "" : "none"}>{Math.round((e.recall / Math.max(...listHome.map((el) => el.recall))) * 100)}%</span>
                    </div>

                    <div>
                      <h3>{e[`price_${lan}`]} : {e.price}сум</h3>
                      {
                        user ?
                          <button onClick={(event) => {
                            event.stopPropagation() // Предотвращаем срабатывание onClick на <li>
                            pushKorzinka(e.id)
                          }}>
                            {
                              korzinka.some((item) => item.id === e.id) ?
                                <i className="bi bi-cart-check"></i>
                                :
                                <i className="bi bi-cart-plus"></i>
                            }
                          </button> : <button onClick={(event) => {
                            event.stopPropagation(); // Предотвращаем срабатывание onClick на <li>
                            navigate('/signin');
                          }}>
                            {
                              korzinka.some((item) => item.id === e.id) ?
                                <i className="bi bi-cart-check"></i>
                                :
                                <i className="bi bi-cart-plus"></i>
                            }
                          </button>
                      }
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
