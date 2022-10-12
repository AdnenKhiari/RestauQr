import { useController } from "react-hook-form";
import UnitSelect from "./UnitSelect"
import joi from "joi"
const UnitValue = (props)=>{
    return <div className="unitvalue">
        <input {...props?.inputcustomprops} type="number" step="0.000000001" defaultValue={props.defaultValue.value} {...props.register(props.name+".value")}/>
        <UnitSelect customunits={props.customunits} control={props.control} defaultValue={props.defaultValue.units} name={props.name+".unit"} units={props.units} />
    </div>
}
export const unitvalueschema = joi.object({
    value: joi.number().required(),
    unit: joi.any()
})
export default UnitValue