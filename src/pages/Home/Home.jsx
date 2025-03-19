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
import evoslogo from "../../assets/image/evoslogo.jpg"
import maxway_logo from "../../assets/image/maxwaylogo3.png"
import oqtepa_logo from "../../assets/image/oqtepalogo1.jpg"
import { Modal, Button, Form } from 'react-bootstrap';

function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminView, setAdminView] = useState('products');
  const [banners, setBanners] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [paginationTrue, setPaginationTrue] = useState(false);
  const [newProduct, setNewProduct] = useState({
    list_name_ru: '',
    list_name_en: '',
    list_text_ru: '',
    list_text_en: '',
    price: 0,
    stock: 0,
    height: 0,
    recall: 0,
    name_fastfood: 'evos',
    images: []
  });

  useEffect(() => {
    // Проверка прав админа
    const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    setIsLoading(true);
    fetch('https://638208329842ca8d3c9f7558.mockapi.io/team-project')
      .then(res => res.json())
      .then(data => {
        // Получаем по одному товару от каждого фастфуда для сравнения
        const evosProduct = data.find(item => item.name_fastfood === 'evos');
        const maxwayProduct = data.find(item => item.name_fastfood === 'maxway');
        const oqtepaProduct = data.find(item => item.name_fastfood === 'oqtepa');
        
        // Добавляем найденные товары в начало списка
        const compareProducts = [evosProduct, maxwayProduct, oqtepaProduct].filter(Boolean);
        const otherProducts = data.filter(item => 
          !compareProducts.some(cp => cp.id === item.id)
        );
        
        const sortedData = [...compareProducts, ...otherProducts].slice(0, 9);
        setProducts(sortedData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setIsLoading(false);
      });

    if (userId) {
      fetch('https://638208329842ca8d3c9f7558.mockapi.io/cart')
        .then(res => res.json())
        .then(data => {
          const userCartItems = data.filter(item => item.userId === userId);
          setCartItems(userCartItems);
          setKorzinka(userCartItems);
        })
        .catch(err => {
          console.error('Ошибка загрузки корзины:', err);
        });
    }
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await fetch('https://638208329842ca8d3c9f7558.mockapi.io/team-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts([...products, addedProduct]);
        setShowAddModal(false);
        setNewProduct({
          list_name_ru: '',
          list_name_en: '',
          list_text_ru: '',
          list_text_en: '',
          price: 0,
          stock: 0,
          height: 0,
          recall: 0,
          name_fastfood: 'evos',
          images: []
        });
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
  };

  const handleDeleteProduct = async (id, event) => {
    event.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const response = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/team-project/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id));
        }
      } catch (error) {
        console.error('Ошибка при удалении:', error);
      }
    }
  };

  const handleEditProduct = (product, event) => {
    event.stopPropagation();
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/team-project/${currentProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentProduct)
      });

      if (response.ok) {
        setProducts(products.map(p =>
          p.id === currentProduct.id ? currentProduct : p
        ));
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Ошибка при обновлении:', error);
    }
  };

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
        setUserData(data);
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
      result = products;
      setPaginationTrue(false)
    } else {
      result = products.filter((item) =>
        item.category?.toLowerCase().includes(elSearch) ||
        item[`list_name_${lan}`]?.toLowerCase().includes(elSearch) ||
        item[`list_text_${lan}`]?.toLowerCase().includes(elSearch)
      );
      setPaginationTrue(true)
    }

    setSearchData(result);
  };

  const listHome = searchData.length ? searchData : products;

  const { korzinka, setKorzinka } = useContext(Context);

  const pushKorzinka = async (id) => {
    if (!userId) {
      console.log("Пользователь не авторизован");
      return;
    }

    try {
      const userResponse = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`);
      if (!userResponse.ok) {
        throw new Error('Ошибка получения данных пользователя');
      }

      const userData = await userResponse.json();
      const userCart = userData.cart || [];

      if (userCart.some(item => item.id === id)) {
        console.log("Этот товар уже в корзине");
        return;
      }

      const itemToAdd = listHome.find(item => item.id === id);
      if (!itemToAdd) {
        console.log("Товар не найден");
        return;
      }

      const newItem = {
        ...itemToAdd,
        quantity: 1,
        cartId: Date.now().toString()
      };

      const updatedCart = [...userCart, newItem];

      const updateResponse = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          cart: updatedCart
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Ошибка обновления корзины');
      }

      setKorzinka(updatedCart);
      setCartItems(updatedCart);

      console.log('Товар успешно добавлен в корзину');

    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`)
        .then(res => res.json())
        .then(userData => {
          const userCart = userData.cart || [];
          setCartItems(userCart);
          setKorzinka(userCart);
        })
        .catch(err => {
          console.error('Ошибка загрузки корзины:', err);
        });
    } else {
      setCartItems([]);
      setKorzinka([]);
    }
  }, [userId]);

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
              {banners.length > 0 ? (
                banners.map((banner, idx) => (
                  <SwiperSlide key={idx}>
                    <img src={banner} alt={`Баннер ${idx + 1}`} />
                  </SwiperSlide>
                ))
              ) : (
                <>
                  <SwiperSlide> </SwiperSlide>
                  <SwiperSlide> </SwiperSlide>
                  <SwiperSlide> </SwiperSlide>
                </>
              )}
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
            <div className="list-header">
              <h2 className='assort'>Ассортимент</h2>
              {isAdmin && (
                <button 
                  onClick={() => navigate('/addData')}
                  className="add-product-btn"
                >
                  Добавить товар
                </button>
              )}
            </div>
            <hr />
            {isLoading ? (
              <div className="loading">
              <div className="spinner"></div> 
              <div className="loading-text">Загрузка...</div>
            </div>
            ) : (
              <>
                {paginationTrue && (
                  <div className="comparison-section">
                    <h3>Сравнение товаров</h3>
                    <ul className="comparison-list">
                      {listHome.slice(0, 3).map((e) => (
                        <li key={e.id} className="three_items" onClick={() => navigate(`/products/${e.id}`)}>
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

                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${(e.height / Math.max(...listHome.slice(0, 3).map((el) => el.height))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>{e.height}гр
                                {
                                  Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.height))) - e.height) !== 0 ?
                                    <strong>
                                      <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.height))) - e.height)}
                                    </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.height / Math.max(...listHome.slice(0, 3).map((el) => el.height))) * 100)}%</span>
                            </div>

                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${(e.price / Math.max(...listHome.slice(0, 3).map((el) => el.price))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>{e.price}сум
                                {
                                  Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.price))) - e.price) !== 0 ?
                                    <strong>
                                      <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.price))) - e.price)}
                                    </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.price / Math.max(...listHome.slice(0, 3).map((el) => el.price))) * 100)}%</span>
                            </div>

                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${(e.recall / Math.max(...listHome.slice(0, 3).map((el) => el.recall))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>Оценка: {e.recall}
                                {
                                  Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.recall))) - e.recall) !== 0 ?
                                    <strong>
                                      <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listHome.slice(0, 3).map((el) => el.recall))) - e.recall)}
                                    </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.recall / Math.max(...listHome.slice(0, 3).map((el) => el.recall))) * 100)}%</span>
                            </div>

                            <div>
                              <h3>{e[`price_${lan}`]} : {e.price}сум</h3>
                              <button onClick={(event) => {
                                event.stopPropagation();
                                if (userId) {
                                  pushKorzinka(e.id);
                                } else {
                                  navigate('/signin');
                                }
                              }}>
                                {userId && korzinka.some(item => item.id === e.id) ? (
                                  <i className="bi bi-cart-check"></i>
                                ) : (
                                  <i className="bi bi-cart-plus"></i>
                                )}
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ul style={paginationTrue !== true ? {} : {display: 'none'}}>
                  {listHome.map((e) => (
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
                        {e.images?.map((t) => (
                          <SwiperSlide key={t.image_id}><img src={t.image_url} style={{marginRight: '0'}} alt="" /></SwiperSlide>
                        ))}
                      </Swiper>
                      <div className="about_product">
                        <h6>{e[`stock_${lan}`]} : {e.stock}</h6>
                        <h2>{e[`list_name_${lan}`]}</h2>
                        <p>{e[`list_text_${lan}`]}</p>
                        <img src={e.name_fastfood == 'evos' ? evoslogo : e.name_fastfood == 'maxway' ? maxway_logo : oqtepa_logo} alt="" className='fastfood_logo' />

                        <div>
                          <h3>{e[`price_${lan}`]} : {e.price}сум</h3>
                          <button onClick={(event) => {
                            event.stopPropagation();
                            if (userId) {
                              pushKorzinka(e.id);
                            } else {
                              navigate('/signin');
                            }
                          }}>
                            {userId && korzinka.some(item => item.id === e.id) ? (
                              <i className="bi bi-cart-check"></i>
                            ) : (
                              <i className="bi bi-cart-plus"></i>
                            )}
                          </button>
                        </div>
                        {isAdmin == true ? (
                          <div className="admin-buttons">
                            <button
                              className="edit-btn"
                              onClick={(event) => handleEditProduct(e, event)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="delete-btn"
                              onClick={(event) => handleDeleteProduct(e.id, event)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать товар / Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название на русском / Name in Russian</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct?.list_name_ru || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  list_name_ru: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name in English</Form.Label>
              <Form.Control
                type="text" 
                value={currentProduct?.list_name_en || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  list_name_en: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание на русском / Description in Russian</Form.Label>
              <Form.Control
                as="textarea"
                value={currentProduct?.list_text_ru || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  list_text_ru: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description in English</Form.Label>
              <Form.Control
                as="textarea"
                value={currentProduct?.list_text_en || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  list_text_en: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Цена / Price</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct?.price || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  price: Number(e.target.value)
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Количество на складе / Stock Amount</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct?.stock || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct,
                  stock: Number(e.target.value)
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Отмена / Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Сохранить / Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} style={{zIndex: 99999}}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новый товар / Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название на русском / Name in Russian</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.list_name_ru}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  list_name_ru: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name in English</Form.Label>
              <Form.Control
                type="text"
                value={newProduct.list_name_en}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  list_name_en: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Описание на русском / Description in Russian</Form.Label>
              <Form.Control
                as="textarea"
                value={newProduct.list_text_ru}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  list_text_ru: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description in English</Form.Label>
              <Form.Control
                as="textarea"
                value={newProduct.list_text_en}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  list_text_en: e.target.value
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Цена / Price</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  price: Number(e.target.value)
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Количество на складе / Stock Amount</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  stock: Number(e.target.value)
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Вес (в граммах) / Weight (in grams)</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.height}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  height: Number(e.target.value)
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Оценка / Rating</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.recall}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  recall: Number(e.target.value)
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Фастфуд / Fastfood</Form.Label>
              <Form.Select
                value={newProduct.name_fastfood}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  name_fastfood: e.target.value
                })}
              >
                <option value="evos">Evos</option>
                <option value="maxway">Maxway</option>
                <option value="oqtepa">Oqtepa</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Отмена / Cancel
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Добавить / Add
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="fixed-basket" onClick={() => navigate('/korzinka')}>
        <div className="basket-icon">
          <i className="bi bi-cart3"></i>
          {korzinka.length > 0 && (
            <span className="basket-count">{korzinka.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
