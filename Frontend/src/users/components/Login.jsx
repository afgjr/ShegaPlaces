
import Card from "../../share/components/UiComponents/Card"
import Button from "../../share/components/FormElements/Button"
import Input from "../../share/components/FormElements/Input"
import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH } from "../../share/util/validators"
import { Link } from "react-router"
import { useState } from "react"
import { useForm } from "../../share/hooks/form-hooks"
 
const Login=()=>{
    const [signUP,setSignUp]=useState(false)
    const signupHandler=()=>{
    setSignUp(true)
    }
        const loginHandle=event=>{
        event.preventDefault()
        console.log(formState)
    }
    const[formState,inputHandler]= useForm({
        email:{
            value:'',
            isValid:false
        } ,
        password:{
            value:'',
            isValid:false
        } 
        
    } ,false)
  
 return<Card className='authentication'>
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={loginHandle}>
            <Input 
                id="email"
                element='input'
                type='email'
                label='E-mail' 
                placeholder='Enter your email'   
                errorText='Please enter valid email' 
                validators={[VALIDATOR_EMAIL()]} 
                onInput={inputHandler}
            />
            <Input 
                id="password"
                element='input'
                type='password'
                label='Password' 
                placeholder='Enter min of 6 digit password'   
                errorText='Please enter a valid password ( at least 6 characters)' 
                validators={[VALIDATOR_MINLENGTH(6)]} 
                onInput={inputHandler}
         />
         <Button type='submit' disabled={!formState.isValid}>LOG IN</Button>
         <h4>you don't have account <Link onClick={()=>{onSignupSet(true)}}>SIGN UP</Link></h4>
        </form>
        {console.log('hello')}
    </Card>
}

export default Login