'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ArrowUp } from 'lucide-react'

const Scrolltop = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollPos, setScrollPos] = useState<number>(0)

  useEffect(() => {
    let timeoutId: number | any

    const handleScroll = () => {
      const scrollY = window.scrollY

      setScrollPos(scrollY)

      setIsVisible(true)

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, 800)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // console.log(scrollPos)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <React.Fragment>
      {scrollPos > 100 && (
        <Button
          size='icon'
          className={`z-20 transition-all duration-300 transform fixed ${
            isVisible ? 'translate-x-20' : 'translate-x-0'
          } bottom-0 right-0 m-10`}
          onClick={scrollToTop}
        >
          <ArrowUp color='#ffffff' size='20px' />
        </Button>
      )}
    </React.Fragment>
  )
}

export default Scrolltop
