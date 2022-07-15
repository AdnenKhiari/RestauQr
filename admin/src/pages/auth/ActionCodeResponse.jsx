import { useSearchParams } from "react-router-dom"

const ActionCodeResponse = ()=>{
    let [searchParams, setSearchParams] = useSearchParams();
    const mode = searchParams.get("mode")
    const oobCode = searchParams.get("oobCode")
    const apiKey = searchParams.get("apiKey")

    console.log("Search Params",mode,oobCode,apiKey)
    return <h1>Response Here</h1>
}
export default ActionCodeResponse