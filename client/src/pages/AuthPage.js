import React, { useState, useEffect, useContext } from 'react';

import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const AuthPage = () => {
  const {
    loading,
    error,
    clearError,
    request,
  } = useHttp();

  const auth = useContext(AuthContext);
  const message = useMessage();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = event => {
    const { target } = event;

    setForm({ ...form, [target.name]: target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', { ...form });
      message(data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', { ...form });
      auth.login(data.token, data.userId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1 className="center-align">Get a short link</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title center-align">Auth</span>
            <form>
              <div className="input-field">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>

              <div className="input-field">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="card-action">
                <button
                  className="btn yellow darken-4"
                  disabled={loading}
                  onClick={loginHandler}
                  >
                  Login
                </button>
                <button
                  className="btn grey lighten-1 black-text"
                  disabled={loading}
                  onClick={registerHandler}
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
};
