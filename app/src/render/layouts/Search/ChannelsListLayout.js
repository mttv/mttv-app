import React from 'react'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'
import ChannelCard from '../../components/Cards/ChannelCard'

const channelsListLayout = (props) => {
    const { channelsList, error, total, limit, query, langPack, getChannelsHandler, langPackOthers } = props
    if (channelsList === null) {
        return(
            <div className="row" id="channels-list">
                <div className="jumbotron msg">
                    <i className="fas fa-heart icon"></i>
                    <p className="lead">{langPack.channels_title}</p>
                </div>
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="channels-list">
                <p>{error}</p>
            </div>
        )
    } else if (channelsList === null || channelsList === undefined) {
        return(
            <div className="row" id="channels-list">
                <p>Looks like there is no channels</p>
            </div>
        )
    } else if (channelsList !== null) {
        const list = channelsList.map((res, i) => {
            return <ChannelCard key={i} 
                        channelId={res._id} 
                        channelName={res.display_name} 
                        logo={res.logo}
                        banner={res.profile_banner}
                        description={res.description}
                    />
        })
        return(
            <div className="row" id="channels-list">
                {list}
                <LoadMoreBtn 
                    query={query} 
                    total={total} 
                    limit={limit}
                    functionHandler={getChannelsHandler}
                    langPackOthers={langPackOthers} 
                />
            </div>
        )
    } else {
        return(
            <div className="row" id="channels-list" />
        )
    }
}

export default channelsListLayout