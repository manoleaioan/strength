import React, { useState } from 'react';
import { motion } from "framer-motion";
import classNames from 'classnames';

import "./NavBar.scss";

import { ReactComponent as Logo } from '../../assets/Logo.svg';
import { ReactComponent as Account } from '../../assets/Account.svg';
import { ReactComponent as Metrics } from '../../assets/Metrics.svg';
import { ReactComponent as Exercises } from '../../assets/Exercises.svg';
import { ReactComponent as Routines } from '../../assets/Routines.svg';
import { ReactComponent as Workout } from '../../assets/Workout.svg';

const Navbar = ({ path, setPath, setAnimate }) => {
  const menuList = [
    { ico: <Workout />, txt: 'workouts' },
    { ico: <Routines />, txt: 'routines' },
    { ico: <Exercises />, txt: 'exercises' },
    { ico: <Metrics />, txt: 'metrics' },
    { ico: <Account />, txt: 'account' }
  ]

  const [selected, setSelected] = useState(path.replace('/', ''));
  const [complete, setComplete] = useState(true);

  const spring = {
    type: "spring",
    stiffness: 100,
    damping: 18
  };

  return (
    <div id="nav-bar">
      <Logo className="logo" />
        <ul>
          {
            menuList.map(item =>
              <li
                key={item.txt}
                className={classNames({
                  'active': item.txt === selected && complete
                },'li-'+item.txt)}
                onClick={() => {
                  if (item.txt !== selected) {
                    setAnimate(true);
                    setSelected(item.txt);
                    setComplete(false);
                  }
                }}
              >
                <div>
                  {item.ico} 
                  <p>{item.txt}</p>
                </div>

                {(item.txt === selected) &&
                  <motion.div
                    layoutId='active'
                    className='active'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={spring}
                    onUpdate={latest => {
                      if (latest.opacity >= 0.8 && !complete) {
                        setComplete(true)
                      }

                      if (latest.opacity === 1) {
                        setAnimate(false);
                        setPath("/" + item.txt);
                      }
                    }}
                  />}
              </li>
            )
          }
        </ul>
    </div>
  )
}

export default Navbar;