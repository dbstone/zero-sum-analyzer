const Simplex = require('./SimplexJS')

function addConstants(A, m, n) {
  A.forEach((row, index) => {
    // Why don't we need slack variables? Is it because SimplexJS automatically adds artificial variables?
    row.push(...Array(m).fill(0)) // add empty columns for slack variables
    row[n+index] = 1              // diagonal 1s, one for each constraint
    row.unshift(-1)               // insert column of -1s on left side
  })
}

// additional constraint: x1 + x2 + ... + xn == 1
function addSumConstraint(A, m, n) {
  let sum_constraint = Array(n).fill(1)
  sum_constraint.unshift(0)
  sum_constraint.push(...Array(m).fill(0))
  A.unshift(sum_constraint)
}

module.exports = function calcEquilibrium(game_matrix) {
  let result = {}
  let model = {}  // input struct for SimplexJS
  model.m = game_matrix.length + 1// rows
  model.n = game_matrix[0].length + 1 // cols
  model.b = Array(model.m).fill(0)
  model.b.unshift(1) // right side of sum constraint
  model.c = Array(model.n * 2).fill(0)
  model.c.unshift(1)
  model.xLB = Array(model.n * 2 + 1).fill(0)
  model.xUB = Array(model.n * 2 + 1).fill(Infinity)

  // The algorithm implemented by SimplexJS requires that all elements of the 
  // A matrix be positive values. We can safely add a constant to each element
  // to accomplish this, then subtract the constant from the final optimized value.
  let matrix_shifted = [...game_matrix].map(row => [...row]) // clone game matrix
  let A_min = Math.min(...matrix_shifted.flat())  // get min value
  matrix_shifted = matrix_shifted.map(row => row.map(element => element - A_min + 1)) // shift matrix so minimum value is 1
  
  // primal
  model.A = [...matrix_shifted].map(row => [...row]) // clone matrix so we can reuse it for dual
  addConstants(model.A, model.m, model.n)
  addSumConstraint(model.A, model.m, model.n)
  Simplex.PrimalSimplex(model) 
  result.expected_value = model.z + A_min - 1 // remove shift
  result.expected_value = Math.round((result.expected_value + Number.EPSILON) * 1000) / 1000 // round to 3 decimal places
  result.col_strat = model.x.slice(1, model.n)

  // dual
  model.A = matrix_shifted[0].map((col, i) => matrix_shifted.map(row => row[i])) // transpose primal
  addConstants(model.A, model.m, model.n)
  addSumConstraint(model.A, model.m, model.n)
  Simplex.PrimalSimplex(model)
  result.row_strat = model.x.slice(1, model.n)

  return result
}