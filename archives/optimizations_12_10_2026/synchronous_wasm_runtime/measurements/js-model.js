// ../sequencertemp/src/components/ContainmentTable/class.ts
var ContainmentTable = class {
  /** Original Strips indexed by Insertion Session and start. */
  strips = /* @__PURE__ */ new Map()
  /**
   * Checks whether an Insertion is already materialized.
   *
   * @param incomingInsertion Insertion whose own identity is tested.
   * @returns Whether its Session and start are indexed.
   */
  has(incomingInsertion) {
    const sequencer = this.strips.get(incomingInsertion[3])
    if (sequencer) return sequencer.has(incomingInsertion[4])
    return false
  }
  /**
   * Returns an Insertion's canonical anchoring Strip.
   *
   * @param incomingInsertion Insertion identifying its dependency by anchor Session and start.
   * @returns The dependency's original Strip, or `undefined` if absent.
   */
  get(incomingInsertion) {
    const sequencer = this.strips.get(incomingInsertion[0])
    if (!sequencer) return void 0
    return sequencer.get(incomingInsertion[1])
  }
  /**
   * Indexes a Strip by its own canonical Insertion identity.
   *
   * @param incomingStrip Original Strip to retain by reference.
   */
  set(incomingStrip) {
    const sequencer =
      this.strips.get(incomingStrip.insertionSession) ??
      /* @__PURE__ */ new Map()
    if (sequencer.size === 0)
      void this.strips.set(incomingStrip.insertionSession, sequencer)
    void sequencer.set(incomingStrip.insertionStart, incomingStrip)
  }
}

// ../sequencertemp/src/components/FrontierTable/class.ts
var FrontierTable = class {
  /** Known active Actors participating in acknowledgement consensus. */
  actors = /* @__PURE__ */ new Set()
  /** Reported logical times indexed by removal Session and Actor. */
  sessions = /* @__PURE__ */ new Map()
  /** Actors whose acknowledgements are ignored by this table. */
  retirees = /* @__PURE__ */ new Set()
  /**
   * Observes an Actor's reported Session frontiers.
   * Retired Actors are ignored; causal completeness is not validated.
   *
   * @param frontier Actor identifier followed by Session/end pairs.
   */
  observeAcknowledgement(frontier) {
    const actorID = frontier[0]
    if (this.retirees.has(actorID)) return
    void this.actors.add(actorID)
    for (let i = 1; i < frontier.length; i += 2) {
      const sessionID = frontier[i]
      const time = frontier[i + 1]
      const session = this.sessions.get(sessionID) ?? /* @__PURE__ */ new Map()
      if (session.size === 0) void this.sessions.set(sessionID, session)
      if (this.sessions.get(actorID) ?? 0 < time)
        void session.set(actorID, time)
    }
  }
  /**
   * Returns the stored frontiers grouped by Actor.
   *
   * @returns Acknowledgement tuples, including Actor-only entries.
   */
  getFrontiers() {
    const frontiers = []
    for (const actorID of this.actors) {
      const acknowledgement = [actorID]
      for (const [sessionID, session] of this.sessions) {
        const time = session.get(actorID)
        if (time === void 0) continue
        void acknowledgement.push(sessionID, time)
      }
      void frontiers.push(acknowledgement)
    }
    return frontiers
  }
  /**
   * Returns Sessions with equal frontiers from every known active Actor.
   *
   * @returns Removal Session identifiers eligible for compaction.
   */
  getCompactableSessions() {
    const ids = []
    for (const [sessionID, frontiers] of this.sessions) {
      if (frontiers.size !== this.actors.size) continue
      let expected
      let acknowledged = true
      for (const frontier of frontiers.values()) {
        if (expected === void 0) {
          expected = frontier
          continue
        }
        if (frontier !== expected) {
          acknowledged = false
          break
        }
      }
      if (acknowledged) void ids.push(sessionID)
    }
    return ids
  }
  /**
   * Retires an Actor from this table's acknowledgement requirements.
   *
   * @param actorID Actor to remove and ignore in subsequent observations.
   */
  eraseActor(actorID) {
    void this.retirees.add(actorID)
    void this.actors.delete(actorID)
    for (const session of this.sessions.values()) void session.delete(actorID)
  }
}

// ../sequencertemp/src/components/PendingTable/class.ts
var PendingTable = class {
  /** Pending buckets indexed by anchor Session and start. */
  insertions = /* @__PURE__ */ new Map()
  /**
   * Queues an Insertion under its missing dependency.
   *
   * @param incoming Insertion to retain by reference.
   */
  set(incoming) {
    let sequencer = this.insertions.get(incoming[0])
    if (!sequencer) {
      sequencer = /* @__PURE__ */ new Map()
      this.insertions.set(incoming[0], sequencer)
    }
    let pending = sequencer.get(incoming[1])
    if (!pending) {
      pending = []
      sequencer.set(incoming[1], pending)
    }
    pending.push(incoming)
  }
  /**
   * Detaches the Insertions waiting for a newly materialized dependency.
   *
   * @param incomingStrip Materialized Strip identifying the dependency.
   * @returns Its pending bucket in arrival order, or `undefined` if absent.
   */
  take(incomingStrip) {
    const sequencer = this.insertions.get(incomingStrip.insertionSession)
    if (!sequencer) return
    const pending = sequencer.get(incomingStrip.insertionStart)
    if (!pending) return
    sequencer.delete(incomingStrip.insertionStart)
    if (sequencer.size === 0)
      this.insertions.delete(incomingStrip.insertionSession)
    return pending
  }
}

// ../sequencertemp/src/auxiliary/linkJumps.ts
function linkJumps(left, right, frames, strips) {
  if (left.rightJump && left.rightJump !== right)
    left.rightJump.leftJump = void 0
  if (right.leftJump && right.leftJump !== left)
    right.leftJump.rightJump = void 0
  left.rightJump = right
  left.rightJumpFrameCount = right.leftJumpFrameCount = frames
  left.rightJumpStripCount = right.leftJumpStripCount = strips
  right.leftJump = left
}

