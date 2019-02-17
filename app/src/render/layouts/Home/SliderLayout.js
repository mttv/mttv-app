import React from 'react'
import { Link } from 'react-router-dom'

const featuredSlider = (props) => {
    const { list, error, langPackOthers, langPack } = props //this.state.featured
    if (list === null) {
        return(
            <div className="row" id="streams-list">
              <p>Loading</p>
            </div>
        )
    } else if(list !== null && error === false) {
        const res = list.map((res, i) => {
            // let imgUrl = res.stream.preview.template
            // imgUrl = imgUrl.replace("{width}", 1920)
            // imgUrl = imgUrl.replace("{height}", 1080)
            return  <div key={i} className="carousel-item">
                        <div className="img-shadow">
                            <img className="d-block w-100" src={res.stream.preview.large} alt="" />
                        </div>
                        <div className="carousel-caption d-none d-md-block">
                            <h2>{res.stream.channel.status}</h2>
                            <p>{res.stream.channel.display_name}<span>{res.stream.channel.game}</span><span>{res.stream.viewers + " " + langPackOthers.viewers}</span></p><br />
                            <Link className="btn watch-btn" to={{
                                pathname: '/app/channel',
                                search: '?id=' + res.stream.channel._id
                            }}>{langPack.watch_btn}</Link>
                        </div>
                    </div>
        })
        return(
            <div className="carousel-inner">   
                {res}
            </div>
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

export default featuredSlider