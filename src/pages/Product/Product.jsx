import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { SwiperSlide, Swiper } from 'swiper/react'
import { catItem, dataPoisk, dataSearch, selValue } from '../../assets/data/data'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Product.scss'
import { Context } from '../../assets/Context/Context'
import { useLocation, useNavigate } from 'react-router-dom'
import jsonFile1 from "../../assets/data/listEvos.json";
import jsonFile2 from "../../assets/data/listMaxway.json";
import jsonFile3 from "../../assets/data/listOqtepa.json";
import evoslogo from "../../assets/image/evoslogo.jpg"
import maxway_logo from "../../assets/image/maxwaylogo3.png"
import oqtepa_logo from "../../assets/image/oqtepalogo1.jpg" 

const listArr = []
const listArr2 = []
const listPagenation = []
const catArr = []


function Product() {

  const listData = [...jsonFile1, ...jsonFile2, ...jsonFile3]


  listData?.map((e) => {
    if (listArr.find((item) => item.category == e.category)) {
      console.log();
    } else {
      listArr.push(e)
    }
  })

  const [listArrr2, setListArr2] = useState(listArr2[0])
  const [pagination, setPagination] = useState(1)
  const [count, setCount] = useState(0)

  const navigate = useNavigate()

  const lan = window.localStorage.getItem('language')

  const SearchDataList = []
  const [searchData, setSearchData] = useState()

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
    setSearchData(result);
  };
  
  // listData.map((e, i) => {
  //   const mat = Math.floor(((i) / 12) + 1)
  //   if (listPagenation.find((item) => item == mat)) {
  //     console.log();
  //   } else {
  //     listPagenation.push(mat)
  //     // console.log(listPagenation);
  //   }
  // })

  const typeData = []
  const [data, setData] = useState()


  const listProduct = []
  const categoryArr = []
  const [categArr, setCategArr] = useState()



  const sortter = (e) => {
    setCount(count + 1)
    setListArr2(e.target.id)
    e.target.parentElement.classList.toggle('cat_item_active')
    if (catArr.find((item) => item == e.target.parentElement.id)) {
      catArr.pop(e.target.parentElement.id)
    } else {
      catArr.push(e.target.parentElement.id)
    }

    listData.map((q) => {
      if (catArr.find((item) => item == q.category)) {
        categoryArr.push(q)
      } else if (catArr.length == 0) {
        categoryArr.push(q)
      }
    })

    setCategArr(categoryArr)
  }

  const selType = (e) => {
    const el = e.target.value; // Получаем выбранное значение
    setData([])
    setCount(count + 1); // Увеличиваем счетчик

    // Определяем массив для сортировки
    const currentData = searchData?.length ? searchData : categArr?.length ? categArr : listData;

    // Копируем данные, чтобы избежать изменения оригинального массива
    const sortedData = [...currentData];

    // Выполняем сортировку в зависимости от выбранного типа
    if (el === "ascending") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (el === "descending") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (el === "new") {
      sortedData.sort((a, b) => b.id - a.id);
    } else {
      sortedData.sort((a, b) => a.id - b.id);
    }

    // Устанавливаем отсортированные данные в состояние
    setData(sortedData);

  };


  if (data) {
    listProduct.push(data)
  }
  if (categArr) {
    listProduct.push(categArr)
  }






  if (searchData) {
    if (searchData.length !== 0) {
      listProduct.push(searchData.slice(pagination * 12 - 12, pagination * 12))
      searchData.map((e, i) => {
        const mat = Math.floor(((i) / 12) + 1)
        if (listPagenation.find((item) => item == mat)) {
          console.log();
        } else {
          listPagenation.push(mat)
          // console.log(listPagenation);
        }
      })
    }
  } else if (categArr) {
    if (categArr.length !== 0) {
      listProduct.push(categArr.slice(pagination * 12 - 12, pagination * 12))
      categArr.map((e, i) => {
        const mat = Math.floor(((i) / 12) + 1)
        if (listPagenation.find((item) => item == mat)) {
          console.log();
        } else {
          listPagenation.push(mat)
          // console.log(listPagenation);
        }
      })
    }
  }
  else if (listProduct.length == 0) {
    listProduct.push(listData.slice(pagination * 12 - 12, pagination * 12))
    listData.map((e, i) => {
      const mat = Math.floor(((i) / 12) + 1)
      if (listPagenation.find((item) => item == mat)) {
        console.log();
      } else {
        listPagenation.push(mat)
      }
    })
  } else {
    listProduct.push(listData.slice(pagination * 12 - 12, pagination * 12))
    listData.map((e, i) => {
      const mat = Math.floor(((i) / 12) + 1)
      if (listPagenation.find((item) => item == mat)) {
        console.log();
      } else {
        listPagenation.push(mat)
      }
    })
  }

  const userId = window.sessionStorage.getItem("userId");
  const [userData, setUserData] = useState([]);
  const listHome = searchData?.length ? searchData : listData.slice(-15, -5);
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


  const { korzinka, setKorzinka } = useContext(Context); // Инициализация как пустого массива
  useEffect(() => {

  }, [korzinka]);
  const pushKorzinka = (id) => {
    setKorzinka((prevKorzinka) => {
      // Проверяем, есть ли элемент в текущем состоянии корзины
      const itemExists = prevKorzinka.some((item) => item.id === id);
      if (itemExists) {
        console.log("Этот элемент уже существует в корзине");
        return prevKorzinka; // Возвращаем корзину без изменений
      } else {
        const itemToAdd = searchData?.length ? searchData.find((item) => item.id === id) : listData.find((item) => item.id === id);
        if (itemToAdd) {
          console.log("Элемент добавлен в корзину:", itemToAdd);
          return [...prevKorzinka, { ...itemToAdd, quantity: 1 }];
        }
      }
      return prevKorzinka; // Возвращаем корзину без изменений, если ничего не найдено
    });
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
    <div className='product'>
      <div className="product__container">
        <div className="product__container__inner">

          <header>
            <ul className='categoriy'>
              {
                listArr?.map((e, i) => (
                  <li name={e.name} id={e.category} className={listArrr2 == e.id ? 'cat_item' : 'cat_item'} onClick={sortter}>
                    <img src={e.images[0].image_url} alt="" id={e.id} />
                    <h5 id={e.id}>{e.category}</h5>
                  </li>
                ))
              }
            </ul>
          </header>

          <main>
            <div className='product__search'>
              <div>
                <form action="#" onSubmit={search__item}>
                  <input name='inp' id='inp_search' type="search" placeholder={dataSearch[0][`name_${lan}`]} />
                  <button type='submit'>{dataPoisk[0][`name_${lan}`]}</button>
                </form>
              </div>
              <div>
                {
                  selValue?.map((e) => (
                    <h4 key={e[`name_${lan}`]}>
                      {e[`name_${lan}`]} :
                      <select onChange={(event) => selType(event, e)}>
                        {e[`list_${lan}`]?.map((q) => (
                          <option key={q.turtle} value={q.turtle}>
                            {q[`title_${lan}`]}
                          </option>
                        ))}
                      </select>
                    </h4>
                  ))
                }
              </div>
            </div>
            <hr />
            <ul>
              {
                listProduct[1] ?
                  listProduct[0]?.map((e, i) => (
                    <li key={e.id} onClick={() => navigate(`/products/${e.id}`)}>
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
                        {
                          e.images?.map((t) => (
                            <SwiperSlide id={t.image_id}><img src={t.image_url} alt="" /></SwiperSlide>
                          ))
                        }
                      </Swiper>
                      <div className="about_product">
                        <h6>{e[`stock_${lan}`]} : {e.stock}</h6>
                        <h2>{e[`list_name_${lan}`]}</h2>
                        <p>{e[`list_text_${lan}`]}</p>
                        <img src={e.name_fastfood == 'evos' ? evoslogo : e.name_fastfood == 'maxway' ? maxway_logo : oqtepa_logo} alt="" className='fastfood_logo' />

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.height / Math.max(...listHome.map((el) => el.height))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{e.height}гр
                            {
                              Math.round((Math.max(...listHome.map((el) => el.height))) - e.height) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.height))) - e.height)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.height / Math.max(...listHome.map((el) => el.height))) * 100)}%</span>
                        </div>

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.price / Math.max(...listHome.map((el) => el.price))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{e.price}сум
                            {
                              Math.round((Math.max(...listHome.map((el) => el.price))) - e.price) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.price))) - e.price)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.price / Math.max(...listHome.map((el) => el.price))) * 100)}%</span>
                        </div>

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.recall / Math.max(...listHome.map((el) => el.recall))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>Оценка: {e.recall}
                            {
                              Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.recall / Math.max(...listHome.map((el) => el.recall))) * 100)}%</span>
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
                  ))
                  :
                  listProduct[0]?.map((e, i) => (
                    <li key={e.id} onClick={() => navigate(`/products/${e.id}`)}>
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
                        {
                          e.images?.map((t) => (
                            <SwiperSlide id={t.image_id}><img src={t.image_url} alt="" /></SwiperSlide>
                          ))
                        }
                      </Swiper>
                      <div className="about_product">
                        <h6>{e[`stock_${lan}`]} : {e.stock}</h6>
                        <h2>{e[`list_name_${lan}`]}</h2>
                        <p>{e[`list_text_${lan}`]}</p>
                        <img src={e.name_fastfood == 'evos' ? evoslogo : e.name_fastfood == 'maxway' ? maxway_logo : oqtepa_logo} alt="" className='fastfood_logo' />

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.height / Math.max(...listHome.map((el) => el.height))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{e.height}гр
                            {
                              Math.round((Math.max(...listHome.map((el) => el.height))) - e.height) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.height))) - e.height)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.height / Math.max(...listHome.map((el) => el.height))) * 100)}%</span>
                        </div>

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.price / Math.max(...listHome.map((el) => el.price))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{e.price}сум
                            {
                              Math.round((Math.max(...listHome.map((el) => el.price))) - e.price) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.price))) - e.price)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.price / Math.max(...listHome.map((el) => el.price))) * 100)}%</span>
                        </div>

                        <div className={listProduct[0].length === 3 ? "progress-bar" : "none"}>
                          <div className="progress-fill" style={{ width: `${(e.recall / Math.max(...listHome.map((el) => el.recall))) * 100}%` }}>
                          </div>
                        </div>
                        <div className={listProduct[0].length == 3 ? 'indikator' : 'none'}>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>Оценка: {e.recall}
                            {
                              Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall) !== 0 ?
                                <strong>
                                  <i class="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.map((el) => el.recall))) - e.recall)}
                                </strong> : ''
                            }
                          </span>
                          <span className={listProduct[0].length === 3 ? "" : "none"}>{Math.round((e.recall / Math.max(...listHome.map((el) => el.recall))) * 100)}%</span>
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
                  ))
              }
            </ul>

            <div className='div__pagenation'>
              <ul>
                {
                  listPagenation?.map((e, i) => (
                    listProduct[0]?.length !== 3 ?
                    <button onClick={() => setPagination(e)}>{e}</button>
                    : ''
                  ))
                }
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Product