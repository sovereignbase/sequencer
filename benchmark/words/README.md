# Words

Run `npm run bench:words` to compare numeric and opt-in byte metadata after
6,000 seeded edits. Append, prepend, random mixed edits and four independent
concurrent authors retain the same Footage in both modes.

Snapshot and update sizes include MessagePack encoding. Timings cover export,
encoding, decoding, construction, complete loading, batch application and
decoding followed by application. Preparation, checks, destruction and explicit
JS process garbage collection stay outside timings. Each case warms for 25 ms
and measures at least 50 ms, up to 10,000 calls. Reports use three runs by default.

`--runs`, `--edits`, `--modes`, `--output` and `--no-output` follow the other benchmark
runners. JSON/Markdown reports and the README block refresh automatically.
