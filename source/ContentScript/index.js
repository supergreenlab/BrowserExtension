import browser from 'webextension-polyfill';

const matches = ['marijuana', 'cannabis', 'grow', 'growing', 'weed', 'seeds', 'seed', 'indoor', 'homegrowing', '420', 'smoke', 'thc', 'cbd', 'vape', 'lst', 'topping', 'hst', 'dwc', 'hydro', 'soil', 'furniture', 'sensor', 'nutrient', 'PH', 'EC', 'LED', 'hps', 'light', 'supergreenlab', 'vegetative', 'bloom', 'blooming', 'bud', 'UV', 'IR', 'spectrum', 'Lights']
const blacklist = ['google']

let added = false

const divID = Math.random().toString(36).substr(2, 5);

const removeDiv = (div) => {
  div.style.top = '-100px'
  setTimeout(() => {
    document.body.removeChild(div)
  }, 500);
}

const injectButton = async () => {
  if (added) return
  added = true

  if (document.getElementById(divID)) return

  const isBlacklisted = new RegExp(`${blacklist.join('|')}`, 'i').test(
    document.location.hostname
  )

  if (isBlacklisted) return

  const loggedIn = await chrome.runtime.sendMessage({'loggedIn': true})

  const div = document.createElement('div')
  div.setAttribute("id", divID)
  div.style.display = 'flex'
  div.style.borderWidth = '2pt'
  div.style.borderColor = '#3bb30b'
  div.style.borderRadius = '5px'
  div.style.borderStyle = 'solid'
  div.style.padding = '15px 15px 10px 10px'
  div.style.position = 'fixed'
  div.style.backgroundColor = 'white'
  div.style.top = '-100px'
  div.style.right = '5px'
  div.style.zIndex = '1000 !important'
  div.style.display = 'flex'
  div.style.transition = 'top 0.3s'
  div.style.fontSize = '12pt'
  div.style.lineHeight = '14.4pt'
  div.style.color = 'black !important'
  div.style.fontWeight = '300 !important'
  div.style.fontFamily = 'Roboto !important'

  setTimeout(() => (div.style.top = '-5px'), 100)

  const logo = document.createElement('img')
  logo.src = browser.runtime.getURL('assets/icons/favicon-48.png')
  div.appendChild(logo)

  const button = document.createElement('a')
  button.style.color = 'black'
  button.style.margin = '0 10pt'
  button.style.textDecoration = 'none'
  button.style.textAlign = 'center'
  button.innerText = loggedIn ? 'Looks like this page could interest the community?\nBookmark and/or share it!' : 'Please login to bookmark and share this page!'
  button.href = 'javascript:void(0)'
  button.addEventListener('click', () => {
    if (!loggedIn) {
      return
    }
    chrome.runtime.sendMessage({'bookmark': document.location.href})
    button.innerText = 'Alright, sent! Thanks ????'
    setTimeout(() => {
      removeDiv(div)
    }, 1000)
  })
  div.appendChild(button)

  const close = document.createElement('a')
  close.style.textDecoration = 'none'
  close.innerText = '???'
  close.href = 'javascript:void(0)'
  close.style.fontSize = '12px'
  close.style.position = 'absolute'
  close.style.top = '7px'
  close.style.right = '5px'
  close.addEventListener('click', () => {
    removeDiv(div)
  })
  div.appendChild(close)

  document.body.appendChild(div)
}

const checkIsPlantRelated = () => {
  const isPlantRelated = new RegExp(`${matches.map(m => `\\b${m}\\b`).join('|')}`, 'i').test(
    document.body.innerText
  )
  if (isPlantRelated) {
    injectButton()
  }
}

chrome.runtime.onMessage.addListener(async (request, __, ___) => {
  if (request.url) {
    added = false;
    checkIsPlantRelated()
  }
})

window.addEventListener('load', checkIsPlantRelated, false)

setInterval(checkIsPlantRelated, 2000);

export {}
