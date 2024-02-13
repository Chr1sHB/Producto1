import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const HomePage = () => {
  return <h1 className='font-bold text-4xl text-blue-800 '>Hello world!</h1>
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='' element={<HomePage></HomePage>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
