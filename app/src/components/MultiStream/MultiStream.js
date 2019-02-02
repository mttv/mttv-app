import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import SideBar from './SideBar'
import Card from './Card'
import DraggablePlayer from './DraggablePlayer'

let timeout = null

export default class MultiStream extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchQuery: "",
            playing: true,
            volume: 0,
            muted: true,
            activeStreams: [],
            streams: {
                list: null,
                error: false,
                total: 0,
                showLimit: 12
            }
        }
    }

    componentDidMount() {
        this.getFollowingStream(100)
        $("#open-search-bar").on("click", function () {
            $("#sidebar").toggleClass("active")
            $(".stream-search-btn").toggleClass("active")
            $(".stream-search-btn .search-icon").toggleClass("hide")
            $(".stream-search-btn .close-icon").toggleClass("active")
        })
        if (this.state.activeStreams.length === 0) {
            $(".drop-container").removeClass("hidden")
            $("#streams-container").fadeOut()
        }
    }

    searchHandler = (event) => {
        let searchQuery = event.target.value
        this.setState({
            searchQuery: searchQuery
        })
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            this.getStreamsHandler(searchQuery, 12)
        }, 1000)
    }

    ActiveStreamsHandler = (props) => {
        const { streams } = props
        const darkMode = localStorage.getItem("darkMode")
        let darkChat
        darkMode ? darkChat = "?darkpopout" :  darkChat = ""
        const streamUrl = "https://www.twitch.tv/"
        let chatUrl = "https://www.twitch.tv/embed/"
        const countStreams = streams.length
        let ShowStreams
        let firstStream
        let others
        switch (countStreams) {
            case 1: 
                ShowStreams = () => {
                    return(
                        <div className="container-fluid" style={{margin: "0 auto", width: "85%"}}>
                            <div className="row" style={{width: "100%"}}>
                                <div className="col-8">
                                    <DraggablePlayer 
                                        url={streamUrl + streams[0].stream.channel.name} 
                                        playing={this.state.playing} 
                                        volume={this.state.volume}
                                        muted={this.state.muted} 
                                />
                                </div>
                                <div className="col-4" style={{marginBottom: "20px"}}>
                                    <div className="container-block" style={{height: "100%"}}>
                                        <webview style={{height: "100%"}}
                                            src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                        </webview>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                break
            case 2: ShowStreams = () => {
                return(
                    <div className="container-fluid" style={{margin: "0 auto", width: "75%"}}>
                        <div className="row" style={{width: "100%"}}>
                            <div className="col-8">
                                <DraggablePlayer 
                                    url={streamUrl + streams[0].stream.channel.name} 
                                    playing={this.state.playing} 
                                    volume={this.state.volume}
                                    muted={this.state.muted} 
                                />
                            </div>
                            <div className="col-4" style={{marginBottom: "20px"}}>
                                <div className="container-block" style={{height: "100%"}}>
                                    <webview style={{height: "100%"}}
                                        src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                    </webview>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{width: "100%"}}>
                            <div className="col-8">
                                <DraggablePlayer 
                                    url={streamUrl + streams[1].stream.channel.name} 
                                    playing={this.state.playing} 
                                    volume={this.state.volume}
                                    muted={this.state.muted} 
                                />
                            </div>
                            <div className="col-4" style={{marginBottom: "20px"}}>
                                <div className="container-block" style={{height: "100%"}}>
                                    <webview style={{height: "100%"}}
                                        src={chatUrl + streams[1].stream.channel.name + "/chat"  + darkChat}>
                                    </webview>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
                break
            case 3:
                firstStream = streams.slice(0, 1)
                others = streams.slice(1, 3)
                others = others.map((res, i) => {
                    return (
                        <DraggablePlayer
                            key={i} 
                            styleClass={"col"} 
                            url={streamUrl + res.stream.channel.name} 
                            playing={this.state.playing} 
                        />
                    )
                })
                ShowStreams = () => {
                    return(
                        <div className="containe-fluid" style={{margin: "0 auto", width: "80%"}}>
                            <div className="row" style={{width: "100%"}}>
                                <div className="col-8">
                                    <DraggablePlayer
                                        url={streamUrl + firstStream[0].stream.channel.name} 
                                        playing={this.state.playing} 
                                        volume={this.state.volume}
                                        muted={this.state.muted}
                                    />
                                </div>
                                <div className="col-4" style={{marginBottom: "20px"}}>
                                    <div className="container-block" style={{height: "100%"}}>
                                        <webview style={{height: "100%"}}
                                            src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                        </webview>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {others}
                            </div>
                        </div>
                    )
                }
                break
            case 4:
                let streams_1 = streams.slice(0, 2)
                let streams_2 = streams.slice(2, 4)
                streams_1 = streams_1.map((res, i) => {
                    return (
                        <DraggablePlayer
                            key={i} 
                            styleClass={"col"} 
                            url={streamUrl + res.stream.channel.name} 
                            playing={this.state.playing} 
                        />
                    )
                })
                streams_2 = streams_2.map((res, i) => {
                    return (
                        <DraggablePlayer
                            key={i} 
                            styleClass={"col"} 
                            url={streamUrl + res.stream.channel.name} 
                            playing={this.state.playing} 
                        />
                    )
                })
                ShowStreams = () => {
                    return(
                        <div className="container-fluid" style={{margin: "0 auto", width: "86%"}}>
                            <div className="row" style={{width: "100%"}}>
                                {streams_1}
                            </div>
                            <div className="row" style={{width: "100%"}}>
                                {streams_2}
                            </div>
                        </div>
                    )
                }
                break
            default: ShowStreams = () => { return <div /> }
                break
        }
        return (
            <div id="streams-container">
                <ShowStreams />
            </div>
        )
    }

    getFollowingStream = (limit) => {
        const token = sessionStorage.getItem("token")
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

    streamsListLayout = () => {
        const { list, error } = this.state.streams
        if (list === null) {
            return(
                <div className="row" id="streams-list"></div>
            )
        } else if (error) {
            return(
                <div className="row" id="streams-list">
                    <p>{error}</p>
                </div>
            )
        } else if (list === "empty") {
            return(
                <div className="row" id="streams-list">
                    <p>Looks like there is no streams</p>
                </div>
            )
        } else if (list !== null) {
            return(
                <Droppable droppableId="search-container">
                    {(provided, snapshot) => (
                        <ul className="list-group"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {list.map((res, i) => <Card key={i} res={res} index={i} langPackOthers={this.props.langPackOthers} />)}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            )
        } else {
            return(
                <div className="row" id="streams-list" />
            )
        }
    }

    followingListLayout = () => {
        const { list, error } = this.state.streams
        if (list === null) {
            return(
                <div className="row" id="following-list"></div>
            )
        } else if (error) {
            return(
                <div className="row" id="following-list">
                    <p>{error}</p>
                </div>
            )
        } else if (list === "empty") {
            return(
                <div className="row" id="following-list">
                    <p>Looks like there is no streams</p>
                </div>
            )
        } else if (list !== null) {
            return(
                <Droppable droppableId="search-container">
                    {(provided, snapshot) => (
                        <ul className="list-group"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {list.map((res, i) => <Card key={i} res={res} index={i} />)}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            )
        } else {
            return(
                <div className="row" id="following-list" />
            )
        }
    }

    
    onDragStart = () => {
        if (this.state.activeStreams.length >= 0 && this.state.activeStreams.length !== 4) {
            $(".drop-container").removeClass("hidden")
            $("#streams-container").fadeOut()
            $("#streams-container").addClass("hidden")
        }
    }

    onDragEnd = (res) => {
        const { destination, source } = res
        const activeStreams = this.state.activeStreams
        if (!destination || destination.droppableId === "search-container") {
            if (activeStreams.length !== 0) {
                $(".drop-container").addClass("hidden")
                $("#streams-container").fadeIn()
                $("#streams-container").removeClass("hidden")
            }
        } else if(destination.droppableId === "drop-container") {
            if (activeStreams.length === 4) {
                if (activeStreams.length !== 0) {
                    $(".drop-container").addClass("hidden")
                    $("#streams-container").fadeIn()
                    $("#streams-container").removeClass("hidden")
                }
            } else {
                const channelId = this.state.streams.list[source.index].channel._id
                const streamId = this.state.streams.list[source.index]._id
                this.props.api.streams.channel({channelID: channelId }, (err, res) => {
                    if (err) {
                        // console.log(err)
                    } else {
                        this.setState(prevState =>({
                            activeStreams: [...prevState.activeStreams, res]
                        }))
                        $("#" + streamId).fadeOut()
                        $(".drop-container").addClass("hidden")
                        $("#streams-container").fadeIn()
                        $("#streams-container").removeClass("hidden")
                    }
                })
            }
        }
    }

    render() {
        return(
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
            >
                <div className="multistream-container">
                    <SideBar 
                        streamsListLayout={this.streamsListLayout} 
                        followingListLayout={this.followingListLayout} 
                        streams={this.state.streams} query={this.state.searchQuery} 
                        searchHandler={this.searchHandler}
                        searchQuery={this.state.searchQuery}
                        totalFollowing={this.state.streams.total}
                        searchTitle={this.props.langPack.search_title}
                    />
                    <div id="open-search-bar" className="btn stream-search-btn"><i className="fas fa-search search-icon"></i><i className="fas fa-chevron-right close-icon"></i></div>
                    <this.ActiveStreamsHandler streams={this.state.activeStreams} />
                    <div className="drop-container hidden">
                        <div className="jumbotron">
                            <Droppable droppableId="drop-container">
                                {(provided, snapshot) => (
                                    <div id="drop-container" style={{width: "100%", height: "100%"}} ref={provided.innerRef} {...provided.droppableProps}>
                                        <i className="fas fa-arrow-circle-down drop-icon"></i>
                                        <h4>{this.props.langPack.title}</h4>
                                        {provided.placeholder}
                                    </div> 
                                )}
                            </Droppable>
                        </div>    
                    </div>
                </div>
            </DragDropContext>
        )
    }
}