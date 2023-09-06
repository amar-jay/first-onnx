import { LoadingOutlined } from '@ant-design/icons';
import React, { useCallback, useEffect } from 'react';
import AppContext, { AppContextType } from './components/context';
import { Graph, GraphDataType } from './components/graph';
import { StatusTrigger } from './components/status';
import { Button } from "./components/ui/button";
import { Textarea } from './components/ui/textarea';
import { useOnnxModel } from './hooks/use-onnx';

const GITHUB_URL = 'https://github.com/amar-jay/first-onnx'
let SAMPLE_DATA_LABELS = ["Happy 😂", "Sad 🥹", "Angry 😡", "Neutral 😐", "Surprised 🫢"]
SAMPLE_DATA_LABELS = SAMPLE_DATA_LABELS.map((label) => label.split(" ")[1])

export function Index() {
  const [store, setStore] = React.useState<AppContextType>({
    text: "",
    loading: false,
    state: 'unknown',
  })
  const [graphData, setGraphData] = React.useState<GraphDataType[]>([])

  const {session, state} = useOnnxModel(store, setStore)
  const setText = useCallback((text: string) => (
    setStore({
      ...store,
      text
    })
  ), [store])

  const toggleLoading = useCallback(() => (
    setStore({
      ...store,
      loading: !store.loading,
    })
  ), [store])


  useEffect(() => {
    const SAMPLE_DATA = SAMPLE_DATA_LABELS.map((label) => ({
    name: label,
    value: Math.floor(Math.random() * 5000) + 1000})
    )
    setGraphData(SAMPLE_DATA)
  }, [store.text])

  useEffect(() => {
    if (store.loading) {
      setTimeout(() => {
          const SAMPLE_DATA = SAMPLE_DATA_LABELS.map((label) => ({
            name: label,
            value: Math.floor(Math.random() * 5000) + 1000})
          )
        setGraphData(SAMPLE_DATA)
        toggleLoading()
      }, 500)
    }
  }, [store.loading, toggleLoading])


	return (

    <AppContext.Provider value={store}>
      {JSON.stringify(session)}{state}
    <div className='container h-screen flex items-center flex-col justify-center'>
    <div className='flex flex-grow flex-col items-center justify-center gap-8 w-full'>
      <h1 className="">B. E. R. T.</h1>
      <div className="grid w-full gap-2">
        <Textarea placeholder="Type your message here." value={store.text} onChange={e => setText(e.target.value)}/>
        <Button onClick={toggleLoading}>
          {
            store.loading ?
            <LoadingOutlined spin /> :
            <>Send</>
          }
          </Button>
      <StatusTrigger/>
        <Graph data={graphData}/>
    </div>

    </div>
    <div className='flex-shrink my-3 border-black border-t-3'>
    You can check out the <a href={GITHUB_URL}>source code</a> on my GitHub.
    </div>

    </div></AppContext.Provider>
	)
}