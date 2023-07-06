'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function register() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const register = async () => {
    const { name, email, password } = user;
    if (name && email && password) {
      await axios
        .post('http://localhost:5000/api/user/signup', user)
        .then((res) => {
          // nicher if_else statement ta backend theke data fatch kore kora hoyeche
          if (res.data === 'fail') {
            alert('User already exist, enter new email');
          } else {
            alert('Registration successfull');
            // history('/login');
            // history('/');
          }
        });
    } else {
      alert('invlid input...');
    }
  };

  // Handle OTP
  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('/verify-otp', { email, otp });
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      setMessage('Invalid OTP');
    }
  };

  return (
    <div className="container pt-5">
      {console.log('User', user)}
      <h1>Register</h1>
      <div className="row">
        <div className="col-6">
          <form>
            <div className="mb-3">
              <label for="exampleInputName" className="form-label">
                Full Name
              </label>
              <div className="input-group mb-3">
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  required="true"
                />
              </div>
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Email"
                required="true"
                pattern="/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                name="password"
                value={user.password}
                onChange={handleChange}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="******"
                required="true"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={register}
            >
              Register
            </button>
          </form>
          <p>
            I have an account so I want to <Link href="/">Login</Link>
          </p>

          <div className="pt-4">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOTP}>Verify OTP</button>
          </div>
        </div>
        <div className="col-6">
          <iframe src="https://embed.lottiefiles.com/animation/40643"></iframe>
        </div>
      </div>
    </div>
  );
}
