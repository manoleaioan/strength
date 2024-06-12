import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { resetPwResetResponse, sendPwResetStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectPwReset_res } from '../../redux/user/user.selectors';
import { motion } from "framer-motion";

import { Button } from '@mui/material/';
import Heading from '../../components/Heading/Heading';
import { InputText } from '../../components/InputText/InputText';


const PasswordReset = ({ switchPage, sendPwResetLink, pwResetStatus, resetPwResetRes }) => {
  const [userData, setUser] = useState({ email: "" })
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const variants = {
    open: { height: "auto", opacity: 1 },
    hide: { height: "auto", opacity: 0 }
  };

  useEffect(() => {
    if (pwResetStatus) {
      setErrors({
        email: pwResetStatus.message || pwResetStatus
      });
      if (pwResetStatus === "Email sent") {
        setEmailSent(true);
      }
      setTimeout(function () {
        setIsLoading(false)
      }, 100)
    }
  }, [pwResetStatus, userData])

  useEffect(() => {
    setErrors({});
    return () => resetPwResetRes();
  }, [resetPwResetRes])

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...userData, [name]: value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    resetPwResetRes();

    setIsLoading(true);

    if (userData.email?.length === 0) {
      setErrors({
        email: 'Required'
      });
      return;
    }

    sendPwResetLink({ email: userData.email });
  };

  return (
    <>
      <Heading><div className="heading-bg">PASSWORD RESET</div></Heading>

      {emailSent
        ? <motion.div className="acc-status"
          variants={variants}
          animate={isLoading ? "hide" : "open"}
          initial={isLoading ? "hide" : "open"}
        >
          We sent an email to {userData.email} with a link to get back into your account.
        </motion.div>
        : <>
          <p className="enter-email">Enter your email and we'll send you a link to get back into your account.</p>
          <form onSubmit={handleSubmit}>
            <InputText
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={userData.email}
              error={errors?.email}
            />

            <Button type="submit" className="btn">
              Send Reset Link
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
  sendPwResetLink: email => dispatch(sendPwResetStart(email)),
  resetPwResetRes: () => dispatch(resetPwResetResponse())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordReset);