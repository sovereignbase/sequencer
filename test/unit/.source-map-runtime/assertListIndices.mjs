export function assertListIndices(crListReplica) {
  if (!crListReplica.currentBlock) return
  let index = crListReplica.size
  while (crListReplica.currentBlock.nextBlock)
    crListReplica.currentBlock = crListReplica.currentBlock.nextBlock
  while (index >= 1) {
    index--
    crListReplica.currentBlock.index = index
    if (crListReplica.currentBlock.previousBlock === undefined) break
    crListReplica.currentBlock = crListReplica.currentBlock.previousBlock
  }
}

//# sourceMappingURL=assertListIndices.mjs.map
