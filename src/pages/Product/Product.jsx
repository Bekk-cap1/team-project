import React, { useContext, useEffect, useState } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { SwiperSlide, Swiper } from 'swiper/react'
import { catItem, dataPoisk, dataSearch, selValue } from '../../assets/data/data'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Product.scss'
import { Context } from '../../assets/Context/Context'
import { useLocation, useNavigate } from 'react-router-dom'
import evoslogo from "../../assets/image/evoslogo.jpg"
import maxway_logo from "../../assets/image/maxwaylogo3.png"
import oqtepa_logo from "../../assets/image/oqtepalogo1.jpg"
import { Modal, Button, Form } from 'react-bootstrap';


const listArr = []
const listArr2 = []
const listPagenation = []
const catArr = []

function Product() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [paginationTrue, setPaginationTrue] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetch("https://638208329842ca8d3c9f7558.mockapi.io/team-project")
      .then(res => res.json())
      .then(data => {
        data?.map((e) => {
          if (listArr.find((item) => item.category == e.category)) {
            console.log();
          } else {
            listArr.push(e)
          }
        })
      });
  }, []);

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
      result = products.filter(Boolean);
    } else {
      result = products.filter((item) =>
        item.category.toLowerCase().includes(elSearch) ||
        item[`list_name_${lan}`]?.toLowerCase().includes(elSearch) ||
        item[`list_text_${lan}`]?.toLowerCase().includes(elSearch)
      );
    }

    console.log(result);
    setPaginationTrue(true);
    setSearchData(result);
  };

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

    products.map((q) => {
      if (catArr.find((item) => item == q.category)) {
        categoryArr.push(q)
      } else if (catArr.length == 0) {
        categoryArr.push(q)
      }
    })

    setCategArr(categoryArr)
  }

  const selType = (e) => {
    const el = e.target.value;
    setData([])
    setCount(count + 1);

    const currentData = searchData?.length ? searchData : categArr?.length ? categArr : products;

    const sortedData = [...currentData];

    if (el === "ascending") {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (el === "descending") {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (el === "new") {
      sortedData.sort((a, b) => b.id - a.id);
    } else {
      sortedData.sort((a, b) => a.id - b.id);
    }

    setData(sortedData);
  };

  if (data) {
    listProduct.push(data.slice(pagination * 12 - 12, pagination * 12))
    data.map((e, i) => {
      const mat = Math.floor(((i) / 12) + 1)
      if (!listPagenation.includes(mat)) {
        listPagenation.push(mat)
      }
    })
  } else if (searchData) {
    if (searchData.length !== 0) {
      listProduct.push(searchData.slice(pagination * 12 - 12, pagination * 12))
      searchData.map((e, i) => {
        const mat = Math.floor(((i) / 12) + 1)
        if (!listPagenation.includes(mat)) {
          listPagenation.push(mat)
        }
      })
    }
  } else if (categArr) {
    if (categArr.length !== 0) {
      listProduct.push(categArr.slice(pagination * 12 - 12, pagination * 12))
      categArr.map((e, i) => {
        const mat = Math.floor(((i) / 12) + 1)
        if (!listPagenation.includes(mat)) {
          listPagenation.push(mat)
        }
      })
    }
  } else {
    listProduct.push(products.slice(pagination * 12 - 12, pagination * 12))
    products.map((e, i) => {
      const mat = Math.floor(((i) / 12) + 1)
      if (!listPagenation.includes(mat)) {
        listPagenation.push(mat)
      }
    })
  }

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
  useEffect(() => {
    // Проверка прав админа
    const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    setIsLoading(true);
    fetch('https://638208329842ca8d3c9f7558.mockapi.io/team-project')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки данных:', err);
        setIsLoading(false);
      });

    if (userId) {
      fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`)
        .then(res => res.json())
        .then(data => {
          const userCartItems = data.filter(item => item.userId === userId);
          setCartItems(userCartItems);
          setKorzinka(userCartItems);
        })
        .catch(err => {

        });
    }
  }, []);

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

  const { korzinka, setKorzinka } = useContext(Context);

  useEffect(() => {
  }, [korzinka]);

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

      const itemToAdd = products.find(item => item.id === id);
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

  return (
    <div className='product'>
      <div className="product__container">
        <div className="product__container__inner">
          <header>
            <ul className='categoriy'>
              {
                listArr?.map((e, i) => (
                  <li key={i} name={e.name} id={e.category} className={listArrr2 == e.id ? 'cat_item' : 'cat_item'} onClick={sortter}>
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
              {isAdmin && (
                <button
                  onClick={() => navigate('/addData')}
                  className="add-product-btn"
                >
                  Добавить товар
                </button>
              )}
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
            {isLoading ? (
              <div className="loading1">
                <div className="spinner"></div>
                <div className="loading-text">Загрузка...</div>
              </div>
            ) : (
              <>
                {/* Сравнение трех товаров */}
                {paginationTrue && (
                  <div className="comparison-section">
                    <h3>Сравнение товаров</h3>
                    <ul className="comparison-list">
                      {listProduct[0].map((e) => (
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
                              <div className="progress-fill" style={{ width: `${(e.height / Math.max(...listProduct[0].map((el) => el.height))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>{e.height}гр
                                {Math.round((Math.max(...listProduct[0].map((el) => el.height))) - e.height) !== 0 ?
                                  <strong>
                                    <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listProduct[0].map((el) => el.height))) - e.height)}
                                  </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.height / Math.max(...listProduct[0].map((el) => el.height))) * 100)}%</span>
                            </div>

                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${(e.price / Math.max(...listProduct[0].map((el) => el.price))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>{e.price}сум
                                {Math.round((Math.max(...listProduct[0].map((el) => el.price))) - e.price) !== 0 ?
                                  <strong>
                                    <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listProduct[0].map((el) => el.price))) - e.price)}
                                  </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.price / Math.max(...listProduct[0].map((el) => el.price))) * 100)}%</span>
                            </div>

                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${(e.recall / Math.max(...listProduct[0].map((el) => el.recall))) * 100}%` }}>
                              </div>
                            </div>
                            <div className="indikator">
                              <span>Оценка: {e.recall}
                                {Math.round((Math.max(...listProduct[0].map((el) => el.recall))) - e.recall) !== 0 ?
                                  <strong>
                                    <i className="bi bi-caret-down-fill"></i>{Math.round((Math.max(...listProduct[0].map((el) => el.recall))) - e.recall)}
                                  </strong> : ''
                                }
                              </span>
                              <span>{Math.round((e.recall / Math.max(...listProduct[0].map((el) => el.recall))) * 100)}%</span>
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

                <ul style={paginationTrue !== true ? {} : { display: 'none' }}>
                  {listProduct[0]?.map((e) => (
                    <li key={e.id} onClick={() => navigate(`/products/${e.id}`)}>
                      <Swiper spaceBetween={30}
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
                        className="mySwiper">
                        {e.images?.map((t) => (
                          <SwiperSlide key={t.image_id}><img src={t.image_url} alt="" /></SwiperSlide>
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
                            {userId && cartItems.some(item => item.id === e.id) ? (
                              <i className="bi bi-cart-check"></i>
                            ) : (
                              <i className="bi bi-cart-plus"></i>
                            )}
                          </button>
                        </div>
                        {isAdmin && (
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
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

              </>
            )}

            <div className='div__pagenation'>
              <ul>
                {
                  listPagenation?.map((e, i) => (
                    paginationTrue !== true ?
                      <button key={i} onClick={() => setPagination(e)}>{e}</button>
                      : ''
                  ))
                }
              </ul>
            </div>
          </main>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} style={{ zIndex: 99999 }}>
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

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} style={{ zIndex: 99999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить новый товар / Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название на русском</Form.Label>
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
              <Form.Label>Описание на русском</Form.Label>
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
              <Form.Label>Количество на складе / Stock</Form.Label>
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
              <Form.Label>Высота / Height</Form.Label>
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
              <Form.Label>Отзывы / Recall</Form.Label>
              <Form.Control
                type="number"
                value={newProduct.recall}
                onChange={(e) => setNewProduct({
                  ...newProduct,
                  recall: Number(e.target.value)
                })}
              />
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
  )
}

export default Product