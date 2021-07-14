import useWindowSize from "../hooks/screen_size";
import useScrollPosition from "../hooks/scroll_position";

const Tooltip = ({content, event}) => {

    const { width } = useWindowSize();
    const scrollPositionTop = useScrollPosition().top;
    // Get mouse position from the event.
    const {pageY: top, pageX: left} = event;
    
    const styles = {
        tooltip: {
            position: 'fixed', 
            top: `${top - scrollPositionTop}px`, 
            left: `${width - left > 200 ? left + 15 : left - 215}px`, 
            zIndex: 5, 
            color: 'black',
            width: '200px', 
            padding: '10px', 
            boxShadow: '0 0 6px gray', 
            whitSpace: 'pre-wrap', 
            borderRadius: '5.5px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)'
        }
    }

    return <span className="tooltip-box text-center" style={styles.tooltip}><strong>{content}</strong></span>
}

export default Tooltip;