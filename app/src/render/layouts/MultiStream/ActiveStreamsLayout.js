import React from 'react'
import DraggablePlayer from '../../components/MultiStream/DraggablePlayer'

const activeStreamsLayout = (props) => {
    const { streams, playing, volume, muted } = props
    const darkMode = localStorage.getItem("darkMode")
    let darkChat
    darkMode ? darkChat = "?darkpopout" :  darkChat = ""
    const streamUrl = "https://www.twitch.tv/"
    let chatUrl = "https://www.twitch.tv/embed/"
    const countStreams = streams.length
    let ShowStreams
    let firstStream
    let others
    switch (countStreams) {
        case 1: 
            ShowStreams = () => {
                return(
                    <div className="container-fluid" style={{margin: "0 auto", width: "85%"}}>
                        <div className="row" style={{width: "100%"}}>
                            <div className="col-8">
                                <DraggablePlayer 
                                    url={streamUrl + streams[0].stream.channel.name} 
                                    playing={playing} 
                                    volume={volume}
                                    muted={muted} 
                            />
                            </div>
                            <div className="col-4" style={{marginBottom: "20px"}}>
                                <div className="container-block" style={{height: "100%"}}>
                                    <webview style={{height: "100%"}}
                                        src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                    </webview>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            break
        case 2: ShowStreams = () => {
            return(
                <div className="container-fluid" style={{margin: "0 auto", width: "75%"}}>
                    <div className="row" style={{width: "100%"}}>
                        <div className="col-8">
                            <DraggablePlayer 
                                url={streamUrl + streams[0].stream.channel.name} 
                                playing={playing} 
                                volume={volume}
                                muted={muted} 
                            />
                        </div>
                        <div className="col-4" style={{marginBottom: "20px"}}>
                            <div className="container-block" style={{height: "100%"}}>
                                <webview style={{height: "100%"}}
                                    src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                </webview>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{width: "100%"}}>
                        <div className="col-8">
                            <DraggablePlayer 
                                url={streamUrl + streams[1].stream.channel.name} 
                                playing={playing} 
                                volume={volume}
                                muted={muted} 
                            />
                        </div>
                        <div className="col-4" style={{marginBottom: "20px"}}>
                            <div className="container-block" style={{height: "100%"}}>
                                <webview style={{height: "100%"}}
                                    src={chatUrl + streams[1].stream.channel.name + "/chat"  + darkChat}>
                                </webview>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
            break
        case 3:
            firstStream = streams.slice(0, 1)
            others = streams.slice(1, 3)
            others = others.map((res, i) => {
                return (
                    <DraggablePlayer
                        key={i} 
                        styleClass={"col"} 
                        url={streamUrl + res.stream.channel.name} 
                        playing={playing} 
                        volume={volume}
                        muted={muted} 
                    />
                )
            })
            ShowStreams = () => {
                return(
                    <div className="containe-fluid" style={{margin: "0 auto", width: "80%"}}>
                        <div className="row" style={{width: "100%"}}>
                            <div className="col-8">
                                <DraggablePlayer
                                    url={streamUrl + firstStream[0].stream.channel.name} 
                                    playing={playing} 
                                    volume={volume}
                                    muted={muted} 
                                />
                            </div>
                            <div className="col-4" style={{marginBottom: "20px"}}>
                                <div className="container-block" style={{height: "100%"}}>
                                    <webview style={{height: "100%"}}
                                        src={chatUrl + streams[0].stream.channel.name + "/chat"  + darkChat}>
                                    </webview>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {others}
                        </div>
                    </div>
                )
            }
            break
        case 4:
            let streams_1 = streams.slice(0, 2)
            let streams_2 = streams.slice(2, 4)
            streams_1 = streams_1.map((res, i) => {
                return (
                    <DraggablePlayer
                        key={i} 
                        styleClass={"col"} 
                        url={streamUrl + res.stream.channel.name} 
                        playing={playing} 
                        volume={volume}
                        muted={muted} 
                    />
                )
            })
            streams_2 = streams_2.map((res, i) => {
                return (
                    <DraggablePlayer
                        key={i} 
                        styleClass={"col"} 
                        url={streamUrl + res.stream.channel.name} 
                        playing={playing} 
                        volume={volume}
                        muted={muted}  
                    />
                )
            })
            ShowStreams = () => {
                return(
                    <div className="container-fluid" style={{margin: "0 auto", width: "86%"}}>
                        <div className="row" style={{width: "100%"}}>
                            {streams_1}
                        </div>
                        <div className="row" style={{width: "100%"}}>
                            {streams_2}
                        </div>
                    </div>
                )
            }
            break
        default: ShowStreams = () => { return <div /> }
            break
    }
    return (
        <div id="streams-container">
            <ShowStreams />
        </div>
    )
}

export default activeStreamsLayout