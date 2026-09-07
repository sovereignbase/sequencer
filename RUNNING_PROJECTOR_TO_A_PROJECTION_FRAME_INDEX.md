1. find shortest walk distance by comparing head, gate and tail
2. infer direction based on wheter the the requested index is larger or smaller
3. travel jump points updating them to new best jumpoint (square root of projection length)
4. reduce from walk distance while walking strips start jumping at the nearest jump point
5. always infer wheter the distance to next jumpoint already contains the index and wheter the walking from here or next jumpoint is shorter
