import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Icon from '../../../img/icon.png'
import LiveIcon from '../../../img/live.png'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class FollowingNav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            streams: {
                list: null,
                error: false,
                showLimit: 100,
                total: 0,
            },
            showCounter: 0
        }
    }

    componentDidMount() {
        this.streamsHandler(100)
        setInterval(() => {
            this.streamsHandler(100)
        }, 1000 * 60)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showCounter !== nextState.showCounter) {
            return true
        } else {
            return false
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
                this.setState({showCounter: this.state.showCounter + 1})
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
                    this.setState({showCounter: this.state.showCounter + 1})
                }
            }
        })
    }

    streamsListLayout = (props) => {
        const { streamsList, error } = props
        if (streamsList === null) {
            return(
                <ul className="dropdown mt-3">
                    <p>Start Searching for streams)</p>
                </ul>
            )
        } else if (error) {
            return(
                <ul className="dropdown mt-3">
                    <p>error</p>
                </ul>
            )
        } else if (streamsList === "") {
            return(
                <ul className="dropdown mt-3">
                    <p>Looks like there is no streams</p>
                </ul>
            )
        } else if (streamsList !== null) {
            const list = streamsList.map((res, i) => {
                return <li key={i} >
                            <NavLink to={`/app/channel?id=${res.channel._id}`} activeClassName="active" className="btn nav-link">
                                <img className="following-nav-avatar" src={res.channel.logo} alt="" />
                            </NavLink>
                            <div className="following-live-card-info"></div>
                        </li>
                // return <StreamPreviewCard 
                //     key={i}
                //     channelId={res.channel._id}
                //     game={res.game} 
                //     type={res.stream_type} 
                //     previewImg={res.preview.large}
                //     logoImg={res.channel.logo}
                //     title={res.channel.status}
                //     channelName={res.channel.display_name}
                //     viewers={res.viewers}
                //     langPackOthers={langPackOthers}
                // />
            })
            return(
                <ul className="dropdown mt-3">
                    <h6 className="nav-icon">Live <img src={LiveIcon} alt="" /></h6>
                    {list}
                </ul>
            )
        } else {
            return(
                <ul className="dropdown mt-3" />
            )
        }
    }

    twitchHandler = () => {
        main.twitchWindow()
    }

    render() {
        return(
            <div id="main-nav" className="shadow-sm">
                <ul className="dropdown mt-3">
                    <div className="nav-icon mttv"><img src={Icon} alt="" /><hr className="m-0 w-50 d-block m-auto" /></div>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.home}><NavLink to="/app/home" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-home menu-icon"></i></NavLink></li>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.search}><NavLink to="/app/search" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-search menu-icon"></i></NavLink></li>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.multistream}><NavLink to="/app/multistream" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-window-restore menu-icon"></i></NavLink></li>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.games}><NavLink to="/app/games" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-gamepad menu-icon"></i></NavLink></li>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.watch}><NavLink to="/app/watch" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-tv menu-icon"></i></NavLink></li>
                    {this.state.streams.list ? <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.following}><NavLink to="/app/following" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-heart menu-icon"></i></NavLink></li> : <li />}
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.notifications}><NavLink to="/app/notifications" activeClassName="active" className="btn nav-btn nav-link"><i className="fas fa-bell menu-icon"></i></NavLink></li>
                    <li data-toggle="tooltip" data-placement="right" title="twitch"><div onClick={this.twitchHandler} className="btn nav-btn"><i className="fab fa-twitch menu-icon"></i></div></li>
                    <li data-toggle="tooltip" data-placement="right" title={this.props.langPack.settings}><div className="btn nav-btn" data-toggle="modal" data-target="#settings-modal"><i className="fas fa-cog menu-icon"></i></div></li>
                </ul>
                <this.streamsListLayout streamsList={this.state.streams.list} error={this.state.streams.error} />
            </div>
        )
    }
}