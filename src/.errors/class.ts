/**
 * Error codes thrown by {@link CRList}.
 */
export type CRListErrorCode =
  | 'DEFAULTS_NOT_CLONEABLE'
  | 'VALUE_NOT_CLONEABLE'
  | 'VALUE_TYPE_MISMATCH'
  | 'INDEX_OUT_OF_BOUNDS'
  | 'LIST_EMPTY'
  | 'LIST_INTEGRITY_VIOLATION'
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
    const detail = message ?? code
    super(`{@sovereignbase/convergent-replicated-list} ${detail}`)
    this.code = code
    this.name = 'CRListError'
  }
}
