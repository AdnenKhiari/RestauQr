import Dexie from 'dexie';
import { registerRoute,Router,Route } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';


const app = new Router()
const curusersregex = new RegExp("/api/.*/users/current/?$")
app.registerRoute(new Route((req)=>{
  if(curusersregex.test(req.url.pathname))
    console.warn("Request coming to current user ",req,curusersregex.test(req.url),curusersregex.test(req.url.pathname))
  return curusersregex.test(req.url.pathname)
},async (handler)=>{
  console.log("fd handler",handler)
  if(navigator.onLine){
    const res = await fetch(handler.request)
    const body = await res.json()
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    await dbinstance.table("connected").put(body.data)
    db.close()
    return new Response(JSON.stringify(body),{headers:  handler.request.headers})
  }else{
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    const connecteduser = await dbinstance.table("connected").toArray()
    db.close()
    if(connecteduser.length > 0)
        return new Response(JSON.stringify({data: connecteduser[0]}),{headers:  handler.request.headers})
    return new Response(JSON.stringify({error: {}}),{headers:  handler.request.headers})
    }
}))

const usersregex = new RegExp("/api/.*/users/?$")
app.registerRoute(new Route((req)=>{
  if(usersregex.test(req.url.pathname))
    console.warn("Request coming to users ",req,usersregex.test(req.url),usersregex.test(req.url.pathname))
  return usersregex.test(req.url.pathname)
},async (handler)=>{
  console.log("fd handler",handler)
  if(navigator.onLine){
    const res = await fetch(handler.request)
    const body = await res.json()
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    await dbinstance.table("users").bulkPut(body.data)
    db.close()
    return new Response(JSON.stringify(body),{headers:  handler.request.headers})
  }else{
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    const users = await dbinstance.table("users").toArray()
    db.close()
    return new Response(JSON.stringify({data: users}),{headers:  handler.request.headers})
    }
}))

export default app