// ../sequencertemp/src/auxiliary/findProjectionPositionOfStrip.ts
function findProjectionPositionOfStrip(strip, gateDiff = 0) {
  let leftCursor = strip
  let rightCursor = strip
  let leftFrameDistance = 0
  let rightFrameDistance = 0
  let leftStripDistance = 0
  let rightStripDistance = 0
  let leftJump
  let rightJump
  let leftJumpedDistance = 0
  let rightJumpedDistance = 0
  let knownIndex
  const optimalJumpSpacing = Math.round(Math.sqrt(this.structuralStripCount))
  let leftJumpFound = !leftCursor.leftStep
  let rightJumpFound = !rightCursor.rightStep
  while (!leftJumpFound || !rightJumpFound) {
    if (!leftJumpFound) {
      leftCursor = leftCursor.leftStep
      const leftDiff = leftCursor.fragmentDiff ?? leftCursor.insertionDiff
      leftFrameDistance += Math.max(0, leftDiff)
      ++leftStripDistance
      if (leftCursor === this.gate) {
        knownIndex = this.gatePosition + leftFrameDistance
      }
      if (leftStripDistance === optimalJumpSpacing) {
        leftJump = leftCursor
        leftJumpedDistance = leftFrameDistance
      }
      leftJumpFound = // Visible boundaries supply known indices even beside hidden history; structural edges
        // and existing jump endpoints also bound the initial local gap.
        leftCursor === this.head ||
        leftCursor === this.tail ||
        !leftCursor.leftStep ||
        !!leftCursor.rightJump ||
        !!leftCursor.leftJump
    }
    if (!rightJumpFound) {
      const rightDiff = rightCursor.fragmentDiff ?? rightCursor.insertionDiff
      rightFrameDistance += Math.max(0, rightDiff)
      rightCursor = rightCursor.rightStep
      ++rightStripDistance
      if (rightCursor === this.gate) {
        knownIndex = this.gatePosition + gateDiff - rightFrameDistance
      }
      if (rightStripDistance === optimalJumpSpacing) {
        rightJump = rightCursor
        rightJumpedDistance = rightFrameDistance
      }
      rightJumpFound = // Stop at a known visible boundary, structural end, or existing jump anchor.
        rightCursor === this.head ||
        rightCursor === this.tail ||
        !rightCursor.rightStep ||
        !!rightCursor.leftJump ||
        !!rightCursor.rightJump
    }
  }
  if (leftCursor !== strip) {
    if (leftStripDistance >= optimalJumpSpacing * 2) {
      linkJumps(
        leftCursor,
        leftJump,
        leftFrameDistance - leftJumpedDistance,
        leftStripDistance - optimalJumpSpacing
      )
      linkJumps(leftJump, strip, leftJumpedDistance, optimalJumpSpacing)
    } else {
      linkJumps(leftCursor, strip, leftFrameDistance, leftStripDistance)
    }
  }
  if (rightCursor !== strip) {
    if (rightStripDistance >= optimalJumpSpacing * 2) {
      linkJumps(strip, rightJump, rightJumpedDistance, optimalJumpSpacing)
      linkJumps(
        rightJump,
        rightCursor,
        rightFrameDistance - rightJumpedDistance,
        rightStripDistance - optimalJumpSpacing
      )
    } else {
      linkJumps(strip, rightCursor, rightFrameDistance, rightStripDistance)
    }
  }
  this.leftJumpToPatch = strip
  this.rightJumpToPatch = strip.rightJump
  if (rightCursor === this.head && strip !== this.head) return 0
  if (leftCursor === this.tail && strip !== this.tail)
    return (
      this.projectionFrameCount -
      Math.max(0, strip.fragmentDiff ?? strip.insertionDiff)
    )
  if (knownIndex !== void 0) {
    return knownIndex
  }
  while (true) {
    if (leftCursor === this.head) return leftFrameDistance
    if (rightCursor === this.head) return 0
    if (leftCursor === this.tail)
      return (
        this.projectionFrameCount -
        Math.max(0, strip.fragmentDiff ?? strip.insertionDiff)
      )
    if (rightCursor === this.tail)
      return (
        this.projectionFrameCount -
        Math.max(0, rightCursor.fragmentDiff ?? rightCursor.insertionDiff) -
        rightFrameDistance
      )
    if (!leftCursor.leftStep) {
      return leftFrameDistance
    }
    if (!rightCursor.rightStep) {
      const rightDiff = rightCursor.fragmentDiff
      return (
        this.projectionFrameCount - Math.max(0, rightDiff) - rightFrameDistance
      )
    }
    const leftJump2 = leftCursor.leftJump
    if (leftJump2) {
      let leftJumpFrameCount = leftCursor.leftJumpFrameCount
      let leftJumpStripCount = leftCursor.leftJumpStripCount
      if (
        leftJumpStripCount < optimalJumpSpacing &&
        leftJump2 !== this.head &&
        leftJump2 !== this.tail &&
        leftJump2 !== this.gate
      ) {
        const nextLeftJump = leftJump2.leftJump
        if (
          nextLeftJump && // The extra structural span must fit the remaining spacing budget before bypassing its endpoint.
          leftJump2.leftJumpStripCount <=
            optimalJumpSpacing - leftJumpStripCount
        ) {
          leftJumpFrameCount += leftJump2.leftJumpFrameCount
          leftJumpStripCount += leftJump2.leftJumpStripCount
          linkJumps(
            nextLeftJump,
            leftCursor,
            leftJumpFrameCount,
            leftJumpStripCount
          )
          leftCursor = nextLeftJump
        } else {
          leftCursor = leftJump2
        }
      } else {
        leftCursor = leftJump2
      }
      leftFrameDistance += leftJumpFrameCount
    } else {
      leftCursor = leftCursor.leftStep
      const leftDiff = leftCursor.fragmentDiff ?? leftCursor.insertionDiff
      leftFrameDistance += Math.max(0, leftDiff)
    }
    const rightJump2 = rightCursor.rightJump
    if (rightJump2) {
      let rightJumpFrameCount = rightCursor.rightJumpFrameCount
      let rightJumpStripCount = rightCursor.rightJumpStripCount
      if (
        rightJumpStripCount < optimalJumpSpacing &&
        rightJump2 !== this.tail &&
        rightJump2 !== this.head &&
        rightJump2 !== this.gate
      ) {
        const nextRightJump = rightJump2.rightJump
        if (
          nextRightJump && // Only merge when the next span fits the remaining structural spacing budget.
          rightJump2.rightJumpStripCount <=
            optimalJumpSpacing - rightJumpStripCount
        ) {
          rightJumpFrameCount += rightJump2.rightJumpFrameCount
          rightJumpStripCount += rightJump2.rightJumpStripCount
          linkJumps(
            rightCursor,
            nextRightJump,
            rightJumpFrameCount,
            rightJumpStripCount
          )
          rightCursor = nextRightJump
        } else {
          rightCursor = rightJump2
        }
      } else {
        rightCursor = rightJump2
      }
      rightFrameDistance += rightJumpFrameCount
    } else {
      const rightDiff = rightCursor.fragmentDiff ?? rightCursor.insertionDiff
      rightFrameDistance += Math.max(0, rightDiff)
      rightCursor = rightCursor.rightStep
    }
  }
}

// ../sequencertemp/src/auxiliary/anchorsOverlap.ts
function anchorsOverlap(incomingStrip, currentRightStep) {
  return (
    // Parent Session and start must both match; a shared numerical offset alone is not the same anchor.
    incomingStrip.anchorSession === currentRightStep.anchorSession &&
    incomingStrip.anchorStart === currentRightStep.anchorStart && // Compare the immutable original logical point; fragmentStart describes materialization, not competition.
    incomingStrip.anchorDiff === currentRightStep.anchorDiff
  )
}

// ../sequencertemp/src/auxiliary/competitionIsLarger.ts
function competitionIsLarger(incomingStrip, competition) {
  return (
    // Negative insertions go further right towards their affected fragment.
    (incomingStrip.insertionDiff < 0 && competition.insertionDiff > 0) || // Strips with the same effect from different Sessions are sorted by their
    // Session identifiers. Within one Session, its reserved logical time range
    // tells whether the incoming insertion was authored after this competitor.
    // Apply the numerical tie-breaks only within the same effect group; the sign rule above orders groups.
    (incomingStrip.insertionDiff < 0 === competition.insertionDiff < 0 && // Descending Session order makes same-anchor placement independent of arrival order.
      (incomingStrip.insertionSession < competition.insertionSession || // Only equal Sessions use insertionStart as the next tie-break; equal own identities are duplicates.
        (incomingStrip.insertionSession === competition.insertionSession &&
          incomingStrip.insertionStart < competition.insertionStart)))
  )
}

// ../sequencertemp/src/auxiliary/splitStrip.ts
function splitStrip(anchoringStrip, anchorDiff, incomingDiff) {
  if (incomingDiff < 0 && anchoringStrip?.footage) {
    void anchoringStrip.footage.fill(
      void 0,
      anchorDiff,
      anchorDiff + Math.abs(incomingDiff)
    )
  }
  const rightStep = anchoringStrip.rightStep
  const anchoringStripDiff =
    anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff
  const leftFragmentDiff =
    (anchoringStripDiff < 0 ? -1 : 1) *
    (anchorDiff - (anchoringStrip.fragmentStart ?? 0))
  const rightFragmentDiff =
    anchoringStripDiff -
    leftFragmentDiff +
    (incomingDiff < 0 ? incomingDiff : 0)
  anchoringStrip.fragmentDiff = leftFragmentDiff
  if (rightFragmentDiff === 0) return rightStep
  const rightFragment = {
    anchorSession: anchoringStrip.anchorSession,
    anchorStart: anchoringStrip.anchorStart,
    anchorDiff: anchoringStrip.anchorDiff,
    insertionSession: anchoringStrip.insertionSession,
    insertionStart: anchoringStrip.insertionStart,
    insertionDiff: anchoringStrip.insertionDiff,
    // Only take reference.
    footage: anchoringStrip.footage,
    // A fragment does not independently inherit the original Strip's
    // right-side competitor relation.
    rightCompetitor: void 0,
    // Preserve the existing fragment chain by placing the new fragment between
    // the anchoring Strip and its previous right fragment.
    rightFragment: anchoringStrip.rightFragment,
    // A reducing edit consumes the prefix after the anchor; the retained right fragment begins after it.
    fragmentStart: anchorDiff + (incomingDiff < 0 ? Math.abs(incomingDiff) : 0),
    fragmentDiff: rightFragmentDiff,
    // The newly created fragment immediately follows the anchoring Strip.
    leftStep: anchoringStrip,
    // The new fragment has not yet been selected as a jump endpoint.
    leftJump: void 0,
    leftJumpFrameCount: 0,
    leftJumpStripCount: 0,
    // Preserve the original immediate right neighbour.
    rightStep,
    // Its original left fragment still owns the outgoing jump span.
    rightJump: void 0,
    rightJumpFrameCount: 0,
    rightJumpStripCount: 0,
  }
  anchoringStrip.rightFragment = rightFragment
  anchoringStrip.rightStep = rightFragment
  if (rightStep) rightStep.leftStep = rightFragment
  if (anchoringStrip === this.tail) this.tail = rightFragment
  ++this.structuralStripCount
  return rightFragment
}

// ../sequencertemp/src/auxiliary/containsAnchor.ts
function containsAnchor(anchor, strip, startFrame, endFrame) {
  return (
    // The stable anchor must refer to the same originating insertion.
    anchor.insertionSession === strip.anchorSession &&
    anchor.insertionStart === strip.anchorStart && // The logical anchor point must fall within the inclusive accepted range.
    strip.anchorDiff >= startFrame && // Include the right logical boundary: an N-Frame Insertion supplies points 0 through N.
    strip.anchorDiff <= endFrame
  )
}

