import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const { webFrame } = window.require("electron")
const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class Application extends Component {

    state = {
        zoomLevel: localStorage.getItem("zoom-level") ? parseFloat(localStorage.getItem("zoom-level")) : 1
    }

    componentDidMount() {
        webFrame.setZoomFactor(this.state.zoomLevel)

        const darkMode = localStorage.getItem("darkMode")
        const hardware = localStorage.getItem("hardware")
        const devConsole = localStorage.getItem("dev-console")

        hardware ? $("#hardware-btn input").prop("checked", true) : $("#hardware-btn input").prop("checked", false)
        devConsole ? $("#dev-console-btn input").prop("checked", true) : $("#dev-console-btn input").prop("checked", false)
        darkMode ? this.darkModeHandler() : this.lightModeHandler()

        window.require('electron').ipcRenderer.on("dev-console-enable", (event, res) => {
            const option = localStorage.getItem("dev-console")
            if (res) {
                if (option) {
                    localStorage.removeItem("dev-console")
                    this.props.restartAppHandler()
                } else {
                    localStorage.setItem("dev-console", true)
                    this.props.restartAppHandler()
                }
            } else {
                const Alert = withReactContent(Swal)
                    Alert.fire({
                        type: 'error',
                        text: 'Oops something went wrong!Try again later.'
                })
            }
        })
    }

    devConsoleHandler = () => {
        const option = localStorage.getItem("dev-console")
        const newVal = option ? false : true
        main.devConsole(newVal)
    }

    hardwareHandler = () => {
        const option = localStorage.getItem("hardware")
        if (option) {
            localStorage.removeItem("hardware")
            this.props.restartAppHandler()
        } else {
            localStorage.setItem("hardware", true)
            this.props.restartAppHandler()
        }
    }

    zoomLevelHandler = (event) => {
        localStorage.setItem("zoom-level", event.target.value)
        this.setState({
            zoomLevel: event.target.value
        })
        webFrame.setZoomFactor(parseFloat(event.target.value))
    }

    themeHandler = () => {
        const darkMode = localStorage.getItem("darkMode")
        if (darkMode) {
            $("#night-mode").removeAttr("disabled")
        } else {
            $("#night-mode").attr("disabled", true)
        }
    }

    darkModeHandler = () => {
        localStorage.setItem("darkMode", true)
        $("#dark-mode-btn input").prop("checked", true)
        $("#dark-mode-btn").addClass("active")
        $("#light-mode-btn input").prop("checked", false)
        $("#light-mode-btn").removeClass("active")
        this.themeHandler()
    }

    lightModeHandler = () => {
        localStorage.removeItem("darkMode")
        $("#light-mode-btn input").prop("checked", true)
        $("#light-mode-btn").addClass("active")
        $("#dark-mode-btn input").prop("checked", false)
        $("#dark-mode-btn").removeClass("active")
        this.themeHandler()
    }

    render() {
        return(
            <div className="tab-pane fade show active card-settings" id="application" role="tabpanel" aria-labelledby="list-application">
                        <h5>{this.props.langPack.theme.title}</h5>
                        <div className="form-group form-check settings" id="light-mode-btn" style={{cursor: "pointer"}} onClick={this.lightModeHandler}>
                            <input type="checkbox" className="form-check-input" />
                            <label className="form-check-label" htmlFor="light-mode-btn">{this.props.langPack.theme.light}</label>
                        </div>
                        <div className="form-group form-check settings" id="dark-mode-btn" style={{cursor: "pointer"}} onClick={this.darkModeHandler}>
                            <input type="checkbox" className="form-check-input" />
                            <label className="form-check-label" htmlFor="dark-mode-btn">{this.props.langPack.theme.dark}</label>
                        </div>
                        <h5>{this.props.langPack.dev_console.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="dev-console-btn">
                                <input type="checkbox" onClick={this.devConsoleHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.dev_console.message}</p>
                        </div>
                        <div className="alert alert-warning" role="alert">
                            {this.props.langPack.dev_console.alert_msg}
                        </div>
                        <h5>{this.props.langPack.rendering.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="hardware-btn">
                                <input type="checkbox" onClick={this.hardwareHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.rendering.message}</p>
                        </div>
                        <div className="alert alert-warning" role="alert">
                            {this.props.langPack.rendering.alert_msg_1}
                        </div>
                        <div className="alert alert-warning" role="alert">
                            {this.props.langPack.rendering.alert_msg_2}
                        </div>
                        <h5>{this.props.langPack.zoom.title}</h5>
                        <div className="form-group form-check settings">
                            <p>{this.props.langPack.zoom.indicator_msg}: {this.state.zoomLevel * 100 + "%"}</p>
                            <input 
                                type="range" 
                                className="custom-range" 
                                min="0.5" 
                                max="1.2" 
                                step="0.05"
                                value={this.state.zoomLevel}
                                onChange={this.zoomLevelHandler}
                            />
                        </div>
                    </div>
        )
  }
}