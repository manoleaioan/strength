import React from 'react';
import { ReactComponent as LeftShape } from '../../assets/LeftShape.svg';
import { ReactComponent as RightShape } from '../../assets/RightShape.svg';

import "./BgAnimation.scss";

export default function BgAnimation() {
  return (
    <div className='bg-shapes'>
      <LeftShape className="left-shape" />
      <RightShape className="right-shape" />

      <ul className="circles">
        <li></li> <li></li><li></li><li></li><li></li><li></li> <li></li><li></li><li></li> <li></li>
      </ul>
    </div>
  )
}