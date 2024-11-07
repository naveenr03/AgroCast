import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import { Auth } from './pages/auth'
import { Navbar } from './components/navbar'
import Test from './pages/test'
import TestML from './pages/testML'
import Crop from './pages/crop'
import CropRecommendation from './pages/cropRecommendation'
import './App.css'


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/weather" element={<Test />} />
          <Route path="/testML" element={<TestML />} />
          <Route path="/crop" element={<Crop />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
