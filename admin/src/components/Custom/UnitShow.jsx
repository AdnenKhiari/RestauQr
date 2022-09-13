import CustomSelect from "./CustomSelect"
import {GetUnits} from "../../lib/Units"
import Loading from "../Loading"
import Error from "../Error"
import { useEffect, useState } from "react"
const UnitShow = ({unitval})=>{
    const {result: allunits,loading,error} = GetUnits()
    const [ratio,setRatio] = useState(unitval.unit.subunit ? unitval.unit.subunit.ratio : 1)
    const [currentunit,setCurrentunit] = useState(null)
    useEffect(()=>{
        if(allunits)
            setCurrentunit(allunits.find((un)=>un.name === unitval.unit.name))
    },[allunits])

    if(loading)
        return <Loading />
    if(error)
        return <Error msg={"Unit error"} error={error} />

    return <div onClick={(e)=>{e.preventDefault();e.stopPropagation()}} className="unit-show">
        <p>{unitval.value / ratio}</p>
        <CustomSelect 
        defaultValue={{
            label: unitval.unit.subunit ? unitval.unit.subunit.name : unitval.unit.name,
            value: unitval.unit.subunit || {name: unitval,value: {name: unitval.unit.name,ratio: 1}}
        }}
        onChange={(val)=>{
            console.log(val)
            setRatio(val.value.ratio)
        }} 
        options={currentunit ? [{
            label: currentunit.name,
            options: [{
                label: currentunit.name,
                value: {
                    name: currentunit,
                    ratio: 1
                }
            },...currentunit.subunits.map((sub)=>({
                label: sub.name,
                value: sub
            }))]
        }] : []} />
    </div>
}
export default UnitShow