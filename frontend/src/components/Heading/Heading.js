import React from 'react';
import "./heading.scss"

const Heading = (props) => {
  return(
    <div className="heading">
      <h1>{props.children}</h1>
    </div>
  );
}
export default Heading;