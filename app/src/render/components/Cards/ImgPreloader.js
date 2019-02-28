import React from 'react'

const imgPreloader = (props) => {
    return(
      <div className={"img-preloader " + props.cardType}>
        <div className="preload-icon">
          <div className="circleG circleG_1"></div>
          <div className="circleG circleG_2"></div>
          <div className="circleG circleG_3"></div>
        </div>
      </div>
    )
}

export default imgPreloader

