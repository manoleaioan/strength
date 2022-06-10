import React, { useState } from 'react';
import classNames from 'classnames';
import "./InputText.scss";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export const InputText = (props) => {
  const [inputType, setInputType] = useState("password")
  const HASVALUE = props.value?.length > 0

  return (
    <div className="input-text">
      <span className={classNames({
        'visible': props.value?.length > 0 || props.error,
        'error': props.error
      })}>
        {props.error ? (props.error?.message||props.error) : props.placeholder}
      </span>
      {
        props.type === 'password' && HASVALUE && (
          <div className="input-pw-toggle"
            onClick={(e) => {
              e.target.focus()
              setInputType(inputType === 'text' ? 'password' : 'text')
            }}
          >
            {inputType === 'text' ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </div>
        )
      }
      <input
        {...props}
        type={props.type === 'password' ? inputType : props.type}
        className={classNames({
          'pw': props.type === 'password',
          'on-value': HASVALUE || props.error
        })}
      />
    </div>
  )
}