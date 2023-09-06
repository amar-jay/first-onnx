import ort, { InferenceSession } from 'onnxruntime-web'
import React, { useEffect, useRef } from 'react'
import AppContext, { AppContextType, State } from '../components/context'
import { EMOTIONS, sigmoid } from '../lib/utils'
import BertTokenizer from './tokenizer'
const MODEL_NAME = '/models/classifier.onnx'

type Emoji = [emotion: string, probability: number]
const tokenizer = new BertTokenizer()

async function inference(session: InferenceSession, text: string): Promise<[duration: number, emojis: Emoji[]]> {
	const start = performance.now();
	const encoded = await tokenizer.tokenize(text)

	if (encoded.length === 0) {
		throw new Error("Empty encoding. Error in tokenizing")
		// return [0.0, null]
	}

	const output = await session.run(model_input(encoded), ['output'])
	const duration = performance.now() - start
	const probabilities = output['output'].data.map(sigmoid)

	const resultList:Emoji[] = []
	for (const i in probabilities) {
		resultList.push([EMOTIONS[i], probabilities[i] as number])
	}

	return [duration,resultList];

}

const model_input = (encoded: number[]) => {
	encoded = [101, ...encoded, 102]
	const inputArray:bigint[] = encoded.map(i => BigInt(i))
	const attentionMaskArray:bigint[] = new Array(encoded.length + 2).fill(BigInt(1))
	const tokenTypeArray:bigint[] = new Array(encoded.length + 2).fill(BigInt(0))
	
	const sequenceLen = inputArray.length;
	const inputIds = new ort.Tensor('int64', BigInt64Array.from(inputArray), [1, sequenceLen])
	const attentionMask = new ort.Tensor('int64', BigInt64Array.from(attentionMaskArray), [1, sequenceLen])
	const tokenTypeIds = new ort.Tensor('int64', BigInt64Array.from(tokenTypeArray), [1, sequenceLen])
	
	return {
		inputIds, 
		attentionMask,
		tokenTypeIds
	}
}

export function useOnnxModel(store: AppContextType, setStore: React.Dispatch<React.SetStateAction<AppContextType>>){
	const {state} = React.useContext(AppContext)

	const setState = React.useCallback((state: State) => (
		setStore({
			...store,
			state
		})
	), [store, setStore])

	// ort.env.wasm.numThreads = 3
	// ort.env.wasm.simd = true

	const session = useRef<Promise<InferenceSession>|undefined>()

	useEffect(() => {
		// do not download if already downloaded
		if (session.current) {
			return
		}

		const options:InferenceSession.SessionOptions = {
			executionProviders: ['wasm'], 
			graphOptimizationLevel: 'all'
		};

		if (!tokenizer.loaded) {
			try {
				tokenizer.load()
			} finally {
				setState('downloading')
				session.current = InferenceSession.create(MODEL_NAME, options)

				session.current.then((s) => {
					setState('warming-up')
					for (let i = 0; i < 10; i++){
						console.log("Warming up")
						inference(s, "just warming up")
					}

				setState('ready')
		})
			}
		}

	}, [setState])


	return {
		state,
		session: session.current
	}

}