import React from 'react'
import calcEquilibrium from './calcEquilibrium'

function round(val, decimalPlaces) {
  let multiplier = (10 ** decimalPlaces)
  return Math.round((val + Number.EPSILON) * multiplier) / multiplier
}

function Cell(props) {
  return (
    <input className={props.className} type={props.type} value={props.value} onChange={props.onChange}/>
  )
}

class Board extends React.Component {
  renderDataCell(i, j) {
    return (
      <Cell
        value={this.props.dataCells[i][j]}
        onChange={(event) => this.props.onChange(i, j, event)}
        className="dataCell"
        type='number'
      />
    )
  }
  
  renderLabelCell(label) {
    return (
      <Cell
        value={label}
        className="dataCell"
        type='text'
      />
    )
  }

  renderRow(i) {
    let cols = []
    cols.push(this.renderLabelCell(this.props.rowLabels[i]))
    for (let j = 0; j < this.props.dataCells[0].length; j++) {
      cols.push(this.renderDataCell(i, j))
    }
    return (
      <div className="board-row">
        {cols}
      </div>
    )
  }

  render() {
    let rows = []
    
    let colLabels = []
    colLabels.push(<div className='hiddenCell'/>)
    for (let j = 0; j < this.props.dataCells[0].length; j++) {
      colLabels.push(this.renderLabelCell(this.props.colLabels[j]))
    }

    rows.push(
      <div className="board-row">
        {colLabels}
      </div>
    )

    for (let i = 0; i < this.props.dataCells.length; i++) {
      rows.push(this.renderRow(i))
    }

    return rows
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
      dataCells: Array(3).fill(Array(3).fill(0)),
      rowLabels: Array(3),
      colLabels: Array(3),
      result: {value: null, player1: null, player2: null}
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(i, j, event) {
    const dataCells = [...this.state.dataCells].map(row => [...row])
    dataCells[i][j] = event.target.value
    this.setState({dataCells: dataCells})
  }

  calculate() {
    let numberMatrix = this.state.dataCells.map(row => row.map(element => Number(element)))
    let result = calcEquilibrium(numberMatrix)
    result.value = round(result.value, 3)
    this.setState({result: result})
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            dataCells={this.state.dataCells}
            rowLabels={this.state.rowLabels}
            colLabels={this.state.colLabels}
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
