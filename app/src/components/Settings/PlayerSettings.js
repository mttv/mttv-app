import React, { Component } from 'react'
import $ from 'jquery'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const remote = window.require("electron").remote
const main = remote.require("./main.js")

export default class PlayerSettings extends Component {

    state = {
        playerVolume: localStorage.getItem("player-volume") ? parseFloat(localStorage.getItem("player-volume")) : 1
    }

    componentDidMount() {
        const mutePlayer = localStorage.getItem("mute-player")
        const autoplayPlayer = localStorage.getItem("autoplay")
        const autoplayVideo = localStorage.getItem("autoplay-video")
        const resizablePlayer = localStorage.getItem("resizable-mini-player")
        const ratio = localStorage.getItem("player-ratio")
        const mpSize = localStorage.getItem("mp-size")

        mutePlayer ? $("#mute-player-btn input").prop("checked", true) : $("#mute-player-btn input").prop("checked", false)
        autoplayPlayer ? $("#autoplay-btn input").prop("checked", true) : $("#autoplay-btn input").prop("checked", false)
        autoplayVideo ? $("#autoplay-video-btn input").prop("checked", true) : $("#autoplay-video-btn input").prop("checked", false)
        resizablePlayer ? $("#resizable-player-btn input").prop("checked", true) : $("#resizable-player-btn input").prop("checked", false)
        mpSize ? $("#mp-size " + "#" + mpSize).prop("selected", true) : $("#mp-size #mp_1").prop("selected", true)

        switch (ratio) {
            case "16by9": $("#ar-select #ar-16_9").prop("selected", true)  
                break
            case "21by9": $("#ar-select #ar-21_9").prop("selected", true)
                break
            case "4by3": $("#ar-select #ar-4_3").prop("selected", true)
                break
            case "1by1": $("#ar-select #ar-1_1").prop("selected", true)
                break
            default: $("#ar-select #ar-16_9").prop("selected", true)
                break
        }

        window.require('electron').ipcRenderer.on("resizable-player", (event, res) => {
            const option = localStorage.getItem("resizable-mini-player")
            if (res) {
                if (option) {
                    localStorage.removeItem("resizable-mini-player")
                    this.props.restartAppHandler()
                } else {
                    localStorage.setItem("resizable-mini-player", true)
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

        window.require('electron').ipcRenderer.on("mp-size", (event, res) => {
            if (res === false) {
                const Alert = withReactContent(Swal)
                    Alert.fire({
                        type: 'error',
                        text: 'Oops something went wrong!Try again later.'
                })
                // if (option) {
                //     localStorage.removeItem("resizable-mini-player")
                //     this.props.restartAppHandler()
                // } else {
                //     localStorage.setItem("resizable-mini-player", true)
                //     this.props.restartAppHandler()
                // }
            } else {
                localStorage.setItem("mp-size", res)
                this.props.restartAppHandler()
            }
        })
    }

    resizablePlayerHandler = () => {
        const option = localStorage.getItem("resizable-mini-player")
        const newVal = option ? false : true
        main.resizablePlayer(newVal)
    }

    mutePlayerHandler = () => {
        const option = localStorage.getItem("mute-player")
        if (option) {
            localStorage.removeItem("mute-player")
        } else {
            localStorage.setItem("mute-player", true)
        }
    }

    autoplayHandler = () => {
        const option = localStorage.getItem("autoplay")
        if (option) {
            localStorage.removeItem("autoplay")
        } else {
            localStorage.setItem("autoplay", true)
        }
    }

    playerVolumeHandler = (event) => {
        localStorage.setItem("player-volume", event.target.value)
        this.setState({
            playerVolume: event.target.value
        })
    }

    autoplayVideoHandler = () => {
        const option = localStorage.getItem("autoplay-video")
        if (option) {
            localStorage.removeItem("autoplay-video")
        } else {
            localStorage.setItem("autoplay-video", true)
        }
    }

    playerRatioHandler = (event) => {
        localStorage.setItem("player-ratio", event.target.value)
    }

    miniPlayerSizeHandler = (event) => {
        const val = JSON.parse(event.target.value)
        const id = "mp_" + val.id
        const width = val.w
        const height = val.h
        main.mpSize(width, height, id)
    }


    render() {
        return(
            <div className="card-settings">
                <div className="card-header">
                    <h5 className="mb-0">
                        <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#player-settings" aria-expanded="true" aria-controls="player-settings">{this.props.langPack.title}</button>
                    </h5>
                </div>
                <div id="player-settings" className="collapse">
                    <div className="card-body">
                        <h5>{this.props.langPack.ratio.title}</h5>
                        <div className="form-group form-check settings">
                            <select className="form-control" id="ar-select" onChange={this.playerRatioHandler}>
                                <option id="ar-16_9" value="16by9">16:9</option>
                                <option id="ar-21_9" value="21by9">21:9</option>
                                <option id="ar-4_3" value="4by3">4:3</option>
                                <option id="ar-1_1" value="1by1">1:1</option>
                            </select>
                        </div>
                        <h5>{this.props.langPack.mute.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="mute-player-btn" >
                                <input type="checkbox" onClick={this.mutePlayerHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.mute.message}</p>
                        </div>
                        <h5>{this.props.langPack.autoplay_stream.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="autoplay-btn">
                                <input type="checkbox" onClick={this.autoplayHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.autoplay_stream.message}</p>
                        </div>
                        <h5>{this.props.langPack.volume.title}</h5>
                        <div className="form-group form-check settings">
                            <p>{this.props.langPack.volume.message}</p>
                            <input 
                                type="range" 
                                className="custom-range" 
                                min="0" 
                                max="1" 
                                step="0.01" 
                                value={this.state.playerVolume} 
                                onChange={this.playerVolumeHandler} />
                        </div>
                        <h5>{this.props.langPack.autoplay_video.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="autoplay-video-btn">
                                <input type="checkbox" onClick={this.autoplayVideoHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.autoplay_video.message}</p>
                        </div>
                        <h5>{this.props.langPack.resizable.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <label className="switch" id="resizable-player-btn">
                                <input type="checkbox" onClick={this.resizablePlayerHandler} />
                                <span className="slider round" />
                            </label>
                            <p>{this.props.langPack.resizable.message}</p>
                        </div>
                        <div className="alert alert-warning" role="alert">
                            Need to restart app to make mini player resizable.
                        </div>
                        <h5>{this.props.langPack.mp_size.title}</h5>
                        <div className="form-group form-check settings" style={{display: "inline-flex", flexDirection: "row-reverse"}}>
                            <div className="form-group form-check settings">
                                <select className="form-control" id="mp-size" onChange={this.miniPlayerSizeHandler}>
                                    <option id="mp_1" value={'{"w":480,"h":270,"id": 1}'}>480x270</option>
                                    <option id="mp_2" value={'{"w":720,"h":480,"id": 2}'}>720x480</option>
                                    <option id="mp_3" value={'{"w":720,"h":586,"id": 3}'}>720x586</option>
                                    <option id="mp_4" value={'{"w":800,"h":600,"id": 4}'}>800x600</option>
                                    <option id="mp_5" value={'{"w":1024,"h":768,"id": 5}'}>1024x768</option>
                                    <option id="mp_6" value={'{"w":1280,"h":720,"id": 6}'}>1280x720</option>
                                </select>
                            </div>
                            <p>{this.props.langPack.mp_size.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
  }
}