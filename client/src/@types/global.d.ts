declare module "react-use-websocket"

declare interface AuthObject {
    uid:                string
    email:              string
}

declare interface ServerResponse {
	result?:    		any
	error?:     		number
}

declare interface StoreObject {
    loading:            boolean
    cookie:             string
    account:            AuthObject | null
}