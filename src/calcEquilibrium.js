function selectPivotCol(A, m, n) {
  let q = 0

  for (let j = 1; j < n+1; j++) {
    if (A[m+1][j] < 0) {
      q = j
      break
    }
  }
  
  return q
}

function selectPivotRow(A, m, n, q) {
  let p = 0
  
  let r = Infinity // Ratio of row border val to candidate pivot val.
                   // Select the row that minimizes this value.

  for (let i = 1; i < m+1; i++) {
    let candidate = A[i][q]  // candidate pivot value
    if (candidate > Number.EPSILON) { // value at pivot point must be positive
                                      // (use epsilon to avoid rounding error)
      // TODO: Do we need this check?
      // let border = A[i][n+1]  // border value for candidate row
      // // if (A[i][n+1] <= 0) {
      // //   p = i
      // //   break
      // } else {
      let r2 = A[i][n+1] / candidate
      if (r2 < r) {
        p = i
        r = r2
        // }
      }
    }
  }
  
  // TODO: error check that p > 0
  return p
}

function pivot(A, m, n, p, q) {
  // NOTE: Cells must be updated in the proper order, since 
  // some cells are calculated based on another cell's new value.

  // update cells in same row as pivot
  for (let j = 1; j <= n+1; j++) {
    if (j != q) {
      A[p][j] = A[p][j] / A[p][q]
    }
  }

  // update cells not aligned with pivot
  for (let i = 1; i <= m+1; i++) {
    if (i != p) {
      for (let j = 1; j <= n+1; j++) {
        if (j != q) {
          A[i][j] = A[i][j] - A[i][q] * A[p][j]
        }
      }
    }
  }

  // update cells in same col as pivot
  for (let i = 1; i <= m+1; i++) {
    if (i != p) {
      A[i][q] = (0 - A[i][q]) / A[p][q]
    }
  }

  // update pivot cell
  A[p][q]= 1 / A[p][q]

  // TODO: use this code for non-in-place version?
  // for (let i = 1; i <= m+1; i++) {
  //   for (let j = 1; j <= n+1; j++) {
  //     if (i == p && j == q) { // pivot cell
  //       A[p][q] = 1. / A[p][q]
  //     } else if (i == p) { // same row as pivot
  //       A[i][j] = A[i][j] / A[p][q]
  //     } else if (j == q) { // same col as pivot
  //       A[i][j] = (0. - A[i][j]) / A[p][q]
  //     } else {
  //       A[i][j] = A[i][j] - A[i][q] * A[p][j]
  //     }
  //   }
  // }
  
  // swap pivot row/col labels
  let temp = A[p][0]
  A[p][0] = A[0][q]
  A[0][q] = temp
}

// apply the simplex pivot method
function simplex(A) {
  let m = A.length - 2    // rows
  let n = A[0].length - 2 // cols
  let p, q                // pivot point a(p, q)
  
  q = selectPivotCol(A, m, n)
  while (q > 0) {  // while we still have a valid pivot col
    p = selectPivotRow(A, m, n, q)
    pivot(A, m, n, p, q)
    q = selectPivotCol(A, m, n)
	}
}

// extract game value and equilibrium strategies from a solved tableau
function extractTableauResult(A, m, n, shift) {
  let result = {}
  result.player1 = Array(m)
  result.player2 = Array(n)

  let val = 1 / A[m+1][n+1]

  for (let j = 1; j <= n; j++) {
    if (A[0][j] < 0) {
      result.player1[-A[0][j]-1] = A[m+1][j] * val
    } else {
      result.player2[A[0][j]-1] = 0
    }
	}
  
  for (let i = 1; i <= m; i++) {
    if (A[i][0] < 0) {
      result.player1[-A[i][0]-1] = 0
    } else {
      result.player2[A[i][0]-1] = A[i][n+1] * val
    }
	}
  
  result.value = val - shift  // unshift

  return result
}

module.exports = function calcEquilibrium(game_matrix) {
  let m = game_matrix.length
  let n = game_matrix[0].length

  // For the pivot method, we need to ensure the value of the game is positive. 
  // This is true as long as all the values in a particular row are positive, 
  // since Player I could opt to always choose that row. We can safely add a 
  // constant to each element of the matrix to accomplish this, then subtract 
  // the constant from the final optimized value.
  let shifted_matrix = [...game_matrix].map(row => [...row]) // clone game matrix
  let shift = 1 - Math.min(...shifted_matrix[0])  // the value that when added results in a min value of 1
  shifted_matrix = shifted_matrix.map(row => row.map(element => element + shift)) // apply shift

  // construct intial tableau
  shifted_matrix.push(Array(n).fill(-1))  // append row of -1s
  shifted_matrix.slice(0, -1).forEach(row => row.push(1)) // append col of 1s
  shifted_matrix.slice(-1)[0].push(0) // set lower right to 0
 
  // add col labels, represented as positive integers
  shifted_matrix.unshift([...Array(n+1).keys()].map(element => element + 1)) 

  // add row labels, represented as negative integers
  shifted_matrix.forEach((row, i) => row.unshift(-i))

  simplex(shifted_matrix)

  return extractTableauResult(shifted_matrix, m, n, shift)
}