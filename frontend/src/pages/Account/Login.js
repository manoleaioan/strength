import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { signInStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectError } from '../../redux/user/user.selectors';

import { Button } from '@mui/material/';
import Heading from '../../components/Heading/Heading';
import { InputText } from '../../components/InputText/InputText';


const Login = ({ switchPage, signInStart, loginError }) => {
  const [userData, setUser] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState();

  useEffect(() => {
    if (loginError) {
      setErrors({
        email: loginError.message,
        password: loginError.message
      });
    }
  }, [loginError])

  useEffect(() => {
    setErrors({});
  }, [])

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...userData, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    signInStart(userData);
  };

  return (
    <>
      <Heading><div className="heading-bg">LOGIN</div></Heading>

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
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={userData.password}
          error={errors?.password}
        />

        <p className="lostpw" onClick={() => switchPage('/password-reset')}>Forgot your password?</p>

        <Button type="submit" className="btn logIn">
          Log in
        </Button>

        <p className="switchform">
          Don’t have an account? <span onClick={() => switchPage('/register')}>Register</span>
        </p>
      </form>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  loginError: selectError
});


const mapDispatchToProps = dispatch => ({
  signInStart: userCredentials => dispatch(signInStart(userCredentials))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);