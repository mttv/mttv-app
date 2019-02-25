import React, { Component } from 'react'
import $ from 'jquery'
import VisibilitySensor from 'react-visibility-sensor'

export default class channelDescription extends Component {
    componentDidMount() {
        $(".card.description a").attr({"target":"_blank", "rel":"noopener noreferrer"})
    }

    DescriptionLayout = () => {
        if (!this.props.channelError) {
            return(
                <div className="card description">
                    <a href={this.props.imageLink}>
                        <img className="card-img-top" src={this.props.image} alt="" />
                    </a>
                    <div className="card-body">
                        <h4>{this.props.title}</h4>
                        <div className="htmlDescription" dangerouslySetInnerHTML={{__html: this.props.description}} />
                    </div>
                </div>
            )
        } else {
            return <div />
        }
    }

    render() {
        return(
            <VisibilitySensor>
                <this.DescriptionLayout />
            </VisibilitySensor>
        )
    }
}