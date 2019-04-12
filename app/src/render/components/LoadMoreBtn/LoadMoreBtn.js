import React from 'react'

const loadMoreBtn = (props) => {
    const { query, total, limit, functionHandler, langPackOthers } = props
    if (total > limit) {
        return <button className="btn load-more" onClick={() => functionHandler(query, limit + 18)}>{langPackOthers.load_more_btn}</button>
    } else {
        return <div className='no-load-more' />
    }
}

export default loadMoreBtn