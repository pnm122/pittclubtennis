export const fadeFrom = {
  opacity: 0,
  y: 50
}

export const fadeTo = {
  opacity: 1,
  y: 0,
  ease: `expo.inOut`,
  duration: 1.25,
  stagger: 0.05
}

export const fadeToInView = (trigger: any) => {
  return {
    ...fadeTo,
    scrollTrigger: {
      trigger: trigger,
      start: '80px bottom'
    }
  }
}
