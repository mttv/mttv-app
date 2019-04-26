import React, { Component } from 'react'
import $ from 'jquery'
import { WatchAttributes } from 'react-mutation-observer'
import IntroBg from '../components/WelcomeIntro/index'
import CONFIG from '../../config'
// import Intro from '../components/Login/Intro'

export default class Login extends Component {

  componentDidMount() {
    $("#close-login").click(() => {
      $("#login-view-container").fadeOut()
      $("#close-login").fadeOut()
    })

    $("#log-in-btn").click(() => {
      const loginUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CONFIG.TWITCH_API_PRIVATE_KEY}&response_type=token&force_verify=true&redirect_uri=https://mttv.github.io/&scope=channel_check_subscription+channel_subscriptions+channel_editor+user_read+user_follows_edit`
      $("#login-view-container").attr("src", loginUrl)
      $("#login-view-container").fadeIn()
      $("#close-login").fadeIn()
    })
  }

  render() {
    return(
      <div className="welcome-container">
        <IntroBg />
        <div id="close-login"><i className="fas fa-window-close"></i></div>
        <WatchAttributes onChange={(res) => {
          if (res.name === "src") {
            this.props.layoutHandler(res.to)
          }
        }}>
        <webview id="login-view-container" webpreferences="javascript=yes" />
        </WatchAttributes>
        <div className="welcome-start">
          <div id="logo-intro" className="logo">
            <img src="logo.png" alt="Twitch Player" />
          </div><br />
          <div id="btns-intro">
            <button id="log-in-btn" className="btn twitch-log-in"><span>{this.props.langPack.login_btn}</span><i className="fab fa-twitch icon"></i></button><br />
          </div>
        </div>
        {/* <Intro layoutHandler={this.props.layoutHandler} langPack={this.props.langPack} /> */}
      </div>
    )
  }
}
