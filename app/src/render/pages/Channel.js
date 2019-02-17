import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ChannelHeader from '../layouts/Channel/ChannelHeader'
import Stream from '../layouts/Channel/Stream'
import ChannelVideos from '../layouts/Channel/Videos'
import ChannelClips from '../layouts/Channel/Clips'
import Description from '../layouts/Channel/Description'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class Channel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          channel: null,
          description: null,
          showCounter: 0,
          channelError: false,
          isFollowing: false,
          isSubscribed: false,
          isPlaying: localStorage.getItem("autoplay") ? true : false,
          isMuted: localStorage.getItem("mute-player") ? true : false,
          volume: parseFloat(localStorage.getItem("player-volume")),
          ableToOpenWindow: false,
          currentContainer: "#stream",
          videos: {
            list: null,
            error: false,
            showLimit: 8,
            total: 0,
            showCounter: 0
          }
        }
    }

    componentDidMount() {
        const urlString = window.location.href
        const auth = sessionStorage.getItem("token")
        const channelId = urlString.split("=").pop()
        const userId = sessionStorage.getItem("userId")
        this.getChannelHandler(channelId)
        this.checkFollowHander(userId, channelId)
        this.checkSubscriptionHandler(auth, userId, channelId)
        this.setState({ableToOpenWindow: true})
        window.require('electron').ipcRenderer.on('close-player-window', (event, res) => {
            this.setState({isPlaying: res})
            this.setState({showCounter: this.state.showCounter + 1})
        })
        setTimeout(() => {
            $('#loaded').ready(() => {
                $('#loaded').hide()
                    $('#loaded').fadeIn()
            })
        }, 500)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.showCounter !== nextState.showCounter) {
            return true
        } else {
            return false
        }
    }

    isPlayingHandler = () => {
        if (this.state.ableToOpenWindow) {
            this.setState({isPlaying: false})
            this.setState({showCounter: this.state.showCounter + 1})
            main.miniPlayer(this.state.channel.name, localStorage.getItem("mp-width"), localStorage.getItem("mp-heigth"), localStorage.getItem("mp-resizable"))
        }
    }

    getChannelHandler = (channelId) => {
        this.props.api.channels.channelByID({channelID: channelId}, (err, res) => {
            if (err) {
                this.setState({channel: null})
                this.setState({channelError: err})
                this.setState({showCounter: this.state.showCounter + 1})
            } else {
                this.setState({channelError: false})
                this.setState({channel: res})
                this.getChannelDescriptionHandler(res.name)
            }
        })
    }

    navLayout = (container) => {
        if (container === "#stream") {
            $(this.state.currentContainer).fadeOut()
            $(container).fadeIn()
            this.setState({
                currentContainer: container
            })
            this.setState({
                isPlaying: true
            })
            this.setState({showCounter: this.state.showCounter + 1})
        } else if (container === "#videos") {
            $(this.state.currentContainer).fadeOut()
            $(container).fadeIn()
            this.setState({
                currentContainer: container
            })
            this.setState({
                isPlaying: false
            })
            this.setState({showCounter: this.state.showCounter + 1})
        } else if (container === "#clips") {
            $(this.state.currentContainer).fadeOut()
            $(container).fadeIn()
            this.setState({
                currentContainer: container
            })
            this.setState({
                isPlaying: false
            })
            this.setState({showCounter: this.state.showCounter + 1})
        }
    }

    getChannelDescriptionHandler = (login) => {
        this.props.api.other.panels({channelName: login}, (err, res) => {
            if (err) {
                this.setState({channelError: err})
                this.setState({showCounter: this.state.showCounter + 1})
            } else {
                this.setState({channelError: false})
                this.setState({description: res})
                this.setState({showCounter: this.state.showCounter + 1})
                const urlString = window.location.href
                const channelId = urlString.split("=").pop()
                this.getVideosHandler(channelId, this.state.videos.showLimit)
            }
        })
    }

    checkFollowHander = (userId, channelId) => {
        this.props.api.users.checkFollow({userID: userId, channelID: channelId}, (err, res) => {
            if (err) {
                this.setState({isFollowing: false})
            } else {
                if (res.status) {
                    this.setState({isFollowing: false})
                } else {
                    this.setState({isFollowing: true})
                }
            }
        })
    }

    checkSubscriptionHandler = (auth, userId, channelId) => {
        this.props.api.users.checkSub({auth: auth, userID: userId, channelID: channelId}, (err, res) => {
            if (err) {
                this.setState({isSubscribed: false})
            } else {
                if (res.status) {
                    this.setState({isSubscribed: false})
                } else {
                    this.setState({isSubscribed: true})
                }
            }
        })
    }

    channelLayout = (props) => {
        const { channel, error, description, showCounter, isFollowing, isSubscribed } = props
        if(showCounter === 0) {
            return(
                <div className="row" id="channel">
                  <p>Loading Channel</p>
                </div>
            )
        } else if(error === false && showCounter >= 1) {
            const descriptionList = description.map((res, i) => {
               return <Description
                        title={res.data.title}
                        key={i} 
                        image={res.data.image}
                        imageLink={res.data.link} 
                        description={res.html_description} 
                    />
            })
            return(
                <div id={channel.display_name}>
                    <ChannelHeader
                        api={this.props.api}
                        channelId={channel._id}
                        profileBanner={channel.profile_banner} 
                        name={channel.display_name} 
                        linkname={channel.name}
                        logo={channel.logo} 
                        partner={channel.partner}
                        followers={channel.followers}
                        views={channel.views}
                        videosTotal={this.state.videos.total}
                        isFollowing={isFollowing}
                        isSubscribed={isSubscribed}
                        navLayout={this.navLayout}
                        langPack={this.props.langPack.header}
                        unfollowAlert={this.props.langPack.unfollow_alert}
                        langPackCategories={this.props.langPackCategories}
                    />
                    <div id="stream">
                        <Stream 
                            isPlaying={this.state.isPlaying} 
                            isMuted={this.state.isMuted}
                            volume={this.state.volume}
                            isPlayingHandler={this.isPlayingHandler} 
                            name={channel.name} 
                            status={channel.status} 
                            category={channel.game}
                            langPack={this.props.langPack.stream_options}
                        />
                        <div id="channel-description">
                            <div className="row">
                                <div className="card-columns">
                                    {descriptionList}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="videos">
                        <ChannelVideos 
                            api={this.props.api}
                            getVideosHandler={this.getVideosHandler}
                            videos={this.state.videos} 
                            langPack={this.props.langPack.videos} 
                            langPackOthers={this.props.langPackOthers} />
                    </div>
                    <div id="clips">
                        <ChannelClips 
                            api={this.props.api} 
                            langPack={this.props.langPack.clips} 
                        />
                    </div>
                </div>
            )
        }
    }

    getVideosHandler = (channelId, limit) => {
        if (limit <= 100) {
            if (this.state.showLimit !== limit) {
                this.setState({
                    videos: {
                        ...this.state.videos,
                        showLimit: limit
                    }
                })
            }
            this.props.api.channels.videos({channelID: channelId, limit: limit}, (err, res) => {
                if (err) {
                    this.setState({
                        videos: {
                            ...this.state.videos,
                            error: err
                        }
                    })
                    this.setState({showCounter: this.state.showCounter + 1})
                } else {
                    this.setState({
                        videos: {
                            ...this.state.videos,
                            total: res._total
                        }
                    })
                    this.setState({
                        videos: {
                            ...this.state.videos,
                            error: false
                        }
                    })
                    this.setState({
                        videos: {
                            ...this.state.videos,
                            list: res.videos
                        }
                    })
                    this.setState({
                        videos: {
                            ...this.state.videos,
                            showCounter: this.state.videos.showCounter + 1
                        }
                    })
                    this.setState({showCounter: this.state.showCounter + 1})
                }
            })   
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                showCancelButton: false
            })
        }
    }
    

    render() {
        return(
            <div className="container channel">
                <div id="loaded">
                    <this.channelLayout
                        showCounter={this.state.showCounter}
                        channel={this.state.channel} 
                        error={this.state.channelError}
                        description={this.state.description}
                        isFollowing={this.state.isFollowing}
                        isSubscribed={this.state.isSubscribed}
                    />
                </div>
            </div>
        )
    }
}