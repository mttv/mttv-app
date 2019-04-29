import React from 'react'

const updatingAlert = (props) => {
    return(
        <div id="updating-alert">
            <div className="update-container">
                <div className="spinner-box">
                    <div className="circle-border">
                        <div className="circle-core"></div>
                    </div>  
                </div>
                <p className="h5 text-white mt-4 text-center" id="download-msg-1">{props.langPack.msg_1_1}<br /><small className="text-muted">{props.langPack.msg_1_2}</small></p>
                <p className="h5 text-white mt-4 text-center" id="download-msg-2">{props.langPack.msg_2}</p>
            </div>
        </div>
    )
}

export default updatingAlert