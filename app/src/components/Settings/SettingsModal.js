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

export default class Settings extends Component {

    // componentDidMount() {
    //     window.require('electron').ipcRenderer.on('get-cache-size', (event, res) => {
    //         console.log(res)
    //     })
    // }

    logOutHandler = () => {
        const Alert = withReactContent(Swal)
        Alert.fire({
            type: 'warning',
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
            type: 'warning',
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

    // cacheSizeHandler = () => {
    //     main.getCache()
    // }

    // clearCacheHandler = () => {
    //     main.clearStoredCache()
    // }

    render() {
        return(
            <div className="modal fade" id="settings-modal" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header container-block">
                            <h5 className="modal-title">{this.props.langPack.title}</h5>
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
                            <div className="container-block">
                                <div className="accordion">
                                    <Application langPack={this.props.langPack.application_settings} restartAppHandler={this.restartAppHandler} />
                                    <PlayerSettings langPack={this.props.langPack.twitch_player_settings} restartAppHandler={this.restartAppHandler} />
                                    <Languages langPack={this.props.langPack.languages_settings} languageHandler={this.props.languageHandler} />
                                    <Notifications langPack={this.props.langPack.notifications_settings} />
                                </div>
                                <a href="https://mttv.github.io/faq" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">{this.props.langPack.faq_btn}</a>
                                <a href="https://mttv.github.io/contacts" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">{this.props.langPack.contact_btn}</a>
                                <a href="https://github.com/mttv/mttv-app/releases" className="btn btn-md btn-block btn-link" target="_blank" rel="noopener noreferrer">Change Log</a>
                                <hr />
                                <p className="app-version">{this.props.langPack.version}: 0.2.0 - Public Alpha</p>
                                {/* <div className="btn btn-primary" onClick={this.cacheSizeHandler}>get cache</div> */}
                                {/* <div className="btn btn-primary" onClick={this.clearCacheHandler}>clear cache</div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}