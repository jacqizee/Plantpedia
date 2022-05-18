// ? This function gets token from local storage
export const getTokenFromLocalStorage = () => {
  return window.localStorage.getItem('plantpedia')
}

// ? this function takes the token, splits it up, returns the payload encoded using base64
// This function is not a default export so will be destructured when importing
export const getPayload = () => {
  const token = getTokenFromLocalStorage()
  if (!token) return
  const payload = token.split('.')[1]
  console.log(JSON.parse(atob(payload)))
  return JSON.parse(atob(payload))
}

// ? function that checks that user is authenticated
export const userIsAuthenticated = () => {
  const payload = getPayload()
  if (!payload) return false
  const currentTime = Math.floor(Date.now() / 1000)

  const isAuthenticated = currentTime < payload.exp
  console.log('is authenticated?', isAuthenticated)
  return currentTime < payload.exp
}

// ? This function will check the user id from the payload matches the cheese user id
export const userIsOwner = (singlePlant) => {
  
  // get payload and check it has a value
  const payload = getPayload()
  if (!payload) return
  return singlePlant.user._id === payload.sub
}


