import React, { Component } from 'react'
import $ from 'jquery'
import StreamPreviewCard from '../Watch/StreamPreviewCard'
import GameCard from '../Games/GameCard'
import ChannelCard from '../Channel/ChannelCard'

export default class Following extends Component {

    constructor(props) {
        super(props)
        this.state = {
            streams: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0
            },
            follows: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0
            },
            gamesLive: {
                list: null,
                error: false,
                showLimit: 12,
                total: 0
            }
        }
    }

    componentDidMount() {
        this.streamsHandler(12)
        this.followsHandler(12)
        // this.followedHostingHandler()
        this.gamesLiveHandler(12)
    }

    componentDidUpdate() {
        $('#loaded').ready(() => {
            $('#loaded').fadeIn()
        })
    }

    loadMoreHandler = (props) => {
        const { category, total, limit } = props
        if (category === "streams") {
            if (total > limit) {
                return <button className="btn load-more" onClick={() => this.streamsHandler(limit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
            } else {
                return <div id='no-load-more-streams' />
            }   
        } else if (category === "follows") {
            if (total > limit) {
                return <button className="btn load-more" onClick={() => this.followsHandler(limit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
            } else {
                return <div id='no-load-more-follows' />
            }
        } else if (category === "gamesLive") {
            if (total > limit) {
                return <button className="btn load-more" onClick={() => this.gamesLiveHandler(limit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
            } else {
                return <div id='no-load-more-games-live' />
            } 
        }
    }

    streamsHandler = (limit) => {
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
                }
            }
        })
    }

    streamsListLayout = (props) => {
        const { streamsList, error, showLimit, total } = props
        if (streamsList === null) {
            return(
                <div className="row" id="streams-list">
                    <p>Start Searching for streams)</p>
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="streams-list">
                    <p>{error}</p>
                </div>
            )
        } else if (streamsList === "") {
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
                    <this.loadMoreHandler category={"streams"} total={total} limit={showLimit} />
                </div>
            )
        } else {
            return(
                <div className="row" id="streams-list" />
            )
        }
    }

    followsHandler = (limit) => {
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
                }
            }
        })	
    }

    followsListLayout = (props) => {
        const { channelsList, error, showLimit, total } = props
        if (channelsList === null) {
            return(
                <div className="row" id="channels-list">
                    <p>Start Searching for channels)</p>
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="channels-list">
                    <p>{error}</p>
                </div>
            )
        } else if (channelsList === "") {
            return(
                <div className="row" id="channels-list">
                    <p>Looks like there is no channels</p>
                </div>
            )
        } else if (channelsList !== null) {
            const list = channelsList.map((res, i) => {
                return <ChannelCard key={i} 
                            channelId={res.channel._id} 
                            channelName={res.channel.display_name} 
                            logo={res.channel.logo}
                            banner={res.channel.profile_banner}
                            description={res.channel.description}
                        />
            })
            return(
                <div className="row" id="channels-list">
                    {list}
                    <this.loadMoreHandler category={"follows"} total={total} limit={showLimit} />
                </div>
            )
        } else {
            return(
                <div className="row" id="channels-list" />
            )
        }
    }

    gamesLiveHandler = (limit) => {
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
                }
            }
        })
    }

    gamesLiveListLayout = (props) => {
        const { gamesList, error, showLimit, total } = props
        if (gamesList === null) {
            return(
                <div className="row" id="games-list">
                    <p>Start Searching for games)</p>
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="games-list">
                    <p>{error}</p>
                </div>
            )
        } else if (gamesList === "") {
            return(
                <div className="row" id="games-list">
                    <p>Looks like there is no games</p>
                </div>
            )
        } else if(gamesList !== null) {
            const list = gamesList.map((res, i) => {
                return <GameCard 
                            key={i} 
                            viewers={res.viewers} 
                            img={res.game.box.large} 
                            title={res.game.name} 
                            langPackOthers={this.props.langPackOthers} 
                        />
            })
            return(
                <div className="row" id="games-list">
                    {list}
                    <this.loadMoreHandler category={"gamesLive"} total={total} limit={showLimit} />
                </div>
            )
        } else {
            return(
                <div className="row" id="games-list" />
            )
        }
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
                            <this.streamsListLayout 
                                streamsList={this.state.streams.list} 
                                error={this.state.streams.error}
                                total={this.state.streams.total}
                                showLimit={this.state.streams.showLimit}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="channels" role="tabpanel" aria-labelledby="channels-tab">
                        <div className="container channels-preview">
                            <this.followsListLayout 
                                channelsList={this.state.follows.list} 
                                error={this.state.follows.error}
                                total={this.state.follows.total}
                                showLimit={this.state.follows.showLimit}
                            />
                        </div>
                    </div>
                    <div className="tab-pane fade" id="gameslive" role="tabpanel" aria-labelledby="gameslive-tab">
                        <div className="container games-list">
                            <this.gamesLiveListLayout 
                                gamesList={this.state.gamesLive.list} 
                                error={this.state.gamesLive.error} 
                                total={this.state.gamesLive.total}
                                showLimit={this.state.gamesLive.showLimit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}