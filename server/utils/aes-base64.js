const CryptoJS = require('crypto-js')
const { parseTime } = require('.')

const startIndex = 2
const endIndex = 25

// BASE64加密
function encryptBase64(str) {
  // 使用window.btoa不能加密中文
  const encrypted = CryptoJS.enc.Utf8.parse(str)
  return CryptoJS.enc.Base64.stringify(encrypted)
}
exports.encryptBase64 = encryptBase64
// BASE64解密
function decryptBase64(data) {
  const decrypted = CryptoJS.enc.Base64.parse(data)
  return decrypted.toString(CryptoJS.enc.Utf8)
}
exports.decryptBase64 = decryptBase64

/**
 * AES加密
 * @param {string} str
 * @returns
 */
function encryptAES(str) {
  // 使用年月日时分秒毫秒BASE64作为秘钥
  const time = parseTime(new Date(), '{y}{m}{d}{h}{i}{s}{l}')
  const timeBase64 = encryptBase64(time)
  const oKey = timeBase64.slice(0, -1)
  const secret = time.split('').reverse().slice(0, 8).join('')
  const key = CryptoJS.enc.Utf8.parse(secret)
  const src = CryptoJS.enc.Utf8.parse(str)
  const cipher = CryptoJS.AES.encrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString()
  return cipher.slice(0, startIndex) + oKey + cipher.slice(startIndex)
}
exports.encryptAES = encryptAES

/**
 * AES解密
 * @param {string|object} data
 * @returns
 */
function decryptAES(data) {
  if (typeof data !== 'string') return data
  const src = data.slice(0, startIndex) + data.slice(endIndex)
  const dateBase64 = data.slice(startIndex, endIndex) + '='
  const secret = decryptBase64(dateBase64).split('').reverse().slice(0, 8).join('')
  const key = CryptoJS.enc.Utf8.parse(secret)
  return CryptoJS.AES.decrypt(src, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8)
}
exports.decryptAES = decryptAES
