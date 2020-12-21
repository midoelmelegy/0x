import Web3 from 'web3';
import Web3Modal from "web3modal";
import BigNumber from 'bignumber.js';
import Portis from "@portis/web3";

export class Web3Enabled {
  blocknativeAPIKey: string;
  infuraKey: string;
  portisAPIKey: string;
  squarelinkKey: string;
  fortmaticKey: string;
  web3Modal: any;
  web3Provider: any;
  networkID: number;
  userAddress: string;

  constructor(public web3: Web3) {
    this.blocknativeAPIKey = 'c094a276-3a28-4a57-a468-d61efa51e73c';
    this.infuraKey = 'eb5ba991ba924ec5b80fd85423fd901f';
    this.portisAPIKey = '046eaf6b-d838-45d0-b733-ef5ef749fb0f';
    this.networkID = 4;
  }

  async connect(onConnected, onError, isStartupMode: boolean) {
    const providerOptions = {
      portis: {
        package: Portis, // required
        options: {
          id: this.portisAPIKey
        }
      }
    };

    if (!this.web3Modal) {
      this.web3Modal = new Web3Modal({
        network: "mainnet",
        cacheProvider: true,
        theme: "dark",
        providerOptions
      });
    }

    if (isStartupMode) {
      // Only connect cached provider
      if (this.web3Modal.cachedProvider) {
        this.web3Provider = await this.web3Modal.connect();
      }
    } else {
      // Clear cached provider and connect
      this.web3Modal.clearCachedProvider();
      this.web3Provider = await this.web3Modal.connect();
    }
    this.web3 = new Web3(this.web3Provider);

    if (this.web3Provider) {
      const accounts = await this.web3.eth.getAccounts();
      this.userAddress = accounts[0];
      onConnected();

      // Subscribe to accounts change
      this.web3Provider.on("accountsChanged", (accounts: string[]) => {
        this.userAddress = accounts[0];
        onConnected();
      });

      // Subscribe to chainId change
      this.web3Provider.on("chainChanged", (chainId: number) => {
        onConnected();
      });

      // Subscribe to provider disconnection
      this.web3Provider.on("disconnect", (error: { code: number; message: string }) => {
        onError();
      });
    }
  }

  readonlyWeb3() {
    if (this.web3Provider) {
      return this.web3;
    }
    const endpointURL = `wss://mainnet.infura.io/ws/v3/${this.infuraKey}`;
    return new Web3(endpointURL);
  }

  async estimateGas(func, val, _onError) {
    return Math.floor((await func.estimateGas({
      from: this.userAddress,
      value: val
    }).catch(_onError)) * 1.2);
  }

  async sendTx(func, _onTxHash, _onReceipt, _onError) {
    const gasLimit = await this.estimateGas(func, 0, _onError);
    if (!isNaN(gasLimit)) {
      return func.send({
        from: this.userAddress,
        gas: gasLimit,
      }).on('transactionHash', (hash) => {
      }).on('error', (e) => {
        if (!e.toString().contains('newBlockHeaders')) {
          _onError(e);
        }
      });
    }
  }

  async sendTxWithValue(func, val, _onTxHash, _onReceipt, _onError) {
    const gasLimit = await this.estimateGas(func, val, _onError);
    if (!isNaN(gasLimit)) {
      return func.send({
        from: this.userAddress,
        gas: gasLimit,
        value: val
      }).on('transactionHash', (hash) => {
      }).on('error', (e) => {
        if (!e.toString().contains('newBlockHeaders')) {
          _onError(e);
        }
      });
    }
  }

  async sendTxWithToken(func, token, to, amount, _onTxHash, _onReceipt, _onError) {
    const maxAllowance = new BigNumber(2).pow(256).minus(1).integerValue().toFixed();
    const allowance = new BigNumber(await token.methods.allowance(this.userAddress, to).call());
    if (allowance.gte(amount)) {
      return this.sendTx(func, _onTxHash, _onReceipt, _onError);
    }
    return this.sendTx(token.methods.approve(to, maxAllowance), this.doNothing, () => {
      this.sendTx(func, _onTxHash, _onReceipt, _onError);
    }, _onError);
  }

  displayGenericError(error: Error) {
  }

  doNothing() { }
}