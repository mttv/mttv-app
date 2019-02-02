import React, { Component } from 'react'

export default class Notifications extends Component {
    render() {
        return(
            <div className="card-settings">
                <div className="card-header">
                    <h5 className="mb-0">
                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#notifications" aria-expanded="true" aria-controls="notifications">{this.props.langPack.title}</button>
                    </h5>
                </div>
                <div id="notifications" className="collapse">
                    <div className="card-body">
                        <div className="jumbotron msg text-center">
                            <h3>{this.props.langPack.header_msg}</h3>
                            <p className="lead" style={{textAlign: "center"}}>{this.props.langPack.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
  }
}