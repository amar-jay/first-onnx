/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />

// add SpeechRecognition API to window
interface Window {
	SpeechRecognition: any;
	webkitSpeechRecognition: any;
}