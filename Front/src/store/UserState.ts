import { atom, selector } from "recoil";
import { ConnectionState } from "../components/atoms/Connection/ConnectionState";

const init = {
    address : undefined,
    isConnected : false,
    isRegistred : false, 
}

type User = {
    address : string | undefined,
    isConnected : boolean,
};


export const UserState= selector<User>({
    key: 'UserState',
    get : ({get}) => {
        const connection = get(ConnectionState)
        return {
            address : connection?.address,
            isConnected : connection?.isConnected && connection?.isRegistred
        }
    }
});