export const textFrom = {
  y: '100%',
  opacity: 0,
  rotate: 45
}

export const textTo = {
  y: 0,
  opacity: 1,
  rotate: 0,
  stagger: 0.02,
  ease: 'power4.inOut',
  duration: 0.5
}

export const textToInView = (trigger: any) => {
  return {
    ...textTo,
    scrollTrigger: {
      trigger: trigger,
      start: '80px bottom'
    },
    delay: '0.25'
  }
}