// ../sequencertemp/src/auxiliary/subtreeEnd.ts
function subtreeEnd(rootStrip) {
  const ancestors = []
  let previousStrip = rootStrip
  let previousFragmentFrame = 0
  let nextStrip = previousStrip.rightStep
  if (rootStrip.rightJump) {
    this.leftJumpToPatch = rootStrip
    this.rightJumpToPatch = rootStrip.rightJump
  }
  while (nextStrip) {
    let ancestorStrip = previousStrip
    let ancestorFragmentFrame = previousFragmentFrame
    while (
      // An original right fragment belongs to its Insertion even when descendants intervene in structural order.
      ancestorStrip.rightFragment !== nextStrip &&
      !containsAnchor(
        ancestorStrip,
        nextStrip,
        0,
        // Containment uses the original N+1 logical points 0..N, including removed Frame locations;
        // runtime fragment bounds must not sever causal descendants.
        Math.abs(ancestorStrip.insertionDiff)
      )
    ) {
      const ancestor = ancestors.pop()
      if (!ancestor) return previousStrip
      ;[ancestorStrip, ancestorFragmentFrame] = ancestor
    }
    void ancestors.push([ancestorStrip, ancestorFragmentFrame])
    if (ancestorStrip.rightFragment === nextStrip) {
      previousFragmentFrame =
        ancestorFragmentFrame + // A rightFragment exists only after splitting, which assigns the left fragment's effect.
        Math.abs(ancestorStrip.fragmentDiff)
    } else {
      previousFragmentFrame = 0
    }
    previousStrip = nextStrip
    if (previousStrip.rightJump) {
      this.leftJumpToPatch = previousStrip
      this.rightJumpToPatch = previousStrip.rightJump
    } else if (previousStrip === this.rightJumpToPatch) {
      this.leftJumpToPatch = void 0
      this.rightJumpToPatch = void 0
    }
    nextStrip = nextStrip.rightStep
  }
  return previousStrip
}

// ../sequencertemp/src/auxiliary/anchorStrip.ts
function anchorStrip(incomingStrip, anchoringStrip, anchorDiff) {
  const removalEnd = incomingStrip.anchorDiff - incomingStrip.insertionDiff
  let projectionDiff = 0
  while (true) {
    let leftStep = anchoringStrip
    let rightStep
    let incomingDiff = incomingStrip.fragmentDiff ?? incomingStrip.insertionDiff
    if (incomingStrip.insertionDiff < 0 && anchoringStrip.insertionDiff > 0) {
      incomingDiff = -Math.min(
        -incomingDiff,
        Math.max(
          0,
          (anchoringStrip.fragmentStart ?? 0) +
            (anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff) -
            anchorDiff
        )
      )
      incomingStrip.fragmentDiff = incomingDiff
    }
    if (incomingStrip.insertionDiff < 0 && incomingDiff === 0)
      anchorDiff = Math.max(
        anchoringStrip.fragmentStart ?? 0,
        Math.min(
          anchorDiff,
          (anchoringStrip.fragmentStart ?? 0) +
            Math.abs(anchoringStrip.fragmentDiff)
        )
      )
    if (anchoringStrip) {
      const anchoringStripLength = Math.abs(
        anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff
      )
      if (
        anchorDiff ===
        (anchoringStrip.fragmentStart ?? 0) + anchoringStripLength
      ) {
        rightStep = anchoringStrip.rightStep
      } else {
        rightStep = splitStrip.call(
          this,
          anchoringStrip,
          anchorDiff,
          incomingDiff
        )
      }
    } else {
      rightStep = this.structuralHead
    }
    if (
      incomingStrip.insertionDiff > 0 &&
      anchoringStrip &&
      anchoringStrip.insertionDiff < 0 &&
      incomingStrip.anchorSession === anchoringStrip.insertionSession &&
      incomingStrip.anchorStart === anchoringStrip.insertionStart &&
      rightStep &&
      rightStep.anchorSession === anchoringStrip.anchorSession &&
      rightStep.anchorStart === anchoringStrip.anchorStart &&
      rightStep.anchorDiff ===
        anchoringStrip.anchorDiff + incomingStrip.anchorDiff
    ) {
      while (rightStep.rightCompetitor) rightStep = rightStep.rightCompetitor
      leftStep = subtreeEnd.call(this, rightStep)
      rightStep = leftStep.rightStep
    }
    while (
      rightStep && // Skip zero-effect nodes only when they share the canonical parent and have an earlier
      // anchor point; nodes at the same point must remain available for competition.
      (rightStep.fragmentDiff ?? rightStep.insertionDiff) === 0 &&
      rightStep.anchorSession === incomingStrip.anchorSession &&
      rightStep.anchorStart === incomingStrip.anchorStart &&
      rightStep.anchorDiff < incomingStrip.anchorDiff
    ) {
      leftStep = rightStep
      rightStep = rightStep.rightStep
    }
    if (rightStep && anchorsOverlap(incomingStrip, rightStep)) {
      let largerCompetitor
      let smallerCompetitor = rightStep
      while (
        smallerCompetitor &&
        competitionIsLarger(incomingStrip, smallerCompetitor)
      ) {
        largerCompetitor = smallerCompetitor
        smallerCompetitor = smallerCompetitor.rightCompetitor
      }
      incomingStrip.rightCompetitor = smallerCompetitor
      if (largerCompetitor) {
        largerCompetitor.rightCompetitor = incomingStrip
        leftStep = subtreeEnd.call(this, largerCompetitor)
        rightStep = leftStep.rightStep
      } else {
        rightStep = smallerCompetitor
        leftStep = smallerCompetitor.leftStep
      }
    }
    incomingStrip.leftStep = leftStep
    incomingStrip.rightStep = rightStep
    if (leftStep) leftStep.rightStep = incomingStrip
    else this.structuralHead = incomingStrip
    if (rightStep) {
      rightStep.leftStep = incomingStrip
    }
    if (incomingDiff > 0) {
      if (!this.head || !leftStep || rightStep === this.head)
        this.head = incomingStrip
      if (!this.tail || !rightStep || leftStep === this.tail)
        this.tail = incomingStrip
    }
    while (
      this.head &&
      (this.head.fragmentDiff ?? this.head.insertionDiff) <= 0
    ) {
      if (this.head.rightJump && this.head.rightJumpFrameCount > 0) {
        this.head.rightJump.leftJump = void 0
        this.head.rightJump = void 0
      }
      this.head = this.head.rightStep
    }
    while (
      this.tail &&
      (this.tail.fragmentDiff ?? this.tail.insertionDiff) <= 0
    ) {
      if (this.tail.leftJump && this.tail.leftJumpFrameCount > 0) {
        this.tail.leftJump.rightJump = void 0
        this.tail.leftJump = void 0
      }
      this.tail =
        this.tail.leftJump && this.tail.leftJumpFrameCount === 0
          ? this.tail.leftJump
          : this.tail.leftStep
    }
    incomingStrip.leftJump = void 0
    incomingStrip.leftJumpFrameCount = 0
    incomingStrip.leftJumpStripCount = 0
    incomingStrip.rightJump = void 0
    incomingStrip.rightJumpFrameCount = 0
    incomingStrip.rightJumpStripCount = 0
    ++this.structuralStripCount
    this.projectionFrameCount += incomingDiff
    projectionDiff += incomingDiff
    const nextFragment =
      anchoringStrip && anchoringStrip.insertionDiff > 0
        ? anchoringStrip.rightFragment
        : void 0
    if (
      // Positive Insertions need no mask continuation. A mask stops without another positive
      // fragment, or when that fragment starts at or beyond the original exclusive removal end.
      incomingStrip.insertionDiff >= 0 ||
      !nextFragment ||
      nextFragment.fragmentStart >= removalEnd
    )
      return projectionDiff
    const fragmentStart = nextFragment.fragmentStart
    const nextMask = {
      anchorSession: incomingStrip.anchorSession,
      anchorStart: incomingStrip.anchorStart,
      anchorDiff: incomingStrip.anchorDiff,
      insertionSession: incomingStrip.insertionSession,
      insertionStart: incomingStrip.insertionStart,
      insertionDiff: incomingStrip.insertionDiff,
      // Express this mask fragment's offset relative to the original mask's canonical anchor.
      fragmentStart: fragmentStart - incomingStrip.anchorDiff,
      // Clip to the next fragment's positive length and the remaining original removal interval.
      fragmentDiff: -Math.min(
        Math.max(0, nextFragment.fragmentDiff),
        removalEnd - fragmentStart
      ),
    }
    incomingStrip.rightFragment = nextMask
    incomingStrip = nextMask
    anchoringStrip = nextFragment
    anchorDiff = fragmentStart
  }
}

// ../sequencertemp/src/auxiliary/insertFirst.ts
function insertFirst(strip) {
  strip.leftStep = void 0
  strip.leftJump = void 0
  strip.leftJumpFrameCount = 0
  strip.leftJumpStripCount = 0
  strip.rightStep = void 0
  strip.rightJump = void 0
  strip.rightJumpFrameCount = 0
  strip.rightJumpStripCount = 0
  this.structuralHead = strip
  this.head = strip
  this.gate = strip
  this.tail = strip
  this.structuralStripCount = 1
  this.projectionFrameCount += strip.fragmentDiff ?? strip.insertionDiff
  this.gatePosition = 0
  this.leftJumpToPatch = void 0
  this.rightJumpToPatch = void 0
}

