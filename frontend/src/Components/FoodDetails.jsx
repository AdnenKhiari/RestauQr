import { useParams } from "react-router"
import {useForm} from 'react-hook-form'
import {Link} from "react-router-dom"
import { useContext } from "react"
import {CartContext} from "./Contexts"
import hash from "object-hash"
const tempfood = {
    id: '24U249289',
    title: 'Pizza Neptune',
    img: "https://img.cuisineaz.com/660x660/2021/07/28/i179970-pizza-neptune.webp",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat ad dicta aliquam reprehenderit corporis est sed, unde excepturi itaque dolorem laboriosam! Reprehenderit fugiat adipisci modi ipsa minima ratione mollitia.",
    price: 10,
    category: 'Pizza',
    options: [
    {
        type: 'check',
        price: 3,
        msg: 'Double Fromage'
    },{
        type: 'check',
        price: 2,
        msg: 'Double Thon'
    },{
        type: 'select',
        msg: 'Taille',
        choices:[{price: 0,msg: 'Mini'},{price: 2,msg: 'Moyenne'},{price: 4,msg: 'Large'},{price: 8,msg: 'XL'}]
    }]
}
const FoodDetails = ()=>{
    const [cart,setCart] = useContext(CartContext)

    const {id,cartid} = useParams() 
    // cart id exists get the food info from the id given by the initfood

    var food = tempfood
    if(cartid){
        var initfood = cart.find(f=>f.cartid === cartid)
        if(!initfood)
            console.log('Kdim')
            // should throw an error cause of invalid id
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
                    <Options food = {food} initfood={initfood} />
                </div>
            </div>
        </div>
    </div>
}

const Options = ({food,initfood = null})=>{
    const [cart,setCart] = useContext(CartContext)
    const addToCart = (data)=>{
        const cmd = {...food}
        cmd.options = data
        cmd.price += Object.keys(data).reduce((prev,key)=>{
            const cur = data[key]
            const fd = food.options.find(it=>it.msg === key)
            if(fd.type === 'check' && cur){
                return prev + fd.price
            }else if(fd.type === 'select' && cur){
                return prev + fd.choices.find(ch => ch.msg === cur).price
            }else{
                return 0
            }
        },0)
        cmd.cartid = hash({options: cmd.options,id : cmd.id})
        console.log(cmd,initfood)
        if(initfood){
            const idx = cart.findIndex(f => f.cartid === initfood.cartid)
            console.log("replacing",idx)
            if(idx ===-1)
                return;
            cart.splice(idx,1)
            setCart([...cart,cmd])
        } else{
            setCart([...cart,cmd])
        }

    }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: initfood ? initfood.options : {}
  });
  return <form onSubmit={handleSubmit(addToCart)}>
    {food.options.map((opt,key)=><div className="form-input-container" key={key}> 
    <label htmlFor={opt.msg}>{opt.msg} {opt.price}$</label>
    <br />
    {opt.type === 'select' ? opt.choices.map((c)=><div className="form-input"  key={c.msg}>
        <label htmlFor={c.msg}>{c.msg} {c.price}$</label>
        <input type="radio" value={c.msg} name={opt.msg} id={c.msg} {...register(opt.msg,{required:true})} />
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