import React, { Component } from 'react'

export default class Notifications extends Component {
    render() {
        return(
            <div className="tab-pane fade card-settings" id="notifications" role="tabpanel" aria-labelledby="list-notifications">
                <div className="jumbotron msg text-center">
                    <h3>{this.props.langPack.header_msg}</h3>
                    <p className="lead" style={{textAlign: "center"}}>{this.props.langPack.message}</p>
                </div>
            </div>
        )
  }
}