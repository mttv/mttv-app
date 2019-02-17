import React from 'react'

const featuredSlider = (props) => {
    return(
        <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-ride="carousel">
            <props.featuredSliderIndicators 
                list={props.featured.list} 
                error={props.featured.error}
            />
            <props.featuredSlider 
                list={props.featured.list} 
                error={props.featured.error}
                langPack={props.langPack}
                langPackOthers={props.langPackOthers}
            />
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    )
}

export default featuredSlider