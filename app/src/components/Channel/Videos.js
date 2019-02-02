import React, { Component } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import $ from 'jquery'
import VideoCard from './VideoCard'
import Video from './Video'

export default class ChannelVideos extends Component {

    constructor(props) {
        super(props)

        this.state = {
            channelId: "",
            list: null,
            error: false,
            showLimit: 8,
            total: 0
        }
    }

    componentDidMount() {
        const urlString = window.location.href
        const channelId = urlString.split("=").pop()
        this.setState({
            channelId: channelId
        })
        this.getVideosHandler(channelId, 8)
    }

    componentDidUpdate() {
        $(".card.stream-preview.video").click(function() {
            const id = $(this).attr("data-target")
            const vid = id.split("#").pop()
            let autoplay = localStorage.getItem("autoplay-video")
            autoplay = autoplay ? true : false
            const link = "https://player.twitch.tv/?autoplay=" + autoplay + "&muted=false&video=" + vid
            $(id + "-body").html("<iframe src='" + link + "' height='100%' width='100%' scrolling='yes' allowFullScreen='true'> </iframe>")
        })
    }

    loadMoreHandler = (props) => {
        const { limit, total } = props
        if (total > limit) {
            return(
                <button className="btn load-more" onClick={() => this.getVideosHandler(this.state.channelId, this.state.showLimit + 8)}>{this.props.langPackOthers.load_more_btn}</button>
            )
        } else {
            return(
                <div id="no-more-videos"></div>
            )
        }
    }

    getVideosHandler = (channelId, limit) => {
        if (limit <= 100) {
            if (this.state.showLimit !== limit) {
                this.setState({
                    showLimit: limit
                })
            }
            this.props.api.channels.videos({channelID: channelId, limit: limit}, (err, res) => {
                if (err) {
                    this.setState({
                        error: err
                    })
                } else {
                    this.setState({
                        total: res._total
                    })
                    this.setState({
                        error: false
                    })
                    this.setState({
                        list: res.videos
                    })
                }
            })   
        } else {
            const Alert = withReactContent(Swal)
            Alert.fire({
                type: 'warning',
                title: 'Looks like you\'ve reached the bottom!',
                // text: 'Didn\'t find the stream you wanted?Try search for it.',
                showCancelButton: false
            })
        }
    }

    listLayout = (props) => {
        const { showList, error, showLimit, total } = props
        if (showList === null) {
            return(
                <div className="row" id="videos-list">
                  <p>Loading</p>
                </div>
            )
        } else if (showList !== null && error === false) {
            const cardList = showList.map((res, i) => {
                return <VideoCard 
                            key={i}
                            title={res.title}
                            game={res.game}
                            views={res.views}
                            previewImg={res.preview.large}
                            date={res.created_at}
                            duration={res.length}
                            vid={res._id}
                            langPackOthers={this.props.langPackOthers}
                        />
            })
            const videoList = showList.map((res, i) => {
                return <Video 
                            key={i}
                            vid={res._id}
                            // link={"https://player.twitch.tv/?autoplay=false&muted=false&video=" + res._id}
                        />
            })
            return(
                <div className="row" id="videos-list">
                    {cardList}
                    {videoList}
                    <this.loadMoreHandler limit={showLimit} total={total} />
                </div>
            )
        } else if (error) {
            return(
                <div className="row" id="videos-list">
                    <p>Error on try get videos</p>
                </div>
            )
        } else {
            return(
                <div className="row" id="videos-list" />
            )
        }
    }

    render() {
        return(
            <div className="container streams-live">
                <h1 className="page-title">{this.props.langPack.title}</h1>
                <this.listLayout total={this.state.total} showLimit={this.state.showLimit} showList={this.state.list} error={this.state.error} />
            </div>
        )
    }
}