module.exports = {
  shortenAddress: (address) => address.slice(0, 5) + '...' + address.slice(-4)
};