const calcEquilibrium = require('./calcEquilibrium')

rps_matrix = [
  [0, -1, 1],
  [1, 0, -1],
  [-1, 1, 0],
]

console.log(calcEquilibrium(rps_matrix))

sfv_matrix = [
  [0, 200, -150],
  [120, 0, -150],
  [0, 0, 280],
]

console.log(calcEquilibrium(sfv_matrix))