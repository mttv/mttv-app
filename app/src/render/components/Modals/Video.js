import React from 'react'

const video = (props) => {
    return(
        <div className="modal bd-example-modal-lg" id={props.vid} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div id={props.vid + "-body"} className="modal-body embed-responsive embed-responsive-16by9">
                    {/* <iframe
                        src={props.link}
                        height="100%"
                        width="100%"
                        scrolling="yes"
                        allowFullScreen="true">
                    </iframe> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default video
