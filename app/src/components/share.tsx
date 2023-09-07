import { ShareAltOutlined } from '@ant-design/icons';
import { Button } from "./ui/button";

export function ShareButton() {

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: 'B.E.R.T',
				text: 'Check out this cool app that uses ONNXRUNTIME on https://bert-msi.vercel.app/',
				url: window.location.href
			})
				.then(() => console.log('Successful share'))
				.catch((error) => console.log('Error sharing', error));
		} else {
			// copy to clipboard
			console.log("Share API not supported.Copied to clipboard instead.")
			navigator.clipboard.writeText(window.location.href)
		}
	}

	return (
		<Button variant={'outline'} className="w-10 h-10 m-auto fixed right-10 top-10" onClick={handleShare}>
			<ShareAltOutlined className='text-primary' />
		</Button>

	)
}