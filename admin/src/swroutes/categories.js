import Dexie from 'dexie';
import { registerRoute ,Router,Route} from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';



const categoriesregex = new RegExp("/api/.*/categories/?$")
const app = new Router()
app.registerRoute(new Route((req)=>{
  console.log("Tesring url for categories",req.url.pathname,categoriesregex.test(req.url.pathname))
  return categoriesregex.test(req.url.pathname)
},async (handler)=>{
  console.log("fd handler",handler)
  if(navigator.onLine){
    const res = await fetch(handler.request)
    const body = await res.json()
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    await dbinstance.table("utils").put(body.data)
    db.close()
    return new Response(JSON.stringify(body),{headers:  handler.request.headers})
  }else{
    const db = new Dexie("maindb")
    const dbinstance = await db.open()
    const allcats = await dbinstance.table("utils").get("menu")
    console.warn("SW Cats",allcats)
    db.close()
    return new Response(JSON.stringify({data: allcats}),{headers:  handler.request.headers})
  }
}))

export default app