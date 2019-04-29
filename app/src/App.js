import React, { Component, Suspense, lazy } from 'react'
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom"
// import Analytics from 'electron-google-analytics'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import $ from 'jquery'
//conf with api keys
import CONFIG from './config'
//Compenents that are rendering all the time
import FollowingNav from './render/components/Navs/FollowingNav'
import Login from './render/pages/Login'
import SettingsModal from './render/components/Settings/SettingsModal'
import OfflineAlert from './render/components/Alerts/OfflineAlert'
import UpdatingAlert from './render/components/Alerts/UpdatingAlert'
import icon from './img/icon.png'
import './libs/libs.css'
import './index.css'
import './App.css'
import './Media.css'

const Home = lazy(() => import('./render/pages/Home'))
const Search = lazy(() => import('./render/pages/Search'))
const Games = lazy(() => import('./render/pages/Games'))
const Watch = lazy(() => import('./render/pages/Watch'))
const Channel = lazy(() => import('./render/pages/Channel'))
const Following = lazy(() => import('./render/pages/Following'))
const Notifications = lazy(() => import('./render/pages/Notifications'))
const MultiStream = lazy(() => import('./render/pages/MultiStream'))

const remote = window.require("electron").remote
const main = remote.require("./main.js")


//twitch lib
const api = require('twitch-api-v5')
api.clientID = CONFIG.TWITCH_API_PRIVATE_KEY

//cheking user online status
const appOfflineStatusHandler = () => {
  navigator.onLine ? $("#offline-alert").hide() : $("#offline-alert").fadeIn()
}

window.addEventListener('online', appOfflineStatusHandler)
window.addEventListener('offline', appOfflineStatusHandler)

