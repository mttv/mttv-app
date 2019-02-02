import React, { Component } from 'react'
import Img from 'react-image'
import ContentLoader from 'react-content-loader'

export default class VideoCard extends Component {

    formatDate = (date) => {
        const res = new Date(date)
        const monthNames = [
            this.props.langPackOthers.months.january, this.props.langPackOthers.months.fabruary, this.props.langPackOthers.months.march,
            this.props.langPackOthers.months.april, this.props.langPackOthers.months.may, this.props.langPackOthers.months.june, this.props.langPackOthers.months.july,
            this.props.langPackOthers.months.august, this.props.langPackOthers.months.september, this.props.langPackOthers.months.october,
            this.props.langPackOthers.months.november, this.props.langPackOthers.months.december
        ]
      
        const day = res.getDate()
        const monthIndex = res.getMonth()
        const year = res.getFullYear()
      
        return day + ' ' + monthNames[monthIndex] + ' ' + year
    }

    formatDuration = (time) => {
        let date = new Date(null)
        date.setSeconds(time)
        let res = date.toISOString().substr(11, 8)
        return res
    } 

    render() {
        return(
            <div className="col-sm-6 col-lg-3">
                <div className="card stream-preview video" data-toggle="modal" type={this.props.type} data-target={"#" + this.props.vid}>
                    <div className="card-image-container">
                        <Img className="card-img-top" 
                            src={this.props.previewImg} 
                            alt="" 
                            loader={<ContentLoader className="card-img-top"  primaryColor="#6441A4" secondaryColor="#7a5fb9"><rect x="1.18" y="-14.99" rx="5" ry="5" width="100%" height="177" /></ContentLoader>} 
                        />
                        <div className="card-img-overlay">
                            <h5 className="card-title" style={{textAlign: "right"}}>{(this.props.type === "video") ? this.props.langPackOthers.content_types.video : (this.props.type === "clip") ? this.props.langPackOthers.content_types.clip : ""}</h5>
                            <p className="card-text duration">{this.formatDuration(this.props.duration)}</p>
                            <p className="card-text date">{this.formatDate(this.props.date)}</p>
                            <p className="card-text" style={{bottom: "5px"}}>{this.props.views} {this.props.langPackOthers.views}</p>
                        </div>
                    </div>
                    <div className="card-body">
                        <h6 className="card-title">{this.props.channelName}<br/><small>{this.props.game}</small></h6>
                        <p className="card-text">{this.props.title}</p>
                    </div>
                </div>
            </div>
      )
    }
}