import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/login'
import RegistrationPage from './pages/registration'
import HomePage from './pages/home'
import NewPost from './pages/newPost'
import UserPage from './pages/userPost'

function App() {

  return (
    <BrowserRouter>
    
    <Routes>
      <Route path="/newPost" element={<NewPost/>} />
      <Route path="/userPage" element={<UserPage/>} />
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegistrationPage/>} /> 
    </Routes>
    </BrowserRouter>
  )
}

export default App
