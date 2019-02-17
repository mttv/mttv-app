import React from 'react'
import { Link } from 'react-router-dom'

const gameList = (props) => {
  return(
    <div className="col-xs-6 col-sm-3 col-lg-2">
      <Link onClick={() => sessionStorage.setItem("active-game", props.title)} params={props.title} to={{
          pathname: '/app/watch'
        }} 
      >
        <div className="card game">
          <div className="img-container">
            <div className="img-shadow" />
            <img className="card-img-top" src={props.img} alt={props.title} />
          </div>
          <div className="card-body">
            <h6 className="card-title">{props.title}</h6>
            {props.viewers ? <p className="card-text">{props.viewers} {props.langPackOthers.viewers}</p> : <div />}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default gameList