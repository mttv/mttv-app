import React, { Component } from 'react'
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'

export default class Clips extends Component {

    constructor(props) {
        super(props)

        this.state = {
            channelId: "",
            list: null,
            error: false,
            showLimit: 8,
            total: 0
        }
    }

    componentDidMount() {
        const urlString = window.location.href
        const channelId = urlString.split("=").pop()
        this.setState({
            channelId: channelId
        })
    }

    render() {
        return(
            <div className="container streams-live">
                <h1 className="page-title">{this.props.langPack.title}</h1>
                <div className="jumbotron msg text-center">
                    <h3>{this.props.langPack.header_msg}</h3>
                    <p className="lead">{this.props.langPack.message}</p>
                </div>
            </div>
        )
    }
}