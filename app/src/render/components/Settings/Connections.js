import React, { Component } from 'react'
import axios from 'axios'
import { WatchAttributes } from 'react-mutation-observer'
import $ from 'jquery'

const { Client } = require('discord.js')
const client = new Client()
client.login("NTU4MzQxNTkwODg4NzQyOTE0.XJ9SlA.PFVxktE95JnwxkZ-R_xAaeyeaNU")

export default class Connections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            d_token: localStorage.getItem("d-token") ? true : false,
            d_usr: null
        }
    }

    componentDidMount() {
        $("#discord-login-btn").click(() => {
            const loginUrl = "https://discordapp.com/api/oauth2/authorize?client_id=558341590888742914&redirect_uri=https%3A%2F%2Fmttvapp.com%2Foauth2%2Fdiscord&response_type=code&scope=identify"
            $("#discord-login-view-container").attr("src", loginUrl)
            $("#discord-login-view-container").fadeIn()
            $("#close-dis-login").fadeIn()
        })

        $("#close-dis-login").click(() => {
            $("#discord-login-view-container").fadeOut()
            $("#close-dis-login").fadeOut()
        })
        if (this.state.d_token) {
            this.discordUserHandler(localStorage.getItem("d-token"))
        }
    }

    discordAuthHandler = (token) => {
        let data = {
            client_id: "558341590888742914",
            client_secret: "xdKKmz5va-ZNV0Wz4HpubHBkloJkFHef",
            grant_type: "authorization_code",
            code: token,
            redirect_uri: "https://mttvapp.com/oauth2/discord",
            scope: "identify"
        }
        data = $.param(data)
        axios({
            method: 'post',
            url: 'https://discordapp.com/api/oauth2/token',
            data: data,
            headers: {
              'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
          }).then(r => this.discordUserHandler(r.data.access_token))
          .catch(e => console.log(e))
    }

    discordUserHandler = (token) => {
        axios({
            method: "get",
            url: "https://discordapp.com/api/users/@me",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(r => console.log(r))
        .catch(e => console.log(e))
    }

    discordLayout = (props) => {
        const { dUsr } = props
        if (dUsr) {
            return(
                <div className="jumbotron discord p-2 d-flex align-items-center justify-content-center shadow-sm">
                    <p className="lead m-2  d-flex align-items-center justify-content-center"><i className="fab fa-discord h4 mt-2 mr-3"></i> <small>USER_NAME</small></p>
                </div>
            )
        } else {
            return(
                <div className="jumbotron discord p-2 d-flex align-items-center justify-content-center shadow-sm">
                    <p className="lead m-2 d-flex align-items-center justify-content-center"><i className="fab fa-discord h4 mr-3 mt-2"></i> <button id="discord-login-btn" className="btn btn-outline-light p-1">Connect</button></p>
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
                <h5>Connections</h5>
                <p>Connect this accounts and unlock special integrations with MTTV.</p>
                <div className="jumbotron twitch p-2 d-flex align-items-center justify-content-center shadow-sm mt-4">
                    <p className="lead m-2"><i className="fab fa-twitch mt-2 mr-2"></i> {sessionStorage.getItem("userName")}</p>
                </div>
                <this.discordLayout dUsr={this.state.d_usr} />
                <WatchAttributes onChange={(res) => {
                    if (res.name === "src") {
                        console.log(res.to)
                        const token = this.getParameterByName("code", res.to)
                        if (token) {
                            $("#discord-login-view-container").fadeOut()
                            $("#close-dis-login").fadeOut()
                            this.setState({d_token: true})
                            this.discordAuthHandler(token)
                        }
                    }
                }}>
                    <webview id="discord-login-view-container" webpreferences="javascript=yes" />
                </WatchAttributes>
                <div id="close-dis-login"><i className="fas fa-window-close"></i></div>
            </div>
        )
    }
}