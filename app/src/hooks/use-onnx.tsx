import * as ort  from 'onnxruntime-web'
import React, { useEffect, useRef } from 'react'
import AppContext, { AppContextType, State } from '../components/context'
import { EMOTIONS, sigmoid } from '../lib/utils'
import BertTokenizer from './tokenizer'
const MODEL_NAME = '/models/classifier.onnx'

type Emoji = [emotion: string, probability: number]
const tokenizer = new BertTokenizer()

export async function inference(session: ort.InferenceSession, text: string): Promise<[duration: number, emojis: Emoji[]]> {
	const start = performance.now();
	const encoded = await tokenizer.tokenize(text)

	if (encoded.length === 0) {
		throw new Error("Empty encoding. Error in tokenizing")
		// return [0.0, null]
	}

	const output = await session.run(model_input(encoded), ['output_0'])
	const duration = performance.now() - start
	const probabilities = output['output_0'].data.map(sigmoid)

	const resultList:Emoji[] = []
	for (const i in probabilities) {
		resultList.push([EMOTIONS[i], probabilities[i] as number])
	}

	return [duration,resultList];

}

const model_input = (encoded: number[]) => {
  var inputIds = new Array(encoded.length+2);
  var attentionMask = new Array(encoded.length+2).fill(BigInt(1));
  var tokenTypeIds = new Array(encoded.length+2).fill(BigInt(0));

  inputIds[0] = BigInt(101);
  var i = 0;
  for(; i < encoded.length; i++) { 
    inputIds[i+1] = BigInt(encoded[i]);
  }

  inputIds[i+1] = BigInt(102);
  const sequence_length = inputIds.length;
  inputIds = new ort.Tensor('int64', BigInt64Array.from(inputIds), [1,sequence_length]);
  attentionMask = new ort.Tensor('int64', BigInt64Array.from(attentionMask), [1,sequence_length]);
  tokenTypeIds = new ort.Tensor('int64', BigInt64Array.from(tokenTypeIds), [1,sequence_length]);
  return {
    inputIds,
    attentionMask,
    tokenTypeIds
  }
}

export function useOnnxModel(store: AppContextType, setStore: React.Dispatch<React.SetStateAction<AppContextType>>){
	const {state} = React.useContext(AppContext)

	const setState =(state: State) => (
		setStore({
			...store,
			state
		})
	)

	// ort.env.wasm.numThreads = 3
	// ort.env.wasm.simd = true

	const session = useRef<Promise<ort.InferenceSession>|undefined>()

	useEffect(() => {
		// do not download if already downloaded
		if (session.current) {
			return
		}

		const options:ort.InferenceSession.SessionOptions = {
			executionProviders: ['wasm'], 
			graphOptimizationLevel: 'all'
		};

		if (!tokenizer.loaded) {
			try {
				tokenizer.load()
				session.current = ort.InferenceSession.create(MODEL_NAME, options)
			} 
			finally {
				setState('downloading')

				session.current?.then((s) => {
					setState('warming-up')
					for (let i = 0; i < 10; i++){
						const vals = inference(s, "just warming up")
						console.log("Warming up", vals)
					}

				setState('ready')
		})
			}
		}

	}, [])


	return {
		state,
		session: session.current
	}

}