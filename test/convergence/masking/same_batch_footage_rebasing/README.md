# Same-batch Footage rebasing

An insertion followed by removal of its prefix produces two ordered consumer Splices. Merging the retained snapshot binds several roots to one flat Footage array. Copy-on-write must preserve the insertion Splice's original span until it has been read, then rebase private content before releases. Both apply and merge must reproduce the receiver's final visible values.
