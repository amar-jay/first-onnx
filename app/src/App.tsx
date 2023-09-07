import { LoadingOutlined } from '@ant-design/icons';
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
      state != 'ready' ? (
        <div className='flex flex-col gap-3 items-center justify-center text-sm'>
          <LoadingOutlined spin /> 
            <p className={state == "error" ? "text-red-500": ""}>{state}</p>
        </div>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            {
              session ? <Index session={session}/> : <div className='flex flex-col gap-3 items-center justify-center'>
                <LoadingOutlined spin /> 
                <p>Loading model</p>
              </div>
            }
          </Suspense>
        )
      )
    }
</>
  )
}

export default App
