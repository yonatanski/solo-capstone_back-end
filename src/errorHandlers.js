export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    console.log("Bad request!!", err)
    res.status(400).send({ message: err.message, errorsList: err.errorsList })
  } else {
    next(err)
  }
}

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    console.log(" Unauthorized", err)
    res.status(401).send({ message: err.message })
  } else {
    next(err)
  }
}
export const forbiddenHandler = (err, req, res, next) => {
  if (err.status === 403) {
    console.log(" Forbidden", err)
    res.status(403).send({ message: err.message })
  } else {
    next(err)
  }
}

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    console.log("Not Found", err)
    res.status(404).send({ message: err.message })
  } else {
    next(err)
  }
}

export const genericErrorHandler = (err, req, res, next) => {
  console.log("Internal Server Error: ", err)
  res.status(500).send({ message: "Generic Server Error!" })
}
