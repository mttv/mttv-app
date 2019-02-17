import React from 'react'
import VideoCard from '../../components/Cards/VideoCard'
import Video from '../../components/Modals/Video'

const topVideosLayout = (props) => {
    const { videosList, videosError, langPackOthers } = props
    if (videosList === null) {
        return(
            <div className="row" id="top-videos-list">
              <p>Loading</p>
            </div>
        )
    } else if(videosList !== null && videosError === false) {
        const list = videosList.map((res, i) => {
            return <VideoCard 
                        key={i}
                        title={res.title}
                        game={res.game}
                        views={res.views}
                        previewImg={res.preview.large}
                        date={res.created_at}
                        duration={res.length}
                        channelName={res.channel.display_name}
                        vid={res._id}
                        type={"video"}
                        langPackOthers={langPackOthers}
                    />
        })
        const videoCards = videosList.map((res, i) => {
            return <Video 
                        key={i}
                        vid={res._id}
                        link={"https://player.twitch.tv/?autoplay=false&muted=false&video=" + res._id}
                    />
        })
        return(
            <div className="inline" id="top-videos-list">
                <button id="scroll-left-top-videos" className="btn left-scroll"><i className="fas fa-angle-left"></i></button>
                <div className="inline-container" id="top-videos">
                    {list}
                </div>
                <button id="scroll-right-top-videos" className="btn right-scroll"><i className="fas fa-angle-right"></i></button>
                {videoCards}
            </div>
        )
    } else if(videosError) {
        return(
            <div className="row" id="top-videos-list">
                <p>Error on try get live streams</p>
            </div>
        )
    } else {
        return(
            <div className="row" id="top-videos-list" />
        )
    }
}

export default topVideosLayout