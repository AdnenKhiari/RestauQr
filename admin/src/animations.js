export const staggerChildren = (sc = 0.1,ds = 0.2    )=>{return {
    initial : {

    },
    animate : {
        transition: {   
            delayChildren: ds,
            staggerChildren: sc
        }
    },

}}

export const FadeIn = (d = 0.6)=>{return {
    initial : {
        opacity: 0
    },
    animate : {
        opacity: 1,
        transition: {
            duration: d
        }
    }
}
}

export const TranslateIn = (d = "1s")=>{return {
    initial : {
        x: -30,
        y: -30,
        opacity: 0
    },
    animate : {
        x: 0,
        y: 0,
        opacity:1
    }
}
}

export const loader = (x,y)=>{
    return {
        initial: {
            x: x,
            y: y,
            opacity: 0.9,
        },
        animate:{
            opacity: 1,
            scale: [1,2,1],
            transition:{
                repeat: Infinity
            }
        },
        exit: {
            scale: 0,
            opacity: 0,
            x: -200,
            transition : {
                duration: 5
            }
        }
    }
}


/*        transition: {
type: "spring",
bounce: 0.25,
damping: 10,
velocity: 2,
mass: 1,
stiffness: 100
        } */