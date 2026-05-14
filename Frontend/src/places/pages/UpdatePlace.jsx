import { useEffect, useState } from "react"
import { useParams } from "react-router"

import { useForm } from "../../share/hooks/form-hooks"
import Input from "../../share/components/FormElements/Input"
import Button from "../../share/components/FormElements/Button"
import Card from "../../share/components/UiComponents/Card"
import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from "../../share/util/validators"
import { DUMMY_PLACES } from "./UserPlaces"

import './PlaceForm.css'


const UpdatePlace=()=>{
    const placeId=useParams().id
    const [isLoading,setLoading]=useState(true)
   
   const[formState,inputHandler,setFormData]= useForm({
        title:{
            value:'',
            isValid:false
        },
        description:{
            value:'',
            isValid:false
        }
    },true)
const identifiedPlace=DUMMY_PLACES.find(place=>place.id===`${placeId}`)

useEffect(()=>{
    if(identifiedPlace){
        setFormData({
            title:{
                value:identifiedPlace.title,
                isValid:true
            },
            description:{
                value:identifiedPlace.description,
                isValid:true
            }
        },true)
    }
 
    setLoading(false)  
},[setFormData,identifiedPlace])
const placeUpdateSubmitHandler=event=>{
    event.preventDefault()
    console.log(formState.inputs)
}
if (!identifiedPlace){
    return(
        <div className="center">
            <Card>
            <h2>Could not find place!</h2>
            </Card>
        </div>
    )
}

if (isLoading){
    return(
        <div className="center">
            <h2>Loading...</h2>
        </div>
    )
}
return <form  className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input id='title' element='input' type='text' label='Title' validators={[VALIDATOR_REQUIRE()]} errorText='Please enter valid title' 
                onInput={inputHandler} initialValue={formState.inputs.title.value} initialValid={formState.inputs.title.isValid}
/>

    <Input id='description' element='textarea' type='text' label='Description' validators={[VALIDATOR_MINLENGTH(5)]} errorText='Please enter valid description ( at least 5 charchters)' 
                onInput={inputHandler} initialValue={formState.inputs.description.value} initialValid={formState.inputs.description.isValid}
/>
<Button type='submit ' disabled={!formState.isValid}>Update place</Button>
</form>
       

    
}

export default UpdatePlace