import React, { Component } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import StreamPreviewCard from '../Watch/StreamPreviewCard'
import GameCard from '../Games/GameCard'
import ChannelCard from '../Channel/ChannelCard'

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
                showLimit: 12
            },
            channels: {
                list: null,
                error: false,
                total: 0,
                showLimit: 12
            }
        }
    }

    searchHandler = (event) => {
        const searchQuery = event.target.value
        this.setState({
            searchQuery: searchQuery
        })
        
        // Clear the timeout if it has already been set.
        // This will prevent the previous task from executing
        // if it has been less than <MILLISECONDS>
        clearTimeout(timeout)

        timeout = setTimeout(() => {
            this.getStreamsHandler(searchQuery, 12)
            this.getGamesHandler(searchQuery, 12)
            this.getChannelsHandler(searchQuery, 12)
        }, 1000)
    }

    loadMoreHandler = (props) => {
        const { category, query, total, limit } = props
        if (category === "streams") {
            if (total > limit) {
                return <button className="btn load-more" onClick={() => this.getStreamsHandler(query, limit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
            } else {
                return <div id='no-load-more-streams' />
            }   
        } else if (category === "channels") {
            if (total > limit) {
                return <button className="btn load-more" onClick={() => this.getChannelsHandler(query, limit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
            } else {
                return <div id='no-load-more-channels' />
            }
        }
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
                } else {
                    if (res.streams.length === 0 || res.streams.length === undefined) {
                        this.setState({
                            streams: {
                                ...this.state.streams,
                                list: "empty"
                            }
                        })
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
                    }
                }
            })
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                text: 'You have reached the limit of available streams',
                showCancelButton: false
            })
        }
    }

    streamsListLayout = (props) => {
        const { streamsList, error, total, limit, query } = props
        if (streamsList === null) {
            return(
                <div className="row" id="streams-list">
                   <div className="jumbotron msg" id="streams-list">
                        <i className="fas fa-tv icon"></i>
                        <p className="lead">{this.props.langPack.streams_title}</p>
                    </div> 
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="streams-list">
                    <p>{error}</p>
                </div>
            )
        } else if (streamsList === "empty") {
            return(
                <div className="row" id="streams-list">
                    <p>Looks like there is no streams</p>
                </div>
            )
        } else if (streamsList !== null) {
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
                    <this.loadMoreHandler category={"streams"} query={query} total={total} limit={limit} />
                </div>
            )
        } else {
            return(
                <div className="row" id="streams-list" />
            )
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
                    }
                }
            })
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                text: 'You have reached the limit of available games',
                showCancelButton: false
            })
        }
    }

    gamesListLayout = (props) => {
        const { gamesList, error } = props
        if (gamesList === null) {
            return(
                <div className="row" id="games-list">
                    <div className="jumbotron msg">
                        <i className="fas fa-gamepad icon"></i>
                        <p className="lead">{this.props.langPack.games_title}</p>
                    </div>
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="games-list">
                    <p>{error}</p>
                </div>
            )
        } else if (gamesList === "empty") {
            return(
                <div className="row" id="games-list">
                    <p>Looks like there is no games</p>
                </div>
            )
        } else if(gamesList !== null) {
            const list = gamesList.map((res, i) => {
                return  <GameCard 
                            key={i} 
                            img={res.box.large} 
                            title={res.name}
                            langPackOthers={this.props.langPackOthers}
                        />
            })
            return(
                <div className="row" id="games-list">
                    {list}
                </div>
            )
        } else {
            return(
                <div className="row" id="games-list" />
            )
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
                } else {
                    if (res.channels.length === 0 || res.channels.length === undefined) {
                        this.setState({
                            channels: {
                                ...this.state.channels,
                                error: "empty"
                            }
                        })
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
                    }
                }
            })
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                text: 'You have reached the limit of available channels',
                showCancelButton: false
            })
        }
    }

    channelsListLayout = (props) => {
        const { channelsList, error, total, limit, query } = props
        if (channelsList === null) {
            return(
                <div className="row" id="channels-list">
                    <div className="jumbotron msg">
                        <i className="fas fa-heart icon"></i>
                        <p className="lead">{this.props.langPack.channels_title}</p>
                    </div>
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="channels-list">
                    <p>{error}</p>
                </div>
            )
        } else if (channelsList === null || channelsList === undefined) {
            return(
                <div className="row" id="channels-list">
                    <p>Looks like there is no channels</p>
                </div>
            )
        } else if (channelsList !== null) {
            const list = channelsList.map((res, i) => {
                return <ChannelCard key={i} 
                            channelId={res._id} 
                            channelName={res.display_name} 
                            logo={res.logo}
                            banner={res.profile_banner}
                            description={res.description}
                        />
            })
            return(
                <div className="row" id="channels-list">
                    {list}
                    <this.loadMoreHandler category={"channels"} query={query} total={total} limit={limit} />
                </div>
            )
        } else {
            return(
                <div className="row" id="channels-list" />
            )
        }
    }

    render() {
        console.log(this.state)
        return(
            <div id="search">
                <div className="container">
                    <h1 className="page-title">{this.props.langPack.title}</h1>
                    <input type="text" id="search-input" className="form-control" placeholder={this.props.langPack.title + "..."} onChange={this.searchHandler} />
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
                            <this.streamsListLayout 
                                streamsList={this.state.streams.list} 
                                error={this.state.streams.error} 
                                total={this.state.streams.total} 
                                limit={this.state.streams.showLimit} 
                                query={this.state.searchQuery}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="games" role="tabpanel" aria-labelledby="games-tab">
                        <div className="container games-list">
                            <this.gamesListLayout 
                                gamesList={this.state.games.list} 
                                error={this.state.games.error} 
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="channels" role="tabpanel" aria-labelledby="channels-tab">
                        <div className="container channels-preview">
                            <this.channelsListLayout 
                                channelsList={this.state.channels.list} 
                                error={this.state.channels.error} 
                                total={this.state.channels.total}
                                limit={this.state.channels.showLimit}
                                query={this.state.searchQuery}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}