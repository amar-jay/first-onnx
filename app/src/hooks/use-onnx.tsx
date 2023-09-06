import ort, { InferenceSession } from 'onnxruntime-web'
import { useEffect, useRef, useState } from 'react'
import { EMOTIONS, sigmoid } from '../utils'
import { loadTokenizer } from './tokenizer'
const MODEL_NAME = 'model.onnx'
type State = 'downloading' | 'warming-up' |'ready' | 'error' | 'unknown'

type Emoji = [emotion: string, probability: number]

const tokenizer = await loadTokenizer()
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

export function useOnnxModel(){
	const [state, setState] = useState<State>('unknown')
	const session = useRef<Promise<InferenceSession>|undefined>()

	useEffect(() => {
		setState('downloading')
		session.current = ort.InferenceSession.create(MODEL_NAME, {
			// webgl: true,
			executionProviders: ['webgl'],
			graphOptimizationLevel: 'all',
		})
		session.current.then((s) => {
			setState('warming-up')
			inference(s, "just warming up")
			setState('ready')
		})
	}, [])
	return {
		state,
		session
	}

}