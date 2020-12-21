import { Injectable } from '@angular/core';
import { ConstantsService } from './constants.service';
import { WalletService } from './wallet.service';
import BigNumber from 'bignumber.js';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  token: any;
  tokenBalance: any;
  tokenSymbol: string;
  monsLeft: BigNumber;
  maxMons: any;
  totalMons: BigNumber;
  mergePrice: any;
  buyPrice: any;
  currBlock: any;

  constructor(public wallet: WalletService, public constants: ConstantsService) { 
    this.token = undefined;
    this.tokenBalance = new BigNumber(0);
    this.tokenSymbol = '';
    this.monsLeft = new BigNumber(0);
    this.mergePrice = new BigNumber(0);
    this.buyPrice = new BigNumber(0);

    this.loadData();
  }

  public get YFB() {
    const abi = require('../assets/abi/ERC20.json');
    const address = this.constants.YFB_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get STAKER() {
    const abi = require('../assets/abi/Staker.json');
    const address = this.constants.STAKER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get MONS() {
    const abi = require('../assets/abi/Mons.json');
    const address = this.constants.MON_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  public get DAI() {
    const abi = require('../assets/abi/ERC20.json');
    const address = this.constants.DAI_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get ClAIMER() {
    const abi = require('../assets/abi/Claimer.json');
    const address = this.constants.CLAIMER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public ERC20(address) {
    const abi = require('../assets/abi/ERC20.json');
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  // New Getters
  public get XMON() {
    const abi = require('../assets/abi/ERC20.json');
    const address = this.constants.XMON_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MON_STAKER() {
    const abi = require('../assets/abi/MonStaker.json');
    const address = this.constants.MON_STAKER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MON_SPAWNER() {
    const abi = require('../assets/abi/MonSpawner.json');
    const address = this.constants.MON_SPAWNER_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get MULTICALL() {
    const abi = require('../assets/abi/Multicall.json');
    const address = this.constants.MULTICALL_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address); 
  }

  public get NFT_AGG() {
    const abi = require('../assets/abi/NFTAggregator.json');
    const address = this.constants.NFT_AGGREGATOR_ADDRESS;
    return new this.wallet.web3.eth.Contract(abi, address);
  }

  async loadData() {
    // this.maxMons = new BigNumber(await this.MONS.methods.maxMons.call().call());
    // this.totalMons = await this.MONS.methods.getTotalMons().call();
    // this.monsLeft = this.maxMons.minus(this.totalMons);
    // if (this.monsLeft.isLessThanOrEqualTo(new BigNumber(0))) {
    //   this.monsLeft = new BigNumber(0);
    // }

    // const tokenAddress = await this.MONS.methods.token.call().call();
    // this.token = this.ERC20(tokenAddress);
    // this.tokenSymbol = await this.token.methods.symbol.call().call();
    // this.buyPrice = new BigNumber(await this.MONS.methods.tokenPrice.call().call()).div(this.constants.PRECISION);
    // // this.mergePrice = new BigNumber(await this.MONS.methods.mergePrice.call().call()).div(this.constants.PRECISION);
    // this.currBlock = new BigNumber(await this.wallet.web3.eth.getBlockNumber());
  }
}
