import React, { useState, useEffect } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './Profile.scss'

function Profile() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '', 
    photo: '',
    password: ''
  })
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const token = sessionStorage.getItem('userId')
    if (!token) {
      navigate('/signin')
      return
    }
    setIsAuthenticated(true)
    fetchUserData()
  }
  const userId = sessionStorage.getItem('userId')
  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`)
      const data = await response.json()
      setUserData(data)
    } catch (error) {
      setMessage('Ошибка при загрузке данных')
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const compressImage = (file) => {
    if (!file) {
      throw new Error('Файл не предоставлен');
    }

    if (!(file instanceof Blob || file instanceof File)) {
      throw new Error('Параметр должен быть Blob или File');
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name || 'image.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.8);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoSubmit = async () => {
    if (!photo) {
      setMessage('Пожалуйста, выберите файл');
      return;
    }

    setLoading(true);
    try {
      const compressedFile = await compressImage(photo);
      
      const formData = new FormData();
      formData.append('photo', compressedFile);

      const response = await fetch('https://638208329842ca8d3c9f7558.mockapi.io/user_data', {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        setMessage('Фото профиля успешно обновлено');
      } else {
        setMessage('Ошибка при обновлении фото');
      }
    } catch (error) {
      setMessage('Ошибка при обработке изображения');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Проверяем текущий пароль
    if (currentPassword !== userData.password) {
      setMessage('Неверный текущий пароль')
      setLoading(false)
      return
    }

    // Проверяем совпадение нового пароля
    if (newPassword !== confirmPassword) {
      setMessage('Новые пароли не совпадают')
      setLoading(false)
      return
    }

    // Проверяем сложность пароля
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      setMessage('Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, и цифры')
      setLoading(false)
      return
    }

    try {
      const updatedData = {
        ...userData,
        password: newPassword,
        photo: photo || userData.photo
      }

      const response = await fetch(`https://638208329842ca8d3c9f7558.mockapi.io/user_data/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        setMessage('Пароль успешно обновлен')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage('Ошибка при обновлении пароля')
      }
    } catch (error) {
      setMessage('Ошибка при обновлении пароля')
    }
    setLoading(false)
  }

  if (!isAuthenticated) {
    return null
  }

  console.log(userData);
  

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      {message && <Alert variant={message.includes('успешно') ? 'success' : 'danger'}>{message}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Фото профиля</Form.Label>
          <div className="profile-photo">
            <img 
              src={photo ? URL.createObjectURL(photo) : userData.photo || 'https://via.placeholder.com/150'} 
              alt="Фото профиля"
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <Form.Control 
            type="file" 
            accept="image/*"
            onChange={handlePhotoChange}
            className="mt-2"
          />
          {photo && (
            <Button 
              variant="primary"
              onClick={handlePhotoSubmit}
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Сохранение...' : 'Обновить фото'}
            </Button>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Текущий пароль</Form.Label>
          <Form.Control
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Введите текущий пароль"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Введите новый пароль"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Подтвердите пароль</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите новый пароль"
            required
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </Form>
    </div>
  )
}

export default Profile