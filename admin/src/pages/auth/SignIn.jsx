import BaseUi from "./BaseUi"
import joi from "joi"

const schema = joi.object({
    email: joi.string().email({tlds: {allow: false}}).required().label("Email"),
    password: joi.string().required().label("Password")
})
const formdata = [{label: "Email",name: "email",type: "email"},
{label: "Password",name: "password",type: "password"}
]
const SignIn = ()=>{
    const submit = (data)=>{
        console.log(data)
    }
    return <BaseUi title={"Sign In"} schema={schema} formdata={formdata} submit={submit}/>
}
export default SignIn
