import React from 'react'

const sideBar = (props) => {
  return(
        <nav id="sidebar">
            <div className="sidebar-header">
                <input onChange={props.searchHandler} value={props.query} type="text" id="search-input" className="form-control" placeholder={props.searchTitle} />
                <hr />
            </div>
            <div className="streams-list">
                <div className="result-counter d-flex justify-content-center">
                    {props.streams.list ? <span className="badge total">{props.streams.total}</span> : <span className="badge total">{props.totalFollowing}</span>}
                </div>
                {props.searchQuery ? <props.streamsListLayout /> : <props.followingListLayout />}
            </div>
        </nav>
  )
}

export default sideBar