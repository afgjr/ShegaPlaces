import UserItem from "./UserItem";
import Card from "../../share/components/UiComponents/Card";
import './UserList.css'

const UserList=(props)=>{
   
    if (props.items.length == 0){
        return<Card> <h2>User not found</h2></Card>
    }

    return <ul className="users-list">
        {/* {console.log(props.items)} */}
            {props.items.map(item=>(
                
                <UserItem key={item.id} id={item.id} image={item.image} name={item.name } placeCount={item.places.length}/>
            ))}

    </ul>
}

export default UserList