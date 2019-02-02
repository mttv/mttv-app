import React, { Component } from 'react'
import $ from 'jquery'
import GameCard from './GameCard'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export default class Games extends Component {

  constructor(props) {
    super(props)
    this.state = {
      gamesList: null,
      gamesListError: false,
      showLimit: 12
    }
  }

  componentDidMount() {
    this.getGamesHandler(this.state.showLimit)
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

  getGamesHandler = (limit) => {
    if (limit <= 100) {
      if(this.state.showLimit !== limit) {
        this.setState({showLimit: limit}) 
      }
      this.props.api.games.top({limit: limit}, (err, res) => {
        if(err) {
          this.setState({gamesList: null})
          this.setState({gamesListError: true})
        }
        else {
          this.setState({gamesListError: false})
          this.setState({gamesList: res.top})
          // console.log(res.top[1])
        }
      })
    } else {
      const Alert = withReactContent(Swal)
      Alert.fire({
        type: 'warning',
        title: 'Looks like you\'ve reached the bottom!',
        text: 'Didn\'t find the game you wanted?Try search for it.',
        showCancelButton: false
      })
    }
  }

  gamesListLayout = (props) => {
    const { gamesList, gamesListError } = props
    if (gamesList == null) {
      return(
        <div className="row" id="games-list">
          <p>Loading</p>
        </div>
      )
    } else if(gamesList !== null) {
      const list = gamesList.map((res, i) => {
        return <GameCard 
                setActiveGame={this.setActiveGame} 
                key={i} 
                img={res.game.box.large} 
                title={res.game.name} 
                viewers={res.viewers}
                langPackOthers={this.props.langPackOthers}
              />
      })
      return(
        <div className="row" id="games-list">
          {list}
          <button className="btn load-more" onClick={() => this.getGamesHandler(this.state.showLimit + 6)}>{this.props.langPackOthers.load_more_btn}</button>
        </div>
      )
    } else if(gamesListError) {
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
        <h1 className="page-title">{this.props.langPack.title}</h1>
          <div id="loaded">
            <this.gamesListLayout gamesList={this.state.gamesList} gamesListError={this.state.gamesListError} />
          </div>
      </div>
    )
  }
}