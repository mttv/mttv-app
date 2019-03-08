import React from 'react'
import GameCard from '../../components/Cards/GameCard'
import GamepadIcon from '../../../img/gamepad-icon.png'

const gamesListLayout = (props) => {
    const { gamesList, error, langPack, langPackOthers } = props
    if (gamesList === null) {
        return(
            <div className="row" id="games-list">
                <div className="jumbotron msg">
                    <img src={GamepadIcon} alt="" />
                    <p className="lead">{langPack.games_title}</p>
                </div>
            </div>
        )
    } else if (error) {
        return(
            <div className="row" id="games-list">
                <p>{error}</p>
            </div>
        )
    } else if (gamesList === "empty") {
        return(
            <div className="row" id="games-list">
                <p>Looks like there is no games</p>
            </div>
        )
    } else if(gamesList !== null) {
        const list = gamesList.map((res, i) => {
            return  <GameCard 
                        key={i} 
                        img={res.box.large} 
                        title={res.name}
                        langPackOthers={langPackOthers}
                    />
        })
        return(
            <div className="row" id="games-list">
                {list}
            </div>
        )
    } else {
        return(
            <div className="row" id="games-list" />
        )
    }
}

export default gamesListLayout