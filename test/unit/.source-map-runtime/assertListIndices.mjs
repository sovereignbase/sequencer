export function assertListIndices(crListReplica) {
    if (!crListReplica.cursor)
        return;
    let index = crListReplica.size;
    while (crListReplica.cursor.next)
        crListReplica.cursor = crListReplica.cursor.next;
    while (index >= 1) {
        index--;
        crListReplica.cursor.index = index;
        if (crListReplica.cursor.prev === undefined)
            break;
        crListReplica.cursor = crListReplica.cursor.prev;
    }
}

//# sourceMappingURL=assertListIndices.mjs.map