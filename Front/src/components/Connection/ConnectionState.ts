import { atom } from "recoil";

const init = {
    address : undefined,
    isConnected : false,
    isRegistred : false, 
}

type Connection = {
    address : string | undefined,
    isConnected : boolean,
    isRegistred : boolean,
};


export const ConnectionState= atom<Connection>({
    key: 'ConnectionState',
    default: init,
});