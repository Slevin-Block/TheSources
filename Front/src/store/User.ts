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


export const User= atom<User>({
    key: 'User',
    default: init,
});