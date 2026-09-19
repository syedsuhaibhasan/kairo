import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
  <>
    <div className='bg-blue-600'>Header</div>
      <Outlet />
    <div className='bg-blue-600'>Footer</div>
  </>
  )
}

export default App
