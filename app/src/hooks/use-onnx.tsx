import * as ort from 'onnxruntime-web'
import React, { useEffect, useRef } from 'react'
import { State } from '../components/context'
import { EMOTIONS, sigmoid } from '../lib/utils'
import BertTokenizer from './tokenizer'

/**
 * Fetching the model from github since vercel cannot handle large files but 
 * uses local model on development
 */
let MODEL_URI = 'https://media.githubusercontent.com/media/amar-jay/first-onnx/main/app/public/models/classifier.onnx'
if (process.env.NODE_ENV === 'development') {
	MODEL_URI = '/models/classifier.onnx'
}


type Emoji = {emotion: string, probability: number}
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
		resultList.push({
			emotion: EMOTIONS[i], 
			probability: probabilities[i] as number
		})
	}

	return [duration,resultList];

}

type Tensor = ort.TypedTensor<"int64"> | Array<bigint>
const model_input = (encoded: number[]) => {
  let inputIds: Tensor = new Array(encoded.length+2);
  let attentionMask:Tensor = new Array(encoded.length+2).fill(BigInt(1));
  let tokenTypeIds:Tensor = new Array(encoded.length+2).fill(BigInt(0));

  inputIds[0] = BigInt(101);
  let i = 0;
  for(; i < encoded.length; i++) { 
    inputIds[i+1] = BigInt(encoded[i]);
  }

  inputIds[i+1] = BigInt(102);
  const sequence_length = inputIds.length;
  inputIds = new ort.Tensor('int64', BigInt64Array.from(inputIds), [1,sequence_length]);
  attentionMask = new ort.Tensor('int64', BigInt64Array.from(attentionMask), [1,sequence_length]);
  tokenTypeIds = new ort.Tensor('int64', BigInt64Array.from(tokenTypeIds), [1,sequence_length]);
  return {
    input_ids: inputIds,
    attention_mask: attentionMask,
    token_type_ids: tokenTypeIds
  }
}

export function useOnnxModel(){
	const [state, setState] = React.useState<State>('unknown')

	// ort.env.wasm.numThreads = 3
	// ort.env.wasm.simd = true

	const session = useRef<Promise<ort.InferenceSession>|undefined>()
	const awaitedSession = useRef<ort.InferenceSession|undefined>()

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
				setState('downloading model')
				tokenizer.load()
				session.current = ort.InferenceSession.create(MODEL_URI, options)
			} 
			finally {
				session.current?.then((s) =>  {
					setState('initializing model')
					awaitedSession.current = s
					return s
				}).then((s) => {
					const vals: Promise<[duration: number, emojis: Emoji[]]>[] = []
					setState('warming-up model')
					for (let i = 0; i < 10; i++){
						const val = inference(s, "just warming up")
						vals.push(val)
					}
					return Promise.allSettled(vals)
				}).then(() => {
				setState('ready')
				}).catch((e) => {
					console.error(e)
					setState('error')
				})
			}
		}
	}, [setState])


	return {
		state,
		session: awaitedSession.current
	}

}
