import React from 'react'
import StreamPreviewCard from '../../components/Cards/StreamPreviewCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'
import StreamsIcon from '../../../img/tv-icon.png'

const streamsListLayout = (props) => {
    const { streamsList, error, total, limit, query, langPack, langPackOthers, getStreamsHandler } = props
    if (streamsList === null) {
        return(
            <div className="row" id="streams-list">
               <div className="jumbotron msg" id="streams-list">
                    <img src={StreamsIcon} alt="" />
                    <p className="lead">{langPack.streams_title}</p>
                </div> 
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="streams-list">
                <p>{error}</p>
            </div>
        )
    } else if (streamsList === "empty") {
        return(
            <div className="row" id="streams-list">
                <p>Looks like there is no streams</p>
            </div>
        )
    } else if (streamsList !== null) {
        const list = streamsList.map((res, i) => {
            return <StreamPreviewCard 
                key={i}
                channelId={res.channel._id}
                game={res.game} 
                type={res.stream_type} 
                previewImg={res.preview.large}
                logoImg={res.channel.logo}
                title={res.channel.status}
                channelName={res.channel.display_name}
                viewers={res.viewers}
                langPackOthers={langPackOthers}
                verified={res.channel.partner}
            />
        })
        return(
            <div className="row" id="streams-list">
                {list}
                <LoadMoreBtn
                    query={query} 
                    total={total} 
                    limit={limit}
                    functionHandler={getStreamsHandler}
                    langPackOthers={langPackOthers} 
                />
            </div>
        )
    } else {
        return(
            <div className="row" id="streams-list" />
        )
    }
}

export default streamsListLayout