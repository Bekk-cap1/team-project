import React, { useState } from 'react'
import './addData.scss'

function AddData() {
    
  const [formData, setFormData] = useState({
    list_name_en: '',
    list_name_ru: '',
    list_text_en: '',
    list_text_ru: '', 
    price: '',
    stock: '',
    stock_ru: 'В наличии',
    stock_en: 'In stock',
    price_ru: 'Цена',
    price_en: 'Price',
    name_fastfood: 'evos',
    height: '',
    recall: '',
    category: '',
    images: [{
      image_id: '',
      image_url: ''
    }]
  })

  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    fetch('https://638208329842ca8d3c9f7558.mockapi.io/team-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Ошибка при добавлении товара')
      }
      return res.json()
    })
    .then(data => {
      setNotificationMessage('Товар успешно добавлен!')
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      setFormData({
        list_name_en: '',
        list_name_ru: '',
        list_text_en: '',
        list_text_ru: '',
        price: '',
        stock: '',
        stock_ru: 'В наличии', 
        stock_en: 'In stock',
        price_ru: 'Цена',
        price_en: 'Price',
        name_fastfood: '',
        height: '',
        recall: '',
        category: '',
        images: [{
          image_id: '',
          image_url: ''
        }]
      })
    })
    .catch(err => {
      setNotificationMessage('Ошибка: ' + err.message)
      setShowNotification(true)
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'image_id' || name === 'image_url') {
      setFormData({
        ...formData,
        images: [{
          ...formData.images[0],
          [name]: value
        }]
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          images: [{
            ...formData.images[0],
            image_url: reader.result
          }]
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="add-data">
      {showNotification && (
        <div className={`alert ${notificationMessage.includes('Ошибка') ? 'alert-danger' : 'alert-success'} alert-dismissible fade show`} 
             role="alert" 
             style={{
               position: 'fixed',
               top: '20px',
               right: '20px',
               zIndex: 1000
             }}>
          {notificationMessage}
          <button type="button" className="btn-close" onClick={() => setShowNotification(false)}></button>
        </div>
      )}
      <h2>Добавить новый продукт</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="list_name_en"
          placeholder="Название на английском"
          value={formData.list_name_en}
          onChange={handleChange}
        />
        <input
          type="text" 
          name="list_name_ru"
          placeholder="Название на русском"
          value={formData.list_name_ru}
          onChange={handleChange}
        />
        <textarea
          name="list_text_en"
          placeholder="Описание на английском"
          value={formData.list_text_en}
          onChange={handleChange}
        />
        <textarea
          name="list_text_ru"
          placeholder="Описание на русском"
          value={formData.list_text_ru}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          placeholder="Количество в наличии"
          value={formData.stock}
          onChange={handleChange}
        />
        <input
          type="number"
          name="height"
          placeholder="Вес"
          value={formData.height}
          onChange={handleChange}
        />
        <input
          type="number"
          name="recall"
          placeholder="Рейтинг"
          value={formData.recall}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Категория"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="name_fastfood"
          placeholder="Название фастфуда"
          value={formData.name_fastfood}
          onChange={handleChange}
        />
        <div className="image-upload">
          <input
            type="text"
            name="image_url"
            placeholder="URL изображения"
            value={formData.images[0].image_url}
            onChange={handleChange}
          />
          <p>или</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <input
          type="number"
          name="image_id"
          placeholder="ID изображения"
          value={formData.images[0].image_id}
          onChange={handleChange}
        />
        {formData.images[0].image_url && (
          <div className="image-preview">
            <img src={formData.images[0].image_url} alt="Предпросмотр" style={{maxWidth: '200px'}} />
          </div>
        )}
        <button type="submit">Добавить продукт</button>
      </form>
    </div>
  )
}

export default AddData