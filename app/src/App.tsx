import { Suspense } from 'react';
import './App.css';
import { Index } from './Index';
import { useWasmDetect } from './hooks/use-wasm-detect';



function App() {

  const {wasmSupported} = useWasmDetect()
  return (
    <>
    {!wasmSupported ? "WASM not Supported" : (
      <Suspense fallback={<div>Loading...</div>}>
        <Index/>
      </Suspense>
    )}
</>
  )
}

export default App
