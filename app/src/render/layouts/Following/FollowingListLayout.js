import React from 'react'
import ChannelCard from '../../components/Cards/ChannelCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'

const followingListLayout = (props) => {
    const { channelsList, error, showLimit, total, followsHandler, langPackOthers } = props
    if (channelsList === null) {
        return(
            <div className="row" id="channels-list">
                <p>Start Searching for channels)</p>
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="channels-list">
                <p>{error}</p>
            </div>
        )
    } else if (channelsList === "") {
        return(
            <div className="row" id="channels-list">
                <p>Looks like there is no channels</p>
            </div>
        )
    } else if (channelsList !== null) {
        const list = channelsList.map((res, i) => {
            return <ChannelCard key={i} 
                        channelId={res.channel._id} 
                        channelName={res.channel.display_name} 
                        logo={res.channel.logo}
                        banner={res.channel.profile_banner}
                        description={res.channel.description}
                    />
        })
        return(
            <div className="row" id="channels-list">
                {list}
                <LoadMoreBtn
                    query={""}
                    total={total} 
                    limit={showLimit + 6}
                    functionHandler={followsHandler}
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

export default followingListLayout