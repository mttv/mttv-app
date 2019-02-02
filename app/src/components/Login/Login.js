import React, { Component } from 'react'
import $ from 'jquery'
import { WatchAttributes } from 'react-mutation-observer'
import Intro from './Intro'

export default class Login extends Component {

  componentDidMount() {
    $("#close-login").click(() => {
      $("#login-view-container").fadeOut()
      $("#close-login").fadeOut()
    })

    $("#log-in-btn").click(() => {
      const loginUrl = "https://id.twitch.tv/oauth2/authorize?client_id=lxtgfjpg12cxsvpy32vg5x7a1ie6mc&response_type=token&force_verify=true&redirect_uri=https://mttv.github.io/&scope=channel_check_subscription+channel_subscriptions+channel_editor+user_read+user_follows_edit"
      $("#login-view-container").attr("src", loginUrl)
      $("#login-view-container").fadeIn()
      $("#close-login").fadeIn()
    })
  }

  render() {
    return(
      <div className="welcome-container">
        <div id="close-login"><i className="fas fa-window-close"></i></div>
        <WatchAttributes onChange={(res) => {
          if (res.name === "src") {
            this.props.layoutHandler(res.to)
          }
        }}>
          <webview id="login-view-container" webpreferences="javascript=yes" />
        </WatchAttributes>
        <Intro layoutHandler={this.props.layoutHandler} langPack={this.props.langPack} />
      </div>
    )
  }
}
