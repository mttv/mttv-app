import React from 'react'
import VideoCard from '../../components/Cards/VideoCard'
import Video from '../../components/Modals/Video'

const topClipsLayout = (props) => {
    const { clipsList, clipsError, langPackOthers } = props
    if (clipsList === null) {
        return(
            <div className="row" id="top-clips-list">
              <p>Loading</p>
            </div>
        )
    } else if(clipsList !== null && clipsError === false) {
        const list = clipsList.map((res, i) => {
            return <VideoCard 
                        key={i}
                        title={res.title}
                        game={res.game}
                        views={res.views}
                        previewImg={res.thumbnails.medium}
                        date={res.created_at}
                        duration={res.duration}
                        vid={res.id}
                        channelName={res.broadcaster.display_name}
                        type={"clip"}
                        langPackOthers={langPackOthers}
                    />
        })
        const clipsCards = clipsList.map((res, i) => {
            return <Video 
                        key={i}
                        vid={res.id}
                        link={"https://clips.twitch.tv/embed?autoplay=false&muted=false&clip=" + res.id}
                    />
        })
        return(
            <div className="inline" id="top-clips-list">
                <button id="scroll-left-top-clips" className="btn left-scroll"><i className="fas fa-angle-left"></i></button>
                <div className="inline-container" id="top-clips">
                    {list}
                </div>
                <button id="scroll-right-top-clips" className="btn right-scroll"><i className="fas fa-angle-right"></i></button>
                {clipsCards}
            </div>
        )
    } else if(clipsError) {
        return(
            <div className="row" id="top-clips-list">
                <p>Error on try get live streams</p>
            </div>
        )
    } else {
        return(
            <div className="row" id="top-clips-list" />
        )
    }
}

export default topClipsLayout