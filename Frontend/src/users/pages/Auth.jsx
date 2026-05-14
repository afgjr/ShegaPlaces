import { useForm } from "../../share/hooks/form-hooks"
import Card from '../../share/components/UiComponents/Card'
import { Link } from "react-router"
import Button from "../../share/components/FormElements/Button"
import Input from "../../share/components/FormElements/Input"
import LoadingSpinner from "../../share/components/UiComponents/LoadingSpinner"
import ErrorModal from "../../share/components/UiComponents/ErrorModal"
import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH,VALIDATOR_REQUIRE } from "../../share/util/validators"

import './Auth.css'
import { useContext, useState } from "react"
import { AuthContext } from "../../share/Context/auth-context"

const Auth=()=>{
    const auth=useContext(AuthContext)
    const [isLogin,setIsLogin]=useState(false)
    const [authMessage, setAuthMessage] = useState("");
    const[formState,inputHandler,setFormData]= useForm({
         name:{ 
            value:'', 
            isValid:false },
        email:{
            value:'',
            isValid:false
        } ,
        password:{
            value:'',
            isValid:false
        } 
      
    } ,false)
    const [signUP,setSignUp]=useState(false)
    let res
    const loginHandle= async event=>{
        event.preventDefault()
        if (!signUP){
            try {
                setIsLogin(true)
                const response = await fetch('http://localhost:3000/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })
                res=response
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to sign up, please try again.');
                }
                auth.login();
            } catch (err) {
                setIsLogin(false)
                setAuthMessage(err.message || 'Something went wrong, please try again.');
            }
        } else {
            try {
                setIsLogin(true)
                const response = await fetch('http://localhost:3000/api/users/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    })
                })
                res=response
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message || 'Failed to sign up, please try again.');
                }
                auth.login();
            } catch (err) {
                setIsLogin(false)
                setAuthMessage(err.message || 'Something went wrong, please try again.');
            }

        }
        
    }

    const signupHandler=()=>{
        if(signUP){
            setFormData({
                ...formState.inputs,
                name:undefined
            },formState.inputs.email.isValid&&formState.inputs.password.isValid)
        } else {
          setFormData({
            ...formState.inputs,
            name:{
                value:'',
                isValid:false
            }
          },false)
        }
        setSignUp(prev=>!prev)
        setAuthMessage("")
    }

    return(
    <> 
        
        <Card className='authentication'>
            {isLogin && <LoadingSpinner asOverlay />}
            <h2>{signUP? 'Sign Up':'Log In Required '} </h2>
            <hr />
            <form onSubmit={loginHandle}>
                {signUP && 
                    <Input 
                        id="name"
                        element='input'
                        type='text'
                        label='Name' 
                        placeholder='Enter your Name'   
                        errorText='Please enter valid name' 
                        validators={[VALIDATOR_REQUIRE()]} 
                        onInput={inputHandler}
                    />
                
                }
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
            <Button type='submit' disabled={!formState.isValid}>{signUP?'SIGN UP':'LOG IN'}</Button>
            {authMessage && <p className="auth-message">{authMessage}</p>}
            <p>you {signUP?'':"don't"} have account <span  onClick={signupHandler}> {signUP? 'Log In':'Sign UP'}</span></p>
              
            {/* <Button>SIGN UP</Button> */}
            </form>        
            </Card>
    </>)
}
export default Auth

















