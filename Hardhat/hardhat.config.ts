import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv'

dotenv.config()
const { MNEMONIC, GOERLIRPC, INFURA_ID, MUMBAIRPC, ALCHEMY_ID } = process.env
let network = {}

// NETWORKS CONFIGURATION
if (INFURA_ID) {
    network = {
        ...network,
        goerli: {
            url: `${GOERLIRPC}${INFURA_ID}`,
        }
    }
}
if (ALCHEMY_ID) {
    network = {
        ...network,
        mumbai: {
            url: `${MUMBAIRPC}${ALCHEMY_ID}`,
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
            }
        }
    },
    networks: network,
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "../Front/src/artifacts"
    },
    mocha: {
        timeout: 40000
    }
};

export default config;
