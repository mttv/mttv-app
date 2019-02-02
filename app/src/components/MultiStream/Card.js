import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const streamPreviewCard = (props) => {
    return(
        <Draggable draggableId={props.res._id} index={props.index} id={props.res._id}>
            {(provided, snapshot) => (
                <li className="list-group-item channel-card" id={props.res._id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div className="overlay">
                        <div className="bg-img">
                            <img src={props.res.channel.profile_banner} alt="" />
                        </div>
                        <img className="avatar" src={props.res.channel.logo} alt="" />
                    </div>
                    <div className="description">
                        <h6>{props.res.channel.display_name}<br/><small>{props.res.game}</small></h6>
                        <p>{props.res.channel.status}</p>
                    </div>
                </li>
            )}
        </Draggable>
    )
}

export default streamPreviewCard