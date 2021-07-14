import logoIcon from '../assets/favicon.png';
import { NavLink } from "react-router-dom";
import useWindowSize from '../hooks/screen_size';
import { useEffect, useState } from "react";
import Dark from './dark_mode';

const Navbar = () => {

    const { width } = useWindowSize();

    const [hamburger, setHamburger] = useState(false);
    const [hamburgerOver, setHamburgerHover] = useState(false);
    const [logoOver, setLogoOver] = useState(false);

    useEffect(() => width >= 768 && setHamburger(false), [width]);

    const barStyle = { width: '40px', height: '5px', margin: '6px 0', transition: '0.4s', backgroundColor: hamburgerOver ? '#EEBB22' : '#00BBFF' };

    const styles = {
        navbar: { height: '80px', width: '100%', position: 'fixed', top: 0, zIndex: 5, backgroundColor: 'white' },
        navLinksContainer: { boxShadow: hamburger && '0 3px 3px rgb(80, 80, 80)', backgroundColor: 'white' },
        navLinks: { borderRadius: '3px' },
        hamburger: { cursor: 'pointer', height: '55px', width: '60px', position: 'fixed', top: '10px', right: '10px', zIndex: 9, borderRadius: '10px', padding: '7.5px 10px', boxShadow: hamburgerOver ? '0 0 6px #AAAA00' : '0 0 6px #00AAAA', transition: '0.4s' },
        bars: barStyle,
        bar1: { ...barStyle, transform: 'rotate(-45deg) translate(-9px, 6px)' },
        bar2: { ...barStyle, opacity: 0 },
        bar3: { ...barStyle, transform: 'rotate(45deg) translate(-8px, -8px)' },
        logo: { position: 'fixed', top: '5px', left: width < 1200 ? '5px' : (width - 1200) / 2, opacity: logoOver ? 1 : 0.7, transition: '0.5s' },
        logoImg: { height: '70px', width: '70px' },
    }

    const toggleHamburger = () => {
        setHamburger(!hamburger);
        if (!hamburger) for (let i = 1; i <= 3; i++) delete styles[`bar${i}`];
        else {
            styles.bar1 = { ...styles.bars, transform: 'rotate(-45deg) translate(-9px, 6px)' };
            styles.bar2 = { ...styles.bars, opacity: 0 };
            styles.bar3 = { ...styles.bars, transform: 'rotate(45deg) translate(-8px, -8px)' };
        }
    }

    return (
        <nav className={hamburger ? "navbar p-0" : "navbar p-0 shadow"} style={styles.navbar}>
            <div className="nav mx-auto w-100">
                <div
                    id="hamburger"
                    className="hamburger-container d-block d-md-none"
                    style={!hamburger ? { ...styles.hamburger } : { ...styles.hamburger, boxShadow: 'none' }}
                    onMouseEnter={() => setHamburgerHover(true)}
                    onMouseLeave={() => setHamburgerHover(false)}
                    onClick={toggleHamburger}
                >
                    <div className="bar1" style={hamburger ? styles.bar1 : styles.bars}></div>
                    <div className="bar2" style={hamburger ? styles.bar2 : styles.bars}></div>
                    <div className="bar3" style={hamburger ? styles.bar3 : styles.bars}></div>
                </div>

                <div style={styles.navLinksContainer} className={hamburger ?
                    "navbar-nav d-block w-100 pb-3 mt-4 pt-5 px-2" :
                    "navbar-nav d-none d-md-flex flex-row pr-3 ml-5 pl-5"
                }>
                    <NavLink 
                        to="/home" 
                        className={hamburger ? "nav-link m-2 p-2 border" : "nav-link px-2"} 
                        style={styles.navLinks}
                        onClick={() => setHamburger(false)}
                    >Home </NavLink>
                    <NavLink 
                        to="/favorites" 
                        className={hamburger ? "nav-link m-2 p-2 border" : "nav-link px-2"} 
                        style={styles.navLinks}
                        onClick={() => setHamburger(false)}
                    >Favorites </NavLink>
                </div>
                
                <NavLink
                    to="/home"
                    className="logo d-flex align-items-center"
                    style={styles.logo}
                    onMouseEnter={() => setLogoOver(true)}
                    onMouseLeave={() => setLogoOver(false)}
                >
                    <img src={logoIcon} alt="logo" style={styles.logoImg} />
                </NavLink>
                <Dark/>
            </div>
        </nav>
    )
}

export default Navbar;
