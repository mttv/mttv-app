import React, { Component } from 'react'
import $ from 'jquery'
import VisibilitySensor from 'react-visibility-sensor'

export default class channelDescription extends Component {
    componentDidMount() {
        $(".card-body a").attr("target", "_blank")
    }

    render() {
        return(
            <VisibilitySensor>
                <div className="card description">
                    <a href={this.props.imageLink} target="_blank">
                        <img className="card-img-top" src={this.props.image} alt="" />
                    </a>
                    <div className="card-body">
                        <h4>{this.props.title}</h4>
                        <div className="htmlDescription" dangerouslySetInnerHTML={{__html: this.props.description}} />
                    </div>
                </div>
            </VisibilitySensor>
        )
    }
}