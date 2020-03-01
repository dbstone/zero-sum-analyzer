const Simplex = require('./SimplexJS')

console.log('Rock Paper Scissors:')
var rps = {}
rps.A = [
  [0, 1, 1, 1, 0, 0, 0],
  [1, 0, -1, 1, 1, 0, 0],
  [1, 1, 0, -1, 0, 1, 0],
  [1, -1, 1, 0, 0, 0, 1],
]
rps.b = [1, 0, 0, 0]
rps.c = [1, 0, 0, 0, 0, 0, 0]
rps.m = 4
rps.n = 7
rps.xLB = [0, 0, 0, 0, 0, 0, 0] 
rps.xUB = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity]
Simplex.PrimalSimplex(rps)
console.log(`equilibrium strategy = ${rps.x.slice(1, 4)}`)
console.log(`expected value = ${rps.z}\n`)

console.log('SFV Okizeme:')
var sfv = {}
sfv.A = [
  [0, 1, 1, 1, 0, 0, 0],
  [-1, 281, 161, 281, 1, 0, 0],
  [-1, 81, 281, 281, 0, 1, 0],
  [-1, 431, 431, 1, 0, 0, 1],
]
sfv.b = [1, 0, 0, 0]
sfv.c = [1, 0, 0, 0, 0, 0, 0]
sfv.m = 4
sfv.n = 7
sfv.xLB = [0, 0, 0, 0, 0, 0, 0] 
sfv.xUB = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity]
Simplex.PrimalSimplex(sfv)
console.log(`equilibrium strategy = ${sfv.x}`)
console.log(`expected value = ${sfv.z}`)

var sfv = {}
sfv.A = [
 [0, 1, 1, 1, 0, 0, 0],
 [-1, 151, 271, 151, 1, 0, 0],
 [-1, 351, 151, 151, 0, 1, 0],
 [-1, 1, 1, 431, 0, 0, 1],
]
sfv.b = [1, 0, 0, 0]
sfv.c = [1, 0, 0, 0, 0, 0, 0]
sfv.m = 4
sfv.n = 7
sfv.xLB = [0, 0, 0, 0, 0, 0, 0]
sfv.xUB = [Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, Infinity]
Simplex.PrimalSimplex(sfv)
console.log(`equilibrium strategy = ${sfv.x}`)
console.log(`expected value = ${sfv.z}\n`)