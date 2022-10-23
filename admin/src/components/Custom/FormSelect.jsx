import { useController } from "react-hook-form";
import Select from "react-select";
import CustomSelect from "./CustomSelect"


const FormSelect = (props)=>{
  console.log("recevied",props)
    const {
        field: { onChange, onBlur, name, value, ref },
        formState: { errors }
      } = useController({
        name: props.name,
        control: props.control,
        defaultValue: props.isMulti ? props.defaultValue.map((k)=>k.value) : props.defaultValue?.value || ""
      });
    return <CustomSelect defaultValue={props.defaultValue  || {}} name={name} onChange={(item)=>onChange(props.isMulti ? item.map((k)=>k.value) : item.value)} {...props} />
}


export default FormSelect