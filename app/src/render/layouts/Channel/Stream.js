import React, { Component } from 'react'
import ReactPlayer from 'react-player/lib/players/Twitch'
import $ from 'jquery'

export default class Stream extends Component {

    constructor(props) {
        super(props)
        this.state = {
            link: "https://www.twitch.tv/embed/" + this.props.name + "/chat",
            ratio: localStorage.getItem("player-ratio") ? "container-block embed-responsive embed-responsive-" + localStorage.getItem("player-ratio") : "container-block embed-responsive embed-responsive-16by9"
        }
    }

    componentDidMount() {
        $("#chat-container").hover(
            () => { 
                $("#chat-container").css({"z-index": "15"})
                $("#player-container").css({"pointer-events": "none"})
            },
            () => { 
                $("#chat-container").removeAttr("style")
                $("#player-container").removeAttr("style")
            }
        )

        // const chatWebview = document.getElementById("chat_embed")
        // chatWebview.addEventListener("dom-ready", () => {
        //     chatWebview.insertCSS('body{background: transparent!important}.twilight-minimal-root{background-color: transparent!important}.embed-chat-page{width:34.5%;height:100%;position:absolute;top:0;right:0;margin:0}#bttvSettingsPanel{position:fixed!important}@media (max-width: 768px){.embed-chat-page{width:100%!important;}}')
        // })

        const darkMode = localStorage.getItem("darkMode")
        if (darkMode) {
            this.setState({
                link: "https://www.twitch.tv/embed/" + this.props.name + "/chat?darkpopout"
            })
        } else {
            this.setState({
                link: "https://www.twitch.tv/embed/" + this.props.name + "/chat"
            })
        }

        sessionStorage.removeItem("cinemaMode")

        $("#hide-chat-btn").click(function() {
            const cinemaMode = sessionStorage.getItem("cinemaMode")
            $("#hide-chat-btn").hide()
            $("#show-chat-btn").show()
            $("#chat-container").fadeOut()
            if (cinemaMode) {
                $("#player-size").animate({width: "100%"})
                $(".container-block.stream-options").animate({width: "100%"})
            } else {
                setTimeout(() => {
                    $("#player-container").css({
                        "width": "90%",
                        "margin": "0 auto"
                    })
                }, 300)
            }
        })

        $("#show-chat-btn").click(function() {
            const cinemaMode = sessionStorage.getItem("cinemaMode")
            $("#show-chat-btn").hide()
            $("#hide-chat-btn").show()
            if (cinemaMode) {
                $("#player-size").animate({width: "78%"})
                $(".container-block.stream-options").animate({width: "78%"})
                $("#chat-container").fadeIn()
            } else {
                $("#player-container").removeAttr("style")
                $("#player-size").removeAttr("style")
                setTimeout(function() {
                    $("#chat-container").fadeIn()
                }, 500)
            }
        })

        $("#cinema-mode-btn").click(function() {
            const cinemaMode = sessionStorage.getItem("cinemaMode")
            if (cinemaMode) {
                sessionStorage.removeItem("cinemaMode")
                $("body").removeAttr("style")
                $("#player-size").removeClass("cinema")
                $("#player-size").removeAttr("style")
                $("#player-container").removeClass("cinema")
                $(".container-block.stream-options .btn").removeClass("cinema")
                $(".container-block.stream-options .btn").removeAttr("style")
                $(".container-block.stream-options").removeClass("cinema")
                $(".container-block.stream-options").removeAttr("style")
                $("#chat-container").removeClass("cinema")
                $("#chat-container").removeAttr("style")
                $("#show-chat-btn").hide()
                $("#hide-chat-btn").show()
            } else {
                sessionStorage.setItem("cinemaMode", true)
                $("#show-chat-btn").hide()
                $("#hide-chat-btn").show()
                $("#chat-container").show()
                $("body").css({"overflow-y": "hidden"})
                $("#player-size").addClass("cinema")
                $("#player-container").addClass("cinema")
                $(".container-block.stream-options").addClass("cinema")
                $(".container-block.stream-options .btn").addClass("cinema")
                $("#chat-container").addClass("cinema")
            }
        })
    }

    render() {
        return(
            <div id="stream-container">
                <div className="row" style={{marginLeft: "0px", position: "relative"}}>
                    <div id="player-container">
                        <div className={this.state.ratio} id="player-size">
                            <ReactPlayer 
                                width="100%" 
                                height="100%" 
                                className="react-player" 
                                url={"https://www.twitch.tv/" + this.props.name} 
                                playing={this.props.isPlaying}
                                muted={this.props.isMuted}
                                volume={this.props.volume}
                            />
                        </div>
                        <div className="container-block stream-options">
                        <button className="btn" id="cinema-mode-btn">{this.props.langPack.cinema_btn}</button>
                            {/* <button className="btn">Multi Stream</button> */}
                            <button className="btn" id="window-mode-btn" onClick={this.props.isPlayingHandler}>{this.props.langPack.window_btn}</button>
                            <button className="btn" id="hide-chat-btn">{this.props.langPack.hide_chat_btn}</button>
                            <button className="btn" id="show-chat-btn">{this.props.langPack.show_chat_btn}</button>
                            {/* <button className="btn">Share</button> */}
                        </div>
                    </div>
                    <div className="container-block" id="chat-container">
                        <webview className="chat-css"
                            width="100%"
                            height="100%"
                            id="chat_embed"
                            src={this.state.link}
                        />
                    </div>
                </div>
            </div>
        )
    }
}