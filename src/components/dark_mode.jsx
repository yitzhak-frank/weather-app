import { useCallback, useEffect, useState } from "react";
import useWindowSize from "../hooks/screen_size";
import Tooltip from "./tooltip";

const Dark = () => {

    const { width } = useWindowSize()

    const [dark, setDark] = useState(false);
    const [iconOver, setIconOver] = useState(false);
    const [tooltip, setTooltip] = useState(false);

    const switchTheme = useCallback(() => dark ? darkMode() : lightMode(), [dark])

    useEffect(() => setDark(JSON.parse(localStorage['dark-theme'])), []);
    useEffect(switchTheme, [switchTheme, dark]);
    useEffect(() => {
        window.addEventListener('DOMNodeInserted', switchTheme);
        return () => window.removeEventListener('DOMNodeInserted', switchTheme);
    }, [switchTheme]);

    const styles = {
        i: {
            position: 'fixed', 
            top: '28px', 
            right: width > 1200 ? ((width - 1200) / 2) + 15 : width >= 768 ? '15px' : '95px',
            fontSize: '1.75rem',
            borderRadius: '50%',
            transition: '0.33s' 
        },
        iOver: {
            cursor: 'pointer',
            transform: 'rotate(180deg) scale(1.2)'
        }
    }

    const DARK_COLOR = 'rgb(41, 43, 44)', LIGHT_COLOR = 'white', ELEMENTS = 'body, div, main, input, nav';

    const darkMode = () => {
        document.querySelectorAll(ELEMENTS).forEach(({style, className}) => {
            if((style.backgroundColor && style.backgroundColor !== LIGHT_COLOR) || className.match(/toastify/i)) return;
            style.backgroundColor = DARK_COLOR;
            style.color = LIGHT_COLOR;
        });
        document.querySelectorAll('.shadow').forEach(elem => elem.className = elem.className.replace('shadow', 'dark-theme-shadow'));
    }

    const lightMode = () => {
        document.querySelectorAll(ELEMENTS).forEach(({style, className}) => {
            if((style.backgroundColor && style.backgroundColor !== DARK_COLOR) || className.match(/toastify/i)) return;
            style.backgroundColor = LIGHT_COLOR;
            style.color = '';
        });
        document.querySelectorAll('.dark-theme-shadow').forEach(elem => elem.className = elem.className.replace('dark-theme-shadow', 'shadow'));
    }

    const handleClick = () => {
        localStorage['dark-theme'] = !dark;
        setDark(!dark);
    }

    return (
        <>
        <i 
            className="fas fa-adjust" 
            style={{...styles.i, ...iconOver ? styles.iOver : {}}}
            onMouseEnter={() => setIconOver(true)}
            onMouseMove={setTooltip}
            onMouseLeave={() => {
                setIconOver(false);
                setTooltip(false);
            }}
            onClick={handleClick}
        ></i>
        {tooltip && <Tooltip event={tooltip} content={dark ? 'Light mode' : 'Dark mode'}/>}
        </>
    )
};

export default Dark;