import React, { Component } from 'react'
import axios from 'axios'
// import { WatchAttributes } from 'react-mutation-observer'
import $ from 'jquery'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class Connections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // d_token: localStorage.getItem("d-token") ? localStorage.getItem("d-token") : false,
            // d_usr: null
            d_rpc_status: localStorage.getItem("d-rpc") ? true : false
        }
    }

    // componentDidMount() {
    //     $("#discord-login-btn").click(() => {
    //         const loginUrl = "https://discordapp.com/api/oauth2/authorize?client_id=558341590888742914&redirect_uri=https%3A%2F%2Fmttvapp.com%2Foauth2%2Fdiscord&response_type=code&scope=identify%20email%20rpc%20rpc.api%20rpc.notifications.read"
    //         $("#discord-login-view-container").attr("src", loginUrl)
    //         $("#discord-login-view-container").fadeIn()
    //         $("#close-dis-login").fadeIn()
    //     })

    //     $("#close-dis-login").click(() => {
    //         $("#discord-login-view-container").fadeOut()
    //         $("#close-dis-login").fadeOut()
    //     })
    //     if (this.state.d_token) {
    //         this.discordUserHandler(this.state.d_token)
    //     } else {
    //         localStorage.removeItem("d-token")
    //         localStorage.removeItem("did")
    //     }
    // }

    componentDidMount() {
        window.require('electron').ipcRenderer.on("discord-rpc-status", (event, res) => {
            console.log(res)
            if (res) {
                localStorage.setItem("d-rpc", true)
                this.setState({d_rpc_status: true})
            } else {
                localStorage.removeItem("d-rpc")
                this.setState({d_rpc_status: false})
                // this.discordRPCHandler(true)
            }
        })
    }

    discordAuthHandler = (token) => {
        let data = {
            client_id: "",
            client_secret: "",
            grant_type: "authorization_code",
            code: token,
            redirect_uri: "https://mttvapp.com/oauth2/discord",
            scope: "identify email rpc rpc.api rpc.notifications.read"
        }
        data = $.param(data)
        axios({
            method: 'post',
            url: 'https://discordapp.com/api/oauth2/token',
            data: data,
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
            })
            .then(r => {
                localStorage.setItem("d-token", r.data.access_token)
                this.discordUserHandler(r.data.access_token)
            })
            .catch(e => console.log(e))
    }

    discordUserHandler = (token) => {
        axios({
            method: "get",
            url: "https://discordapp.com/api/users/@me",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(r => {
            localStorage.setItem("did", r.data.id)
            this.setState({
                d_usr: r.data
            })
        })
        .catch(e => console.log(e))
    }

    discordRPCHandler = () => {
        main.authDiscordRPC(true)
    }

    discordLayout = (props) => {
        const { dUsr } = props
        if (dUsr) {
            return(
                <div className="jumbotron discord p-0 d-flex align-items-center justify-content-center shadow-sm">
                    <p className="lead m-2  d-flex align-items-center justify-content-center text-white"><i className="fab fa-discord h4 mt-3 mr-3"></i> {this.props.langPack.discord.status_connected}</p>
                </div>
            )
        } else {
            return(
                <div className="jumbotron discord p-1 d-flex align-items-center justify-content-center shadow-sm">
                    <p className="lead m-2 d-flex align-items-center justify-content-center text-white"><i className="fab fa-discord h4 mr-3 mt-2"></i> <button id="discord-login-btn" onClick={this.discordRPCHandler} className="btn btn-outline-light p-1">{this.props.langPack.discord.btn_connect}</button></p>
                </div>
            )
        }
    }

     getParameterByName = (name, url) => {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    render() {
        return(
            <div className="tab-pane fade card-settings" id="connections" role="tabpanel" aria-labelledby="list-connections">
                <h5>{this.props.langPack.title}</h5>
                <p>{this.props.langPack.sub_title}</p>
                <div className="jumbotron twitch p-1 d-flex align-items-center justify-content-center shadow-sm mt-4">
                    <p className="lead m-2 text-white"><i className="fab fa-twitch mt-2 mr-2"></i> {sessionStorage.getItem("userName")}</p>
                </div>
                <this.discordLayout dUsr={this.state.d_rpc_status} />
                {/* <WatchAttributes onChange={(res) => {
                    if (res.name === "src") {
                        console.log(res.to)
                        const token = this.getParameterByName("code", res.to)
                        if (token) {
                            $("#discord-login-view-container").fadeOut()
                            $("#close-dis-login").fadeOut()
                            this.discordAuthHandler(token)
                        }
                    }
                }}>
                    <webview id="discord-login-view-container" webpreferences="javascript=yes" />
                </WatchAttributes> */}
                {/* <div id="close-dis-login"><i className="fas fa-window-close"></i></div> */}
            </div>
        )
    }
}