import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { useHistory } from 'react-router-dom';
import Config from './config.json';

export const config = Config;

const initialStore: StoreObject = {
    account:                null,
    cookie:                 "",
    loading:                false
}

const fns = {} as {
	[id:string]:(response: ServerResponse) => Promise<void>
}

const setStore = (state: StoreObject) => {
	window.localStorage.setItem(config.appKey, JSON.stringify(state))
}

const getStore = (initialStore: any) => {
    try {
        const buf = window.localStorage.getItem(config.appKey);
        if(buf) {
            const json = JSON.parse(buf);
            for (let k in json) {
                if (initialStore[k] !== undefined) {
                    initialStore[k] = json[k]
                }
            }
        }

        initialStore.loading = false;
    } catch (err) {
        
    }
}

export const slice = createSlice({
	name: 'store',
	initialState: getStore(initialStore),
	reducers: {
		update: (state: any, action) => {
			for (const k in action.payload) {
				if (state[k] === undefined) new Error(`undefined store key ${k}`)
				state[k] = action.payload[k]
			}
			setStore(state)
		}
	}
})

const useStore = () => {
    const history = useHistory();
    const G = useSelector((store:StoreObject) => store);
	const dispatch = useDispatch()
	const update = (payload:Partial<StoreObject>) => dispatch(slice.actions.update(payload))

    const { sendJsonMessage } = useWebSocket(config.apiServer + '/' + config.apiKey + ':' + (G.cookie || ''), {
		shouldReconnect: ( closeEvent: any ) => true,
		onOpen: (e: WebSocketEventMap['open']) => {
			console.log("Socket connected");
		},
		onClose: (e: WebSocketEventMap['close']) => {
			console.log("Socket disconnected");
		},
		onMessage: async (e: WebSocketEventMap['message']) => {
			try {
				if (typeof e.data==="string") {
					const { jsonrpc, id, result, error } = JSON.parse(decodeURI(e.data))
					if (jsonrpc==="2.0" && typeof fns[id]==="function") {
						await fns[id]({result, error})
					}
				}
			} catch (error) {
				
			}
		},
		onError: (e: WebSocketEventMap['error']) => {
			console.log("socket error")
		},
		reconnectAttempts: 1000,
		reconnectInterval: 5000,
		share: true
	})

    

	const sendJson = (method:string, ...params:Array<any>):Promise<ServerResponse> => {
		return new Promise(async resolve=>{
			const id = [+new Date(), Math.round(Math.random()*1e6)].join('')
			const timer = setTimeout(()=>{
				resolve({error:32001})
				delete fns[id]
			}, 60000)
			fns[id] = async (response) => {
				resolve(response)
				delete fns[id]
				clearTimeout(timer)
			}
			sendJsonMessage({
				jsonrpc: "2.0",
				method,
				params: params || [],
				id
			})
		})
	}

    return { ...G, history, update, sendJson }
}

export default useStore;