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
        onChange={(event) => this.props.onDataChange(i, j, event)}
        className="data-cell"
        type='number'
      />
    )
  }
  
  renderLabelCell(label, onChange) {
    return (
      <Cell
        value={label}
        onChange={onChange}
        className="data-cell"
        type='text'
      />
    )
  }

  renderRow(i) {
    let cols = []
    cols.push(
      <div className='first-col-hidden-cell'>
        <button className='mod-row-button' onClick={this.props.onAddCol}>-</button>
      </div>
    )
    cols.push(this.renderLabelCell(this.props.rowLabels[i], event => this.props.onRowLabelChange(i, event)))
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
    
    let removeColButtons = []
    removeColButtons.push(<div className='first-col-hidden-cell'/>)
    removeColButtons.push(<div className='hidden-cell'/>)
    for (let j = 0; j < this.props.dataCells[0].length; j++) {
      removeColButtons.push(
        <div className='hidden-cell'>
          <button className='mod-col-button' onClick={this.props.onAddCol}>-</button>
        </div>
      )
    }

    removeColButtons.push(
      <div className='hidden-cell'>
        <button className='mod-col-button' onClick={this.props.onAddCol}>+</button>
      </div>
    )

    rows.push(
      <div className="board-row">
        {removeColButtons}
      </div>
    )
    
    let colLabels = []
    colLabels.push(<div className='first-col-hidden-cell'/>)
    colLabels.push(<div className='hidden-cell'/>)
    for (let j = 0; j < this.props.dataCells[0].length; j++) {
      colLabels.push(this.renderLabelCell(this.props.colLabels[j], event => this.props.onColLabelChange(j, event)))
    }

    rows.push(
      <div className="board-row">
        {colLabels}
      </div>
    )

    for (let i = 0; i < this.props.dataCells.length; i++) {
      rows.push(this.renderRow(i))
    }
    
    rows.push(
      <div className='board-row'>
        <div className='first-col-hidden-cell'>
          <button className='mod-row-button' onClick={this.props.onAddRow}>+</button>
        </div>
      </div>
    )

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
        <h3>Value: {props.result.value}</h3>
        <h3>Row-player strategy:</h3>
        {props.result.player1.map((e, i) => <div>{props.rowLabels[i]} {toPercentString(e)}<br/></div>)}
        <h3>Col-player strategy:</h3>
        {props.result.player2.map((e, i) => <div>{props.colLabels[i]} {toPercentString(e)}<br/></div>)}
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
      rowLabels: ['Rock', 'Paper', 'Scissors'],
      colLabels: ['Rock', 'Paper', 'Scissors'],
      result: {value: null, player1: null, player2: null}
    }
    this.handleDataChange = this.handleDataChange.bind(this)
    this.addRow = this.addRow.bind(this)
    this.addCol = this.addCol.bind(this)
    this.handleRowLabelChange = this.handleRowLabelChange.bind(this)
    this.handleColLabelChange = this.handleColLabelChange.bind(this)
  }

  handleDataChange(i, j, event) {
    const dataCells = [...this.state.dataCells].map(row => [...row])
    dataCells[i][j] = event.target.value
    this.setState({dataCells: dataCells})
  }

  handleRowLabelChange(i, event) {
    const rowLabels = [...this.state.rowLabels]
    rowLabels[i] = event.target.value
    this.setState({rowLabels: rowLabels})
  }
  
  handleColLabelChange(j, event) {
    const colLabels = [...this.state.colLabels]
    colLabels[j] = event.target.value
    this.setState({colLabels: colLabels})
  }

  calculate() {
    let numberMatrix = this.state.dataCells.map(row => row.map(element => Number(element)))
    let result = calcEquilibrium(numberMatrix)
    result.value = round(result.value, 3)
    this.setState({result: result})
  }

  addRow() {
    const rowLabels = [...this.state.rowLabels]
    rowLabels.push("")
    this.setState({rowLabels: rowLabels})
    
    const dataCells = [...this.state.dataCells].map(row => [...row])
    dataCells.push(Array(dataCells[0].length).fill(0))
    this.setState({dataCells: dataCells})
  }

  addCol() {
    const colLabels = [...this.state.colLabels]
    colLabels.push("")
    this.setState({colLabels: colLabels})
    
    const dataCells = [...this.state.dataCells].map(row => [...row])
    dataCells.forEach(row => row.push(0))
    this.setState({dataCells: dataCells})
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            dataCells={this.state.dataCells}
            rowLabels={this.state.rowLabels}
            colLabels={this.state.colLabels}
            onDataChange={this.handleDataChange}
            onRowLabelChange={this.handleRowLabelChange}
            onColLabelChange={this.handleColLabelChange}
            onAddRow={this.addRow}
            onAddCol={this.addCol}
          />
        </div>
        <div>
          <button className="calculate-button" onClick={() => this.calculate()}>
            calculate
          </button>
        </div>
        <div className="game-info">
          <Results 
            result={this.state.result}
            rowLabels={this.state.rowLabels}
            colLabels={this.state.colLabels}
          />
        </div>
      </div>
    )
  }
}

export default Game
