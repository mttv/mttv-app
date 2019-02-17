import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import SideBar from '../layouts/MultiStream/SideBar'
import ActiveStreamsLayout from '../layouts/MultiStream/ActiveStreamsLayout'

let timeout = null

export default class MultiStream extends Component {

    constructor(props) {
        super(props)
        this.state = {
            searchQuery: "",
            playing: false,
            muted: true,
            volume: 0,
            showCounter: 0,
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

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showCounter !== nextState.showCounter || this.state.searchQuery !== nextState.searchQuery) {
            return true
        } else {
            return false
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
                this.setState({showCounter: this.state.showCounter + 1})
            } else {
                if (res._total === 0) {
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
    
    onDragStart = () => {
        if (this.state.activeStreams.length >= 0 && this.state.activeStreams.length !== 4) {
            $(".drop-container").removeClass("hidden")
            $("#streams-container").addClass("hidden")
        }
        // this.setState({
        //     muted: true
        // })
    }

    onDragEnd = (res) => {
        // this.setState({
        //     muted: false
        // })
        console.log(res)
        const { destination, source } = res
        const activeStreams = this.state.activeStreams
        if (!destination || destination.droppableId === "search-container") {
            if (activeStreams.length !== 0) {
                $(".drop-container").addClass("hidden")
                $("#streams-container").removeClass("hidden")
                $("#streams-container").removeClass("hidden")
            }
        } else if(destination.droppableId === "drop-container") {
            if (activeStreams.length === 4) {
                if (activeStreams.length !== 0) {
                    $(".drop-container").addClass("hidden")
                    $("#streams-container").removeClass("hidden")
                    $("#streams-container").removeClass("hidden")
                }
            } else {
                const channelId = this.state.streams.list[source.index].channel._id
                const streamId = this.state.streams.list[source.index]._id
                this.props.api.streams.channel({channelID: channelId }, (err, res) => {
                    if (err) {
                        const Alert = withReactContent(Swal)
                        Alert.fire({
                            type: 'error',
                            title: 'Oops there is an error!',
                            text: JSON.stringify(err),
                            showCancelButton: false
                        })
                    } else {
                        this.setState(prevState =>({
                            activeStreams: [...prevState.activeStreams, res]
                        }))
                        this.setState({showCounter: this.state.showCounter + 1})
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
                        streams={this.state.streams}
                        query={this.state.searchQuery} 
                        searchHandler={this.searchHandler}
                        searchQuery={this.state.searchQuery}
                        totalFollowing={this.state.streams.total}
                        searchTitle={this.props.langPack.search_title}
                    />
                    <div id="open-search-bar" className="btn stream-search-btn"><i className="fas fa-search search-icon"></i><i className="fas fa-chevron-right close-icon"></i></div>
                    <ActiveStreamsLayout 
                        streams={this.state.activeStreams} 
                        playing={this.state.playing}
                        volume={this.state.volume}
                        muted={this.state.muted}
                    />
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