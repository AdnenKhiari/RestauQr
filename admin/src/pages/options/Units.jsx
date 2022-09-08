import trashimg from "../../images/trash.png"
import plusimg from "../../images/plus.png"
import { useForm,FormProvider,useFormContext, useFieldArray, useWatch } from "react-hook-form"
import {GetUnits,UpdateUnits} from "../../lib/Units"
import Error from "../../components/Error"
import Loading from "../../components/Loading"
import joi from "joi"
import {joiResolver} from "@hookform/resolvers/joi"

const subunit = joi.object({
    name: joi.string().required().label("Sub Unit Name"),
    ratio: joi.number().required().positive().label("Ratio")
})
const units = joi.object({
    name : joi.string().required().label("Unit Name"),
    subunits: joi.array().items(subunit).required()
})

const unitsSchema = joi.object({
    allunits: joi.array().items(units).required()
})

const Units = ()=>{
    const {result,error,loading} = GetUnits()

    if(error)
        return <Error msg={"An Error Has occured While Fetching Units"} error={error}  />
    if(loading)
        return <Loading />
    return <UnitsUi allunits={result}/>

}

const UnitsUi = ({allunits})=>{

    const formcont = useForm({
        defaultValues: allunits.length > 0 ? {allunits : allunits} : undefined,
        resolver: joiResolver(unitsSchema)
    })
    const {append,remove} = useFieldArray({
        control: formcont.control,
        name: "allunits"
    })
    const unitupdater = UpdateUnits()
    const submitUnits = async (data)=>{
        console.log(data)
        await unitupdater.mutate(data)
    }   
    const units = formcont.watch("allunits")
    console.log(units,formcont.formState.errors)
    return <FormProvider {...formcont}>
    <div className="units-container secondary-form">
        <div className="units-header">
            <h1>Units:</h1>
            <button type="button" onClick={(e)=>{
                append({name: "",subunits: []})
            }}>Add Unit</button>
        </div>
        <form onReset={(e)=>{e.preventDefault();formcont.reset()}} onSubmit={formcont.handleSubmit(submitUnits)}  className="all-units">
            <div className="allunits">
                {units && units.map((unit,key)=>{   
                    return<UnitCard removeUnit = {remove} key={key} number={key}  unit={unit}/>
                })}
            </div>
            <div className="units-footer">
                <button type="submit" disabled={unitupdater.loading}>Update</button>
                <button type="reset">Reset</button>
            </div>
        </form>
    </div>
    </FormProvider>
}

const UnitCard = ({number,removeUnit})=>{
    const {register,control,watch,formState: {errors}} = useFormContext()
    const {append,remove} = useFieldArray({
        control: control,
        name: `allunits.${number}.subunits`
    })
    const unit = watch(`allunits.${number}`)
    console.log("Unit : ",number,unit)
    return  <div className="unit-card">
        <div className="unit-card-header">
            <h2><input className={"secondary-input " + ((errors.allunits  && errors.allunits[number] && errors.allunits[number].name ) ?  "input-error": "" ) } type="text" {...register(`allunits.${number}.name`)} /></h2>
            <div>
            <img className="make-img-green" onClick={(e)=>{
                append({name: "",ratio: 1})
            }} src={plusimg} alt="Add SubUnit" />
            <img className="make-img-error" onClick={(e)=>{
                removeUnit(number)
            }} src={trashimg} alt="Remove Unit" />
            </div>
        </div>
        <div className="unit-card-subinfo">
            {unit.subunits && unit.subunits.map((sub,key)=>{
                return <div className="subunit" key={1000+key}>
                    <div>
                        <p>1 </p>
                        <input className={"secondary-input   "+ ((errors.allunits  && errors.allunits[number] && errors.allunits[number].subunits && errors.allunits[number].subunits[key] && errors.allunits[number].subunits[key].name ) ?  "input-error": "") } type="text" {...register(`allunits.${number}.subunits.${key}.name`)} />
                        <p> = </p>
                        <input className={"secondary-input   " + ((errors.allunits  && errors.allunits[number] && errors.allunits[number].subunits  && errors.allunits[number].subunits[key] && errors.allunits[number].subunits[key].ratio ) ?  "input-error": "")}  type="number" {...register(`allunits.${number}.subunits.${key}.ratio`)} />
                        <p> {unit.name}</p>
                    </div>
                    <img className="make-img-error" onClick={(e)=>remove(key)} src={trashimg} alt="remove" />
                </div>
            })}
        </div>
    </div>
}
export default Units