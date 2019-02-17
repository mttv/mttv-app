import React, { Component } from 'react'
import $ from 'jquery'
import GamesListLayout from '../layouts/Games/GamesListLayout'

export default class Games extends Component {

  constructor(props) {
    super(props)
    this.state = {
      gamesList: null,
      gamesListError: false,
      showLimit: 12,
      total: 0,
      showCounter: 0
    }
  }

  componentDidMount() {
    this.getGamesHandler("", this.state.showLimit)
  }

  componentDidUpdate() {
    $('#loaded').ready(() => {
        $('#loaded').fadeIn()
    })
}

  componentWillUnmount() {
    this.setState({gamesList: null})
    this.setState({gamesListError: false})
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showCounter !== nextState.showCounter) {
      return true
    } else {
      return false
    }
  }

  getGamesHandler = (query, limit) => {
    if (limit <= 100) {
      if(this.state.showLimit !== limit) {
        this.setState({showLimit: limit}) 
      }
      this.props.api.games.top({limit: limit}, (err, res) => {
        if(err) {
          this.setState({gamesList: null})
          this.setState({gamesListError: true})
          this.setState({showCounter: this.state.showCounter + 1})
        }
        else {
          this.setState({gamesListError: false})
          this.setState({gamesList: res.top})
          this.setState({total: res._total})
          this.setState({showCounter: this.state.showCounter + 1})
          // console.log(res.top[1])
        }
      })
    }
  }

  render() {
    return(
      <div className="container games-list">
        <h1 className="page-title">{this.props.langPack.title}</h1>
          <div id="loaded">
            <GamesListLayout 
              gamesList={this.state.gamesList} 
              gamesListError={this.state.gamesListError}
              getGamesHandler={this.getGamesHandler}
              showLimit={this.state.showLimit}
              total={this.state.total}
              langPackOthers={this.props.langPackOthers}
            />
          </div>
      </div>
    )
  }
}