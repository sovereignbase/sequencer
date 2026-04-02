export type PackageNameErrorCode = 'EXAMPLE_ERROR_CODE'

export class PackageNameError extends Error {
  readonly code: PackageNameErrorCode

  constructor(code: PackageNameErrorCode, message?: string) {
    const detail = message ?? code
    super(`{@z-base/package-name} ${detail}`)
    this.code = code
    this.name = 'PackageNameError'
  }
}
