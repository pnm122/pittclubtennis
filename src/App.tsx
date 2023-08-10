import Header from 'components/Header/Header.tsx'
import Homepage from 'pages/Homepage/Homepage.tsx'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'context/ThemeContext'
import Footer from 'components/Footer/Footer'
import { initializeApp } from "firebase/app";
import PageNotFound from 'pages/404/PageNotFound'
import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { textFrom, textTo, textToInView } from 'utils/animation/textAnimation'
import { ScrollTrigger } from 'gsap/all'
import SplitType from 'split-type'
import { fadeFrom, fadeToInView } from 'utils/animation/fadeAnimation'

function App() {
  const location = useLocation()

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

  gsap.registerPlugin(ScrollTrigger)

  useLayoutEffect(() => {
    const sections = document.getElementsByClassName('two-cols')
    let ctxs : gsap.Context[] = []
    for(let s of sections) {
      ctxs.push(
        gsap.context(() => {
          const splitTextElem = s.querySelector('.title')
          const contentElem = s.querySelector('.content')

          if (!splitTextElem || !contentElem) return

          const splitText = new SplitType(splitTextElem as any, {
            wordClass: 'no-overflow'
          })
          
          gsap.fromTo(splitText.chars, textFrom, textToInView(s))
      
          gsap.fromTo(contentElem, fadeFrom, fadeToInView(s))
        }, s)
      )
    }

    return () => {
      for(let ctx of ctxs) {
        ctx.revert()
      }
    }
  }, [location.pathname])

  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </ThemeProvider>
  )
}

export default App
