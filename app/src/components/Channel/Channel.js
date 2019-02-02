import React, { Component } from 'react'
import $ from 'jquery'
import ChannelHeader from './ChannelHeader'
import Stream from './Stream'
import ChannelVideos from './Videos'
import ChannelClips from './Clips'
import Description from './Description'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class Channel extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          channel: null,
          description: null,
          viewers: null,
          streamInfo: null,
          communitiesList: null,
          readyToShow: false,
          channelError: false,
          isFollowing: false,
          isSubscribed: false,
          isPlaying: localStorage.getItem("autoplay") ? true : false,
          isMuted: localStorage.getItem("mute-player") ? true : false,
          volume: parseFloat(localStorage.getItem("player-volume")),
          ableToOpenWindow: false,
          currentContainer: "#stream"
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
        })
        setTimeout(() => {
            $('#loaded').ready(() => {
                $('#loaded').hide()
                    $('#loaded').fadeIn()
            })
        }, 500)
    }

    isPlayingHandler = () => {
        if (this.state.ableToOpenWindow) {
            this.setState({isPlaying: false})
            main.miniPlayer(this.state.channel.name, localStorage.getItem("mp-width"), localStorage.getItem("mp-heigth"), localStorage.getItem("mp-resizable"))
        }
    }

    getChannelHandler = (channelId) => {
        this.props.api.channels.channelByID({channelID: channelId}, (err, res) => {
            if (err) {
                this.setState({channel: null})
                this.setState({channelError: err})
            } else {
                this.setState({channelError: false})
                this.setState({channel: res})
                //profile_banner ? null
                this.getChannelDescriptionHandler(res.name)
                // this.getStreamInfoHandler(channelId)
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
        } else if (container === "#videos") {
            $(this.state.currentContainer).fadeOut()
            $(container).fadeIn()
            this.setState({
                currentContainer: container
            })
            this.setState({
                isPlaying: false
            })
        } else if (container === "#clips") {
            $(this.state.currentContainer).fadeOut()
            $(container).fadeIn()
            this.setState({
                currentContainer: container
            })
            this.setState({
                isPlaying: false
            })
        }
    }

    getChannelDescriptionHandler = (login) => {
        this.props.api.other.panels({channelName: login}, (err, res) => {
            if (err) {
                this.setState({channelError: err})
            } else {
                this.setState({channelError: false})
                this.setState({description: res})
                this.setState({readyToShow: true})
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
        const { channel, error, description, readyToShow, isFollowing, isSubscribed } = props
        if(readyToShow === false) {
            return(
                <div className="row" id="channel">
                  <p>Loading Channel</p>
                </div>
            )
        } else if(error === false && readyToShow === true) {
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

    render() {
        return(
            <div className="container channel">
                <div id="loaded">
                    <this.channelLayout
                        readyToShow={this.state.readyToShow}
                        channel={this.state.channel} 
                        // streamInfo={this.state.streamInfo}
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