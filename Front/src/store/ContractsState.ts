import { atom } from "recoil";

type Contracts = {
    marketPlace : `0x${string}`;
    article : `0x${string}`;
    memberToken : `0x${string}`;
    ready : boolean;
}

export const ContractsState= atom<Contracts>({
    key: 'ContractsState',
    default : {
        marketPlace : '0x',
        article : '0x',
        memberToken : '0x',
        ready : false
    }
});