// ../sequencertemp/src/auxiliary/isGossip.ts
var isSafeInteger = Number.isSafeInteger
function isInsertion(data) {
  if (!Array.isArray(data) || (data.length !== 6 && data.length !== 7))
    return false
  if (
    // Exact integer coordinates are required for identity lookup and deterministic numerical tie-breaks.
    !isSafeInteger(data[0]) ||
    !isSafeInteger(data[1]) ||
    !isSafeInteger(data[2]) ||
    !isSafeInteger(data[3]) ||
    !isSafeInteger(data[4]) ||
    !isSafeInteger(data[5]) || // Wire Insertions must have an original positive or negative length;
    // zero runtime fragments are represented inside the graph, not as new zero-length Insertions.
    data[5] === 0
  )
    return false
  return data.length === 6 || data[6] === void 0 || Array.isArray(data[6])
}
function isAcknowledgement(data) {
  if (!Array.isArray(data) || data.length < 1 || (data.length & 1) === 0)
    return false
  for (let i = 0; i < data.length; ++i)
    if (!isSafeInteger(data[i])) return false
  return true
}

// ../sequencertemp/src/auxiliary/findContainingFragment.ts
function findContainingFragment(origin, incomingStrip) {
  let anchoringStrip = origin
  while (true) {
    const fragmentStart = anchoringStrip.fragmentStart ?? 0
    const fragmentEnd =
      fragmentStart +
      Math.abs(anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff)
    const anchorIsWithinFragment =
      incomingStrip.insertionDiff < 0
        ? incomingStrip.anchorDiff >= fragmentStart &&
          incomingStrip.anchorDiff < fragmentEnd
        : incomingStrip.anchorDiff <= fragmentEnd
    if (anchorIsWithinFragment) {
      if (
        incomingStrip.insertionDiff < 0 && // If the original removal spans farther than this fragment, materialize only this fragment's
        // remaining suffix here; anchorStrip handles any affected later original fragments.
        Math.abs(incomingStrip.insertionDiff) >
          fragmentEnd - incomingStrip.anchorDiff
      )
        incomingStrip.fragmentDiff = incomingStrip.anchorDiff - fragmentEnd
      return [Math.max(incomingStrip.anchorDiff, fragmentStart), anchoringStrip]
    }
    let consumingMask = anchoringStrip.rightStep
    while (
      consumingMask && // Stay within masks and siblings anchored to this original Insertion; another parent's
      // coordinate space cannot determine whether the requested point was consumed.
      consumingMask.anchorSession === origin.insertionSession &&
      consumingMask.anchorStart === origin.insertionStart && // Zero-effect masks consume nothing. Positive siblings are not masks. Past mask endpoints
      // are skipped with >= for affected Frames, but > for positive right-boundary anchors.
      (consumingMask.fragmentDiff === 0 ||
        consumingMask.insertionDiff > 0 ||
        (incomingStrip.insertionDiff < 0
          ? incomingStrip.anchorDiff >=
            consumingMask.anchorDiff +
              (consumingMask.fragmentStart ?? 0) +
              Math.abs(consumingMask.fragmentDiff)
          : incomingStrip.anchorDiff >
            consumingMask.anchorDiff +
              (consumingMask.fragmentStart ?? 0) +
              Math.abs(consumingMask.fragmentDiff)))
    )
      consumingMask =
        consumingMask.insertionDiff > 0
          ? consumingMask.rightCompetitor
          : // Advance to a mask's next fragment only once the requested point reaches its start.
            // Otherwise use the next competitor or structural successor so a gap owned by another mask
            // is not skipped. Positive anchors retain the current mask at an equal boundary.
            consumingMask.rightFragment &&
              (incomingStrip.insertionDiff < 0
                ? incomingStrip.anchorDiff >=
                  consumingMask.anchorDiff +
                    consumingMask.rightFragment.fragmentStart
                : incomingStrip.anchorDiff >
                  consumingMask.anchorDiff +
                    consumingMask.rightFragment.fragmentStart)
            ? consumingMask.rightFragment
            : (consumingMask.rightCompetitor ?? consumingMask.rightStep)
    if (
      consumingMask && // The resolved candidate must actually be a reducing Insertion anchored in the original coordinate space.
      consumingMask.insertionDiff < 0 &&
      consumingMask.anchorSession === origin.insertionSession &&
      consumingMask.anchorStart === origin.insertionStart
    ) {
      const maskStart =
        consumingMask.anchorDiff + (consumingMask.fragmentStart ?? 0)
      const maskEnd = maskStart + Math.abs(consumingMask.fragmentDiff)
      if (incomingStrip.insertionDiff > 0)
        return [
          incomingStrip.anchorDiff - consumingMask.anchorDiff,
          consumingMask,
        ]
      const anchorDiff = incomingStrip.anchorDiff - consumingMask.anchorDiff
      const consumed = Math.min(
        Math.abs(incomingStrip.fragmentDiff ?? incomingStrip.insertionDiff),
        maskEnd - incomingStrip.anchorDiff
      )
      incomingStrip.fragmentStart =
        (incomingStrip.fragmentStart ?? 0) + consumed
      incomingStrip.fragmentDiff =
        incomingStrip.insertionDiff + incomingStrip.fragmentStart
      if (incomingStrip.fragmentDiff === 0)
        return [anchorDiff + consumed, consumingMask]
      const advancedAnchor = incomingStrip.anchorDiff + consumed
      let rightFragment = anchoringStrip.rightFragment
      while (
        rightFragment && // A right fragment ending at or before the endpoint contains no further affected Frame;
        // advance through rightFragment, without revisiting previous fragments.
        advancedAnchor >=
          rightFragment.fragmentStart + Math.abs(rightFragment.fragmentDiff)
      )
        rightFragment = rightFragment.rightFragment
      if (!rightFragment) {
        incomingStrip.fragmentStart = Math.abs(incomingStrip.insertionDiff)
        incomingStrip.fragmentDiff = 0
        return [anchorDiff + consumed, consumingMask]
      }
      const resolvedAnchor = Math.max(
        advancedAnchor,
        rightFragment.fragmentStart
      )
      incomingStrip.fragmentStart = Math.min(
        -incomingStrip.insertionDiff,
        resolvedAnchor - incomingStrip.anchorDiff
      )
      incomingStrip.fragmentDiff =
        incomingStrip.insertionDiff + incomingStrip.fragmentStart
      return [resolvedAnchor, rightFragment]
    }
    anchoringStrip = anchoringStrip.rightFragment
  }
}

