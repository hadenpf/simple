export type ResponseStatus = 'success' | 'error'

export type ResponseType<T = any> = T extends string
  ? {
      status: ResponseStatus
      message: string
      code?: string | number
    }
  : {
      status: ResponseStatus
      data: T
      code?: string | number
    }

export function response(
  status: ResponseStatus,
  message: string,
  code?: string
): ResponseType<string>
export function response<T extends object>(
  status: ResponseStatus,
  data: T,
  code?: string
): ResponseType<T>
export function response(
  status: ResponseStatus,
  data: any,
  code?: string
): ResponseType {
  if (typeof data === 'string')
    return {
      status,
      message: data,
      code,
    }
  else
    return {
      status,
      data,
      code,
    }
}
