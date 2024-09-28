import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import { Auth } from './pages/auth'
import { Navbar } from './components/navbar'
import './App.css'
import Test from './pages/test'
import TestML from './pages/testML'


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/test" element={<Test />} />
          <Route path="/testML" element={<TestML />} />
      
        </Routes>
      </Router>
    </>
  )
}

export default App