// ../sequencertemp/src/auxiliary/findFramePositionByProjectionPosition.ts
function findFramePositionByProjectionPosition(index, forInsertion = false) {
  let after = 0
  let cursorStrip = this.gate
  let cursorIndex = this.gatePosition
  let leftJumpToPatch = this.leftJumpToPatch
  let rightJumpToPatch = this.rightJumpToPatch
  const tailDiff = this.tail.fragmentDiff ?? this.tail.insertionDiff
  const tailIndex = this.projectionFrameCount - tailDiff
  const tailDistance = Math.abs(tailIndex - index)
  const gateDistance = Math.abs(this.gatePosition - index)
  if (
    // Distance to travel from head to requested projection position is shorter than distance from gate and tail.
    index < gateDistance && // Allow a tie with tail after requiring a strict improvement over gate; head's start is already index zero.
    index <= tailDistance
  ) {
    cursorStrip = this.head
    cursorIndex = 0
    leftJumpToPatch = cursorStrip
    rightJumpToPatch = cursorStrip.rightJump
  } else if (
    // Distance to travel from tail to requested projection position is shorter than distance from gate.
    // A strict comparison keeps the existing gate when tail offers no distance improvement.
    tailDistance < gateDistance
  ) {
    cursorStrip = this.tail
    cursorIndex = tailIndex
    leftJumpToPatch = cursorStrip.leftJump
    rightJumpToPatch = cursorStrip
  }
  const optimalJumpSpacing = Math.round(Math.sqrt(this.structuralStripCount))
  let jumpStart = cursorStrip
  let jumpStartIndex = cursorIndex
  let jumpSteps = 0
  while (true) {
    if (cursorStrip.leftJump || cursorStrip.rightJump) {
      jumpStart = cursorStrip
      jumpStartIndex = cursorIndex
      jumpSteps = 0
    }
    const cursorDiff = cursorStrip.fragmentDiff ?? cursorStrip.insertionDiff
    const stripLength = cursorDiff > 0 ? cursorDiff : 0
    if (cursorIndex <= index && index < cursorIndex + stripLength) {
      if (
        forInsertion &&
        !after &&
        index === cursorIndex &&
        cursorStrip.fragmentStart !== void 0
      ) {
        const mask = cursorStrip.leftStep
        const originalZero =
          mask &&
          mask.insertionDiff < 0 &&
          mask.anchorDiff === 0 &&
          mask.anchorSession === cursorStrip.insertionSession &&
          mask.anchorStart === cursorStrip.insertionStart &&
          mask.leftStep?.insertionSession === mask.anchorSession &&
          mask.leftStep?.insertionStart === mask.anchorStart && // A zero-offset right fragment follows an existing child; only the original Strip's zero is free.
          mask.leftStep?.fragmentStart === void 0
        if (
          (originalZero ||
            cursorStrip.fragmentStart === 0 ||
            (index === 0 &&
              (mask?.anchorSession !== cursorStrip.insertionSession ||
                mask.anchorStart !== cursorStrip.insertionStart))) &&
          mask &&
          mask.insertionDiff < 0
        ) {
          if (originalZero && (mask.leftJump || mask.rightJump)) {
            jumpStart = mask
            jumpStartIndex = cursorIndex
            jumpSteps = 1
          }
          after = originalZero ? 0 : Math.abs(mask.fragmentDiff)
          cursorStrip = originalZero ? mask.leftStep : mask
          jumpSteps =
            cursorStrip.leftJump || cursorStrip.rightJump
              ? 0
              : jumpSteps - (originalZero ? 2 : 1)
        } else if (index > 0) {
          --index
          after = 1
          continue
        }
      }
      if (jumpSteps > 0) {
        const right = jumpStart.rightJump
        const frames = cursorIndex - jumpStartIndex
        if (right)
          linkJumps(
            cursorStrip,
            right,
            jumpStart.rightJumpFrameCount - frames,
            jumpStart.rightJumpStripCount - jumpSteps
          )
        linkJumps(jumpStart, cursorStrip, frames, jumpSteps)
      } else if (jumpSteps < 0) {
        const left = jumpStart.leftJump
        const frames = jumpStartIndex - cursorIndex
        if (left)
          linkJumps(
            left,
            cursorStrip,
            jumpStart.leftJumpFrameCount - frames,
            jumpStart.leftJumpStripCount + jumpSteps
          )
        linkJumps(cursorStrip, jumpStart, frames, -jumpSteps)
      }
      if (cursorStrip.rightJump) {
        leftJumpToPatch = cursorStrip
        rightJumpToPatch = cursorStrip.rightJump
      } else if (cursorStrip === rightJumpToPatch) {
        leftJumpToPatch = void 0
        rightJumpToPatch = void 0
      }
      this.gate = cursorStrip
      this.gatePosition = cursorIndex
      this.leftJumpToPatch = leftJumpToPatch
      this.rightJumpToPatch = rightJumpToPatch
      const fragmentStart = cursorStrip.fragmentStart
      return (fragmentStart ?? 0) + index - cursorIndex + after
    }
    if (cursorIndex <= index) {
      const walkStrip = cursorStrip.rightStep
      const walkIndex = cursorIndex + stripLength
      let rightJump = cursorStrip.rightJump
      if (rightJump && cursorIndex >= 0) {
        let rightJumpFrameCount = cursorStrip.rightJumpFrameCount
        let rightJumpStripCount = cursorStrip.rightJumpStripCount
        if (
          // A short jump may be combined with its successor, but head and tail remain explicit
          // endpoints because their visible positions are known without further traversal.
          rightJumpStripCount < optimalJumpSpacing &&
          rightJump !== this.head &&
          rightJump !== this.tail
        ) {
          const nextRightJump = rightJump.rightJump
          if (
            nextRightJump && // Combine only when both structural spans fit within the current spacing target.
            rightJump.rightJumpStripCount <=
              optimalJumpSpacing - rightJumpStripCount
          ) {
            rightJumpFrameCount += rightJump.rightJumpFrameCount
            rightJumpStripCount += rightJump.rightJumpStripCount
            linkJumps(
              cursorStrip,
              nextRightJump,
              rightJumpFrameCount,
              rightJumpStripCount
            )
            rightJump = nextRightJump
          }
        }
        const jumpIndex = cursorIndex + rightJumpFrameCount
        if (cursorIndex <= index && index <= jumpIndex) {
          leftJumpToPatch = cursorStrip
          rightJumpToPatch = rightJump
        }
        if (
          // Stay before the target and skip at least two structural steps, including hidden nodes.
          jumpIndex <= index &&
          rightJumpStripCount > 1
        ) {
          cursorStrip = rightJump
          cursorIndex = jumpIndex
          leftJumpToPatch = void 0
          rightJumpToPatch = void 0
          continue
        }
      }
      if (rightJump) {
        leftJumpToPatch = cursorStrip
        rightJumpToPatch = rightJump
      }
      cursorStrip = walkStrip
      cursorIndex = walkIndex
      ++jumpSteps
      if (cursorStrip === rightJumpToPatch) {
        leftJumpToPatch = void 0
        rightJumpToPatch = void 0
      }
    } else {
      const walkStrip = cursorStrip.leftStep
      const walkDiff = walkStrip.fragmentDiff ?? walkStrip.insertionDiff
      const walkLength = walkDiff > 0 ? walkDiff : 0
      const walkIndex = cursorIndex - walkLength
      let leftJump = cursorStrip.leftJump
      if (leftJump) {
        let leftJumpFrameCount = cursorStrip.leftJumpFrameCount
        let leftJumpStripCount = cursorStrip.leftJumpStripCount
        if (
          leftJumpStripCount < optimalJumpSpacing &&
          leftJump !== this.head &&
          leftJump !== this.tail
        ) {
          const nextLeftJump = leftJump.leftJump
          if (
            nextLeftJump && // The preceding span must fit the remaining structural spacing budget before it can be combined.
            leftJump.leftJumpStripCount <=
              optimalJumpSpacing - leftJumpStripCount
          ) {
            leftJumpFrameCount += leftJump.leftJumpFrameCount
            leftJumpStripCount += leftJump.leftJumpStripCount
            linkJumps(
              nextLeftJump,
              cursorStrip,
              leftJumpFrameCount,
              leftJumpStripCount
            )
            leftJump = nextLeftJump
          }
        }
        const jumpIndex = cursorIndex - leftJumpFrameCount
        if (jumpIndex <= index && index <= cursorIndex) {
          leftJumpToPatch = leftJump
          rightJumpToPatch = cursorStrip
        }
        if (
          // Stay at or after the target and skip at least two structural steps.
          index <= jumpIndex &&
          leftJumpStripCount > 1
        ) {
          cursorStrip = leftJump
          cursorIndex = jumpIndex
          leftJumpToPatch = void 0
          rightJumpToPatch = void 0
          continue
        }
      }
      if (leftJump) {
        leftJumpToPatch = leftJump
        rightJumpToPatch = cursorStrip
      }
      cursorStrip = walkStrip
      cursorIndex = walkIndex
      --jumpSteps
      if (cursorStrip === leftJumpToPatch) {
        leftJumpToPatch = void 0
        rightJumpToPatch = void 0
      }
    }
  }
}

