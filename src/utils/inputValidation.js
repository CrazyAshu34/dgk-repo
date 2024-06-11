export const allowOnlyNumbers = (e) => {
    const value = e.target.value
    if (value === undefined) {
      return value
    }
    return value.replace(/[^0-9]/g, '')
  }
  
  // Allow only characters in input field
  export const allowOnlyCharacters = (e) => {
    const value = e.target.value
    if (value === undefined) {
      return value
    }
    return value.replace(/[^a-zA-Z]/g, '')
  }