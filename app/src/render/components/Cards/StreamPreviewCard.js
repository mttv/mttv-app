import React from 'react'
import { Link } from 'react-router-dom'
import Img from 'react-image'
import ImgPreloader from './ImgPreloader'
import VerifiedIcon from '../../../img/verified.png'

const streamPreviewCard = (props) => {
  return(
    <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3">
        <Link to={{
            pathname: '/app/channel',
            search: '?id=' + props.channelId
        }}>
            <div className="card stream-preview stream shadow-sm">
                <div className="card-image-container">
                    <Img className="card-img-top" 
                        src={props.previewImg} 
                        alt={props.title} 
                        loader={<ImgPreloader cardType="others" />} 
                    />
                    <div className="card-img-overlay">
                        <h5 className="card-title">{(props.type === "live") ? <i className="far fa-play-circle stream-preview-icon"></i> : <i className="fas fa-undo-alt stream-preview-icon"></i>}</h5>
                        <p className="card-text"><i className="fas fa-eye"></i> {props.viewers}</p>
                        <Img className="card-avatar" 
                            src={props.logoImg} 
                            alt={props.title} 
                            loader={<div />} 
                        />
                        {props.verified ? <img src={VerifiedIcon} className="card-verified-icon" alt="" /> : <div />}
                    </div>
                </div>
                <div className="card-body shadow-sm">
                    <h6 className="card-title"><small className="badge">Channel:</small>{props.channelName}</h6>
                    <p className="card-text"><small className="badge">Game:</small>{props.game}</p>
                    <p className="card-text"><small className="badge">Title:</small>{props.title}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default streamPreviewCard