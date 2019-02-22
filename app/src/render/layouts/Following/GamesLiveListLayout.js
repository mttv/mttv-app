import React from 'react'
import GameCard from '../../components/Cards/GameCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'

const gamesLiveListLayout = (props) => {
    const { gamesList, error, showLimit, total, langPackOthers, gamesLiveHandler } = props
    if (gamesList === null) {
        return(
            <div className="row" id="games-list">
                <p>Start Searching for games)</p>
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="games-list">
                <p>{error}</p>
            </div>
        )
    } else if (gamesList === "") {
        return(
            <div className="row" id="games-list">
                <p>Looks like there is no games</p>
            </div>
        )
    } else if(gamesList !== null) {
        const list = gamesList.map((res, i) => {
            return <GameCard 
                        key={i} 
                        viewers={res.viewers} 
                        img={res.game.box.large} 
                        title={res.game.name} 
                        langPackOthers={langPackOthers} 
                    />
        })
        return(
            <div className="row" id="games-list">
                {list}
                <LoadMoreBtn
                    query={""}
                    total={total} 
                    limit={showLimit}
                    functionHandler={gamesLiveHandler}
                    langPackOthers={langPackOthers}
                />
            </div>
        )
    } else {
        return(
            <div className="row" id="games-list" />
        )
    }
}

export default gamesLiveListLayout