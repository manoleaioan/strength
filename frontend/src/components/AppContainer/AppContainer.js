import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../NavBar/NavBar';
import UserAccount from '../../pages/UserAccount/UserAccount';
import Exercises from '../../pages/Exercises/Exercises';
import Routines from '../../pages/Routines/Routines';
import Workouts from '../../pages/Workouts/Workouts';
import Metrics from '../../pages/Metrics/Metrics';
import { motion } from "framer-motion";

import "./AppContainer.scss";
import HomeScreenPrompt from '../HomeScreenPrompt/HomeScreenPrompt';

const AppContainer = () => {
  const [path, setPath] = useState(useLocation().pathname);
  const [animate, setAnimate] = useState();
  const navigate = useNavigate();

  const components = {
    "/account": <UserAccount />,
    "/exercises": <Exercises />,
    "/routines": <Routines />,
    "/workouts": <Workouts/>,
    "/metrics": <Metrics/>
  }

  useEffect(() => {
    navigate(path, { replace: true });
    setAnimate(false);
  }, [path, navigate])


  return (
    <div id="app-container">
      <HomeScreenPrompt />
      <Navbar path={path} setPath={setPath} setAnimate={setAnimate}/>
      <motion.div
        transition={{duration: 0.4}}
        initial={{ opacity: animate ? 1 : 0 }}
        animate={{ opacity: animate ? 0 : 1  }}
        layoutScroll
        id="content">
        {components[path]}
      </motion.div>
    </div>
  )
}

export default AppContainer;
