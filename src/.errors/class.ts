/**
 * Error codes thrown by {@link CRList}.
 *
 * Codes are part of the public contract and allow callers to branch on
 * semantic failures without parsing human-readable text.
 */
export type CRListErrorCode =
  /** A value could not be cloned by an operation that requires cloneability. */
  | 'VALUE_NOT_CLONEABLE'
  /** A requested list index is outside the current live projection. */
  | 'INDEX_OUT_OF_BOUNDS'
  /** A read or cursor operation required at least one live block. */
  | 'LIST_EMPTY'
  /** Internal projection metadata failed an integrity check. */
  | 'LIST_INTEGRITY_VIOLATION'
  /** Update input was not an array of values. */
  | 'UPDATE_EXPECTED_AN_ARRAY'

/**
 * Represents a typed CRList runtime error.
 */
export class CRListError extends Error {
  /**
   * The semantic error code for the failure.
   */
  readonly code: CRListErrorCode

  /**
   * Creates a typed CRList error.
   *
   * @param code - The semantic error code.
   * @param message - An optional human-readable detail message.
   */
  constructor(code: CRListErrorCode, message?: string) {
    // Prefer caller-provided detail while preserving the semantic code default.
    const detail = message ?? code

    // Prefix every public error with the package scope for auditability.
    super(`{@sovereignbase/convergent-replicated-list} ${detail}`)

    // Store the machine-readable public error contract.
    this.code = code

    // Stabilize the runtime error name across JavaScript environments.
    this.name = 'CRListError'
  }
}
