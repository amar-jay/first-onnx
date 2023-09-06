import { createContext } from 'react';

export type State = 'downloading' | 'warming-up' |'ready' | 'error' | 'unknown'

export type AppContextType = {
	text: string;
	loading: boolean;
	state: State;
}

export const AppContext = createContext<AppContextType>({
	text: "",
	loading: false,
	state: 'unknown',
});


export default AppContext;
