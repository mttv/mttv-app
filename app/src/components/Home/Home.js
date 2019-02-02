import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import VideoCard from '../Channel/VideoCard'
import Video from '../Channel/Video'
import Featured from './Featured'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            featured: {
                list: null,
                error: false,
            },
            topVideos: {
                list: null,
                error: false
            },
            topClips: {
                list: null,
                error: false
            }
        }
    }

    componentDidMount() {
        this.featuredHandler()
        this.topVideosHandler()
        this.topClipsHandler()
        // this.followedVideosHandler()
        // this.followedClipsHandler()
    }

    componentDidUpdate() {
        $('#loaded').ready(() => {
            $('#loaded').fadeIn()
        })
        $("li.slider-preview").first().addClass("active")
        $(".carousel-item").first().addClass("active")
        /*
            Creating popup for videos and clips
        */
        $(".card.stream-preview.video").click(function() {
            const id = $(this).attr("data-target")
            const type = $(this).attr("type")
            const vid = id.split("#").pop()
            let autoplay = localStorage.getItem("autoplay-video")
            autoplay = autoplay ? true : false
            let link
            if (type === "video") {
                link = "https://player.twitch.tv/?autoplay=" + autoplay + "&muted=false&video=" + vid  
            } else {
                link = "https://clips.twitch.tv/embed?autoplay=" + autoplay + "&muted=false&clip=" + vid  
            }
            $(id + "-body").html("<iframe src='" + link + "' height='100%' width='100%' scrolling='yes' allowFullScreen='true'> </iframe>")
        })
        /*
            Scroll animations from lists
        */
        $("#scroll-left-featured").click(() => {
            sideScroll(document.getElementById('featured'), 'left', 15, 250, 10)
        })

        $("#scroll-left-top-videos").click(function() {
            sideScroll(document.getElementById('top-videos'), 'left', 15, 250, 10)
        })

        $("#scroll-right-top-videos").click(function() {
            sideScroll(document.getElementById('top-videos'), 'right', 15, 250, 10)
        })

        $("#scroll-left-top-clips").click(function() {
            sideScroll(document.getElementById('top-clips'), 'left', 15, 250, 10)
        })

        $("#scroll-right-top-clips").click(function() {
            sideScroll(document.getElementById('top-clips'), 'right', 15, 250, 10)
        })

        function sideScroll(element, direction, speed, distance, step) {
            let scrollAmount = 0
            let slideTimer = setInterval(function() {
                if(direction === 'left') {
                    element.scrollLeft -= step
                } else {
                    element.scrollLeft += step
                }
                scrollAmount += step
                if(scrollAmount >= distance){
                    window.clearInterval(slideTimer)
                }
            }, speed)
        }
    }

    featuredHandler = () => {
        this.props.api.streams.featured({limit: 10}, (err, res) => {
            if (err) {
                this.setState({
                    featured: {
                        ...this.state.featured,
                        list: null
                    }
                })
                this.setState({
                    featured: {
                        ...this.state.featured,
                        error: err
                    }
                })
            } else {
                if (res.featured.length === 0) {
                    this.setState({
                        featured: {
                            ...this.state.featured,
                            list: ""
                        }
                    })
                } else {
                    this.setState({
                        featured: {
                            ...this.state.featured,
                            list: res.featured
                        }
                    })
                    this.setState({
                        featured: {
                            ...this.state.featured,
                            error: false
                        }
                    })
                }
            }
        })
    }

    featuredSlider = () => {
        const { list, error } = this.state.featured
        if (list === null) {
            return(
                <div className="row" id="streams-list">
                  <p>Loading</p>
                </div>
            )
        } else if(list !== null && error === false) {
            const res = list.map((res, i) => {
                // let imgUrl = res.stream.preview.template
                // imgUrl = imgUrl.replace("{width}", 1920)
                // imgUrl = imgUrl.replace("{height}", 1080)
                return  <div key={i} className="carousel-item">
                            <div className="img-shadow">
                                <img className="d-block w-100" src={res.stream.preview.large} alt="" />
                            </div>
                            <div className="carousel-caption d-none d-md-block">
                                <h2>{res.stream.channel.status}</h2>
                                <p>{res.stream.channel.display_name}<span>{res.stream.channel.game}</span><span>{res.stream.viewers + " " + this.props.langPackOthers.viewers}</span></p><br />
                                <Link className="btn watch-btn" to={{
                                    pathname: '/app/channel',
                                    search: '?id=' + res.stream.channel._id
                                }}>{this.props.langPack.watch_btn}</Link>
                            </div>
                        </div>
            })
            return(
                <div className="carousel-inner">   
                    {res}
                </div>
            )
        } else if(error) {
            return(
                <div className="row" id="streams-list">
                    <p>Error on try get live streams</p>
                </div>
            )
        } else {
            return(
                <div className="row" id="streams-list" />
            )
        }
    }

    featuredSliderIndicators = () => {
        const { list, error } = this.state.featured
        if (list === null) {
            return(
                <div className="row" id="streams-list">
                  <p>Loading</p>
                </div>
            )
        } else if(list !== null && error === false) {
            const res = list.map((res, i) => {
                return  <li key={i} className="slider-preview" data-target="#carouselExampleIndicators" data-slide-to={i}>
                            <img className="d-block w-100" src={res.stream.preview.large} alt="" />
                        </li>
            })
            return(
                <ol className="carousel-indicators">   
                    {res}
                </ol>
            )
        } else if(error) {
            return(
                <div className="row" id="streams-list">
                    <p>Error on try get live streams</p>
                </div>
            )
        } else {
            return(
                <div className="row" id="streams-list" />
            )
        }
    }

    topVideosHandler = () => {
        this.props.api.videos.top({limit: 15, sort: "views"}, (err, res) => {
            if (err) {
                this.setState({
                    topVideos: {
                        ...this.state.topVideos,
                        list: null
                    }
                })
                this.setState({
                    topVideos: {
                        ...this.state.topVideos,
                        error: err
                    }
                })
            } else {
                if (res.vods.length === 0) {
                    this.setState({
                        topVideos: {
                            ...this.state.topVideos,
                            list: ""
                        }
                    })
                } else {
                    this.setState({
                        topVideos: {
                            ...this.state.topVideos,
                            list: res.vods
                        }
                    })
                    this.setState({
                        topVideos: {
                            ...this.state.topVideos,
                            error: false
                        }
                    })
                }
            }
        })
    }

    topVideosLayout = (props) => {
        const { videosList, videosError } = props
        if (videosList === null) {
            return(
                <div className="row" id="top-videos-list">
                  <p>Loading</p>
                </div>
            )
        } else if(videosList !== null && videosError === false) {
            const list = videosList.map((res, i) => {
                return <VideoCard 
                            key={i}
                            title={res.title}
                            game={res.game}
                            views={res.views}
                            previewImg={res.preview.large}
                            date={res.created_at}
                            duration={res.length}
                            channelName={res.channel.display_name}
                            vid={res._id}
                            type={"video"}
                            langPackOthers={this.props.langPackOthers}
                        />
            })
            const videoCards = videosList.map((res, i) => {
                return <Video 
                            key={i}
                            vid={res._id}
                            link={"https://player.twitch.tv/?autoplay=false&muted=false&video=" + res._id}
                        />
            })
            return(
                <div className="inline" id="top-videos-list">
                    <button id="scroll-left-top-videos" className="btn left-scroll"><i className="fas fa-angle-left"></i></button>
                    <div className="inline-container" id="top-videos">
                        {list}
                    </div>
                    <button id="scroll-right-top-videos" className="btn right-scroll"><i className="fas fa-angle-right"></i></button>
                    {videoCards}
                </div>
            )
        } else if(videosError) {
            return(
                <div className="row" id="top-videos-list">
                    <p>Error on try get live streams</p>
                </div>
            )
        } else {
            return(
                <div className="row" id="top-videos-list" />
            )
        }
    }

    topClipsHandler = () => {
        this.props.api.clips.top({limit: 15}, (err, res) => {
            if (err) {
                this.setState({
                    topClips: {
                        ...this.state.topClips,
                        list: null
                    }
                })
                this.setState({
                    topClips: {
                        ...this.state.topClips,
                        error: err
                    }
                })
            } else {
                if (res.clips.length === 0) {
                    this.setState({
                        topClips: {
                            ...this.state.topClips,
                            list: ""
                        }
                    })
                } else {
                    this.setState({
                        topClips: {
                            ...this.state.topClips,
                            list: res.clips
                        }
                    })
                    this.setState({
                        topClips: {
                            ...this.state.topClips,
                            error: false
                        }
                    })
                }
            }
        })
    }

    topClipsLayout = (props) => {
        const { clipsList, clipsError } = props
        if (clipsList === null) {
            return(
                <div className="row" id="top-clips-list">
                  <p>Loading</p>
                </div>
            )
        } else if(clipsList !== null && clipsError === false) {
            const list = clipsList.map((res, i) => {
                return <VideoCard 
                            key={i}
                            title={res.title}
                            game={res.game}
                            views={res.views}
                            previewImg={res.thumbnails.medium}
                            date={res.created_at}
                            duration={res.duration}
                            vid={res.id}
                            channelName={res.broadcaster.display_name}
                            type={"clip"}
                            langPackOthers={this.props.langPackOthers}
                        />
            })
            const clipsCards = clipsList.map((res, i) => {
                return <Video 
                            key={i}
                            vid={res.id}
                            link={"https://clips.twitch.tv/embed?autoplay=false&muted=false&clip=" + res.id}
                        />
            })
            return(
                <div className="inline" id="top-clips-list">
                    <button id="scroll-left-top-clips" className="btn left-scroll"><i className="fas fa-angle-left"></i></button>
                    <div className="inline-container" id="top-clips">
                        {list}
                    </div>
                    <button id="scroll-right-top-clips" className="btn right-scroll"><i className="fas fa-angle-right"></i></button>
                    {clipsCards}
                </div>
            )
        } else if(clipsError) {
            return(
                <div className="row" id="top-clips-list">
                    <p>Error on try get live streams</p>
                </div>
            )
        } else {
            return(
                <div className="row" id="top-clips-list" />
            )
        }
    }

    // followedVideosHandler = () => {
    //     const token = sessionStorage.getItem("token")
    //     this.props.api.videos.followed({limit: 15, auth: token, sort: "views"}, (err, res) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log(res)
    //         }
    //     })
    // }

    // followedClipsHandler = () => {
    //     const token = sessionStorage.getItem("token")
    //     this.props.api.clips.followed({limit: 15, auth: token, trending: false}, (err, res) => {
    //         if (err) {
    //             console.log(err)
    //         } else {
    //             console.log(res)
    //         }
    //     })
    // }

    render() {
        return(
            <div className="home-container">
                <Featured featuredSlider={this.featuredSlider} featuredSliderIndicators={this.featuredSliderIndicators} />
                <div className="container streams-live">
                    <div id="loaded">
                        {/* <h1 className="page-title">Featured</h1> */}
                        {/* <this.featuredListLayout streamsList={this.state.featured.list} streamsListError={this.state.featured.error} /> */}
                        <h1 className="page-title" style={{marginTop: "20px"}}>{this.props.langPack.popular_videos_title}</h1>
                        <this.topVideosLayout videosList={this.state.topVideos.list} videosError={this.state.topVideos.error} />
                        <h1 className="page-title">{this.props.langPack.popular_clips_title}</h1>
                        <this.topClipsLayout clipsList={this.state.topClips.list} clipsError={this.state.topClips.error} />
                    </div>
                </div>
            </div>
    )
  }
}