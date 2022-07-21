const Error  = ({error,msg})=>{
    console.error(error)
    return <p className="error">{msg}</p>
}
export default Error