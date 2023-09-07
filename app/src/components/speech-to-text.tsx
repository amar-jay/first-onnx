import { AudioMutedOutlined, AudioOutlined } from '@ant-design/icons';
import { Button } from "./ui/button";

export function SpeechToText({setText}: {setText: (text: string) => void}) {
	let SSTButton = AudioOutlined

	if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
		SSTButton = AudioMutedOutlined
	}
		const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

		recognition.onstart = () => {
			setText('Listening...');
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recognition.onresult = (event: any) => {
			const transcript = event.results[0][0].transcript;
			setText(transcript)
		};

			recognition.onerror = (event: {error: string} ) => {
				alert('Speech recognition error: ' + event.error);
				setText('')
			};

	const handleShare = () => {
		recognition.start()
	}

	return (
		<Button variant={'outline'} className="w-10 h-10 m-auto fixed right-10 bottom-10" onClick={handleShare}>
			<SSTButton className='text-primary' />
		</Button>

	)
}