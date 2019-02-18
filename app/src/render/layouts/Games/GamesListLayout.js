import React from 'react'
import GameCard from '../../components/Cards/GameCard'
import LoadMoreBtn from '../../components/LoadMoreBtn/LoadMoreBtn'

const gamesListLayout = (props) => {
    const { gamesList, gamesListError, getGamesHandler, langPackOthers, showLimit, total } = props
    if (gamesList == null) {
      return(
        <div className="row" id="games-list">
          <p>Loading</p>
        </div>
      )
    } else if(gamesList !== null) {
      const list = gamesList.map((res, i) => {
        return <GameCard
                key={i} 
                img={res.game.box.large} 
                title={res.game.name} 
                viewers={res.viewers}
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
                functionHandler={getGamesHandler}
                langPackOthers={langPackOthers}
            />
        </div>
      )
    } else if(gamesListError) {
      return(
        <div className="row" id="games-list">
          <p>Error on try get gamesList</p>
        </div>
      )
    } else {
      return <div className="row" id="games-list" />
    }
}

export default gamesListLayout

