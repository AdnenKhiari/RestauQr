import {FormProvider, useFieldArray, useForm, useFormContext} from "react-hook-form"
import UploadFile from "../lib/UploadFile"
import {AddUpdateFood} from "../lib/FoodDal"
import {useNavigate} from "react-router-dom"
import * as ROUTES from "../ROUTES"
const FoodDetails = ({defaultVals = undefined})=>{
    const formOptions = useForm({
        defaultValues: defaultVals || {
            title: '',
            img: null,
            description: '',
            options: []
        }
    })
    const {handleSubmit,register,setValue,watch,reset} = formOptions
    const uploader = UploadFile()
    const food_uploader = AddUpdateFood()
    const usenav = useNavigate() 
    const SubmitForm = async (data)=>{
        try{

        if(data.img.length !==1)
            return
        
        const url = await uploader.upload(new Blob(data.img),data.img[0].type)
        data.img = url

        const food_id  =await food_uploader.mutate(data)
        console.log(food_uploader,food_id)

        if(food_uploader.error)
            throw food_uploader.error

        //normalement usenav to the new id
       // usenav(ROUTES.FOOD.GET_REVIEW(food_id))
        }catch(err){
            console.error(err)
        }
    }

    return <div className="food-addupd">
        <h1>{defaultVals ? "Update Food : " + defaultVals.id :"Add Food" } </h1>
        <FormProvider {...formOptions}>
        <form onReset={(e)=>reset()} onSubmit={handleSubmit(SubmitForm)}>
        <h2>Name : <input placeholder="Name" className="food-input" type="text" id="title" {...register('title')} /></h2> 
        <label htmlFor='img'>
            <img className="food-img" src={(watch('img') && URL.createObjectURL(new Blob(watch('img')))) || "/addimage.png" }  alt="" />
        </label>
        <input className="food-input" type="file" id='img' {...register("img")} />
        <h2>Description</h2>
        <textarea placeholder="Description Here ..." name="" id="" cols="30" rows="10"{...register("description")}></textarea>
        <h2>Price: <input placeholder="0" className="food-input" type="number" id="price" {...register("price")} /></h2>
        <Options     />
        <div className="validate">
            <button type={"reset"}>Reset</button>
            <button type="submit">{defaultVals ? "Update" : "Add"}</button>
        </div>
        </form>
        </FormProvider>
    </div>
}
const Options = ()=>{

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: "options", // unique name for your Field Array
    });

    const {watch,setValue,register} = useFormContext()
    return  <div className="options-list">
        <div className="options-list-header">
            <h2>Options:</h2>
            <h3><button onClick={(e)=>{
                const leng = watch('options') ? watch('options').length : 0
                setValue(`options.${leng}`,{type: 'check',msg: '',price: 0})
            }}>Add Check Item</button></h3>
                    <h3><button onClick={(e)=>{
                const leng = watch('options') ? watch('options').length : 0
                setValue(`options.${leng}`,{type: 'select',msg: '',choices: []})
            }}>Add Multiple Select Item</button></h3>  

        </div>

        <div className="options-types">
        {watch("options") && watch("options").map((opt,index)=>{
            if(opt.type === 'check')
                return <div key={index} className="check-item">
                    <img src="/checkbox.png" alt="Option" />
                    <input placeholder="Message..." className="food-input" type="text" {...register(`options.${index}.msg`)} />
                    <input placeholder="0" className="food-input"  type="number" {...register(`options.${index}.price`)} />
                    <img  className="remove-img" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                    }} />
                </div>
            return <MultipleChoiceItem removeItem={remove} idx={index} key={index} />
        })
        }
        </div>
    </div>
}
const MultipleChoiceItem = ({idx,removeItem})=>{
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        name: `options.${idx}.choices`, // unique name for your Field Array
    });
    const {register,setValue,watch} = useFormContext()

    return <div className="select-item">
        <div className="select-header">
            <img src="/radio-button.png" alt="Option" />
                <input  placeholder="Message..." className="food-input"  type="text" {...register(`options.${idx}.msg`)} />
                <img className="add-img" src="/plus.png" alt="Add Choice" onClick={(e)=>{
                append({msg: '',price: ''})
                }} />
                <img className="remove-img" src="/trash.png" alt="Option" onClick={(e)=>{
                        removeItem(idx)
                }} />
        </div>

            <div className="choices">
            {watch(`options.${idx}.choices`) && watch(`options.${idx}.choices`).map((choice,index)=><div className="choice-item"  key={index}>
                <img src="/radio.png" alt="radio" />
                <input placeholder="Message..." className="food-input"  type="text" {...register(`options.${idx}.choices.${index}.msg`)} />
                <input placeholder="0" className="food-input"  type="number" {...register(`options.${idx}.choices.${index}.price`)} />
                <img className="remove-img" src="/trash.png" alt="Option" onClick={(e)=>{
                        remove(index)
                }} />
            </div>)
            }
            </div>
        </div>
}
export default FoodDetails