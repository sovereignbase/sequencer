Sequencer C++ API
=================

``sequencer::Projection`` maintains Structural Order and resolves its visible
Frames. The native runtime owns anchoring, fragmentation, traversal, Session
clocks, pending Insertions, Acknowledgements and snapshot compaction.

The synchronous WebAssembly instance is shared by the
`TypeScript API <../index.html>`_. Each Projection retains independent history.
JavaScript owns Footage; native spans refer to its binding tokens and array
offsets. Application values never enter WebAssembly memory.

Register all active Actors before removals. Equal complete frontiers from every
active Actor permit whole-Session compaction: exported Sequences omit eligible
masks, deleted Footage and compacted Session claims, while retaining membership.
Compaction may translate retained anchors; discarded coordinates are not retained
for unregistered offline history.

Implementation
--------------

* ``class.hpp`` defines Projection state and operations.
* ``algorithms/`` implements editing, replication, reads and snapshot export.
* ``auxiliary/`` implements anchor resolution, fragmentation and traversal.
* ``components/`` contains the containment, pending and frontier tables.
* ``types/type.hpp`` defines coordinates, Strips, spans and results.
* ``bindings.cpp`` exposes numeric inputs and borrowed output views to TypeScript.

The API reference below is generated from the declarations and documentation
in ``src/c++``. Strip indices, original Frame coordinates and visible Projection
positions are distinct; each parameter documents the coordinate space it uses.
See `How Sequencer works <../documents/INTERNALS.html>`_ for the sequence model.

API reference
-------------

.. doxygenindex::
   :project: sequencer