// ../sequencertemp/src/algorithms/apply.ts
function apply(gossip) {
  if (!Array.isArray(gossip)) return
  const changes = []
  const acknowledgements = []
  for (const entry of gossip) {
    if (isAcknowledgement(entry)) {
      void this.frontierTable.observeAcknowledgement(entry)
      continue
    }
    if (!isInsertion(entry)) return
    const queue = [entry]
    while (queue.length !== 0) {
      const incoming = queue.pop()
      if (incoming[5] < 0) {
        const acknowledgement = [
          this.actorID,
          incoming[3],
          // Subtracting the negative length gives the mask's original logical end.
          incoming[4] - incoming[5],
        ]
        void this.frontierTable.observeAcknowledgement(acknowledgement)
        void acknowledgements.push(acknowledgement)
      }
      if (this.containmentTable.has(incoming)) continue
      const incomingStrip = {
        anchorSession: incoming[0],
        anchorStart: incoming[1],
        anchorDiff: incoming[2],
        insertionSession: incoming[3],
        insertionStart: incoming[4],
        insertionDiff: incoming[5],
        footage: incoming[6],
      }
      const birth =
        incomingStrip.anchorSession === 0 &&
        incomingStrip.anchorStart === 0 &&
        incomingStrip.anchorDiff === 0
      let startAt = 0
      let projectionDiff = incomingStrip.insertionDiff
      if (birth && this.structuralStripCount === 0) {
        void insertFirst.call(this, incomingStrip)
      } else {
        let anchoringStrip
        let anchorDiff = 0
        if (!birth) {
          const origin = this.containmentTable.get(incoming)
          if (!origin) {
            void this.pendingTable.set(incoming)
            continue
          }
          ;[anchorDiff, anchoringStrip] = findContainingFragment(
            origin,
            incomingStrip
          )
        }
        if (this.projectionFrameCount === 0) {
          this.gate = void 0
          this.gatePosition = 0
        } else if (
          this.gate &&
          (this.gate.fragmentDiff ?? this.gate.insertionDiff) <= 0
        )
          void findFramePositionByProjectionPosition.call(
            this,
            Math.min(this.gatePosition, this.projectionFrameCount - 1)
          )
        projectionDiff = anchorStrip.call(
          this,
          incomingStrip,
          anchoringStrip,
          anchorDiff
        )
        let gateDiff = projectionDiff
        if (projectionDiff < 0 && incomingStrip.rightFragment && this.gate) {
          let parent = this.gate
          while (
            parent &&
            !(
              parent.insertionSession === incomingStrip.anchorSession &&
              parent.insertionStart === incomingStrip.anchorStart
            ) &&
            !(
              parent.anchorSession === incomingStrip.anchorSession &&
              parent.anchorStart === incomingStrip.anchorStart
            )
          )
            parent = this.containmentTable.get([
              parent.anchorSession,
              parent.anchorStart,
              parent.anchorDiff,
              parent.insertionSession,
              parent.insertionStart,
              parent.insertionDiff,
            ])
          if (parent) {
            const boundary =
              parent.insertionSession === incomingStrip.anchorSession &&
              parent.insertionStart === incomingStrip.anchorStart
                ? (parent.fragmentStart ?? 0)
                : parent.anchorDiff
            gateDiff = 0
            for (
              let mask = incomingStrip;
              mask && mask.anchorDiff + (mask.fragmentStart ?? 0) < boundary;
              mask = mask.rightFragment
            )
              gateDiff -= Math.min(
                // anchorStrip assigns each mask fragment its actual consumed effect.
                -mask.fragmentDiff,
                Math.max(
                  0,
                  boundary - mask.anchorDiff - (mask.fragmentStart ?? 0)
                )
              )
          }
        }
        startAt = findProjectionPositionOfStrip.call(
          this,
          incomingStrip,
          gateDiff
        )
        if (startAt <= this.gatePosition)
          this.gatePosition = Math.max(startAt, this.gatePosition + gateDiff)
        if (projectionDiff > 0 && this.gate?.fragmentDiff === 0) {
          this.gate = this.gate.rightFragment
          const right = incomingStrip.rightJump
          if (right && right !== this.gate)
            linkJumps(
              this.gate,
              right,
              incomingStrip.rightJumpFrameCount - projectionDiff,
              incomingStrip.rightJumpStripCount - 1
            )
          linkJumps(incomingStrip, this.gate, projectionDiff, 1)
        }
      }
      void this.containmentTable.set(incomingStrip)
      if (projectionDiff > 0) {
        if (startAt === 0) this.head = incomingStrip
        if (startAt + projectionDiff === this.projectionFrameCount)
          this.tail = incomingStrip
        void changes.push([
          startAt,
          startAt,
          incomingStrip.footage ?? // If no Footage was supplied, preserve the inserted Frame count in the Change.
            new Array(incomingStrip.insertionDiff),
        ])
      } else if (projectionDiff < 0) {
        let mask = incomingStrip
        let position = startAt
        while (mask) {
          if (mask.fragmentDiff < 0)
            void changes.push([position, position - mask.fragmentDiff])
          const next = mask.rightFragment
          if (next)
            for (
              let strip = mask.rightStep;
              strip !== next;
              strip = strip.rightStep
            )
              position += Math.max(0, strip.fragmentDiff ?? strip.insertionDiff)
          mask = next
        }
      }
      if (this.projectionFrameCount === 0) {
        this.gate = void 0
        this.gatePosition = 0
      } else if (!this.gate) {
        this.gate = this.head
        this.gatePosition = 0
      } else if ((this.gate.fragmentDiff ?? this.gate.insertionDiff) <= 0) {
        void findFramePositionByProjectionPosition.call(
          this,
          Math.min(this.gatePosition, this.projectionFrameCount - 1)
        )
      }
      if (this.gate?.rightJump) {
        this.leftJumpToPatch = this.gate
        this.rightJumpToPatch = this.gate.rightJump
      }
      const pending = this.pendingTable.take(incomingStrip)
      if (pending)
        for (let i = pending.length - 1; i >= 0; --i)
          void queue.push(pending[i])
    }
  }
  return acknowledgements.length === 0 ? [changes] : [changes, acknowledgements]
}

// ../sequencertemp/src/auxiliary/getRandom53bitNumber.ts
function getRandom53bitNumber() {
  const bytes = new Uint8Array(7)
  crypto.getRandomValues(bytes)
  bytes[0] &= 31
  let value2 = 0
  for (const byte of bytes) value2 = value2 * 256 + byte
  return value2
}

// ../sequencertemp/src/algorithms/create.ts
function create(trustedSequence) {
  const [frontiers, projection] = trustedSequence ?? []
  if (Array.isArray(frontiers)) {
    for (const acknowledgement of frontiers)
      void this.frontierTable.observeAcknowledgement(acknowledgement)
  }
  const unsafeIDs = /* @__PURE__ */ new Set()
  if (Array.isArray(projection)) {
    const jumpSpacing = Math.max(1, Math.round(Math.sqrt(projection.length)))
    const fragments = /* @__PURE__ */ new Map()
    let jumpStart
    let jumpCursor
    let jumpFrameCount = 0
    let jumpStripCount = 0
    let tailJumpStart
    let head
    let tail
    for (let index = 0; index < projection.length; ++index) {
      const incoming = projection[index]
      void unsafeIDs.add(incoming[0])
      void unsafeIDs.add(incoming[3])
      const incomingStrip = {
        anchorSession: incoming[0],
        anchorStart: incoming[1],
        anchorDiff: incoming[2],
        insertionSession: incoming[3],
        insertionStart: incoming[4],
        insertionDiff: incoming[5],
        footage: incoming[6],
      }
      const birth =
        incomingStrip.anchorSession === 0 &&
        incomingStrip.anchorStart === 0 &&
        incomingStrip.anchorDiff === 0
      if (birth && this.structuralStripCount === 0) {
        void insertFirst.call(this, incomingStrip)
      } else {
        let anchoringStrip
        let anchorDiff = 0
        if (!birth) {
          const origin = this.containmentTable.get(incoming)
          const fragment = origin.rightFragment
            ? (fragments.get(origin) ?? origin)
            : origin
          ;[anchorDiff, anchoringStrip] = findContainingFragment(
            incomingStrip.anchorDiff > (fragment.fragmentStart ?? 0)
              ? fragment
              : origin,
            incomingStrip
          )
          if (
            origin.rightFragment &&
            anchoringStrip.insertionSession === origin.insertionSession &&
            anchoringStrip.insertionStart === origin.insertionStart
          )
            fragments.set(origin, anchoringStrip)
        }
        void anchorStrip.call(this, incomingStrip, anchoringStrip, anchorDiff)
      }
      void this.containmentTable.set(incomingStrip)
      if (incomingStrip.insertionDiff < 0) {
        void this.frontierTable.observeAcknowledgement([
          this.actorID,
          incomingStrip.insertionSession,
          incomingStrip.insertionStart - incomingStrip.insertionDiff,
        ])
      }
      if (!jumpCursor) jumpStart = jumpCursor = this.structuralHead
      const stop = index + 1 < projection.length ? incomingStrip : void 0
      while (jumpCursor && jumpCursor !== stop) {
        const diff = jumpCursor.fragmentDiff ?? jumpCursor.insertionDiff
        if (diff > 0) {
          if (!head) {
            head = jumpCursor
            jumpStart = jumpCursor
            jumpFrameCount = 0
            jumpStripCount = 0
          }
          tail = jumpCursor
          tailJumpStart = jumpStart
        }
        jumpFrameCount += Math.max(0, diff)
        ++jumpStripCount
        jumpCursor = jumpCursor.rightStep
        if (jumpStripCount === jumpSpacing && jumpCursor) {
          linkJumps(jumpStart, jumpCursor, jumpFrameCount, jumpStripCount)
          jumpStart = jumpCursor
          jumpFrameCount = 0
          jumpStripCount = 0
        }
      }
    }
    this.head = head
    this.tail = tail
    if (
      tailJumpStart &&
      tailJumpStart !== this.tail &&
      tailJumpStart.rightJump
    ) {
      tailJumpStart.rightJump.leftJump = void 0
      tailJumpStart.rightJump = void 0
    }
  }
  this.gate = this.head
  const getSafeSessionID = () => {
    let sessionID
    do {
      sessionID = getRandom53bitNumber()
    } while (unsafeIDs.has(sessionID))
    void unsafeIDs.add(sessionID)
    return sessionID
  }
  this.increaseClock[0] = getSafeSessionID()
  this.increaseClock[1] = 0
  this.decreaseClock[0] = getSafeSessionID()
  this.decreaseClock[1] = 0
}

// ../sequencertemp/src/auxiliary/patchJumps.ts
function patchJumps(frameDiff, stripDiff, incoming) {
  const predecessor = incoming.leftStep
  const rightJump = predecessor.rightJump
  const leftFrames = Math.max(
    0,
    predecessor.fragmentDiff ?? predecessor.insertionDiff
  )
  if (rightJump)
    linkJumps(
      incoming,
      rightJump,
      predecessor.rightJumpFrameCount + frameDiff - leftFrames,
      predecessor.rightJumpStripCount + stripDiff - 1
    )
  const leftJump = predecessor.leftJump
  if (leftJump && leftFrames === 0 && predecessor.leftJumpFrameCount === 0)
    linkJumps(leftJump, incoming, 0, predecessor.leftJumpStripCount + 1)
  else linkJumps(predecessor, incoming, leftFrames, 1)
  const boundary = incoming.rightStep
  if (
    boundary &&
    (boundary === this.head || boundary === this.tail) &&
    incoming.rightJump !== boundary
  ) {
    const right = incoming.rightJump
    const frames = Math.max(0, incoming.fragmentDiff ?? incoming.insertionDiff)
    if (right)
      linkJumps(
        boundary,
        right,
        incoming.rightJumpFrameCount - frames,
        incoming.rightJumpStripCount - 1
      )
    linkJumps(incoming, boundary, frames, 1)
  }
  this.leftJumpToPatch = incoming
  this.rightJumpToPatch = incoming.rightJump
}

