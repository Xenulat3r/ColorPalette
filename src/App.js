import React, { useState, useEffect } from 'react';

function App() {
  const [mode, setMode] = useState("monochrome")
  const [color, setColor] = useState("e9cbff")
  const [seedColor,setSeedColor] = useState([])
  const [copyColor, setCopyColor] = useState("")
  const [palette, setPalette] = useState([])
  const [start, setStart] = useState(false)
  const [infoText, setInfoText] = useState("")
  const url = `https://www.thecolorapi.com/scheme?hex=${color}&mode=${mode}&count=10`

  useEffect(() => {  
    !start &&
      fetch(url)
        .then(res => res.json())
        .then(data => {setPalette(data.colors);})
  }, [start])

  async function copyIt(color) {
    try {
      await navigator.clipboard.writeText(color)
      setInfoText(color + ' copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  useEffect(() => {
    copyColor &&
      copyIt(copyColor)
    setTimeout(() => {
      setCopyColor("")
    }, 500)

  }, [copyColor])



  const colorDivs = palette.map(color => ( 
    <div className="color"
      style={{ backgroundColor: `${color.hex.value}` }}
      onClick={() => { !copyColor && setCopyColor(`${color.hex.value}`) }}
    >
      <div style={{ color: `${color.contrast.value}` }}
      >
        {`${color.hex.value}` === copyColor ? <h1>Copied!</h1> : <h1>{color.hex.value}</h1>}
      </div>
    </div>
  ))



  const handleSubmit = async (e) => {
    e.preventDefault();
    setStart(true)
    fetch(url)
      .then(res => res.json())
      .then(data => {setPalette(data.colors)})
  }

  return (
    <main>
      <form id="modeSelect" onSubmit={handleSubmit}>
        <input value={"#" + color} type="color" onChange={(e) => setColor(e.target.value.slice(1))} />
        <select onChange={(e) => setMode(e.target.value)}>
          <option value="monochrome">monochrome</option>
          <option value="monochrome-dark">monochrome-dark</option>
          <option value="monochrome-light">monochrome-light</option>
          <option value="analogic">analogic</option>
          <option value="complement">complement</option>
          <option value="analogic-complement">analogic-complement</option>
          <option value="triad">triad</option>
          <option value="quad">quad</option>
        </select>
        <button type="submit">Get Color Scheme</button>

      </form>

         


      <div className="colors">
        {colorDivs}
      </div>
      <footer>
        <h2> {copyColor ? infoText : "Click a color to copy its hex code!"}</h2>
      </footer>
    </main>
  );
}


export default App;
