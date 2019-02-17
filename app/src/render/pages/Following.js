import React, { Component } from 'react'
import $ from 'jquery'
import StreamsListLayout from '../layouts/Following/StreamsListLayout'
import GamesLiveListLayout from '../layouts/Following/GamesLiveListLayout'
import FollowingListLayout from '../layouts/Following/FollowingListLayout'

export default class Following extends Component {

    constructor(props) {
        super(props)
        this.state = {
            streams: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0,
                showCounter: 0
            },
            follows: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0,
                showCounter: 0
            },
            gamesLive: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0,
                showCounter: 0
            },
        }
    }

    componentDidMount() {
        this.streamsHandler("", 12)
        this.followsHandler("", 12)
        this.gamesLiveHandler("", 12)
    }

    componentDidUpdate() {
        $('#loaded').ready(() => {
            $('#loaded').fadeIn()
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.gamesLive.showCounter !== nextState.gamesLive.showCounter) {
            return true
        } else if (this.state.streams.showCounter !== nextState.streams.showCounter) {
            return true
        } else if (this.state.follows.showCounter !== nextState.follows.showCounter) {
            return true
        } else {
            return false
        }
    }

    streamsHandler = (query, limit) => {
        const token = sessionStorage.getItem("token")
        if (this.state.streams.showLimit !== limit) {
            this.setState({
                streams: {
                    ...this.state.streams,
                    showLimit: limit
                }
            })
        }
        this.props.api.streams.followed({auth: token, limit: limit}, (err, res) => {
            if (err) {
                this.setState({
                    streams: {
                        ...this.state.streams,
                        error: err
                    }
                })
                this.setState({
                        streams: {
                            ...this.state.streams,
                            showCounter: this.state.streams.showCounter + 1
                        }
                })
            } else {
                if (res._total === 0) {
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            list: ""
                        }
                    })   
                } else {
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            list: res.streams
                        }
                    })
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            total: res._total
                        }
                    })
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            error: false
                        }
                    })
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            showCounter: this.state.streams.showCounter + 1
                        }
                    })
                }
            }
        })
    }

    followsHandler = (query, limit) => {
        const userId = sessionStorage.getItem("userId")
        if (this.state.follows.showLimit !== limit) {
            this.setState({
                follows: {
                    ...this.state.follows,
                    showLimit: limit
                }
            })
        }
        this.props.api.users.follows({userID: userId, limit: limit}, (err, res) => {
            if (err) {
                this.setState({
                    follows: {
                        ...this.state.follows,
                        error: err
                    }
                })
                this.setState({
                    follows: {
                        ...this.state.follows,
                        showCounter: this.state.follows.showCounter + 1
                    }
                })
            } else {
                if (res._total === 0) {
                    this.setState({
                        follows: {
                            ...this.state.follows,
                            list: ""
                        }
                    })
                } else {
                    this.setState({
                        follows: {
                            ...this.state.follows,
                            list: res.follows
                        }
                    })
                    this.setState({
                        follows: {
                            ...this.state.follows,
                            total: res._total
                        }
                    })
                    this.setState({
                        follows: {
                            ...this.state.follows,
                            error: false
                        }
                    })
                    this.setState({
                        follows: {
                            ...this.state.follows,
                            showCounter: this.state.follows.showCounter + 1
                        }
                    })
                }
            }
        })	
    }

    gamesLiveHandler = (query, limit) => {
        const name = sessionStorage.getItem("userName")
        if (this.state.follows.showLimit !== limit) {
            this.setState({
                gamesLive: {
                    ...this.state.gamesLive,
                    showLimit: limit
                }
            })
        }
        this.props.api.other.followedGamesLive({channelName: name, limit: limit}, (err, res) => {
            if (err) {
                this.setState({
                    gamesLive: {
                        ...this.state.gamesLive,
                        error: err
                    }
                })
                this.setState({
                    gamesLive: {
                        ...this.state.gamesLive,
                        showCounter: this.state.gamesLive + 1
                    }
                })
            } else {
                if (res._total === 0) {
                    this.setState({
                        gamesLive: {
                            ...this.state.gamesLive,
                            list: ""
                        }
                    })
                } else {
                    this.setState({
                        gamesLive: {
                            ...this.state.gamesLive,
                            list: res.follows
                        }
                    })
                    this.setState({
                        gamesLive: {
                            ...this.state.gamesLive,
                            total: res._total
                        }
                    })
                    this.setState({
                        gamesLive: {
                            ...this.state.gamesLive,
                            error: false
                        }
                    })
                    this.setState({
                        gamesLive: {
                            ...this.state.gamesLive,
                            showCounter: this.state.gamesLive + 1
                        }
                    })
                }
            }
        })
    }
    
    render() {
        return(
            <div id="following">
                <div className="container">
                    <h1 className="page-title">{this.props.langPack.title}</h1>
                    <ul className="nav nav-tabs" id="search-categories-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="streams-tab" data-toggle="tab" href="#streams" role="tab" aria-controls="streams" aria-selected="true">{this.props.langPackCategories.streams}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="channels-tab" data-toggle="tab" href="#channels" role="tab" aria-controls="channels" aria-selected="false">{this.props.langPackCategories.channels}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="gameslive-tab" data-toggle="tab" href="#gameslive" role="tab" aria-controls="gameslive" aria-selected="false">{this.props.langPackCategories.games}</a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content" id="searchTabContent">
                    <div className="tab-pane fade show active" id="streams" role="tabpanel" aria-labelledby="streams-tab">
                        <div className="container streams-live" id="loaded">
                            <StreamsListLayout 
                                streamsList={this.state.streams.list} 
                                error={this.state.streams.error}
                                total={this.state.streams.total}
                                showLimit={this.state.streams.showLimit}
                                langPackOthers={this.props.langPackOthers}
                                streamsHandler={this.streamsHandler}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="channels" role="tabpanel" aria-labelledby="channels-tab">
                        <div className="container channels-preview">
                            <FollowingListLayout
                                channelsList={this.state.follows.list} 
                                error={this.state.follows.error}
                                total={this.state.follows.total}
                                showLimit={this.state.follows.showLimit}
                                langPackOthers={this.props.langPackOthers}
                                followsHandler={this.followsHandler}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="gameslive" role="tabpanel" aria-labelledby="gameslive-tab">
                        <div className="container games-list">
                            <GamesLiveListLayout 
                                gamesList={this.state.gamesLive.list} 
                                error={this.state.gamesLive.error} 
                                total={this.state.gamesLive.total}
                                showLimit={this.state.gamesLive.showLimit}
                                langPackOthers={this.props.langPackOthers}
                                gamesLiveHandler={this.gamesLiveHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}