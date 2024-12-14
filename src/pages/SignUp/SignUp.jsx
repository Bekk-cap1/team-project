import React, { useState } from "react";
import logo from "./../../assets/image/logo.png";
import "./SignUp.scss";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const registerUser = (e) => {
    e.preventDefault();
    const el = e.target.elements;

    if (
      el.login.value.trim() !== "" &&
      el.email.value.trim() !== "" &&
      el.password.value.trim() !== ""
    ) {
      if (el.password.value === el.passwordConfirm.value) {
        fetch("https://638208329842ca8d3c9f7558.mockapi.io/user_data", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email: el.email.value,
            login: el.login.value,
            password: el.password.value,
            cart: [] // Добавляем пустой массив корзины для нового пользователя
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Ошибка сервера: ${res.status} ${res.statusText}`
              );
            }
            return res.json();
          })
          .then((data) => {
            if (data && data.id) {
              el.email.value = "";
              el.login.value = "";
              el.password.value = "";
              el.passwordConfirm.value = "";

              sessionStorage.setItem("userId", data.id);
              navigate('/')
            } else {
              alert("Что-то пошло не так, попробуйте снова.");
            }
          })
          .catch((error) => {
            console.error("Ошибка при отправке данных:", error);
            alert("Произошла ошибка при отправке данных.");
          });
      } else {
        alert("Пароли не совпадают!");
      }
    } else {
      alert("Пожалуйста, заполните все поля.");
    }
  };

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordValid, setPasswordValid] = useState(null);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (e) => {
    setPasswordConfirm(e.target.value);
  };

  const handlePasswordBlur = () => {
    if (password.length < 8) {
      setPasswordValid(false);
      setPasswordError("Пароль должен содержать не менее 8 символов");
    } else {
      setPasswordValid(true);
      setPasswordError("");
    }
  };

  const handlePasswordConfirmBlur = () => {
    if (passwordConfirm !== password) {
      setConfirmPasswordValid(false);
    } else {
      setConfirmPasswordValid(true);
    }
  };

  const passwordStyle =
    passwordValid === false
      ? { border: "1px solid red" }
      : passwordValid === true
      ? { border: "1px solid green" }
      : {};

  const confirmPasswordStyle =
    confirmPasswordValid === false || password.length < 8
      ? { border: "1px solid red" }
      : confirmPasswordValid === true
      ? { border: "1px solid green" }
      : {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup">
      <div className="wrapp">
        <form action="#" onSubmit={registerUser} className="form">
          <h2>Sign Up</h2>
          <input type="email" placeholder="Email" name="email" required />
          <input type="text" placeholder="Login" name="login" required />
          <div className="pass">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              minLength="8"
              maxLength="20"
              required
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              style={passwordStyle}
            />
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
          {passwordError && (
            <p style={{ color: "red", fontSize: "14px" }}>{passwordError}</p>
          )}
          <div className="pass">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Password Again"
              name="passwordConfirm"
              minLength="8"
              maxLength="20"
              required
              value={passwordConfirm}
              onChange={handlePasswordConfirmChange}
              onBlur={handlePasswordConfirmBlur}
              style={confirmPasswordStyle}
            />
            <i
              className={`fas ${
                showConfirmPassword ? "fa-eye-slash" : "fa-eye"
              }`}
              onClick={toggleConfirmPasswordVisibility}
            ></i>
          </div>
          {confirmPasswordValid === false && (
            <p style={{ color: "red", fontSize: "14px" }}>
              Пароли не совпадают
            </p>
          )}
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
