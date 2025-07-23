import React from 'react'
import './App.css'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import NewPosts from './pages/NewPosts'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/> 
        <Route path='/register' element={<Register/>}/> 
        <Route path='/home' element={<Home/>}/> 
        <Route path='/add-post' element={<NewPosts/>}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
