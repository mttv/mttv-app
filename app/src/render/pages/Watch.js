import React, { Component } from 'react'
import $ from 'jquery'
import StreamsListLayout from '../layouts/Watch/StreamsListLayout'

export default class Watch extends Component {

    constructor(props) {
        super(props)
        this.state = {
          streamsList: null,
          streamsListError: false,
          game: "",
          showLimit: 12,
          total: 0,
          showCounter: 0
        }
      }

    componentDidMount() {
        const game = sessionStorage.getItem("active-game")
        if (game) {
            this.getStreamsHandler(game, this.state.showLimit)
            this.setState({game: game})
        } else {
            this.getStreamsHandler("", this.state.showLimit)
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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showCounter !== nextState.showCounter) {
            return true
        } else {
            return false
        }
    }

    getStreamsHandler = (game, limit) => {
        if(limit <= 100) {
            if (this.state.showLimit !== limit) {
                this.setState({showLimit: limit}) 
            }
            this.props.api.streams.live({limit: limit, game: game}, (err, res) => {
                if (err) {
                    this.setState({streamsList: null})
                    this.setState({streamsListError: true})
                    this.setState({showCounter: this.state.showCounter + 1})
                } else {
                    this.setState({total: res._total})
                    this.setState({streamsListError: false})
                    this.setState({streamsList: res.streams})
                    this.setState({showCounter: this.state.showCounter + 1})
                }
            })
        }
    }

    render() {
        return(
            <div className="container streams-live">
                <h1 className="page-title">{this.props.langPack.title} <span>{this.state.game}</span></h1>
                <div id="loaded">
                    <StreamsListLayout 
                        streamsList={this.state.streamsList} 
                        streamsListError={this.state.streamsListError} 
                        getStreamsHandler={this.getStreamsHandler} 
                        showLimit={this.state.showLimit}
                        total={this.state.total}
                        langPackOthers={this.props.langPackOthers} 
                        game={this.state.game} />
                </div>
            </div>
        )
    }
}