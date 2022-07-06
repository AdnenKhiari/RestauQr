import { useParams } from "react-router"
import {useForm} from 'react-hook-form'
import {Link} from "react-router-dom"
import { useContext } from "react"
import {CartContext} from "./Contexts"
const FoodDetails = ()=>{
    const {id} = useParams() 
    const food = {
        id: '24U249289',
        title: 'Pizza Neptune',
        img: "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat ad dicta aliquam reprehenderit corporis est sed, unde excepturi itaque dolorem laboriosam! Reprehenderit fugiat adipisci modi ipsa minima ratione mollitia.",
        price: 10,
        category: 'Pizza',
        options: [
        {
            type: 'check',
            msg: 'Double Fromage'
        },{
            type: 'check',
            msg: 'Double Thon'
        },{
            type: 'select',
            msg: 'Taille',
            choices:['Mini','Moyenne','Large','XL']
        }]
    }
    return <div className="food-details-container">
        <div className="food-details">
            <div className="food-img">
                <img src={food.img} alt={food.title}/>
            </div>
            <div className="food-info">
            <Link to='/'>Main Menu</Link>
                <h2>{food.title}</h2>
                <p className="category">{food.category}</p>
                <p className="description">{food.description}</p>
                <p className="price">Price :{food.price}</p>
                <div className="food-custom">
                    <h2>Ajouter Des Options:</h2>
                    <Options food = {food} />
                </div>
            </div>
        </div>
    </div>
}

const Options = ({food})=>{
    const [cart,setCart] = useContext(CartContext)
    const addToCart = (data)=>{
        const cmd = {...food}
        cmd.options = data
        console.log(cmd)
        setCart([...cart,cmd])
    }

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  return <form onSubmit={handleSubmit(addToCart)}>
    {food.options.map((opt,key)=><div className="form-input-container" key={key}> 
    <label htmlFor={opt.msg}>{opt.msg}</label>
    <br />
    {opt.type === 'select' ? opt.choices.map((c)=><div className="form-input"  key={c}>
        <label htmlFor={c}>{c}</label>
        <input type="radio" value={c} name={opt.msg} id={c} {...register(opt.msg,{required:true})} />
    </div>
    ) :  <div className="form-input">
    <input type="checkbox" id={opt.msg} {...register(opt.msg)}/>
 </div>}
    </div>)
    }
    <button type="submit">Submit</button>
  </form>

}
export default FoodDetails