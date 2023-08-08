import Header from 'components/Header/Header.tsx'
import Homepage from 'pages/Homepage/Homepage.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'context/ThemeContext'
import Footer from 'components/Footer/Footer'
import { initializeApp } from "firebase/app";
import PageNotFound from 'pages/404/PageNotFound'

function App() {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "clubtennisatpitt-0.firebaseapp.com",
    projectId: "clubtennisatpitt-0",
    storageBucket: "clubtennisatpitt-0.appspot.com",
    messagingSenderId: "750088423287",
    appId: "1:750088423287:web:f3d96de20f7c2d1521c372",
    measurementId: "G-Q7Y5R3WVNC"
  }
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/404" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to='/404' />} />
        </Routes>
        <Footer />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
