import catsrouter from  "./categories"
import foodrouter from  "./food"
import usersrouter from  "./users"

const processRouters = (routers,event)=>{
    const {request} = event;
    if(!routers.some((router)=>{
        const responsePromise = router.handleRequest({
            event,
            request,
          });
          console.warn(request.url,responsePromise)
        if (responsePromise) {
            // Router found a route to handle the request.
            event.respondWith(responsePromise);
            return true
        } else {
            // No route was found to handle the request.
            console.warn("No Route was found to process",request.url,"in",router)
            return false
        }
    })){
    }
}


const ProcessRouters = (event)=>{
    return processRouters([
        foodrouter,
        catsrouter,
        usersrouter
    ],event)
}
export default ProcessRouters