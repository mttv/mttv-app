import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ClipsIconLight from '../../../img/clips_icon_light.svg'
import ClipsIconDark from '../../../img/clips_icon_dark.svg'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class ChannelHeader extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            followers: this.props.followers,
            views: this.props.views,
            isFollowing: this.props.isFollowing,
            isSubscribed: this.props.isSubscribed
        }
    }

    componentDidMount() {
        const w = $(window).scroll(() => {
            if (w.scrollTop() > 520) {
              $(".container-block.channel-top-header").addClass("fixed")
            } else {
              $(".container-block.channel-top-header").removeClass("fixed")
            }
        })

        $(".load-btn-group").click(() => {
            $(".btns-container").toggleClass("open")
            $(".container-block.channel-top-header .btn").toggleClass("container-open")
            $(".load-btn-group").addClass("open")
        })
        this.digitsHandler(this.state.followers, "f")
        this.digitsHandler(this.state.views, "v")
    }

    subscribeHandler = (channelName) => {
        main.subscribeWindow(channelName)
    }

    digitsHandler = (num, type) => {
        if (num >= 1000000) {
            num = (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
            if (type === "f") {
                this.setState({followers: num})
            } else {
                this.setState({views: num})
            }
         } else if (num >= 1000) {
            num = (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
            if (type === "f") {
                this.setState({followers: num})
            } else {
                this.setState({views: num})
            }
         } else {
            //  num = num
             if (type === "f") {
                this.setState({followers: num})
            } else {
                this.setState({views: num})
            }
         }
    }

    followHandler = () => {
        const Alert = withReactContent(Swal)
        const body = {
            type: 'error',
            title: 'Oops!There seems to be an error, please try again later.',
            showCancelButton: false
        }
        const userId = sessionStorage.getItem("userId")
        const token = sessionStorage.getItem("token")
        this.props.api.users.followChannel({auth: token, userID: userId, channelID: this.props.channelId}, (err, res) => {
            if (err) {
                Alert.fire(body)
            } else {
                if (res.statusCode !== 204 || res.statusCode !== 422) {
                    this.setState({isFollowing: true})
                } else {
                    Alert.fire(body)
                }
            }
        })
    }

    unfollowHandler = () => {
        const Alert = withReactContent(Swal)
        const userId = sessionStorage.getItem("userId")
        const token = sessionStorage.getItem("token")
        Alert.fire({
            type: 'question',
            html: this.props.unfollowAlert.message + '<b>' + this.props.name +'</b>?',
            showCancelButton: true,
            confirmButtonColor: '#cc0000',
            cancelButtonText: this.props.unfollowAlert.cancel_btn,
            confirmButtonText: this.props.unfollowAlert.confirm_btn
        }).then((res) => {
            if(res.dismiss === "cancel") {
            } else if(res.value === true) {
                this.props.api.users.unfollowChannel({auth: token, userID: userId, channelID: this.props.channelId}, (err, res) => {
                    this.setState({isFollowing: false})
                })      
            }
        })
    }

    actionsLayout = () => {
        const userId = sessionStorage.getItem("userId")
        const channelId = this.props.channelId
        const SubscribeBtns = () => {
            if (this.props.partner) {
                if (this.state.isSubscribed) {
                    return <button onClick={() => this.subscribeHandler(this.props.linkname)} className="btn subscribe true">{this.props.langPack.subscribe_btn_2}</button>
                } else {
                    return <button onClick={() => this.subscribeHandler(this.props.linkname)} className="btn subscribe">{this.props.langPack.subscribe_btn} <i className="fas fa-dollar-sign"></i></button>
                }
            } else {
                return <div id="no-partner-btn" />
            }
        }
        if (userId !== channelId) {
            return(
                <div className="btns-container">
                    {this.state.isFollowing ? <button onClick={this.unfollowHandler} className="btn following true"><div><i className="fas fa-heart"></i></div></button> : <button onClick={this.followHandler} className="btn following">{this.props.langPack.follow_btn}</button>}
                    <SubscribeBtns />
                </div>
            )   
        } else {
            return <div className="btns-container" />
        }
    }

    render() {
        return(
            <div id="channel-header">
            <div className="container-block" style={{boxShadow: "none", marginBottom: "0", position: "relative"}}>
                <div className="channel-img-shadow" />
                <div 
                    style={{backgroundImage: "url(" + this.props.profileBanner + ")" }} 
                    className="img-fluid profile-banner"
                />
            </div>
            <div className="container-block channel-top-header shadow">
                <ul className="channel-top-nav">
                    <li onClick={() => this.props.navLayout("#stream")} className="short-info">
                        <img src={this.props.logo} className="profile-logo channel-header" alt={this.props.name} />
                        <span>{this.props.name}</span>
                    </li>
                    {this.props.partner ? <li className="verified-icon" /> : <li style={{padding: "0"}} />}
                    <li className="nav-option"><i className="fas fa-users"></i> <span>{this.state.followers}</span></li>
                    <li className="nav-option"><i className="fas fa-eye"></i> <span>{this.state.views}</span></li>
                    <li onClick={() => this.props.navLayout("#videos")} className="nav-option"><i className="fas fa-video"></i> <span>{this.props.videosTotal}</span></li>
                    <li onClick={() => this.props.navLayout("#clips")} className="nav-option"><img src={localStorage.getItem("darkMode") ? ClipsIconLight : ClipsIconDark} alt="" className="clips-icon" /> <span>0</span></li>
                </ul>
                <div className="btns-group">
                    <this.actionsLayout />
                </div>
            </div>
        </div>
        )
    }
}