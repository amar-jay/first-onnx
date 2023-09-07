import React, { Suspense } from 'react';
import './App.css';
import { useOnnxModel } from './hooks/use-onnx';
import { useWasmDetect } from './hooks/use-wasm-detect';


const Index = React.lazy(() => import('./Index'));

function App() {

  const {wasmSupported} = useWasmDetect()
  const {state, session} = useOnnxModel()
  return (
    <>
    {!wasmSupported ? "WASM not Supported" : (
      state != 'ready' ? state : (
          <Suspense fallback={<div>Loading...</div>}>
            {
              session ? <Index session={session}/> : "Loading model"
            }
          </Suspense>
        )
      )
    }
</>
  )
}

export default App
