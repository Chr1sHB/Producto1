import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Homepage from './pages/HomePage'
import Footer from './Components/Footer'
import Login from './pages/Login'
import CreateTaskPage from './pages/CreateTask'
import Reports from './Components/Reports'
import PrivateRoute from './Components/PrivateRoot'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Login/>}/>
        <Route path='/create-task' element={<CreateTaskPage/>}/>
        <Route path='/reports' element={
          <PrivateRoute>
            <Reports/>
          </PrivateRoute>
        }/>
      </Routes>
      {/* Footer */}
      <Footer></Footer>
    </BrowserRouter>
  )
}

export default App
