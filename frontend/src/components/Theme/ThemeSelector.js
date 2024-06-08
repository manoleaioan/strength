import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';
import classNames from 'classnames';

import "./ThemeSelectors.scss";

const ThemeSelector = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'device');

    const applyTheme = (theme) => {
        localStorage.setItem('theme', theme);
        setTheme(theme);
        document.querySelector("body").setAttribute('data-theme', theme);
        var color = getComputedStyle(document.body).getPropertyValue('--app-bg')
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", color);
    };

    return (
        <div id='theme'>
            <div>
                <h1>Theme</h1>
                <p>{theme}</p>
            </div>
            <div className='select'>
            <Button className={classNames({ 'device': theme === 'device' })} onClick={() => applyTheme('device')}>
                <FontAwesomeIcon icon={faDesktop} />
            </Button>

            <Button className={classNames({ 'light': theme === 'light' })} onClick={() => applyTheme('light')}>
                <FontAwesomeIcon icon={faSun} />
            </Button>

            <Button className={classNames({ 'dark': theme === 'dark' })} onClick={() => applyTheme('dark')}>
                <FontAwesomeIcon icon={faMoon} />
            </Button>
            </div>
        </div>
    );
};

export default ThemeSelector;
