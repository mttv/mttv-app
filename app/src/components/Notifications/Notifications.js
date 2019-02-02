import React, { Component } from 'react'
import icon from '../../img/icon.png'

export default class Notificaitons extends Component {

    notifactionsHandler = () => {
        Notification.requestPermission().then((r) => {
            new Notification("MTTV", {
                "body": "Hello World!",
                "icon": icon
            })
        })
    }

    render() {
        return(
            <div className="container">
                <h1 className="page-title">{this.props.langPack.title}</h1>
                <div className="jumbotron msg text-center">
                    <h3>{this.props.langPack.header_msg}</h3>
                    <p className="lead">{this.props.langPack.message}</p>
                    <button style={{marginTop: "20px"}} className="btn btn-info btn-lg" onClick={this.notifactionsHandler}>{this.props.langPack.test_btn}</button>
                </div>
            </div>
        )
    }
}