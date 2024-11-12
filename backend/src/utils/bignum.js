const { BN } = require('bn.js')

const toTokenBn = (num, decimals = 6) => {
  if (typeof decimals === 'string')
    decimals = parseInt(decimals)

  let numstr = "0"
  if (Number.isInteger(num)) {
    numstr = (new BN(num).mul(new BN(10 ** decimals))).toString()
  } else {
    numstr = (Number(num) * (10 ** decimals)).toString()
  }
  return BigInt(numstr);
}

const fromTokenBn = (num, decimals = 6) => {
  if (typeof decimals === 'string') decimals = parseInt(decimals)

  let numstr
  if (Number.isInteger(num)) {
    numstr = (new BN(num).div(new BN(10 ** decimals))).toString()
  } else {
    numstr = (Number(num) / (10 ** decimals)).toString()
  }
  return Number(numstr)
}

module.exports = {
  toTokenBn,
  fromTokenBn
}
