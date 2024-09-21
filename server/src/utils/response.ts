import { Response } from "express"

const ResponseStatus = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  ACCESS_DENIED: 440,
  INTERNAL_ERROR: 500,
}

const successResponse = (res: Response, msg: string, data?: any) => {
  if (data) {
    res.status(ResponseStatus.SUCCESS).json({
      msg,
      data,
    })
    return
  }
  res.status(ResponseStatus.SUCCESS).json({
    msg,
  })
}

const createdSuccessResponse = (res: Response, msg: string, data: any) => {
  res.status(ResponseStatus.CREATED).send({
    msg,
    data,
  })
}

const notFoundResponse = (res: Response, msg = "Not found") => {
  res.status(ResponseStatus.NOT_FOUND).send({
    msg,
  })
}

const unauthorizedResponse = (res: Response, msg = "Unauthorized") => {
  res.status(ResponseStatus.UNAUTHORIZED).send({
    msg,
  })
}

const badRequestResponse = (res: Response, msg = "Bad request") => {
  res.status(ResponseStatus.BAD_REQUEST).send({
    msg,
  })
}

const forbiddenResponse = (res: Response, msg = "Forbidden") => {
  res.status(ResponseStatus.FORBIDDEN).send({
    msg,
  })
}

const serverErrorResponse = (
  res: Response,
  msg = "Internal server error",
  data?: any
) => {
  if (data) {
    res.status(ResponseStatus.INTERNAL_ERROR).send({
      msg,
      data,
    })
  } else {
    res.status(ResponseStatus.INTERNAL_ERROR).send({
      msg,
    })
  }
}

const accessDeniedResponse = (
  res: Response,
  msg = "Access denied",
  data: any
) => {
  res.status(ResponseStatus.ACCESS_DENIED).send({
    msg,
    data,
  })
}

const unprocessableEntityResponse = (
  res: Response,
  msg = "Unprocessable entity"
) => {
  res.status(ResponseStatus.UNPROCESSABLE_ENTITY).send({
    msg,
  })
}

export {
  successResponse,
  createdSuccessResponse,
  notFoundResponse,
  unauthorizedResponse,
  badRequestResponse,
  forbiddenResponse,
  serverErrorResponse,
  accessDeniedResponse,
  unprocessableEntityResponse,
}
