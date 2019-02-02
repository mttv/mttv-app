import React, { Component } from 'react'
import $ from 'jquery'
import StreamPreviewCard from './StreamPreviewCard'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class Watch extends Component {

    constructor(props) {
        super(props)
        this.state = {
          streamsList: null,
          streamsListError: false,
          game: "",
          showLimit: 12
        }
      }

    componentDidMount() {
        const game = sessionStorage.getItem("active-game")
        if (game) {
            this.getStreamsHandler(this.state.showLimit, game)
            this.setState({game: game})
        } else {
            this.getStreamsHandler(this.state.showLimit)
        }
        // let game = url.split("?game=").pop()
        // if (game === 'http://localhost:5000/#/app/watch') {
        //     this.getStreamsHandler(this.state.showLimit)   
        // } else {
        //     game = game.replace(/%20/g, " ")
        //     this.getStreamsHandler(this.state.showLimit, game)
        //     this.setState({game: game})
        // }
    }

    componentDidUpdate() {
        $('#loaded').ready(() => {
            $('#loaded').fadeIn()
        })
    }

    componentWillUnmount() {
        this.setState({streamsList: null})
        this.setState({streamsListError: false})
        this.setState({showLimit: 12})
        this.setState({game: ""})
        sessionStorage.removeItem("active-game")
    }

    getStreamsHandler = (limit, game) => {
        if(limit <= 100) {
            if (this.state.showLimit !== limit) {
                this.setState({showLimit: limit}) 
            }
            this.props.api.streams.live({limit: limit, game: game}, (err, res) => {
                if (err) {
                    this.setState({streamsList: null})
                    this.setState({streamsListError: true})
                } else {
                    this.setState({streamsListError: false})
                    this.setState({streamsList: res.streams})
                }
            })
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                text: 'Didn\'t find the stream you wanted?Try search for it.',
                showCancelButton: false
            })
        }
    }

    streamsListLayout = (props) => {
        const { streamsList, streamsListError } = props
        if (streamsList === null) {
            return(
                <div className="row" id="streams-list">
                  <p>Loading</p>
                </div>
            )
        } else if(streamsList !== null && streamsListError === false) {
            const list = streamsList.map((res, i) => {
                return <StreamPreviewCard 
                            key={i}
                            channelId={res.channel._id}
                            game={res.game} 
                            type={res.stream_type} 
                            previewImg={res.preview.large}
                            logoImg={res.channel.logo}
                            title={res.channel.status}
                            channelName={res.channel.display_name}
                            viewers={res.viewers}
                            langPackOthers={this.props.langPackOthers}
                        />
            })
            return(
                <div className="row" id="streams-list">
                    {list}
                    <button className="btn load-more" onClick={() => this.getStreamsHandler(this.state.showLimit + 6, this.state.game)}>{this.props.langPackOthers.load_more_btn}</button>
                </div>
            )
        } else if(streamsListError) {
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

    render() {
        return(
            <div className="container streams-live">
                <h1 className="page-title">{this.props.langPack.title} <span>{this.state.game}</span></h1>
                <div id="loaded">
                    <this.streamsListLayout streamsList={this.state.streamsList} streamsListError={this.state.streamsListError} />
                </div>
            </div>
        )
    }
}