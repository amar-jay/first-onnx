import { createContext } from 'react';

export type AppContextType = {
	text: string;
	loading: boolean;
}
export const AppContext = createContext<AppContextType>({
	text: "",
	loading: false,
});


export default AppContext;
