import joi from "joi"
import BaseUi from "./BaseUi"

const schema = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required().label("Email"),
    password: joi.string().required().label("Password"),
    confirmPassword: joi.string().valid(joi.ref("password"))
})
const formdata = [
    {label: "Email",name: "email",type: "email"},
{label: "Password",name: "password",type: "password"},
{label: "Confirm Password",name: "confirmPassword",type: "password"},
]
const SignUp = ()=>{
    const submit = (data)=>{
        console.log(data)
    }
    return <BaseUi title={"Sign Up"} schema={schema} formdata={formdata} submit={submit}/>
}
export default SignUp
