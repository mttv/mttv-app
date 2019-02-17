import React, { Component } from 'react'
import $ from 'jquery'
import Featured from '../components/Home/Featured'
import FeaturedSlider from '../layouts/Home/SliderLayout'
import FeaturedSliderIndicators from '../layouts/Home/SliderStreamPreviewLayout'
import TopClipsLayout from '../layouts/Home/TopClipsLayout'
import TopVideosLayout from '../layouts/Home/TopVideosLayout'

export default class Home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            featured: {
                list: null,
                error: false,
                readyToShow: false
            },
            topVideos: {
                list: null,
                error: false,
                readyToShow: false
            },
            topClips: {
                list: null,
                error: false,
                readyToShow: false
            },
        }
    }

    componentDidMount() {
        this.featuredHandler()
        this.topClipsHandler()
        this.topVideosHandler()
        // this.followedVideosHandler()
        // this.followedClipsHandler()
    }

    shouldComponentUpdate() {
        if (this.state.featured.readyToShow && this.state.topVideos.readyToShow && this.state.topClips.readyToShow) {
            return true
        } else {
            return false
        }
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
                    this.setState({
                        featured: {
                            ...this.state.featured,
                            readyToShow: true
                        }
                    })
                }
            }
        })
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
                            readyToShow: true
                        }
                    })
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
                    this.setState({
                        topClips: {
                            ...this.state.topClips,
                            readyToShow: true
                        }
                    })
                }
            }
        })
    }

    render() {
        return(
            <div className="home-container">
                <Featured 
                    featured={this.state.featured} 
                    langPack={this.props.langPack} 
                    langPackOthers={this.props.langPackOthers} 
                    featuredSlider={FeaturedSlider} 
                    featuredSliderIndicators={FeaturedSliderIndicators} 
                />
                <div className="container streams-live">
                    <div id="loaded">
                        <h1 className="page-title" style={{marginTop: "20px"}}>{this.props.langPack.popular_videos_title}</h1>
                        <TopVideosLayout 
                            videosList={this.state.topVideos.list} 
                            videosError={this.state.topVideos.error} 
                            langPackOthers={this.props.langPackOthers} 
                        />
                        <h1 className="page-title">{this.props.langPack.popular_clips_title}</h1>
                        <TopClipsLayout 
                            clipsList={this.state.topClips.list} 
                            clipsError={this.state.topClips.error} 
                            langPackOthers={this.props.langPackOthers}
                        />
                    </div>
                </div>
            </div>
    )
  }
}