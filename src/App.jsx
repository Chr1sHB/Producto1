import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Homepage from './pages/HomePage'
import Footer from './Components/Footer'
import Login from './pages/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>}/>
        <Route path='/login' element={<Login></Login>}/>
      </Routes>
      {/* Footer */}
      <Footer></Footer>
    </BrowserRouter>
  )
}

export default App
