/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import { useEffect, useState } from "react";
import { simd } from "wasm-feature-detect";
export const useWasmDetect = () => {
	const [support, setSupport] = useState(false);

	const wasmSupported = simd();
	useEffect(() => {
		const run = async () => {
		if (await wasmSupported) 
			setSupport(true);
	}
		run();
	}, [wasmSupported]);



	return {
		wasmSupported: support
	}
}
