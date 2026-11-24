# Two-endpoint rank walk: rejected

The current concurrent mixed-apply profile puts 111 self samples in native
`position_of`, behind 154 in JavaScript input staging and 140 in native apply.
The indexed rank query normally walks from its block's first node. The candidate
also walks from its last node, keeping independent link chains and stopping at
the first endpoint that reaches the target. No retained state or wire field is
added. This differs from the earlier rejected direction selection for visible
position-to-node lookup: it targets node-to-position rank and interleaves two
independent streams rather than choosing one dependent direction.

All 357 tests pass. The final linked module grows 115,387 → 115,560 B (+173 B).
`position_of` grows from 826 to 972 WAT lines, with 42 → 51 static loads and the
same 25 SIMD instructions. Both endpoint chains are present in the final code;
that is not proof of a beneficial MLP effect. The additional comparisons and
loads can offset overlapped link latency.

Five paired words processes show binary concurrent apply -1.7% by ratio of
medians, paired -4.3% (1.3-point IQR). Binary random receive is +7.2%, paired
+8.6% (32.9-point IQR). A complete three-pair lifecycle/throughput/tuple guard
has 90 timing medians improve over 5% and 94 worsen over 5%, including length
controls. The complete table retains paired ratios and dispersion. The results
do not establish a useful improvement meeting the requested no-regression rule.
Memory and wire representation are unchanged.

Reject the candidate and restore the original walk. Additional full pairs are
not collected to certify a rejected implementation; the three-pair guard is not
presented as resolving every noisy row. The preserved patch, frozen sources,
five paired words runs, full-suite raw data, symbol maps and linked disassembly
allow a future materially different experiment to be distinguished from this one.

- [Complete guard](rank-performance.md)
- [Rejected patch](rank-pair.patch)
- Raw prefix: `temp/optimization_2026_11_22_runtime/rank*`
