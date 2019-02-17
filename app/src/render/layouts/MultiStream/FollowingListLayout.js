import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import Card from '../../components/MultiStream/DraggableCard'

const followingListLayout = (props) => {
    const { list, error } = props
    if (list === null) {
        return(
            <div className="row" id="following-list"></div>
        )
    } else if (error) {
        return(
            <div className="row" id="following-list">
                <p>{error}</p>
            </div>
        )
    } else if (list === "empty") {
        return(
            <div className="row" id="following-list">
                <p>Looks like there is no streams</p>
            </div>
        )
    } else if (list !== null) {
        return(
            <Droppable droppableId="search-container">
                {(provided, snapshot) => (
                    <ul className="list-group"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {list.map((res, i) => <Card key={i} res={res} index={i} />)}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        )
    } else {
        return(
            <div className="row" id="following-list" />
        )
    }
}

export default followingListLayout