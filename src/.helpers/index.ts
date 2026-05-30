/** Rebuilds the block-start index cache from linked projection state. */
export { rebuildBlocksByIndex } from './rebuildBlocksByIndex/index.js'

/** Moves the replica cursor to a requested live index. */
export { seekCursorToIndex } from './seekCursorToIndex/index.js'

/** Rebuilds linked projection order from CRDT previousBlock buckets. */
export { rebuildLiveProjection } from './rebuildLiveProjection/index.js'

/** Converts snapshot/delta blocks into mutable local state blocks. */
export { createStateBlock } from './createStateBlock/index.js'

/** Adds a block to item-id and previousBlock indexes. */
export { attachBlockToIndexes } from './attachBlockToIndexes/index.js'

/** Installs the first block into an empty replica. */
export { attachBlockToEmptyReplica } from './attachBlockToEmptyReplica/index.js'

/** Removes a block from item-id and previousBlock indexes. */
export { detachBlockFromIndexes } from './detachBlockFromIndexes/index.js'

/** Deletes a full live block and records its tombstones. */
export { deleteBlock } from './deleteBlock/index.js'

/** Dispatches typed CRList DOM events. */
export { dispatchCRListEvent } from './dispatchCRListEvent/index.js'

/** Reparents a block by changing its stable previousBlock id. */
export { changePreviousBlockOf } from './changePreviousBlockOf/index.js'

/** Links a block between two projection neighbours. */
export { linkBlockBetween } from './linkBlockBetween/index.js'

/** Parses proxy property keys into list indexes. */
export { indexFromPropertyKey } from './indexFromPropertyKey/index.js'

/** Fast-path splice for a simple child insert. */
export { trySpliceChildInsert } from './trySpliceChildInsert/index.js'

/** Fast-path splice for an inserted parent and reparented child. */
export { trySpliceInsertedParent } from './trySpliceInsertedParent/index.js'

/** Fast-path splice for tombstone-backed replacements. */
export { trySpliceReplacement } from './trySpliceReplacement/index.js'

/** Fast-path splice for concurrent sibling-parent inserts. */
export { trySpliceSiblingParentInsert } from './trySpliceSiblingParentInsert/index.js'

/** Fast-path splice for concurrent sibling inserts. */
export { trySpliceSiblingInsert } from './trySpliceSiblingInsert/index.js'

/** Allocates the next local block start id. */
export { getBlockStartId } from './getBlockStartId/index.js'

/** Resolves a block's current live start index. */
export { getBlockStartIndex } from './getBlockStartIndex/index.js'

/** Resolves a block's final virtual item id. */
export { getBlockEndId } from './getBlockEndId/index.js'

/** Resolves the live index after a virtual item id. */
export { getIndexAfterBlockId } from './getIndexAfterBlockId/index.js'

/** Splits a block into left and right block state. */
export { splitBlock } from './splitBlock/index.js'

/** Splits the cursor so it starts at a target index. */
export { splitCursorAtIndex } from './splitCursorAtIndex/index.js'

/** Splits the cursor so insertion after an index is block-aligned. */
export { splitCursorAfterIndex } from './splitCursorAfterIndex/index.js'

/** Filters a received block down to unseen live runs. */
export { sliceBlockIntoUnseenBlocks } from './sliceBlockIntoUnseenBlocks/index.js'

/** Deletes one virtual item id, splitting blocks as needed. */
export { deleteItemById } from './deleteItemById/index.js'

/** Writes a block into a local index-keyed change patch. */
export { writeBlockChange } from './writeBlockChange/index.js'

/** Chooses the nearest of three numeric cursor candidates. */
export { nearestOf3Numbers } from './nearestOf3Numbers/index.js'

/** Queries and records compact deleted-id ranges. */
export { isDeleted, markDeletedRange } from './deletedRanges/index.js'
