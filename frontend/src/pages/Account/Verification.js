import React, { useState, useEffect, } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { motion } from "framer-motion";
import { createStructuredSelector } from 'reselect';
import { emailVerificationStart } from '../../redux/user/user.actions';
import { selectVerification_res } from '../../redux/user/user.selectors';

import { CircularProgress } from '@mui/material';
import Heading from '../../components/Heading/Heading';

const Verification = ({ verifyEmail, activationStatus }) => {
  let { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyEmail({ token })
  }, [token, verifyEmail])

  useEffect(() => {
    if (activationStatus) {
      setTimeout(function () {
        setIsLoading(false)
      }, 500)
    }
  }, [activationStatus])

  const variants = {
    open: { height: "auto", opacity: 1 },
    collapsed: { height: "auto", opacity: 0 }
  };

  return (
    <>
      <Heading>
        <div className="heading-bg">
          {isLoading && <CircularProgress color="inherit" className='activation-spinner' />}
          Account verification
        </div>
      </Heading>
      
      <motion.div className="acc-status"
        variants={variants}
        animate={isLoading ? "collapsed" : "open"}
        initial={isLoading ? "collapsed" : "open"}
      >
        {!isLoading && <>
          {activationStatus.message === "Invalid" && 'Invalid activation link or expired!'}
          {activationStatus.verified && 'Your account has been activated successfully!'}
        </>}
      </motion.div>
    </>
  )
}

const mapStateToProps = createStructuredSelector({
  activationStatus: selectVerification_res
});

const mapDispatchToProps = dispatch => ({
  verifyEmail: token => dispatch(emailVerificationStart(token))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verification);