appOfflineStatusHandler()

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loginRedirect: false,
      logoutRedirect: false,
      langPack: {}
    }
  }

  componentWillMount() {
    //loading language pack depening on user settings
    this.languageHandler()
  }

  componentDidMount() {
    //checking for updates
    window.require('electron').ipcRenderer.on("app-update-message", (event, res) => {
      console.log(res)
      if (res === "Update available.") {
          if (localStorage.getItem("auto-update")) {
            main.downloadUpdate(true)
          } else {
            this.appUpdateHandler()
          }
          $("#check-for-updates-btn").removeClass("check-upd-warn disabled")
          $("#check-for-updates-btn").removeClass("check-upd-danger disabled")
          $("#check-for-updates-btn").addClass("check-upd-success disabled")
          $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_upt_available)
          setTimeout(() => {
            $("#check-for-updates-btn").removeClass("check-upd-success disabled")
            $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_upt)
          }, 1000 * 10)
      } else if (res === "Update not available.") {
          $("#check-for-updates-btn").removeClass("check-upd-success disabled")
          $("#check-for-updates-btn").addClass("check-upd-warn disabled")
          $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_no_upt)
          setTimeout(() => {
              $("#check-for-updates-btn").removeClass("check-upd-warn disabled")
              $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_upt)
          }, 5000)
      } else if (res === "Error in auto-updater.") {
          $("#check-for-updates-btn").removeClass("check-upd-success disabled")
          $("#check-for-updates-btn").addClass("check-upd-danger disabled")
          $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_upt_err)
          setTimeout(() => {
              $("#check-for-updates-btn").removeClass("check-upd-danger disabled")
              $("#check-for-updates-btn").html(this.state.langPack.settings_page.application_settings.updates.btn_upt)
          }, 5000)
      } else if (res === "Downloading update.") {
          $("#updating-alert").fadeIn()
      } else if (res === "Update downloaded.") {
          $("#download-msg-1").hide()
          $("#download-msg-2").fadeIn()
      }
    })
    window.require('electron').ipcRenderer.on("try-open-dev-tools", (event, res) => {
      if (res) {
        const option = localStorage.getItem("dev-console")
        if (option === "false" || !option) {
          window.require('electron').ipcRenderer.send("open-dev-tools", false)
        } else {
          window.require('electron').ipcRenderer.send("open-dev-tools", true)
        }
      }
    })
    this.darkModeHandler()
  }

  componentDidUpdate() {
    this.darkModeHandler()
    if (this.state.loginRedirect === true) {
      Notification.requestPermission().then((r) => {
        new Notification("MTTV", {
            "body": this.state.langPack.welcome_page.welcome_alert_msg + sessionStorage.getItem("userName") + "!",
            "icon": icon
        })
      })
    }
  }

  appUpdateHandler = () => {
    const updateAlert = withReactContent(Swal)
    updateAlert.fire({
      type: 'info',
      text: this.state.langPack.others.app_update_alert.title,
      showCancelButton: true,
      confirmButtonText: this.state.langPack.others.app_update_alert.update_btn,
      cancelButtonText: this.state.langPack.others.app_update_alert.cancel_btn,
      cancelButtonColor: '#cc0000'
    }).then((r) => {
      if (r.value === true) {
        main.downloadUpdate(true)
      }
    })
  }

  languageHandler = () => {
    const pickedLang = localStorage.getItem("language")
    if (pickedLang === "en" || !pickedLang) {
      const en = require('./languages/en.json')
      this.setState({
        langPack: en
      })
    } else if (pickedLang === "ru") {
      const ru = require('./languages/ru.json')
      this.setState({
        langPack: ru
      })     
    } else if (pickedLang === "ua") {
      const ua = require('./languages/ua.json')
      this.setState({
        langPack: ua
      })
    } else if (pickedLang === "de") {
      const de = require('./languages/de.json')
      this.setState({
        langPack: de
      })
    } else {
      const en = require('./languages/en.json')
      this.setState({
        langPack: en
      })
    }
  }

  darkModeHandler = () => {
    const darkMode = localStorage.getItem("darkMode")
    if (darkMode) {
      $("#night-mode").removeAttr("disabled")
    } else {
      $("#night-mode").attr("disabled", true)
    }
  }

  logOutHandler = () => {
    this.setState({logoutRedirect: true})
      sessionStorage.clear()
      setTimeout(() => {
        this.setState({logoutRedirect: false})
        window.location.reload()
    }, 1500)
  }

  loginHandler = (getToken) => {
    const isInApp = sessionStorage.getItem("isInApp")
    if (isInApp) {
      this.logOutHandler()
    } else {
        let token = sessionStorage.getItem("token")
        if(getToken) {
          token = getToken.split("#access_token=").pop().split("&")[0]
        } else {
          token = null
        }
        if (token !== getToken) {
          api.auth.checkToken({auth: token}, (err, res) => {
            if (err) {
              this.logOutHandler()
            } else {
              if (res.token.valid) {
                sessionStorage.setItem("token", token)
                sessionStorage.setItem("userId", res.token.user_id)
                sessionStorage.setItem("userName", res.token.user_name)
                this.setState({loginRedirect: true})
                setTimeout(() => {
                  sessionStorage.setItem("isInApp", true)
                  this.setState({loginRedirect: false})
                  window.location.reload()
                }, 1500) 
              }
            }
          }) 
        }
    }
  }

  AppLayout = () => {
    const isInApp = sessionStorage.getItem("isInApp")
    if(isInApp === "true") {
        return(
          <div id="app">
            {this.state.logoutRedirect ? <Redirect to='/' /> : <div id="no-logout-redirect" />}
            <FollowingNav api={api} langPack={this.state.langPack.menu_titles} />
              <div id="container-fade">
                <Suspense fallback={<div />}>
                  <Switch>
                    <Route 
                      path={"/"} 
                      exact 
                      component={props => <Redirect to='/app/home' />} />
                    <Route 
                      path={"/app/home"} 
                      exact 
                      component={props => <Home api={api} 
                      langPack={this.state.langPack.home_page}
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/search"} 
                      exact 
                      component={props => <Search 
                      api={api} 
                      langPack={this.state.langPack.search_page} 
                      langPackCategories={this.state.langPack.categories} 
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/multistream"} 
                      exact 
                      component={props => <MultiStream 
                      api={api} 
                      langPack={this.state.langPack.multistream_page}
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/games"} 
                      exact 
                      component={props => <Games 
                      api={api} 
                      langPack={this.state.langPack.games_page} 
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/watch"} 
                      exact 
                      component={props => <Watch 
                      api={api}
                      langPack={this.state.langPack.watch_page} 
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/channel"} 
                      component={props => <Channel 
                      api={api}
                      // discord={discord}
                      langPack={this.state.langPack.channel_page} 
                      langPackCategories={this.state.langPack.categories} 
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/following"} 
                      exact 
                      component={props => <Following 
                      api={api} 
                      langPack={this.state.langPack.following_page} 
                      langPackCategories={this.state.langPack.categories} 
                      langPackOthers={this.state.langPack.others} />} />
                    <Route 
                      path={"/app/notifications"} 
                      exact 
                      component={props => <Notifications 
                      api={api} 
                      langPack={this.state.langPack.notifications_page} />} />
                    {this.state.logoutRedirect ? <Redirect to='/' /> : <div id="no-logout-redirect"></div>}
                  </Switch>
                </Suspense>
              </div>
          </div>
        )
    } else {
      return(
        <div id="app">
          {this.state.loginRedirect ? <Redirect to='/app/home' /> : <div id="no-login-redirect"></div>}   
          <Route path={"/"} component={props => <Login 
              layoutHandler={this.loginHandler} 
              api={api}
              langPack={this.state.langPack.welcome_page}
            />} 
          />
        </div>
      )
    }
  }

  render() {
    return (
      <Router>
        <div className="container-fluid">
            <this.AppLayout />
            <SettingsModal 
              layoutHandler={this.loginHandler} 
              langPack={this.state.langPack.settings_page}
              languageHandler={this.languageHandler}
            />
            <UpdatingAlert langPack={this.state.langPack.update_page} />
            <OfflineAlert />
        </div>
      </Router>
    )
  }
}

export default App
