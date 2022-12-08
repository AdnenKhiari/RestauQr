import Dexie from 'dexie';
import { registerRoute,Router,Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';


const app = new Router()
const foodregex = new RegExp("/api/.*/food/?$")
app.registerRoute(new Route((req)=>{
  if(foodregex.test(req.url.pathname))
    console.warn("Request coming to fod ",req,foodregex.test(req.url),foodregex.test(req.url.pathname))
  return foodregex.test(req.url.pathname)
},async (handler)=>{
  console.log("fd handler",handler)
  if(navigator.onLine){
    const res = await fetch(handler.request)
    const body = await res.json()
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    await dbinstance.table("food").bulkPut(body.data)
    db.close()
    return new Response(JSON.stringify(body),{headers:  handler.request.headers})
  }else{
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    const allfood = await dbinstance.table("food").toArray()
    db.close()
    return new Response(JSON.stringify({data: allfood}),{headers:  handler.request.headers})
  }
}))

const getfoodregex = new RegExp("/api/.*/food/(.*)/?$")
app.registerRoute(new Route((req)=>{
  if(getfoodregex.test(req.url.pathname))
    console.warn("Request coming to fod ",req,getfoodregex.test(req.url),getfoodregex.test(req.url.pathname))
  return getfoodregex.test(req.url.pathname)
},async (handler)=>{
  console.log("fd handler",handler)
  if(navigator.onLine){
    const res = await fetch(handler.request)
    const body = await res.json()
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    await dbinstance.table("food").put(body.data,body.data.id)
    db.close()
    return new Response(JSON.stringify(body),{headers:  handler.request.headers})
  }else{
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    const id = getfoodregex.exec(handler.url.pathname)[1]
    const food = await dbinstance.table("food").get(id)
    db.close()
    return new Response(JSON.stringify({data: food}),{headers:  handler.request.headers})
  }
}))

export default app