import { useRef } from "react"
import Select from "react-select"

const CustomSelect  = (props)=>{
    const t = props.maincolor || "74,149,162"
    return <Select 
    defaultValue={props.defaultValue}
    className="react-select-container"
    classNamePrefix="react-select"
    theme={(theme)=>({
        ...theme,
        colors: {
            ...theme.colors,
            primary: `rgb(${t})`,
            primary25: `rgba(${t},0.25)`,
            primary50: `rgba(${t},0.5)`,
            primary75: `rgba(${t},0.75)`,
            danger: `rgb(255,113,113)`,
            dangerLight: `rgba(255,113,113,0.5)`
        }
    })} 
    {...props}
    />
}
export default CustomSelect