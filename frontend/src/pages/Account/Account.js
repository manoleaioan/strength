import React, { useState } from 'react';
import { useNavigate , useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Account.scss";

import { ReactComponent as Logo } from '../../assets/Logo.svg';

import BgAnimation from '../../components/BgAnimation/BgAnimation';
import Login from '../../pages/Account/Login';
import Register from '../../pages/Account/Register';
import PasswordReset from '../../pages/Account/PasswordReset';
import Verification from './Verification';
import PasswordResetConfirm from './PasswordResetConfirm';

const backdropVariants = {
  expanded: {
    opacity: 0.1,
    height: 80
  },
  collapsed: {
    height: 'auto',
    opacity: 1
  }
};

const expandingTransition = {
  duration: 0.5,
  type: "spring",
};

export default function Account() {
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const [isExpanded, setExpanded] = useState(false);


  const playExpandingAnimation = () => {
    setExpanded(true);
    setTimeout(() => {
      setExpanded(false);
    }, expandingTransition.duration * 1000 - 200);
  };

  const switchPage = route => {
    playExpandingAnimation();
    setTimeout(() => {
      navigate(route);
    }, 250);
  };

  return (
    <div className="account-container">
      <header>
        <Logo className="logo" />
        <p>Welcome to Strength!</p>
        <p>"Your workout routine"</p>
      </header>

      <motion.div
        className="motion"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={backdropVariants}
        transition={expandingTransition}
      >

        {(path === "/login" || path === "/") && <Login switchPage={switchPage} />}
        {path === "/register" && <Register switchPage={switchPage} />}
        {path === "/password-reset" && <PasswordReset switchPage={switchPage} />}
        {path.indexOf("/password-reset/confirm/") === 0 && <PasswordResetConfirm switchPage={switchPage} />}
        {path.indexOf("/verify/") === 0 && <Verification />}

      </motion.div>

      {/* <BgAnimation /> */}
    </div>
  )
}