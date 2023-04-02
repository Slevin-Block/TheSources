import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'

dotenv.config()
const { MNEMONIC, GOERLIRPC, INFURA_ID, MUMBAIRPC, ALCHEMY_ID, MAIN_ACCOUNT, CLIENT_1_ACCOUNT, CLIENT_2_ACCOUNT, CLIENT_3_ACCOUNT, CLIENT_4_ACCOUNT } = process.env
let networks = {}
const accounts = [MAIN_ACCOUNT, CLIENT_1_ACCOUNT, CLIENT_2_ACCOUNT, CLIENT_3_ACCOUNT, CLIENT_4_ACCOUNT]


// NETWORKS CONFIGURATION
if (INFURA_ID) {
    networks = {
        ...networks,
        goerli: {
            url: `${GOERLIRPC}${INFURA_ID}`,
            accounts,
        }
    }
}
if (ALCHEMY_ID) {
    networks = {
        ...networks,
        mumbai: {
            url: `${MUMBAIRPC}${ALCHEMY_ID}`,
            accounts,
        }
    }
}


// GLOBALS CONFIGURATIONS
const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks,
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: ".artifacts"//"../Front/src/artifacts"
    },
    mocha: {
        timeout: 40000
    }
};

export default config;
