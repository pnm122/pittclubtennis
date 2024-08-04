/** Poll until the callback function returns true or the timeout passes. */
export default async function waitFor(callback: () => boolean, timeout: number = 100) {
  const startTime = Date.now()
  return new Promise<void>(res => {
    const test = async () => {
      const currentTime = Date.now()
      const timedOut = currentTime > startTime + timeout
      if(timedOut || callback()) {
        res()
      } else {
        setTimeout(test)
      }
    }
    test()
  })
}