import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="App" style={{padding: '20px'}}>
      <div style={{marginBottom: '20px'}}>
        <button 
          onClick={() => setShowLogin(true)}
          style={{marginRight: '10px', backgroundColor: showLogin ? '#007bff' : '#ccc'}}
        >
          Login
        </button>
        <button 
          onClick={() => setShowLogin(false)}
          style={{backgroundColor: !showLogin ? '#007bff' : '#ccc'}}
        >
          Register
        </button>
      </div>
      
      {showLogin ? <Login /> : <Register />}
    </div>
  )
}

export default App