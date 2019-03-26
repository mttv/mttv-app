import React from 'react'
import Img from 'react-image'
import { Link } from 'react-router-dom'
import ImgPreloader from './ImgPreloader'

const gameList = (props) => {
  return(
    <div className="col-sm-6 col-md-4 col-lg-2">
      <Link onClick={() => sessionStorage.setItem("active-game", props.title)} params={props.title} to={{
          pathname: '/app/watch'
        }} 
      >
        <div className="card game shadow-sm">
          <div className="img-container">
              <Img 
                className="card-img-top" 
                src={props.img} 
                alt={props.title} 
                loader={<ImgPreloader cardType="game" />}
                />
          </div>
          <div className="card-body">
            <div className="card-body-content">
              <h6 className="card-title">{props.title}</h6>
              {props.viewers ? <p className="card-text">{props.viewers} {props.langPackOthers.viewers}</p> : <div />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default gameList