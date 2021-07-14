const styles = {
    headingBlue: { 
        textAlign: 'center', 
        color: '#00BBFF' 
    },
    headingYellow: { 
        textAlign: 'center', 
        color: '#EEBB22' 
    },
    icon: { 
        fontSize: '1.55rem',
        padding: '10px',
        borderRadius: '7px',
        color: '#00BBFF',
        transition: '0.33s' 
    },
    iconOver: { 
        transform: 'scale(1.1)', 
        cursor: 'pointer', 
        color: '#EEBB22' 
    },
    weatherColor: txt => ({
        color: 
            txt.match(/sun/i)                    ? '#EEBB22'     : 
            txt.match(/shower|rain/i)            ? '#00BBFF'     : 
            txt.match(/cloud|storm|dreary|fog/i) ? 'gray'        : 
            txt.match(/clear/i)                  ? 'yellowgreen' : ''
        }),
    tempColor: temp => ({
        color: 
            temp <= 10 ? 'rgb(145, 255, 255)' : 
            temp <= 20 ? 'rgb(122, 189, 255)' : 
            temp <= 30 ? 'rgb(249, 199, 48)'  : 
            temp <= 40 ? 'rgb(255, 114, 0)'   : 
                         'rgb(223, 11, 17)'
    })
}

export default styles;