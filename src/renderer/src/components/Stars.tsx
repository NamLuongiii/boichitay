import { JSX, useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

type Star = {
  id: number
  size: number
  x: number
  y: number
  type: 'star' | 'circle'
  opacity: number
  rotate: number
  duration: number
}

function createRandom(id: number): Star {
  return {
    id: id,
    size: Math.random() * 20 + 10,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    type: Math.random() > 0.5 ? 'star' : 'circle',
    opacity: Math.random() > 0.5 ? 0.9 : 0.5,
    rotate: Math.random() * 360,
    duration: Math.random() * 10 + 3
  }
}

function createRandomStars(): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < 10; i++) {
    stars.push(createRandom(i))
  }
  return stars
}

export const Stars = (): JSX.Element => {
  const [stars] = useState(createRandomStars())
  return (
    <StyledStars>
      {stars.map((star) => (
        <RandomStar key={star.id} star={star} />
      ))}
    </StyledStars>
  )
}

const RandomStar = ({ star }: { star: Star }): JSX.Element => {
  // const [star, setStar] = useState(initialStar)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setStar(createRandom(initialStar.id))
  //   }, initialStar.duration)
  //
  //   return () => clearInterval(timer)
  // }, [initialStar])

  return (
    <motion.div
      key={star.id}
      initial={{ scale: 0, opacity: 0, rotate: [star.rotate, star.rotate + 360] }}
      animate={{ scale: [0, 1.6, 1], opacity: [0, star.opacity, 0] }}
      transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
      style={{
        position: 'absolute',
        left: star.x,
        top: star.y,
        width: star.size,
        height: star.size
      }}
    >
      {star.type === 'star' ? <StarSVG /> : <CircleSVG />}
    </motion.div>
  )
}

const StarSVG = (): JSX.Element => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" opacity={0.9}>
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#FFD700" />
  </svg>
)

const CircleSVG = (): JSX.Element => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" opacity={0.9}>
    <circle cx="12" cy="12" r="5" fill="#FFD700" />
  </svg>
)

const StyledStars = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
`
