import { LoadingOutlined } from '@ant-design/icons';
import { InferenceSession } from 'onnxruntime-web';
import React, { useCallback, useEffect } from 'react';
import AppContext, { AppContextType } from './components/context';
import { Graph, GraphDataType } from './components/graph';
import { ShareButton } from './components/share';
import { SpeechToText } from './components/speech-to-text';
import { StatusTrigger } from './components/status';
import { Button } from "./components/ui/button";
import { Textarea } from './components/ui/textarea';
import { inference } from './hooks/use-onnx';

const GITHUB_URL = 'https://github.com/amar-jay/first-onnx'

export default function Index({session} : {session: InferenceSession}) {
  const [store, setStore] = React.useState<AppContextType>({
    text: "What a beautiful day!",
    loading: false,
    state: 'unknown',
  })
  const [graphData, setGraphData] = React.useState<GraphDataType[]>([])

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
    if (store.loading) {
      const s = setTimeout(() => {
        inference(session, store.text)
        .then(([, emojis]) => {
          const DATA = emojis.map((emoji) => {
            return({
            name: emoji.emotion.split(" ")[1],
            value: emoji.probability
          })})
          setGraphData(DATA)
        }).then(() => toggleLoading())
      }, 500)

      return () => clearTimeout(s)
    }
  }, [store.loading, toggleLoading, session, store.text])

  useEffect(
    () => {
      const interval = setTimeout(() => {
        inference(session, store.text)

        .then(([, emojis]) => {
          const SAMPLE_DATA = emojis.map((emoji) => {
            return({
            name: emoji.emotion.split(" ")[1],
            value: emoji.probability
          })})
          setGraphData(SAMPLE_DATA)
        })
      }, 1000)

      return () => clearInterval(interval)
    },[store.text, session]
  )


	return (

    <AppContext.Provider value={store}>
      <SpeechToText setText={setText}/>
      <ShareButton/>
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
