// Fixed Session entropy for matched process runs; workload seeds stay unchanged.
let state = 0x12345678
crypto.getRandomValues = (array) => {
  for (let i = 0; i < array.length; ++i) {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5
    array[i] = state >>> 0
  }
  return array
}
