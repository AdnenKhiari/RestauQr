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
        defaultValue: props.defaultValue.value || ""
      });
    return <CustomSelect defaultValue={props.defaultValue} name={name} onChange={(item)=>onChange(item.value)} {...props} />
}


export default FormSelect