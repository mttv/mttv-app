import React from 'react'

const offlineStatusAlert = () => {
    return(
        <div className="card offline-alert" id="offline-alert">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <img src="https://img.icons8.com/dusk/64/000000/wifi-off.png" className="offline-icon" alt="" />
                    <h6 className="p-2">Looks like your internet connection is down.</h6>
                    <button onClick={() => window.location.reload()} type="button" className="btn btn-outline-warning">Reload</button>
                </div>
            </div>
        </div>
    )
}

export default offlineStatusAlert