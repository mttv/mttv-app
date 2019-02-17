import React from 'react'

const featuredSliderIndicators = (props) => {
    const { list, error } =  props //this.state.featured
    if (list === null) {
        return(
            <div className="row" id="streams-list">
              <p>Loading</p>
            </div>
        )
    } else if(list !== null && error === false) {
        const res = list.map((res, i) => {
            return  <li key={i} className="slider-preview" data-target="#carouselExampleIndicators" data-slide-to={i}>
                        <img className="d-block w-100" src={res.stream.preview.large} alt="" />
                    </li>
        })
        return(
            <ol className="carousel-indicators">   
                {res}
            </ol>
        )
    } else if(error) {
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

export default featuredSliderIndicators