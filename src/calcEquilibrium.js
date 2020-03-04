const Simplex = require('./SimplexJS')

function selectPivotCol(A, m, n) {
  let q = 0

  let j = 1
  while (j < n+1) {
    if (A[m+1][j] < 0) {
      q = j
      break
    }
    j++
  }
  
  return q
}

function selectPivotRow(A, m, n, col) {
  let p = 0
  
  let r = 0 // Ratio of row border val to candidate pivot val.
            // Select the row that minimizes this value.

  for (let i = 1; i < m+1; i++) {
    let candidate = A[i][q]  // candidate pivot value
    if (candidate > Number.EPSILON) { // value at pivot point must be positive
                                      // (use epsilon to avoid rounding error)
      // TODO: Do we need this check?
      // let border = A[i][n+1]  // border value for candidate row
      // if (border <= 0) {
      //   p = i
      //   break
      // } else
      let r2 = A[i][n+1] / candidate
      if (r2 < r) {
        p = i
        r = r2
      }
    }
  }
  
  // TODO: error check that p > 0
  return p
}

// apply the simplex pivot method
function simplex(A) {
  let m = A.length - 2    // rows
  let n = A[0].length - 2 // cols
  let i, j                // row, col index for iterating
  let p, q                // pivot point a(p, q)
  let pivot_val           // value at pivot point
  
  q = selectPivotCol(A, m, n)
  // TODO: can we allow A to start with non-negative col border?
  while (q != 0) {  // while we still have a valid pivot col
    p = selectPivotRow(A, m, n, q)

		pivot_val = A[p][q]
  
    j = 1
		while (j <= n1) {
		    if (j != q) {
          A[p][j] = A[p][j] / pivot_val
        }
			j++
		}
    
    i = 1
		while (i <= m+1) {			/* Pivot main part */
		  if (i != p) {
			  j = 1
				while (j <= n+1) {
          if (j != q) {
            A[i][j] = A[i][j] - A[i][q] * A[p][j]
          }
          j++
				}
		  }
			i++
		}
    
    i = 1
		while (i <= m1) {			/* Pivot col */
      if (i != p) {
        A[i][q] = (0. - A[i][q]) / pivot_val
      }
			i++
    }

		A[p][q] = 1. / pivot_val
		t1 = A[p][0]
		A[p][0] = A[0][q]
		A[0][q] = t1				/* End pivot */
   
    // select next pivot col

	}
}

module.exports = function calcEquilibrium(game_matrix) {
  let result = {}
  let m = game_matrix.length
  let n = game_matrix[0].length

  // For the pivot method, we need to ensure the value of the game is positive. 
  // This is true as long as all the values in a particular row are positive, 
  // since Player I could opt to always choose that row. We can safely add a 
  // constant to each element of the matrix to accomplish this, then subtract 
  // the constant from the final optimized value.
  let matrix_shifted = [...game_matrix].map(row => [...row]) // clone game matrix
  let shift = 1 - Math.min(...matrix_shifted[0])  // the value that when added results in a min value of 1
  matrix_shifted = matrix_shifted.map(row => row.map(element => element + shift)) // apply shift

  // construct intial tableau
  matrix_shifted.push(Array(n).fill(-1))  // append row of -1s
  matrix_shifted.slice(0, -1).forEach(row => row.push(1)) // append col of 1s
  matrix_shifted.slice(-1)[0].push(0) // set lower right to 0
 
  // add col labels, represented as positive integers
  matrix_shifted.unshift([...Array(n+1).keys()].map(element => element + 1)) 

  // add row labels, represented as negative integers
  matrix_shifted.forEach((row, i) => row.unshift(-i))
  
  console.table(matrix_shifted)
 
  // unshift

  return result
}