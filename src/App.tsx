import Homepage from 'pages/Homepage/Homepage.tsx'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'context/ThemeContext'
import { initializeApp } from "firebase/app";
import PageNotFound from 'pages/404/PageNotFound'
import { useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { textFrom, textToInView } from 'utils/animation/textAnimation'
import { ScrollTrigger } from 'gsap/all'
import SplitType from 'split-type'
import { fadeFrom, fadeToInView } from 'utils/animation/fadeAnimation'
import About from 'pages/About/About'
import Tryouts from 'pages/Tryouts/Tryouts'
import Members from 'pages/Members/Members'
import Tournaments from 'pages/Tournaments/Tournaments'
import Fundraisers from 'pages/Fundraisers/Fundraisers'
import PageLayout from 'layout/PageLayout'
import Admin from 'pages/Admin/Admin';
import Login from 'pages/Admin/Login/Login';
import Edit from 'pages/Admin/Edit/Edit';

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
  // @ts-ignore
  const app = initializeApp(firebaseConfig)

  gsap.registerPlugin(ScrollTrigger)

  useLayoutEffect(() => {
    // For each two-cols section on the page, create a GSAP context where
    // the content of the section animates in when the section appears on-screen
    const sections = document.getElementsByClassName('two-cols')
    let ctxs : gsap.Context[] = []
    for(let s of sections) {
      ctxs.push(
        gsap.context(() => {
          const splitTextElem = s.querySelector('.title')
          const fadeInElems = s.getElementsByClassName('fade-in')

          // Make sure that the elems exist before performing anything on them
          if (!splitTextElem || !fadeInElems) return

          const splitText = new SplitType(splitTextElem as any, {
            wordClass: 'no-overflow'
          })
          
          gsap.fromTo(splitText.chars, textFrom, textToInView(s))
      
          for(let elem of fadeInElems) {
            gsap.fromTo(elem, fadeFrom, fadeToInView(s))
          }
        }, s)
      )
    }

    return () => {
      for(let ctx of ctxs) {
        ctx.revert()
      }
    }
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/tryouts" element={<Tryouts />} />
          <Route path="/tournaments" element={<Tournaments />} />
          <Route path="/fundraisers" element={<Fundraisers />} />
          <Route path="/members" element={<Members />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="login" element={<Login />} />
          <Route path="edit" element={<Edit />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
