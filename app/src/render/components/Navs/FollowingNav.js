import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

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
                    <p>{error}</p>
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
                return <li key={i} ><NavLink to={`/app/channel?id=${res.channel._id}`} activeClassName="active" className="btn nav-link"><img className="following-nav-avatar" src={res.channel.logo} alt="" /></NavLink></li>
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
                    {list}
                </ul>
            )
        } else {
            return(
                <ul className="dropdown mt-3" />
            )
        }
    }

    render() {
        return(
            <div id="following-nav">
                <this.streamsListLayout streamsList={this.state.streams.list} error={this.state.streams.error} />
            </div>
        )
    }
}