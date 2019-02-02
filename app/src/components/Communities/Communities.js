import React, { Component } from 'react'
import GameCard from '../Games/GameCard'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class Communities extends Component {

  constructor(props) {
    super(props)
    this.state = {
      communitiesList: null,
      communitiesListError: false,
      showLimit: 12
    }
  }

  componentDidMount() {
    this.getCommunitiesHandler(this.state.showLimit)
  }

  componentWillUnmount() {
    this.setState({communitiesList: null})
    this.setState({communitiesListError: false})
  }

  getCommunitiesHandler = (limit) => {
    if (limit <= 100) {
      if(this.state.showLimit !== limit) {
        this.setState({showLimit: limit}) 
      }
      this.props.api.communities.top({limit: limit}, (err, res) => {
        if(err) {
          this.setState({communitiesList: null})
          this.setState({communitiesListError: true})
        }
        else {
          this.setState({communitiesListError: false})
          this.setState({communitiesList: res.communities})
          // console.log(res.communities)
        }
      })
    } else {
      const Alert = withReactContent(Swal)
      Alert.fire({
        type: 'warning',
        title: 'Looks like you\'ve reached the bottom!',
        text: 'Didn\'t find the community you wanted?Try search for it.',
        showCancelButton: false
      })
    }
  }

  communitiesListLayout = (props) => {
    const { communitiesList, communitiesListError } = props
    if (communitiesList == null) {
      return(
        <div className="row" id="games-list">
          <p>Loading</p>
        </div>
      )
    } else if(communitiesList !== null) {
      const list = communitiesList.map((res, i) => {
        return <GameCard key={i} img={res.avatar_image_url} title={res.display_name} viewers={res.viewers} />
      })
      return(
        <div className="row" id="games-list">
          {list}
          <button className="btn load-more" onClick={() => this.getCommunitiesHandler(this.state.showLimit + 6)}>Load More</button>
        </div>
      )
    } else if(communitiesListError) {
      return(
        <div className="row" id="games-list">
          <p>Error on try get gamesList</p>
        </div>
      )
    } else {
      return <div className="row" id="games-list" />
    }
  }

  render() {
    return(
      <div className="container games-list">
        <h1 className="page-title">Communities</h1>
        {/* Cards start */}
        <this.communitiesListLayout communitiesList={this.state.communitiesList} communitiesListError={this.state.communitiesListError} />
        {/* Cards end */}
      </div>
    )
  }
}