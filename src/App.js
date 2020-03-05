import React from 'react'
import calcEquilibrium from './calcEquilibrium'

function round(val, decimalPlaces) {
  let multiplier = (10 ** decimalPlaces)
  return Math.round((val + Number.EPSILON) * multiplier) / multiplier
}

function Square(props) {
  return (
    <input className="square" type="text" value={props.value} onChange={props.onChange}/>
  )
}

class Board extends React.Component {
  renderSquare(i, j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onChange={(event) => this.props.onChange(i, j, event)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0, 0)}
          {this.renderSquare(0, 1)}
          {this.renderSquare(0, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1, 0)}
          {this.renderSquare(1, 1)}
          {this.renderSquare(1, 2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2, 0)}
          {this.renderSquare(2, 1)}
          {this.renderSquare(2, 2)}
        </div>
      </div>
    )
  }
}

function toPercentString(val) {
  return String(round(val * 100, 1), 1) + '%'
}

function Results(props) {
  if (props.result.value !== null) {
    return (
      <div>
        <div>{props.result.value}</div>
        <div>Row player: {String(props.result.player1.map(e => toPercentString(e)))}</div>
        <div>Col player: {String(props.result.player2.map(e => toPercentString(e)))}</div>
      </div>
    )
  } else {
    return <div/>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      squares: Array(3).fill(Array(3).fill(0)),
      result: {value: null, player1: null, player2: null}
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(i, j, event) {
    const squares = [...this.state.squares].map(row => [...row])
    squares[i][j] = event.target.value
    this.setState({squares: squares})
  }

  calculate() {
    let numberMatrix = this.state.squares.map(row => row.map(element => Number(element)))
    let result = calcEquilibrium(numberMatrix)
    result.value = round(result.value, 3)
    // result.player1 = result.player1.map(element => round(element, 3))
    // result.player2 = result.player2.map(element => round(element, 3))
    this.setState({result: result})
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={this.state.squares}
            onChange={this.handleChange}
          />
        </div>
        <div className="calculate-button">
          <button onClick={() => this.calculate()}>
            calculate
          </button>
        </div>
        <div className="game-info">
          <Results result={this.state.result}/>
        </div>
      </div>
    )
  }
}

export default Game
