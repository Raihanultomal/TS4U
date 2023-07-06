'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';

export default function login() {
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [name, setName] = useState('');
  // Login er pore user er name/data collect korar jonne
  // const [name, setName] = useState('');

  // sending data to home page after login

  function sendProps() {
    Router.push({
      pathname: '/users/home',
      query: { name },
    });
  }

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = async () => {
    const { email, password } = user;
    if (email && password) {
      await axios
        .post('http://localhost:5000/api/user/signin', user)
        .then((res) => {
          if (res.data === 'fail') {
            alert('Enter valied Email and Password');
            // console.log(res);
          } else {
            alert('Login successfull');
            console.log(res);
            setName(res.name);
            sendProps();
            // login korle eikhan theke user er name home page e pathano hobe
            // const data = res.data;
            // console.log(data);
            // history('/home', { state: { data: res.data } });
            // history('/');
          }
        });
    } else {
      alert('invlid input...');
    }
  };

  return (
    <div className=" container pt-5">
      <div className="row">
        <div className="col-6">
          <h1>Login</h1>
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                onChange={handleChange}
                placeholder="Email"
                required="true"
              />
              <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" class="form-label">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                class="form-control"
                id="exampleInputPassword1"
                onChange={handleChange}
                placeholder="********"
                required="true"
              />
            </div>

            <button type="submit" class="btn btn-primary" onClick={login}>
              {/* <Link
                style={{ color: 'white', textDecoration: 'none' }}
                href="/users/home"
              >
                Login
              </Link> */}
              Login
            </button>
          </form>
          <p>
            I have no account so I want to{' '}
            <Link href="/users/register">register</Link> first
          </p>

          {/* <a onClick={() => Router.push('/user/register')}>click to register</a> */}
        </div>
        <div className="col-6 ">
          <iframe
            className="pt-4"
            src="https://embed.lottiefiles.com/animation/40643"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
