/**
 * Error codes thrown by {@link RGA}.
 */
export type RGAErrorCode =
  | 'DEFAULTS_NOT_CLONEABLE'
  | 'VALUE_NOT_CLONEABLE'
  | 'VALUE_TYPE_MISMATCH'

/**
 * Represents a typed OO-Struct runtime error.
 */
export class RGAError extends Error {
  /**
   * The semantic error code for the failure.
   */
  readonly code: RGAErrorCode

  /**
   * Creates a typed OO-Struct error.
   *
   * @param code - The semantic error code.
   * @param message - An optional human-readable detail message.
   */
  constructor(code: RGAErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@sovereignbase/replicated-growable-array} ${detail}`)
    this.code = code
    this.name = 'RGAError'
  }
}
