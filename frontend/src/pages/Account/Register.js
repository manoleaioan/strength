import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { signUpStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectError } from '../../redux/user/user.selectors';

import { Button } from '@mui/material/';
import Heading from '../../components/Heading/Heading';
import { InputText } from '../../components/InputText/InputText';

const Register = ({ switchPage, signUpStart, registerError }) => {
  const [userData, setUser] = useState({
    email: "",
    password: "",
    fullName: "",
    username: ""
  })

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (registerError) {
      try {
        const parsedErrors = JSON.parse(registerError.message);
        const errors = Object.entries(parsedErrors).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        setErrors(errors);
      } catch (error) {
        console.error("Failed to parse registerError.message:", error);
      }
    }
  }, [registerError]);
  

  useEffect(() => {
    setErrors({});
  }, [])

  const handleChange = event => {
    const { name, value } = event.target;
    const username = name === 'username' ? value.replace(/\s/g, '') : userData.username
    setUser({ ...userData, [name]: value, username });
  };

  const handleSubmit = event => {
    event.preventDefault();
    let validationErrors = {}

    for (const [input, value] of Object.entries(userData)) {
      if (value.trim().length === 0) {
        validationErrors[input] = `${input} required`;
      }
    }

    if (userData.password.length < 8)
      validationErrors.password = 'Password must contain at least 8 characters';

    if (Object.keys(validationErrors).length) {
      return setErrors({
        ...validationErrors,
      });
    }
    signUpStart(userData);
  };

  return (
    <>
      <Heading>REGISTER</Heading>

      <form onSubmit={handleSubmit}>
        <InputText
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={userData.email}
          error={errors?.email}
        />

        <InputText
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          value={userData.fullName}
          error={errors?.fullName}
        />

        <InputText
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={userData.username}
          error={errors?.username}
        />

        <InputText
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={userData.password}
          error={errors?.password}
        />

        <Button type="submit" className="btn register">
          Register
        </Button>

        <p className="switchform">
          Already have an account? <span onClick={() => switchPage('/login')}>Log in</span>
        </p>
      </form>

    </>
  )
}

const mapStateToProps = createStructuredSelector({
  registerError: selectError
});

const mapDispatchToProps = dispatch => ({
  signUpStart: userCredentials => dispatch(signUpStart(userCredentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);