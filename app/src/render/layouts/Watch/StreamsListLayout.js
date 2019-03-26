import React from 'react'
import StreamPreviewCard from '../../components/Cards/StreamPreviewCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'

const streamsListLayout = (props) => {
    const { streamsList, streamsListError, showLimit, game, getStreamsHandler, langPackOthers, total } = props
    if (streamsList === null) {
        return(
            <div className="row" id="streams-list">
              <p>Loading</p>
            </div>
        )
    } else if(streamsList !== null && streamsListError === false) {
        const list = streamsList.map((res, i) => {
            return <StreamPreviewCard 
                        key={i}
                        verified={res.channel.partner}
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
                    query={game}
                    total={total} 
                    limit={showLimit}
                    functionHandler={getStreamsHandler}
                    langPackOthers={langPackOthers}
                />
            </div>
        )
    } else if(streamsListError) {
        return(
            <div className="row" id="streams-list">
                <p>Error on try get live streams</p>
            </div>
        )
    } else {
        return(
            <div className="row" id="streams-list" />
        )
    }
}

export default streamsListLayout