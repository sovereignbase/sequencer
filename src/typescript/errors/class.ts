/** Semantic error codes reported by the Sequencer public API. */
export type SequencerErrorCode =
  | 'UNKNOWN_ERROR'
  | 'PROJECTION_DESTROYED'
  | 'NATIVE_OPERATION_FAILED'
  | 'STRING_ENCODING_FAILED'

/** Error reported by Sequencer with a stable code and package-prefixed message. */
export class SequencerError extends Error {
  /** Machine-readable code identifying the failure condition. */
  readonly code: SequencerErrorCode

  /**
   * Creates a Sequencer error.
   *
   * @param code Stable code identifying the failure condition.
   * @param message Human-readable detail; defaults to `code`.
   * @param options Standard error options; `cause` retains an underlying error.
   */
  constructor(
    code: SequencerErrorCode,
    message?: string,
    options?: ErrorOptions
  ) {
    const detail = message ?? code
    super(`{@sovereignbase/sequencer} ${detail}`, options)
    this.code = code
    this.name = 'SequencerError'
  }
}

/** Preserves library errors and identifies the public call for unexpected failures. */
export function unknownError(cause: unknown, method: string): SequencerError {
  return cause instanceof SequencerError
    ? cause
    : new SequencerError('UNKNOWN_ERROR', `Projection.${method}() failed.`, {
        cause,
      })
}
