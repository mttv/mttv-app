import React from 'react'
import ReactPlayer from 'react-player'

const DraggablePLayer = (props) => {
    return(
        <div className={"player-container container-block embed-responsive embed-responsive-16by9 " + props.styleClass}>
            <ReactPlayer width="100%" height="100%" className="react-player" url={props.url} playing={props.playing} muted={true} />
        </div>
    )
}

export default DraggablePLayer