import { useState, useEffect, useMemo, useRef } from 'react';

const useScrollPosition = () => {
    const [scrollPosition, setScrollPosition] = useState(window.scrollY);
    const handleScroll = () => setScrollPosition(window.scrollY);

    let pageHeight       = useRef(() => document.body.clientHeight);
    const resizeObserver = useMemo(() => new ResizeObserver(entries => pageHeight.current = entries[0].target.clientHeight), []);
    const screenHeight   = document.documentElement.clientHeight
    
    useEffect(() => {
        resizeObserver.observe(document.body);
        window.addEventListener('scroll', handleScroll);
        return () => {
            resizeObserver.unobserve(document.body);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [resizeObserver]);

    return ({top: scrollPosition, bottom: pageHeight - (screenHeight + scrollPosition)});
}

export default useScrollPosition;
