const matches = ['cannabis', 'grow', 'weed', 'seeds', 'seed', 'indoor', 'homegrowing', '420', 'smoke', 'thc', 'cbd', 'vape', 'lst', 'topping', 'hst', 'dwc', 'hydro', 'soil', 'furniture', 'sensor', 'nutrient', 'PH', 'EC', 'LED', 'hps', 'light', 'supergreenlab']
const blacklist = ['google']

let added = false

const injectButton = async () => {
  const isBlacklisted = new RegExp(`${blacklist.join('|')}/i`, 'i').test(
    document.location.hostname
  )

  if (isBlacklisted) return

  if (added) return

	const loggedIn = await chrome.runtime.sendMessage({'loggedIn': true})

  added = true
  const div = document.createElement('div')
  div.style.borderWidth = '2pt'
  div.style.borderColor = '#3bb30b'
  div.style.borderRadius = '5px'
  div.style.borderStyle = 'solid'
  div.style.padding = '15px 15px 10px 10px'
  div.style.position = 'fixed'
  div.style.backgroundColor = 'white'
  div.style.top = '-60px'
  div.style.right = '5px'
  div.style.zIndex = 1000
  div.style.display = 'flex'
  div.style.transition = 'top 0.3s'

  setTimeout(() => (div.style.top = '-5px'), 100)

  const button = document.createElement('a')
  button.style.textDecoration = 'none'
  button.innerText = loggedIn ? 'Bookmark and share this page!' : 'Please login to bookmark and share this page!'
  button.href = 'javascript:void(0)'
  button.addEventListener('click', () => {
    if (!loggedIn) {
      return
    }
		chrome.runtime.sendMessage({'bookmark': document.location.href})
    button.innerText = 'Alright, sent! Thanks 💚'
    setTimeout(() => {
      div.style.top = '-60px'
    }, 1000)
  })
  div.appendChild(button)

  const close = document.createElement('a')
  close.style.textDecoration = 'none'
  close.innerText = '❌'
  close.href = 'javascript:void(0)'
  close.style.fontSize = '8px'
  close.style.position = 'absolute'
  close.style.top = '7px'
  close.style.right = '2px'
  close.addEventListener('click', () => {
    div.style.top = '-60px'
  })
  div.appendChild(close)

  document.body.appendChild(div)
}

const checkIsPlantRelated = () => {
  const isPlantRelated = new RegExp(`${matches.map(m => `\\b${m}\\b`).join('|')}/i`, 'i').test(
    document.body.innerText
  )
  if (isPlantRelated) {
    injectButton()
  }
}

chrome.runtime.onMessage.addListener(async (request, __, ___) => {
	if (request.url) {
		checkIsPlantRelated()
	}
})

window.addEventListener('load', checkIsPlantRelated, false)

export {}
