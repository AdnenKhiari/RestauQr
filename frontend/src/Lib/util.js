export const removeFromCart = (cart,setCart,cartid)=>{
    cart.splice(cart.findIndex(it => it.cartid === cartid),1)
    setCart([...cart])
}
export const getReducedCart = (ct)=>{
    const prev = []
    ct.forEach((cur)=>{
        const idx = prev.findIndex(it => it.cartid === cur.cartid)
        if(idx === -1){
            prev.push({...cur,count : 1})
        }else{
            const el = prev[idx]
            el.count = el.count +1
        }
    } ,[])
    return prev
}