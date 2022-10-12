import FormSelect from "./FormSelect"

const UnitSelect = (props)=>{
    const units = props.units
    const customunits = props.customunits
    return <FormSelect 
    {...props} 
    defaultValue = {props.defaultValue.subunit ? {
        label: props.defaultValue.subunit.name,
        value: props.defaultValue 
    } :  {
        label: props.defaultValue.name,
        value: {name: props.defaultValue.name,id: props.defaultValue.id}
    }}
    options={[...units.map((unit)=>({
        label: unit.name,
        options: [
            {
                label: unit.name,
                value: {
                    id: unit.id,

                    name: unit.name
                }
            },
            ...unit.subunits.map((sub)=>({
            label: sub.name,
            value: {
                name: unit.name,
                id: unit.id,
                subunit: {
                    name: sub.name,
                    ratio: sub.ratio
                }
            }
        }))]
    })),...(customunits ? customunits.map((un)=>({
        
        label: "Custom Units",
        options: un.customUnits.map((sub)=>({
            label: sub.name,
            value: {
                name: un.name,
                id: un.id,
                subunit: {
                    name: sub.name,
                    ratio: sub.ratio
                }
            }
        }))
    })) : [] )
    ]
} />
}


export default UnitSelect