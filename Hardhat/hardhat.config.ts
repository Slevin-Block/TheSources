import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'
import "@typechain/hardhat"

dotenv.config()
const { MNEMONIC, GOERLIRPC, INFURA_ID, MUMBAIRPC, ALCHEMY_ID, MAIN_ACCOUNT, CLIENT_1_ACCOUNT, CLIENT_2_ACCOUNT, CLIENT_3_ACCOUNT, CLIENT_4_ACCOUNT } = process.env
const accounts = [MAIN_ACCOUNT, CLIENT_1_ACCOUNT, CLIENT_2_ACCOUNT, CLIENT_3_ACCOUNT, CLIENT_4_ACCOUNT]
let networks = {}


// NETWORKS CONFIGURATION
/* networks = {
        localhost : {
        url :"http://127.0.0.1:8545",
        chainId : 31337,
        allowUnlimitedContractSize: true
    }
} */
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
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
        },
    },

    defaultNetwork: "localhost",
    networks,
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: /* ".artifacts" */"../Front/src/artifacts"
    },
    typechain: {
        outDir: "typeschain-types",
        target: "ethers-v5",
        alwaysGenerateOverloads: false,
        externalArtifacts: [],
    },
    mocha: {
        timeout: 40000
    }
};

export default config;
