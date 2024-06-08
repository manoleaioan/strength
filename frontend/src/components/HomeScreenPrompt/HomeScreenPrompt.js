import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

import "./HomeScreenPrompt.scss";
import { Button } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

export const isStandalone = () => {
  // For iOS
  if (window.navigator.standalone) {
    return true;
  }

  // For PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  return false;
};

export const isMobile = () => {
  return /Mobi|Android/i.test(navigator.userAgent);
};

const HomeScreenPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (isMobile() && !isStandalone() && localStorage.getItem('hideStandaloneDialog') !== "true") {
      setShowPrompt(true);
    }
  }, []);

  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const hideDialog = () => {
    if (checked) {
      localStorage.setItem('hideStandaloneDialog', true)
    }

    setShowPrompt(false);
  }

  return (
    (showPrompt) &&
    <motion.div
      transition={{ duration: 0.4, delay: 0.5 }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      id="home-screen-prompt"
    >
      <div>
        <p>For the best experience, run this app from your home screen (standalone mode):</p>
        <p>1. Tap the <strong>Share</strong> button (iOS) or <strong>Menu</strong> button (Android)</p>
        <p>2. Select <strong>Add to Home Screen</strong> and <strong>Open</strong></p>
      </div>
      <div className="btns">
        <Button variant='contained' color='success' onClick={hideDialog}>Ok</Button>
        <div className='check'>
          <label htmlFor='chkbox' className='check'>
            Never show this dialog again
          </label>
          <Checkbox
            id='chkbox'
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default HomeScreenPrompt;