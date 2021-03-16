import 'emoji-log';
import axios from 'axios'
import browser from 'webextension-polyfill';

const API_URL = process.env.NODE_ENV == 'development' ? 'http://192.168.1.87:8080' : 'https://api2.supergreenlab.com'

const sendBookmark = async (bookmark) => {
  const stored = await browser.storage.local.get('token')
  if (!stored.token) return;

  const resp = await axios.post(`${API_URL}/linkbookmark`, {
    url: bookmark
  }, {
    headers: {
      'Authorization': `Bearer ${stored.token}`,
    },
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, _) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      url: changeInfo.url,
    });
  }
});

chrome.runtime.onMessage.addListener((request, __, sendResponse) => {
	if (request.bookmark) {
    return sendBookmark(request.bookmark)
	} else if (request.loggedIn) {
    return browser.storage.local.get('token').then(stored => !!stored.token)
  }
});

browser.runtime.onInstalled.addListener(() => {
  console.emoji('🦄', 'extension installed');
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
});
