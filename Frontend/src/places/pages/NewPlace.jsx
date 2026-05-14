
import { useCallback, useReducer } from "react"

import Input from "../../share/components/FormElements/Input"
import Button from "../../share/components/FormElements/Button"
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../share/util/validators"
import { useForm } from "../../share/hooks/form-hooks"
import './PlaceForm.css'



const Newplace =()=>{
  const[formState,inputHandler]= useForm({
            title:{
                value:'',
                isValid:false
            } ,
            description:{
                value:'',
                isValid:false
            } ,
            address:{
                value:'',
                isValid:false
            }
        } ,false)
 
    const submitHandler=event=>{
        event.preventDefault()
        console.log(formState.inputs)
    }
    return <form className="place-form" onSubmit={submitHandler}>
        <Input 
            id="title"
            element='input'
            type='text'
            label='Title'    
            errorText='Please enter valid title' 
            validators={[VALIDATOR_REQUIRE()]} 
            onInput={inputHandler}
        />
        <Input 
            id="description"
            element='textarea'
            type='text'
            label='description'    
            errorText='Please enter a valid description ( at least 5 characters) ' 
            validators={[VALIDATOR_MINLENGTH(5)]} 
            onInput={inputHandler}
        />
        <Input 
            id="address"
            element='input'
            type='text'
            label='Address'    
            errorText='Please enter a valid address ' 
            validators={[VALIDATOR_REQUIRE()]} 
            onInput={inputHandler}
        />
       <Button type='submit'  disabled={!formState.isValid}>ADD PLACE</Button>
       
    </form>
}

export default Newplace