# Large strings

`npm run bench:text` compares arrays of UTF-16 code units with string Footage at
1,024, 65,536 and 1,048,576 code units. Both representations use the same text
and the public Projection API. Independent runs alternate representation order.

Insertion and replacement include splitting in the array path. Snapshot creation
receives the same string snapshot in both modes; text mode opts into retained
string Footage with the fourth constructor argument. `values.text` includes joining
array output; the string path requests text directly. `apply` and `merge` request
string Splices only in string mode. `apply.array` retains the default array result.
Array and text reads, whole and partial removals, partial replacements and both
snapshot formats are measured separately. Snapshot cases include a compactable
partial removal and 32 masks waiting for an offline Actor. Append batches contain
16 chunks and an indexed read; concurrent replay applies four peers and reads
the text. Both force a character access before API timing ends.

Setup, assertions, destruction and explicit JS process garbage collection are
outside API intervals. Each warmup accumulates 10 ms of API work; each measured
sample accumulates 25 ms, capped at 8,192 mutation calls or 131,072 reads. Reads
reuse one populated fixture; remote inputs are prepared once per measurement.
Short reads use timed batches to limit clock overhead. Reports retain actual call counts
and elapsed API time. Checks verify length, boundary values, changed positions
and output representation. Memory estimates cover one populated instance;
MessagePack and gzip encode its string snapshot and insertion Gossip outside
API timing. Strings use a conservative two-byte-per-code-unit storage estimate;
this does not measure the JavaScript engine's physical string representation.

Options: `--runs 5`, `--sizes 1024,65536,1048576`,
`--representations array,string`, `--output <path>` and `--no-output`.
JSON samples and the Markdown report default to `benchmark/.results/text`.
Completed runs also update the Text mode benchmark tables in the root README.
Reports identify local runs or link to the GitHub Actions run that produced them.
`--no-output` leaves both report files and the README unchanged.
