import React from "react";

const Login = () => {
  return (
    <>
      <div className="main">
        <div className="form-container">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="enter username"
            />
            <input
              type="text"
              name="username"
              id="username"
              placeholder="enter username"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="enter password"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