// ../sequencertemp/src/auxiliary/selectAnchor.ts
function selectAnchor(of) {
  let anchorDiff
  let anchoringStrip
  const gate = this.gate
  const removed = gate?.leftStep
  const rightStep = gate?.rightStep
  if (
    of === this.gatePosition &&
    gate &&
    gate.insertionDiff < 0 &&
    removed &&
    rightStep && // At the Projection head, the mask must directly precede visible content.
    (of > 0 || (rightStep.fragmentDiff ?? rightStep.insertionDiff) > 0) &&
    (rightStep.fragmentStart !== void 0 || rightStep.fragmentDiff === 0) &&
    removed.insertionSession === gate.anchorSession &&
    removed.insertionStart === gate.anchorStart && // An original-end child occupies this boundary; resolve its visible content instead.
    !(
      rightStep.anchorSession === gate.anchorSession &&
      rightStep.anchorStart === gate.anchorStart &&
      rightStep.anchorDiff === gate.anchorDiff - gate.insertionDiff
    ) && // A fully removed whole successor also retains its original zero boundary.
    ((rightStep.fragmentStart ?? 0) === 0 ||
      containsAnchor(
        rightStep,
        removed,
        rightStep.fragmentStart,
        rightStep.fragmentStart
      ))
  ) {
    anchoringStrip = gate
    anchorDiff =
      (anchoringStrip.fragmentStart ?? 0) - // This branch selects a materialized mask, whose actual effect is always assigned.
      anchoringStrip.fragmentDiff
  } else if (of === this.projectionFrameCount) {
    anchoringStrip = this.tail
    this.leftJumpToPatch = anchoringStrip
    this.rightJumpToPatch = anchoringStrip.rightJump
    anchorDiff =
      (anchoringStrip.fragmentStart ?? 0) +
      Math.abs(anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff)
  } else {
    anchorDiff = findFramePositionByProjectionPosition.call(this, of, true)
    anchoringStrip = this.gate
  }
  return [anchorDiff, anchoringStrip]
}

// ../sequencertemp/src/algorithms/insert.ts
function insert(values2, at) {
  if (this.projectionFrameCount === 0) {
    const increasingStrip2 = {
      anchorSession: 0,
      anchorStart: 0,
      anchorDiff: 0,
      insertionSession: this.increaseClock[0],
      insertionStart: this.increaseClock[1],
      insertionDiff: values2.length,
      // Keep the caller's array as Footage; runtime fragmentation will share this reference.
      footage: values2,
    }
    void insertFirst.call(this, increasingStrip2)
    void this.containmentTable.set(increasingStrip2)
    this.increaseClock[1] += values2.length + 1
    return [
      [
        increasingStrip2.anchorSession,
        increasingStrip2.anchorStart,
        increasingStrip2.anchorDiff,
        increasingStrip2.insertionSession,
        increasingStrip2.insertionStart,
        increasingStrip2.insertionDiff,
        increasingStrip2.footage,
      ],
    ]
  }
  const [anchorDiff, anchoringStrip] = selectAnchor.call(this, at)
  const increasingStrip = {
    anchorSession: anchoringStrip.insertionSession,
    anchorStart: anchoringStrip.insertionStart,
    anchorDiff,
    insertionSession: this.increaseClock[0],
    insertionStart: this.increaseClock[1],
    insertionDiff: values2.length,
    footage: values2,
  }
  const previousStructuralStripCount = this.structuralStripCount
  void anchorStrip.call(this, increasingStrip, anchoringStrip, anchorDiff)
  void patchJumps.call(
    this,
    increasingStrip.insertionDiff,
    this.structuralStripCount - previousStructuralStripCount,
    increasingStrip
  )
  void this.containmentTable.set(increasingStrip)
  if (values2.length > 0 && at === 0) this.head = increasingStrip
  if (values2.length > 0 && at + values2.length === this.projectionFrameCount)
    this.tail = increasingStrip
  this.gate = increasingStrip
  this.gatePosition = at
  this.increaseClock[1] += values2.length + 1
  return [
    [
      increasingStrip.anchorSession,
      increasingStrip.anchorStart,
      increasingStrip.anchorDiff,
      increasingStrip.insertionSession,
      increasingStrip.insertionStart,
      increasingStrip.insertionDiff,
      increasingStrip.footage,
    ],
  ]
}

// ../sequencertemp/src/auxiliary/isSequence.ts
function isSequence(data) {
  if (!Array.isArray(data) || data.length !== 2) return false
  const frontiers = data[0]
  const projection = data[1]
  if (!Array.isArray(frontiers) || !Array.isArray(projection)) return false
  for (let i = 0; i < frontiers.length; ++i)
    if (!isAcknowledgement(frontiers[i])) return false
  for (let i = 0; i < projection.length; ++i)
    if (!isInsertion(projection[i])) return false
  return true
}

// ../sequencertemp/src/algorithms/merge.ts
function merge(sequence2) {
  if (!isSequence(sequence2)) return
  const [frontiers, projection] = sequence2
  const result = apply.call(this, projection)
  void apply.call(this, frontiers)
  return result
}

// ../sequencertemp/src/algorithms/remove.ts
function remove(startAt = 0, endWith = this.projectionFrameCount - 1) {
  const insertions = []
  let remaining = endWith - startAt + 1
  while (remaining > 0) {
    const anchorDiff = findFramePositionByProjectionPosition.call(this, startAt)
    const anchoringStrip = this.gate
    const decreasingLength = Math.min(
      remaining,
      (anchoringStrip.fragmentStart ?? 0) +
        (anchoringStrip.fragmentDiff ?? anchoringStrip.insertionDiff) -
        anchorDiff
    )
    const decreasingStrip = {
      anchorSession: anchoringStrip.insertionSession,
      anchorStart: anchoringStrip.insertionStart,
      anchorDiff,
      insertionSession: this.decreaseClock[0],
      insertionStart: this.decreaseClock[1],
      insertionDiff: -decreasingLength,
    }
    const previousStructuralStripCount = this.structuralStripCount
    void anchorStrip.call(this, decreasingStrip, anchoringStrip, anchorDiff)
    void patchJumps.call(
      this,
      decreasingStrip.insertionDiff,
      this.structuralStripCount - previousStructuralStripCount,
      decreasingStrip
    )
    void this.containmentTable.set(decreasingStrip)
    if (startAt === this.gatePosition) this.gate = decreasingStrip
    void insertions.push([
      decreasingStrip.anchorSession,
      decreasingStrip.anchorStart,
      decreasingStrip.anchorDiff,
      decreasingStrip.insertionSession,
      decreasingStrip.insertionStart,
      decreasingStrip.insertionDiff,
    ])
    this.decreaseClock[1] += decreasingLength + 1
    remaining -= decreasingLength
  }
  const acknowledgement = [
    this.actorID,
    this.decreaseClock[0],
    this.decreaseClock[1] - 1,
  ]
  void this.frontierTable.observeAcknowledgement(acknowledgement)
  void insertions.push(acknowledgement)
  return insertions
}

// ../sequencertemp/src/algorithms/replace.ts
function replace(
  withValues,
  startAt = 0,
  endWith = this.projectionFrameCount - 1
) {
  return [
    ...this.remove(startAt, endWith),
    // An empty replacement is removal only; a zero-length Insertion is not valid Gossip.
    ...(withValues.length === 0 ? [] : this.insert(withValues, startAt)),
  ]
}

