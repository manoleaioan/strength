import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';

const ThemeSelector = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.querySelector("body").setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        document.querySelector("body").setAttribute('data-theme', theme);
        var color = getComputedStyle(document.body).getPropertyValue('--app-bg')
        var metaThemeColor = document.querySelector("meta[name=theme-color]");
        metaThemeColor.setAttribute("content", color);
    }, [theme]);


    return (
        <div id='theme'>
            <div>
                <h1>Theme</h1>
                <p>{theme}</p>
            </div>
            <Button onClick={toggleTheme}>
                {
                    theme === 'dark' ?
                        <FontAwesomeIcon icon={faMoon} /> :
                        <FontAwesomeIcon icon={faSun} />
                }
            </Button>
        </div>
    );
};

export default ThemeSelector;