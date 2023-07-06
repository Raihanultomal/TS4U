const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const RegisterSchema = require('./models/registerModel');
const LoginSchema = require('./models/loginModel');

const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const secretkey = 'secretkey';

// OTP generator tools
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const otpMap = new Map();

const app = express();
// request data collect korar jonne midleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Async await function use kore mongoDB connect

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/authUserEmail');
    console.log('DB connet');
  } catch (error) {
    console.log('DB not connet');
    console.log(error);
  }
};

// routers

app.get('/', (req, res) => {
  res.send('Okey');
});

// register api

app.post('/api/user/signup', async (req, res) => {
  try {
    const newUsers = new RegisterSchema({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // console.log(newUsers);
    const { email } = newUsers;

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    // Store OTP in memory (you can use a database or temporary storage like Redis)
    otpMap.set(email, otp);

    // Send OTP via email

    // connect with smtp
    const transporter = await nodemailer.createTransport({
      host: 'smtp.forwardemail.net',
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'jaydon16@ethereal.email',
        pass: 'eQ8zJb1xNS7eBS1NVE',
      },
    });

    const mailOptions = {
      from: '"Fred Foo 👻" <jaydon16@ethereal.email>',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to send OTP via email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
    // OTP end

    // database e email already ache kina seta chenck kora hocce
    const findData = await RegisterSchema.findOne({
      email: email,
    });
    // email already databse e na thakle new ID create kora hobe
    if (!findData) {
      const usersData = await newUsers.save();
      console.log(findData);

      res.status(200).send('Successfull');
    } else {
      res.json('fail');
      res.status(200).send('Already exist');
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  // Retrieve stored OTP
  const storedOTP = otpMap.get(email);

  if (!storedOTP) {
    res.status(400).json({ message: 'OTP not found for the provided email' });
  } else if (storedOTP === otp) {
    // OTP is valid, perform further actions (e.g., mark email as verified)
    res.status(200).json({ message: 'OTP verification successful' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
});

// token generator

const generateToken = (payload) => {
  const token = jwt.sign(payload, secretkey, { expiresIn: '1h' });
  return token;
};

// login api

app.post('/api/user/signin', async (req, res) => {
  try {
    const newUsers = new LoginSchema({
      email: req.body.email,
      password: req.body.password,
    });
    const { email, password } = newUsers;
    // database e email already ache kina seta chenck kora hocce
    const findData = await RegisterSchema.findOne({
      email: email,
      password: password,
    });
    // email already databse e na thakle new ID create kora hobe
    if (findData) {
      // const usersData = await newUsers.save();

      // jwt generateing

      const payload = { userId: findData._id };
      const token = generateToken(payload);
      // res.json({ token });

      console.log(findData);

      // res.json(findData);

      res.json({
        findData,
        token,
      });

      res.status(200).send('Successfull');
    } else {
      res.json('fail');
      res.status(200).send('Register first to login');
    }
  } catch (error) {
    res.json({ message: error.message });
    res.status(500).send({ message: error.message });
  }
});

app.listen(5000, async () => {
  console.log('Server connected');
  await connectDB();
});
