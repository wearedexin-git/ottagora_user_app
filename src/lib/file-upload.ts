/** Dimensione massima file caricato dal browser (mock upload → data URL). */
export const MAX_UPLOAD_FILE_BYTES = 4 * 1024 * 1024

export const FILE_SIZE_LIMIT_MESSAGE = "Limite superato"

/** Stima lunghezza massima data URL (base64 + intestazione). */
export const MAX_DATA_URL_LENGTH = Math.ceil((MAX_UPLOAD_FILE_BYTES * 4) / 3) + 128

export class FileSizeLimitError extends Error {
  readonly maxBytes: number
  readonly actualBytes: number

  constructor(maxBytes: number, actualBytes: number) {
    super(FILE_SIZE_LIMIT_MESSAGE)
    this.name = "FileSizeLimitError"
    this.maxBytes = maxBytes
    this.actualBytes = actualBytes
  }
}

export function formatMaxUploadSizeLabel(maxBytes = MAX_UPLOAD_FILE_BYTES): string {
  const mb = maxBytes / (1024 * 1024)
  return mb % 1 === 0 ? `${mb} MB` : `${mb.toFixed(1)} MB`
}

export function assertFileWithinLimit(
  file: File,
  maxBytes = MAX_UPLOAD_FILE_BYTES
): void {
  if (file.size > maxBytes) {
    throw new FileSizeLimitError(maxBytes, file.size)
  }
}

export function isFileSizeLimitError(error: unknown): error is FileSizeLimitError {
  return error instanceof FileSizeLimitError
}

export function dataUrlExceedsLimit(
  value: string,
  maxLength = MAX_DATA_URL_LENGTH
): boolean {
  return value.trim().startsWith("data:") && value.length > maxLength
}

export function readFileAsDataUrl(
  file: File,
  maxBytes = MAX_UPLOAD_FILE_BYTES
): Promise<string> {
  assertFileWithinLimit(file, maxBytes)

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (dataUrlExceedsLimit(reader.result)) {
          reject(new FileSizeLimitError(maxBytes, file.size))
          return
        }
        resolve(reader.result)
      } else {
        reject(new Error("Lettura file non riuscita"))
      }
    }
    reader.onerror = () => reject(reader.error ?? new Error("Lettura file non riuscita"))
    reader.readAsDataURL(file)
  })
}
