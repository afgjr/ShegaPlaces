import React, {useEffect , useState} from "react";

import UserList from "../components/UserList";
import ErrorModal from "../../share/components/UiComponents/ErrorModal";
import LoadingSpinner from "../../share/components/UiComponents/ErrorModal";


import myImage from '../../assets/images.jpeg'

 const User =()=>{
        const [isLoading , setIsLoading]=useState(false)
        const [error , setError]=useState()
        const [loadedUsers , setLoadedUsers]=useState()

        useEffect (()=>{
            const sendRequest=async()=>{
                setIsLoading(true)
                try {
                    const response= await fetch('http://localhost:3000/api/users')
                    const responseData= await response.json()

                    if (!response.ok) {
                        throw new Error(responseData.message || 'Failed to fetch users')
                    }
                      console.log(responseData.users)
                    setLoadedUsers(responseData.users)
                  

                } catch (err) {
                    setError(err.message || 'Something went wrong , please try again')
                }
                setIsLoading(false)
            }
            sendRequest()
        } ,[])

        const errorHandler=()=>{
            setError(null)
        }
        
    return <>
        <ErrorModal error={error} onClear={errorHandler}/>
        {isLoading && <div className="center"><LoadingSpinner/></div>}
        {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
    </>
 }

 export default User

 //'/src/assets/images.jpeg'