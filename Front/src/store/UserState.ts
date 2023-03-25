import { atom } from "recoil";

const init = {
    address : undefined,
    isConnected : false,
    isRegistred : false, 
}

type User = {
    address : string | undefined,
    isConnected : boolean,
    isRegistred : boolean,
};


export const UserState= atom<User>({
    key: 'UserState',
    default: init,
});