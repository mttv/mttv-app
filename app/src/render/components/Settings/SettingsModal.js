import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Application from './Application'
import Languages from './Languages'
import Notifications from './Notifications'
import PlayerSettings from './PlayerSettings'

const remote = window.require("electron").remote
const main = remote.require("./main.js")
const win = remote.getCurrentWindow()

const pretty = require('prettysize')

export default class Settings extends Component {

    componentDidMount() {
        window.require('electron').ipcRenderer.on('cache-cleared', (event, res) => {
            console.log("cache cleared...")
        })
    }

    logOutHandler = () => {
        const Alert = withReactContent(Swal)
        Alert.fire({
            type: 'question',
            text: this.props.langPack.logout_alert.message,
            showCancelButton: true,
            confirmButtonColor: '#cc0000',
            confirmButtonText: this.props.langPack.logout_alert.confirm_btn,
            cancelButtonText: this.props.langPack.logout_alert.cancel_btn
        }).then((logOut) => {
            if(logOut.dismiss === "cancel") {
                Swal("fuf...")
            } else if(logOut.value === true) {
                $("#settings-modal").hide()
                sessionStorage.clear()
                this.props.layoutHandler()
            }
        })
    }

    restartAppHandler = () => {
        const Alert = withReactContent(Swal)
        Alert.fire({
            type: 'question',
            text: this.props.langPack.restart_alert.title,
            showCancelButton: true,
            confirmButtonColor: '#cc0000',
            confirmButtonText: this.props.langPack.restart_alert.restart_btn,
            cancelButtonText: this.props.langPack.restart_alert.cancel_btn
        }).then((e) => {
            if(e.value === true) {
                main.restartApp()
            }
        })
    }

    cacheSizeHandler = () => {
        win.webContents.session.getCacheSize((size) => {
            console.log(pretty(size))
        })
    }

    render() {
        return(
            <div className="modal fade" id="settings-modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header container-block">
                            <div className="dropdown">
                                <button className="btn btn-more" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-ellipsis-v"></i>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="settings-more">
                                    <button className="dropdown-item log-out" onClick={this.logOutHandler}>{this.props.langPack.logout_btn}</button>
                                </div>
                            </div>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="container-block" style={{boxShadow: "none"}}>
                                {/* <div className="accordion">
                                    <Application langPack={this.props.langPack.application_settings} restartAppHandler={this.restartAppHandler} />
                                    <PlayerSettings langPack={this.props.langPack.twitch_player_settings} restartAppHandler={this.restartAppHandler} />
                                    <Languages langPack={this.props.langPack.languages_settings} languageHandler={this.props.languageHandler} />
                                    <Notifications langPack={this.props.langPack.notifications_settings} />
                                </div>
                                <a href="https://mttv.github.io/faq" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">{this.props.langPack.faq_btn}</a>
                                <a href="https://mttv.github.io/contacts" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">{this.props.langPack.contact_btn}</a>
                                <a href="https://github.com/mttv/mttv-app/releases" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">{this.props.langPack.log_btn}</a>
                                <hr />
                                <p className="app-version">{this.props.langPack.version}: 0.2.3 - Public Alpha</p>
                                <div className="btn btn-primary" onClick={this.cacheSizeHandler}>get cache</div> */}
                                <div className="row">
                                    <div className="col-4">
                                        <div className="list-group" id="list-tab" role="tablist" style={{paddingBottom: "0px"}}>
                                            <h5 className="modal-title">{this.props.langPack.title}</h5>
                                            <a className="list-group-item list-group-item-action active" id="list-application" data-toggle="list" href="#application" role="tab" aria-controls="application">{this.props.langPack.application_settings.title}</a>
                                            <a className="list-group-item list-group-item-action" id="list-player" data-toggle="list" href="#player" role="tab" aria-controls="player">{this.props.langPack.twitch_player_settings.title}</a>
                                            <a className="list-group-item list-group-item-action" id="list-languages" data-toggle="list" href="#languages" role="tab" aria-controls="languages">{this.props.langPack.languages_settings.title}</a>
                                            <a className="list-group-item list-group-item-action" id="list-notifications" data-toggle="list" href="#notifications" role="tab" aria-controls="notifications">{this.props.langPack.notifications_settings.title}</a>
                                            <a className="list-group-item list-group-item-action" href="https://mttv.github.io/contacts" target="_blank" rel="noopener noreferrer">{this.props.langPack.contact_btn}</a>
                                            <a className="list-group-item list-group-item-action" href="https://github.com/mttv/mttv-app/releases" target="_blank" rel="noopener noreferrer">{this.props.langPack.log_btn}</a>
                                            <p className="app-version">{this.props.langPack.version}: 0.2.4 - Public Alpha</p>
                                            <div className="row settings-social-footer">
                                                <a className="social-icon twitter" href="https://twitter.com/mttvapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
                                                <a className="social-icon github" href="https://github.com/mttv" target="_blank" rel="noopener noreferrer"><i className="fab fa-github-alt"></i></a>
                                                <a className="social-icon patreon" href="https://www.patreon.com/mttvapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-patreon"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="tab-content settings" id="nav-tabContent">
                                            <Application langPack={this.props.langPack.application_settings} restartAppHandler={this.restartAppHandler} />
                                            <PlayerSettings langPack={this.props.langPack.twitch_player_settings} restartAppHandler={this.restartAppHandler} />
                                            <Languages langPack={this.props.langPack.languages_settings} languageHandler={this.props.languageHandler} />
                                            <Notifications langPack={this.props.langPack.notifications_settings} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}