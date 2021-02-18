export class NotFoundError extends Error {
  code = 404
}

export class UnauthorizerError extends Error {
  code = 401
}

export class GenericRequestError extends Error {
  code = 400
}
