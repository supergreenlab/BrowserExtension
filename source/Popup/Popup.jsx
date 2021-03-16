import axios from 'axios'
import * as React from 'react'
import browser from 'webextension-polyfill';

import './styles.scss'

const API_URL = process.env.NODE_ENV == 'development' ? 'http://192.168.1.87:8080' : 'https://api2.supergreenlab.com'

const Login = (props) => {
  const { handleLogin } = props
  const [login, setLogin] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <section id="popup">
      <div id='center'>
        <h2>Super<span class='green'>Green</span>Lab</h2>
        <div>
          Login:<br />
          <input type="text" value={login} onChange={e => setLogin(e.target.value)} />
        </div>
        <div>
          Password:<br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button class='cta' onClick={() => handleLogin(login, password)}>Login</button>
      </div>
    </section>
  )
}

const LoggedIn = () => {
  const [url, setUrl] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const getPage = async () => {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true })
      setUrl(tabs[0].url)
    }
    getPage()
  }, [])
  const sendBookmark = async () => {
    setLoading(true)
    await chrome.runtime.sendMessage({'bookmark': url})
    setSent(true)
    setLoading(false)
  }
  if (loading) {
    return (
      <Loading />
    );
  }
  const logo = browser.runtime.getURL('assets/icons/favicon-48.png')
  return (
    <section id="popup" style={{backgroundImage: `url(${logo})`}}>
      <div id='center'>
        <div>Current page URL:</div>
        <b id='url'>{ url }</b>
        { sent ? 
            <h2>Alright, <span class='green'>sent!</span> Thanks 💚</h2> :
            <button onClick={sendBookmark}>Bookmark this page</button>
        }
      </div>
    </section>
  )
}

const Loading = () => {
  return (
    <section id="popup">
      <div id='center'>
        <div>Loading please wait</div>
      </div>
    </section>
  )
}

const Popup = () => {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    const checkToken = async () => {
      const stored = await browser.storage.local.get('token')
      if (stored.token) {
        setLoggedIn(true)
      }
      setLoading(false)
    }
    checkToken()
  }, [])

  const handleLogin = async (login, password) => {
    setLoading(true)
    try {
      const resp = await axios.post(`${API_URL}/login`, {
        handle: login,
        password,
      })
    } catch(e) {
      setLoading(false)
      setLoggedIn(false)
      return
    }

    const token = resp.headers['x-sgl-token']
    if (!token) {
      setLoading(false)
      setLoggedIn(false)
      return
    }

    await browser.storage.local.set({token})
    setLoading(false)
    setLoggedIn(true)
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!loggedIn) {
    return (
      <Login handleLogin={handleLogin} />
    )
  }
  return (
    <LoggedIn />
  )
}

export default Popup;
