import React from 'react'
import StreamPreviewCard from '../../components/Cards/StreamPreviewCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'

const streamsListLayout = (props) => {
    const { streamsList, error, showLimit, total, langPackOthers, streamsHandler } = props
    if (streamsList === null) {
        return(
            <div className="row" id="streams-list">
                <p>Start Searching for streams)</p>
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="streams-list">
                <p>{error}</p>
            </div>
        )
    } else if (streamsList === "") {
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
            />
        })
        return(
            <div className="row" id="streams-list">
                {list}
                <LoadMoreBtn
                    query={""}
                    total={total} 
                    limit={showLimit}
                    functionHandler={streamsHandler}
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