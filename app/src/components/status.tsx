import {
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

export const StatusTrigger = () => {
	return (

		<AlertDialogTrigger asChild>
			<Button variant="outline" className="w-full">How to?</Button>
		</AlertDialogTrigger>
	)
}
export const StatusComponent = () => {
	return( 
		<AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>How to?</AlertDialogTitle>
          <AlertDialogDescription>
			This is a demo of the BERT model. It is not a real chatbot.
			it detects the sentiment of the message and responds accordingly.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel color="#f00">Cancel</AlertDialogCancel>
          {/* <AlertDialogAction>Continue</AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
	)}