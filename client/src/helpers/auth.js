// ? This function gets token from local storage
export const getTokenFromLocalStorage = () => {
  return 'get token'
}

// ? this function takes the token, splits it up, returns the payload encoded using base64
// This function is not a default export so will be destructured when importing
export const getPayload = () => {
  return 'getPayload'
}

// ? function that checks that user is authenticated
export const userIsAuthenticated = () => {
  return 'userIsAuthenticated'
}

// ? This function will check the user id from the payload matches the cheese user id
export const userIsOwner = (something) => {
  return something
}