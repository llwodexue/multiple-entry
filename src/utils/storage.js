function getItem(flag) {
  return JSON.parse(sessionStorage.getItem(flag))
}

function setItem(flag, value) {
  return sessionStorage.setItem(flag, JSON.stringify(value))
}

export default {
  getItem,
  setItem
}
