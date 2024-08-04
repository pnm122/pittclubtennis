export default function generateId() {
  function randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26))
  }

  return (new Array(12)).fill('').map(() => randomLetter()).join('')
}