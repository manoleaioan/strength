import React, { useState, useEffect } from 'react';
import "./SpashScreen.scss";

import { ReactComponent as Logo } from '../../assets/Logo.svg';

const SplashScreen = WrappedComponent => {
  const Spinner = ({ isLoading, ...otherProps }) => {
    const [splash, setSplash] = useState(false)

    useEffect(() => {
      setTimeout(() =>
        setSplash(true), 500);
    }, [])

    return (isLoading || !splash) ? (
      <div className="sppinner-overlay">
        <Logo className="logo" />
        {/* <div className="container"></div> */}
      </div>
    ) : (
      <WrappedComponent {...otherProps} />
    );
  };
  return Spinner;
};

// const SplashScreen = () => {
//   return (
//     <div className="sppinner-overlay">
//       <div className="container"></div>
//     </div>
//   )
// };

export default SplashScreen;