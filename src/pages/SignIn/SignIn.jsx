import React, { useEffect, useState } from "react";
import "./SignIn.scss";
import logo from "./../../assets/image/logo.png";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const [userData, setUserData] = useState();
  const [checkText, setCheckText] = useState(false);
  const navigate = useNavigate();
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

  const checkUser = (e) => {
    e.preventDefault();
    const login = e.target.elements.login.value.trim();
    const password = e.target.elements.password.value.trim();

    // Проверка на админа

    const user = userData?.find(item => item.login === login);
    const pass = userData?.find(item => item.password === password);
    if (login !== "" && password !== "") {
      if (login === "admin" && password === "admin123") {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("userId", pass?.id);
        navigate("/");
        return;
      }

      if (user && pass) {
        sessionStorage.setItem("userId", pass?.id);
        navigate("/");
      } else {
        setCheckText(true);
      }
    }
  };

  return (
    <div className="signin container">
      <div className="wrapp">
        <form action="#" onSubmit={checkUser}>
          <h2>Sign In</h2>
          <input type="text" placeholder="Login" name="login" required />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
          />
          {checkText == true ? (
            <p style={{ color: "red", fontSize: "14px" }}>
              Такого пользователя не существует
            </p>
          ) : (
            ""
          )}
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
