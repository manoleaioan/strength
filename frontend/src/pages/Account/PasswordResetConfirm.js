import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { pwResetStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectPwReset_res } from '../../redux/user/user.selectors';
import { motion } from "framer-motion";

import { Button, CircularProgress } from '@mui/material/';
import Heading from '../../components/Heading/Heading';
import { InputText } from '../../components/InputText/InputText';
import { useParams } from 'react-router';


const PasswordResetConfirm = ({ switchPage, resetPassword, pwResetStatus }) => {
  let { token } = useParams();
  const [userData, setUser] = useState({ password: "" })
  const [requestSent, setRequestSent] = useState(false);
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const variants = {
    open: { height: "auto", opacity: 1 },
    hide: { height: "auto", opacity: 0 }
  };

  useEffect(() => {
    if (pwResetStatus) {
      console.log(pwResetStatus)
      setErrors({
        password: pwResetStatus.message || pwResetStatus
      });

      setRequestSent(true);

      setTimeout(function () {
        setIsLoading(false)
      }, 100)
    }
  }, [pwResetStatus, userData])

  useEffect(() => {
    setErrors({});
  }, [])

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...userData, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (userData.password.length < 8) {
      return setErrors({ password: 'Password must contain at least 8 characters' });
    }
    setIsLoading(true);
    resetPassword(token, userData.password);
  };


  return (
    <>
      <Heading>
        <div className="heading-bg">
          {isLoading && <CircularProgress color="inherit" className='activation-spinner' />}
          PASSWORD RESET
        </div>
      </Heading>

      {requestSent
        ? <motion.div className="acc-status"
          variants={variants}
          animate={isLoading ? "hide" : "open"}
          initial={isLoading ? "hide" : "open"}
        >
          {pwResetStatus.message || pwResetStatus}
        </motion.div>
        : <>
          <p className="enter-email">Enter your new password.</p>
          <form onSubmit={handleSubmit}>
            <InputText
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={userData.password}
              error={errors?.password}
            />

            <Button type="submit" className="btn">
              Change Password
            </Button>

            <p className="switchform">
              Back to <span onClick={() => switchPage('/login')}>Login</span>
            </p>
          </form>
        </>
      }

    </>
  )
}

const mapStateToProps = createStructuredSelector({
  pwResetStatus: selectPwReset_res
});

const mapDispatchToProps = dispatch => ({
  resetPassword: (token, newPassword) => dispatch(pwResetStart(token, newPassword))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordResetConfirm);