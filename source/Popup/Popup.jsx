import axios from 'axios'
import * as React from 'react'
import browser from 'webextension-polyfill';

import './styles.scss'

const API_URL='https://api2.supergreenlab.com'

const Login = (props) => {
  const { handleLogin } = props
  const [login, setLogin] = React.useState('')
  const [password, setPassword] = React.useState('')

  return (
    <section id="popup">
      <h2>SuperGreenLab</h2>
      <div>
        Login:<br />
        <input type="text" value={login} onChange={e => setLogin(e.target.value)} />
      </div>
      <div>
        Password:<br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button onClick={() => handleLogin(login, password)}>Login</button>
    </section>
  )
}

const LoggedIn = () => {
  return (
    <section id="popup">
      <div id='center'>
        <div>You are loggedIn</div>
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
    const resp = await axios.post(`${API_URL}/login`, {
      handle: login,
      password,
    })

    await browser.storage.local.set({token: resp.headers['x-sgl-token']})
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
