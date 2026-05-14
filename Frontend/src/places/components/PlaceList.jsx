
import PlaceItem from './PlaceItem'
import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import './PlaceList.css'

const PlaceList=props=>{
    if (props.items.length===0){
        return <div className='place-list center'>
            <Card>
                <h2>No Place Found Maybe Create One! </h2>
                <Button to='/places/new'>Share Place</Button>
            </Card>
        </div>
    }
    return <ul className='place-list'>
        {props.items.map(place=>(
            <PlaceItem
                key={place.id} 
                id={ place.id} 
                image={place.image} 
                address={place.address} 
                title={place.title} 
                description={place.description} 
                creatorId={place.creator}
                coordinates={place.location}
        />))}
    </ul>
}

export default PlaceList