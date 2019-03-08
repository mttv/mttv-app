import React, { Component } from 'react'
import StreamsListLayout from '../layouts/Search/StreamsListLayout'
import GamesListLayout from '../layouts/Search/GamesListLayout'
import ChannelsListLayout from '../layouts/Search/ChannelsListLayout'

// Init a timeout variable to be used below
let timeout = null

export default class Search extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchQuery: "",
            games: {
                list: null,
                error: false,
                showLimit: 12
            },
            streams: {
                list: null,
                error: false,
                total: 0,
                showCounter: 0,
                showLimit: 12
            },
            channels: {
                list: null,
                error: false,
                total: 0,
                showLimit: 12
            },
            showCounter: 0
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showCounter !== nextState.showCounter) {
            return true
        } else {
            return false
        }
    }

    searchHandler = (event) => {
        const searchQuery = event.target.value
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            this.getStreamsHandler(searchQuery, 12)
            this.getGamesHandler(searchQuery, 12)
            this.getChannelsHandler(searchQuery, 12)
            this.setState({
                searchQuery: searchQuery
            })
            this.setState({showCounter: this.state.showCounter + 1})
        }, 1000)
    }

    getStreamsHandler = (query, limit) => {
        if(limit <= 100) {
            if (this.state.streams.showLimit !== limit) {
                this.setState({
                    streams: {
                        ...this.state.streams,
                        showLimit: limit
                    }
                }) 
            }
            this.props.api.search.streams({limit: limit, query: query}, (err, res) => {
                if (err) {
                    this.setState({
                        streams: {
                            ...this.state.streams,
                            error: err
                        }
                    })
                    this.setState({showCounter: this.state.showCounter + 1})
                } else {
                    if (res.streams.length === 0 || res.streams.length === undefined) {
                        this.setState({
                            streams: {
                                ...this.state.streams,
                                list: "empty"
                            }
                        })
                        this.setState({showCounter: this.state.showCounter + 1})
                    } else {
                        this.setState({
                            streams: {
                                ...this.state.streams,
                                total: res._total
                            }
                        })
                        this.setState({
                            streams: {
                                ...this.state.streams,
                                list: res.streams
                            }
                        })
                        this.setState({
                            streams: {
                                ...this.state.streams,
                                error: false
                            }
                        })
                        this.setState({showCounter: this.state.showCounter + 1})
                    }
                }
            })
        }
    }

    getGamesHandler = (query, limit) => {
        if (limit <= 100) {
            if (this.state.games.showLimit !== limit) {
                this.setState({
                    games: {
                        ...this.state.games,
                        showLimit: limit
                    }
                })
            }
            this.props.api.search.games({limit: limit, query: query, live: true}, (err, res) => {
                if (err) {
                    this.setState({
                        games: {
                            ...this.state.games,
                            error: err
                        }
                    })
                    this.setState({showCounter: this.state.showCounter + 1})
                } else {
                    if (res.games === null || res.games === undefined) {
                        this.setState({
                            games: {
                                ...this.state.games,
                                list: "empty"
                            }
                        })
                    } else {
                        this.setState({
                            games: {
                                ...this.state.games,
                                list: res.games
                            }
                        })
                        this.setState({
                            games: {
                                ...this.state.games,
                                error: false
                            }
                        })
                        this.setState({showCounter: this.state.showCounter + 1})
                    }
                }
            })
        }
    }

    getChannelsHandler = (query, limit) => {
        if (limit <= 100) {
            if (this.state.channels.showLimit !== limit) {
                this.setState({
                    channels: {
                        ...this.state.channels,
                        showLimit: limit
                    }
                })
            }
            this.props.api.search.channels({limit: limit, query: query}, (err, res) => {
                if (err) {
                    this.setState({
                        channels: {
                            ...this.state.channels,
                            error: err
                        }           
                    })
                    this.setState({showCounter: this.state.showCounter + 1})
                } else {
                    if (res.channels.length === 0 || res.channels.length === undefined) {
                        this.setState({
                            channels: {
                                ...this.state.channels,
                                error: "empty"
                            }
                        })
                        this.setState({showCounter: this.state.showCounter + 1})
                    } else {
                        this.setState({
                            channels: {
                                ...this.state.channels,
                                total: res._total
                            }
                        })
                        this.setState({
                            channels: {
                                ...this.state.channels,
                                list: res.channels
                            }
                        })
                        this.setState({
                            channels: {
                                ...this.state.channels,
                                error: false
                            }
                        })
                        this.setState({showCounter: this.state.showCounter + 1})
                    }
                }
            })
        }
    }

    render() {
        return(
            <div id="search">
                <div className="container">
                    <h1 className="page-title">{this.props.langPack.title}</h1>
                    <input type="text" id="search-input" className="form-control form-control-lg border-0 shadow-sm" placeholder={this.props.langPack.title + "..."} onChange={this.searchHandler} />
                    <ul className="nav nav-tabs" id="search-categories-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="streams-tab" data-toggle="tab" href="#streams" role="tab" aria-controls="streams" aria-selected="true">{this.props.langPackCategories.streams}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="games-tab" data-toggle="tab" href="#games" role="tab" aria-controls="games" aria-selected="false">{this.props.langPackCategories.games}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="channels-tab" data-toggle="tab" href="#channels" role="tab" aria-controls="channels" aria-selected="false">{this.props.langPackCategories.channels}</a>
                        </li>
                    </ul>
                </div>
                <div className="tab-content" id="searchTabContent">
                    <div className="tab-pane fade show active" id="streams" role="tabpanel" aria-labelledby="streams-tab">
                        <div className="container streams-live">
                            <StreamsListLayout 
                                streamsList={this.state.streams.list} 
                                error={this.state.streams.error} 
                                total={this.state.streams.total} 
                                limit={this.state.streams.showLimit}
                                query={this.state.searchQuery}
                                langPack={this.props.langPack}
                                langPackOthers={this.props.langPackOthers}
                                getStreamsHandler={this.getStreamsHandler}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="games" role="tabpanel" aria-labelledby="games-tab">
                        <div className="container games-list">
                            <GamesListLayout 
                                gamesList={this.state.games.list} 
                                error={this.state.games.error}
                                query={this.state.searchQuery}
                                langPack={this.props.langPack}
                                langPackOthers={this.props.langPackOthers}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="channels" role="tabpanel" aria-labelledby="channels-tab">
                        <div className="container channels-preview">
                            <ChannelsListLayout 
                                channelsList={this.state.channels.list} 
                                error={this.state.channels.error} 
                                total={this.state.channels.total}
                                query={this.state.searchQuery}
                                limit={this.state.channels.showLimit}
                                langPack={this.props.langPack}
                                langPackOthers={this.props.langPackOthers}
                                getChannelsHandler={this.getChannelsHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}