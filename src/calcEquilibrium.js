const Simplex = require('./SimplexJS')

module.exports = function calcEquilibrium(game_matrix) {
  let result = {}
  let model = {}

  // primal
  model.A = [...game_matrix].map(row => [...row])
  model.A = model.A.map(row => row.map(element => element * -1))
  model.A.forEach((row, index) => {
    row.unshift(1)
    row.push(0, 0, 0)
    row[4+index] = -1
  });
  model.A.unshift([0, 1, 1, 1, 0, 0, 0])
  
  model.b = [1, 0, 0, 0]
  model.c = [1, 0, 0, 0, 0, 0, 0]
  model.m = 4
  model.n = 4
  model.xLB = [0, 0, 0, 0, 0, 0, 0] 
  model.xUB = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity]
  Simplex.PrimalSimplex(model)
  result.utility = Math.round((model.z + Number.EPSILON) * 100) / 100
  result.col_strat = model.x.slice(1, 4)

  // dual
  model.A = game_matrix[0].map((col, i) => game_matrix.map(row => row[i] * -1))
  model.A.forEach((row, index) => {
    row.unshift(1)
    row.push(0, 0, 0)
    row[4+index] = -1
  });
  model.A.unshift([0, 1, 1, 1, 0, 0, 0])
  
  Simplex.PrimalSimplex(model)
  result.row_strat = model.x.slice(1, 4)

  return result
}