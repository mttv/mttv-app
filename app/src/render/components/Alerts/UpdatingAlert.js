import React from 'react'

const updatingAlert = () => {
    return(
        <div id="updating-alert">
            <div className="update-container">
                <div className="spinner-box">
                    <div className="circle-border">
                        <div className="circle-core"></div>
                    </div>  
                </div>
                <p className="h5 text-white mt-4 text-center" id="download-msg-1">Downloading new update. Stay tuned!<br /><small className="text-muted">It may take few minutes.</small></p>
                <p className="h5 text-white mt-4 text-center" id="download-msg-2">Installing update...</p>
            </div>
        </div>
    )
}

export default updatingAlert