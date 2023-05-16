import { forwardRef, useState, Suspense, useMemo , useEffect} from 'react'
import Spiral from './components/Spiral'
import classes from './components/Loader.module.css'

function App() {
  return (
    <>
  
      <Spiral/>

    </>
  )
}

export default App