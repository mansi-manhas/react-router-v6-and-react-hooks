import React from "react";

const Login = () => {
  const login = () => {
    localStorage.setItem("auth", true);
    window.location.href = "/dashboard";
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
