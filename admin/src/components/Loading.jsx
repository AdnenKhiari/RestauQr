import {motion} from "framer-motion"
import {staggerChildren,loader} from "../animations"
const Loading = ()=>{
    let loaders = []
    let k = 8
    let r = 25
    for(let i = 0;i < k;i++){
        let ang = 2.0 * i * Math.PI  / k
        loaders.push({
            x: r * Math.cos(ang),
            y: r * Math.sin(ang)
        })
    }
    return <motion.div variants={staggerChildren()} animate="animate" exit="exit" initial="initial" className="loader">
        {loaders.map((item,key)=><motion.div className="loader-item" variants={loader(item.x,item.y)} key={key}></motion.div>)}
    </motion.div>
}
export default Loading