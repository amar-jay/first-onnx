import { useState } from 'react'
import './App.css'
import reactLogo from './assets/react.svg'
import { useOnnxModel } from './hooks/use-onnx'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  const {
    state
  } = useOnnxModel()

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <div>
            <h3>Sadness</h3>
            <p>{state}</p>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
