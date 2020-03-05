const calcEquilibrium = require('./calcEquilibrium')

// TODO: make some proper assert tests

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

sfv_matrix = [
  [0, -200, 150],
  [-120, 0, 150],
  [0, 0, -280],
]

console.log(calcEquilibrium(sfv_matrix))

sfv_matrix = [
  [0, 120, 0],
  [200, 0, 0],
  [-150, -150, 280],
]

console.log(calcEquilibrium(sfv_matrix))

sfv_matrix = [
  [0, 0, 200, -150],
  [120, 0, 0, -150],
  [0, 200, 0, 280],
]

console.log(calcEquilibrium(sfv_matrix))

sfv_matrix = [
  [0, -120, 0],
  [0, 0, -200],
  [-200, 0, 0],
  [150, 150, -280],
]

console.log(calcEquilibrium(sfv_matrix))