// ../sequencertemp/src/algorithms/sequence.ts
function sequence() {
  const compactableIDs = new Set(this.frontierTable.getCompactableSessions())
  const removed = /* @__PURE__ */ new Map()
  const removedFrames = (session, start) => removed.get(session)?.get(start)
  if (compactableIDs.size !== 0) {
    let strip2 = this.structuralHead
    while (strip2) {
      const diff = strip2.fragmentDiff ?? strip2.insertionDiff
      if (diff < 0 && compactableIDs.has(strip2.insertionSession)) {
        const start = strip2.anchorDiff + (strip2.fragmentStart ?? 0)
        let session = removed.get(strip2.anchorSession)
        let frames = session?.get(strip2.anchorStart)
        if (!frames) {
          const parent = this.containmentTable.get([
            strip2.anchorSession,
            strip2.anchorStart,
            strip2.anchorDiff,
            strip2.insertionSession,
            strip2.insertionStart,
            strip2.insertionDiff,
          ])
          frames =
            start === 0 && -diff === parent.insertionDiff
              ? parent.insertionDiff
              : new Uint32Array(parent.insertionDiff)
          if (!session) {
            session = /* @__PURE__ */ new Map()
            removed.set(strip2.anchorSession, session)
          }
          session.set(strip2.anchorStart, frames)
        }
        if (typeof frames !== 'number') frames.fill(1, start, start - diff)
      }
      strip2 = strip2.rightStep
    }
  }
  const removedBefore = (frames, at) =>
    !frames || at <= 0
      ? 0
      : typeof frames === 'number'
        ? Math.min(at, frames)
        : // A positive point indexes the dense prefix array within its length.
          frames[Math.min(at, frames.length) - 1]
  const projection = []
  const omitted = [0, 0, 0, 0, 0, 0]
  const included = /* @__PURE__ */ new Map()
  let left
  let leftDiff = 0
  let strip = this.structuralHead
  while (strip) {
    if (strip.insertionDiff < 0 && compactableIDs.has(strip.insertionSession)) {
      strip = strip.rightStep
      continue
    }
    const frames =
      removed.size === 0
        ? void 0
        : removedFrames(strip.insertionSession, strip.insertionStart)
    if (typeof frames === 'number') {
      strip = strip.rightStep
      continue
    }
    let session = included.get(strip.insertionSession)
    let insertion = session?.get(strip.insertionStart)
    const first = !insertion
    if (!insertion) {
      let anchorSession = strip.anchorSession
      let anchorStart = strip.anchorStart
      let anchorDiff = strip.anchorDiff
      let insertionDiff = strip.insertionDiff
      let footage = strip.footage
      if (insertionDiff > 0 && compactableIDs.size !== 0) {
        anchorSession = left?.[3] ?? 0
        anchorStart = left?.[4] ?? 0
        anchorDiff = leftDiff
      } else if (insertionDiff < 0 && removed.size !== 0) {
        anchorDiff -= removedBefore(
          removedFrames(anchorSession, anchorStart),
          anchorDiff
        )
      }
      if (insertionDiff > 0 && frames) {
        const compacted = []
        let count = 0
        for (let index = 0; index < insertionDiff; ++index) {
          if (frames[index] === 0) compacted.push(footage?.[index])
          count += frames[index]
          frames[index] = count
        }
        insertionDiff = compacted.length
        footage = compacted
      } else if (insertionDiff < 0 && removed.size !== 0) {
        const target = removedFrames(strip.anchorSession, strip.anchorStart)
        insertionDiff +=
          removedBefore(target, strip.anchorDiff - insertionDiff) -
          removedBefore(target, strip.anchorDiff)
      }
      insertion =
        insertionDiff === 0
          ? omitted
          : [
              anchorSession,
              anchorStart,
              anchorDiff,
              strip.insertionSession,
              strip.insertionStart,
              insertionDiff,
              footage,
            ]
      if (!session) {
        session = /* @__PURE__ */ new Map()
        included.set(strip.insertionSession, session)
      }
      session.set(strip.insertionStart, insertion)
      if (insertionDiff !== 0) projection.push(insertion)
    }
    if (
      insertion[5] !== 0 && // Repeated identities are runtime fragments, whose fragmentDiff is assigned at creation.
      (first || strip.fragmentDiff !== 0)
    ) {
      left = insertion
      leftDiff =
        (strip.fragmentStart ?? 0) +
        Math.abs(strip.fragmentDiff ?? strip.insertionDiff)
      if (removed.size !== 0 && strip.insertionDiff > 0)
        leftDiff -= removedBefore(frames, leftDiff)
      else if (removed.size !== 0) {
        const target = removedFrames(strip.anchorSession, strip.anchorStart)
        leftDiff -=
          removedBefore(target, strip.anchorDiff + leftDiff) -
          removedBefore(target, strip.anchorDiff)
      }
    }
    strip = strip.rightStep
  }
  const frontiers = this.frontierTable.getFrontiers()
  if (compactableIDs.size === 0) return [frontiers, projection]
  return [
    frontiers.map((frontier) => {
      const acknowledgement = [frontier[0]]
      for (let index = 1; index < frontier.length; index += 2)
        if (!compactableIDs.has(frontier[index]))
          acknowledgement.push(frontier[index], frontier[index + 1])
      return acknowledgement
    }),
    projection,
  ]
}

// ../sequencertemp/src/algorithms/value.ts
function value(at) {
  const framePosition = findFramePositionByProjectionPosition.call(this, at)
  return this.gate?.footage?.[framePosition]
}

// ../sequencertemp/src/algorithms/values.ts
function values(startAt = 0, endWith = this.projectionFrameCount - 1) {
  const values2 = []
  if (startAt > endWith || this.projectionFrameCount === 0) return values2
  let framePosition = findFramePositionByProjectionPosition.call(this, startAt)
  let strip = this.gate
  let remaining = endWith - startAt + 1
  while (strip && remaining > 0) {
    const stripDiff = strip.fragmentDiff ?? strip.insertionDiff
    if (stripDiff > 0) {
      const length = Math.max(
        0,
        Math.min(
          remaining,
          stripDiff -
            framePosition +
            (strip.fragmentStart ? strip.fragmentStart : 0)
        )
      )
      for (let i = 0; i < length; ++i)
        void values2.push(strip.footage[framePosition + i])
      remaining -= length
    }
    framePosition =
      (strip.rightStep?.fragmentStart ? strip.rightStep.fragmentStart : 0) +
      Math.max(
        0,
        framePosition -
          (strip.fragmentStart ? strip.fragmentStart : 0) -
          Math.max(0, stripDiff)
      )
    strip = strip.rightStep
  }
  return values2
}

// ../sequencertemp/src/class.ts
var Projection = class {
  /**
   * Prepares to sequence a projection, optionally hydrating from a trusted sequence stored by the application.
   *
   * @param actorID Actor identifier used in acknowledgements.
   * @param trustedSequence Optional trusted Sequence in Structural Order, stored by the application.
   */
  constructor(actorID, trustedSequence) {
    this.actorID = actorID
    void create.call(this, trustedSequence)
  }
  actorID
  /** Strip containing the very left-most position of the projection (0) */
  head
  /** Local traversal Strip, retained across remote edits while its content survives. */
  gate
  /** Strip containing the very right-most position of the projection (projectionFrameCount - 1) */
  tail
  //
  /** Right endpoint of the jump awaiting a local edit's distance update. */
  rightJumpToPatch
  /** Left endpoint of the jump awaiting a local edit's distance update. */
  leftJumpToPatch
  //
  /** First Strip in Structural Order, including non-visible Strips. */
  structuralHead
  /** Structural amount of strips in the sequence. */
  structuralStripCount = 0
  /** Amount of frames in the projection. */
  projectionFrameCount = 0
  /** First Projection position of the Strip at gate. */
  gatePosition = 0
  //
  /** Materialized Insertions indexed by their canonical identity. */
  containmentTable = new ContainmentTable()
  /** Known Actor acknowledgement frontiers used for compaction. */
  frontierTable = new FrontierTable()
  /** Insertions awaiting their anchoring Insertion. */
  pendingTable = new PendingTable()
  //
  /** Session identifier and next logical time for positive Insertions. */
  increaseClock = [0, 0]
  /** Session identifier and next logical time for reducing Insertions. */
  decreaseClock = [0, 0]
  /**
   * Applies gossiped Insertions and Acknowledgements.
   *
   * @param gossip Batch of Insertion and Acknowledgement tuples.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` for invalid input. Earlier entries may already have been applied.
   */
  apply(gossip) {
    return apply.call(this, gossip)
  }
  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive.
   * @returns Gossip describing the insertion.
   */
  insert(values2, at) {
    return insert.call(this, values2, at)
  }
  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length.
   */
  length() {
    return this.projectionFrameCount
  }
  /**
   * Applies relevant acknowledgements and nonduplicate insertions from a replica of the sequence.
   *
   * @param sequence Sequence to merge.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` if the Sequence has an invalid runtime shape.
   */
  merge(sequence2) {
    return merge.call(this, sequence2)
  }
  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip.
   */
  remove(startAt, endWith) {
    return remove.call(this, startAt, endWith)
  }
  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order.
   */
  replace(withValues, startAt, endWith) {
    return replace.call(this, withValues, startAt, endWith)
  }
  /**
   * Retires an Actor from future compaction requirements.
   *
   * @remarks
   * This is a manual per-replica operation. The application is responsible for
   * deciding which Actors are retired and for propagating that decision to the
   * relevant replicas.
   *
   * Retiring an Actor removes its acknowledgements from the FrontierTable and
   * keeps the Actor retired for the lifetime of the current session. As a result,
   * its acknowledgements are excluded from later sequenced state and are not
   * required when compaction is performed while sequencing that state.
   *
   * For example, an Actor managing a document could rotate keys and propagate a
   * directive telling the relevant replicas which Actors to retire.
   *
   * @param actorID Number identifying the Actor whose acknowledgements are no
   * longer required for safe compaction.
   */
  retire(actorID) {
    void this.frontierTable.eraseActor(actorID)
  }
  /**
   * Sequences state into a compact serializable format.
   *
   * @returns A Sequence with acknowledged removals compacted in the exported state.
   */
  sequence() {
    return sequence.call(this)
  }
  /**
   * Returns the value at a Projection position.
   *
   * @param at Valid visible position in `0..length() - 1`.
   * @returns The corresponding Footage value.
   */
  value(at) {
    return value.call(this, at)
  }
  /**
   * Returns values from an inclusive range of Projection positions.
   *
   * @param startAt First included position; defaults to 0.
   * @param endWith Last included position; defaults to `length() - 1`.
   * @returns A new array of values, or an empty array for an empty range.
   */
  values(startAt, endWith) {
    return values.call(this, startAt, endWith)
  }
}
export { Projection }
