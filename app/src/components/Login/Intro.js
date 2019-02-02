import React from 'react'

const intro = (props) => {
    return(
        <div className="welcome-start">
          <div id="logo-intro" className="logo">
            <img src="logo.png" alt="Twitch Player" />
          </div><br />
          <div id="btns-intro">
            <button id="log-in-btn" className="btn twitch-log-in"><span>{props.langPack.login_btn}</span><i className="fab fa-twitch icon"></i></button><br />
          </div>
        </div>
    )
}

export default intro;