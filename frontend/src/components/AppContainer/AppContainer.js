import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Navbar from '../NavBar/NavBar';
import UserAccount from '../../pages/UserAccount/UserAccount';
import Exercises from '../../pages/Exercises/Exercises';
import Routines from '../../pages/Routines/Routines';
import { motion } from "framer-motion";
import ConstructionIcon from '@mui/icons-material/Construction';

import "./AppContainer.scss";

const AppContainer = () => {
  const [path, setPath] = useState(useLocation().pathname);
  const [animate, setAnimate] = useState();

  const components = {
    "/account": <UserAccount />,
    "/exercises": <Exercises />,
    "/routines": <Routines />
  }

  useEffect(() => {
    window.history.replaceState({ ...window.history.state, as: path, url: path }, '', path);
    setAnimate(false)
  }, [path])

  return (
    <div id="app-container">
      <Navbar path={path} setPath={setPath} setAnimate={setAnimate} />
      <motion.div
        transition={{duration: 0.4}}
        initial={{ opacity: animate ? 1 : 0 }}
        animate={{ opacity: animate ? 0 : 1  }}
        layoutScroll
        id="content">
        {components[path] || <div className='dev'><ConstructionIcon /> <p>Section under development</p></div>}
      </motion.div>
    </div>
  )
}

export default AppContainer;