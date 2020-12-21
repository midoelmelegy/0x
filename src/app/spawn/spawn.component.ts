import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { ConstantsService } from '../constants.service';
import { UtilsService } from '../utils.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-merge',
  templateUrl: './spawn.component.html',
  styleUrls: ['./spawn.component.css']
})
export class SpawnComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService, public utils: UtilsService) { 
    this.resetData();
  }

  blockNumber: BigNumber;
  monLeft: any;
  monRight: any;
  monList: any;
  monLookup: any;
  spawnFee: BigNumber;
  xmonBalance: BigNumber;
  numMons: BigNumber;
  maxMons: BigNumber;

  ngOnInit(): void {
    if (this.wallet.connected) {
      this.loadData();
    }
    this.wallet.connectedEvent.subscribe(() => {
      this.loadData();
    });
    this.wallet.errorEvent.subscribe(() => {
      this.resetData();
    });
  }

  resetData() {
    this.blockNumber = new BigNumber(0);
    this.monLeft = "";
    this.monRight = "";
    this.monList = [];
    this.monLookup = {};
    this.spawnFee = new BigNumber(0);
    this.xmonBalance = new BigNumber(0);
    this.numMons = new BigNumber(0);
    this.maxMons = new BigNumber(0);
  }

  async loadData() {

    let multicallFns = {
      "monIds": {
        target: this.constants.NFT_AGGREGATOR_ADDRESS,
        callData: this.contract.NFT_AGG.methods.getIds(this.constants.MON_MINTER_ADDRESS, this.wallet.userAddress).encodeABI()
      },
      "spawnFee": {
        target: this.constants.MON_SPAWNER_ADDRESS,
        callData: this.contract.MON_SPAWNER.methods.spawnFee.call().encodeABI()
      },
      "xmonBalance": {
        target: this.constants.XMON_ADDRESS,
        callData: this.contract.XMON.methods.balanceOf(this.wallet.userAddress).encodeABI()
      },
      "numMons": {
        target: this.constants.MON_SPAWNER_ADDRESS,
        callData: this.contract.MON_SPAWNER.methods.numMons.call().encodeABI()
      },
      "maxMons": {
        target: this.constants.MON_SPAWNER_ADDRESS,
        callData: this.contract.MON_SPAWNER.methods.maxMons.call().encodeABI()
      }
    };
    let multicallKeys = Object.keys(multicallFns);
    let multicallValues = Object.values(multicallFns);
    let rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    this.blockNumber = rawResult["blockNumber"];
    let multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);
    this.spawnFee = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["spawnFee"])).div(this.constants.PRECISION);
    this.xmonBalance = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["xmonBalance"])).div(this.constants.PRECISION);
    this.numMons = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["numMons"]));
    this.maxMons = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults["maxMons"]));

    // Get unlock blocks in second multicall
    let monIdList = this.wallet.web3.eth.abi.decodeParameter('uint256[]', multicallResults["monIds"]);
    let newCall = {};
    for (let i of monIdList) {
      newCall[i.toString()] = {
        target: this.constants.MON_SPAWNER_ADDRESS,
        callData: this.contract.MON_SPAWNER.methods.monUnlock(i).encodeABI()
      }
    }
    multicallKeys = Object.keys(newCall);
    multicallValues = Object.values(newCall);
    rawResult = await this.contract.MULTICALL.methods.aggregate(multicallValues).call();
    multicallResults = this.utils.zipObject(multicallKeys, rawResult["returnData"]);

    const response = await fetch("./assets/monData.json");
    const responseObj = await response.json();
    for (let i of monIdList) {
      let obj = {};
      obj["id"] = i;
      obj["name"] = responseObj["1"]["name"] + i;
      obj["img"] =  responseObj["1"]["img"];
      obj["unlockBlock"] = new BigNumber(this.wallet.web3.eth.abi.decodeParameter('uint256', multicallResults[i]));
      this.monList.push(obj);
      this.monLookup[i] = obj;
    }
  }

  spawnNewMon() {
    if (this.monLeft === this.monRight) {
      alert("You can't merge two of the same monster!");
    }
    // else if (this.blockNumber.isLessThanOrEqualTo(this.getUnlockBlock(this.monLeft)) || this.blockNumber.isLessThanOrEqualTo(this.getUnlockBlock(this.monRight))) {
    //   alert("One or more of these monsters haven't unlocked yet for merging!")
    // }
    else {
      const func = this.contract.MON_SPAWNER.methods.spawnNewMon(this.monLeft, this.monRight);
      this.wallet.sendTxWithToken(func, this.contract.XMON, this.constants.MON_SPAWNER_ADDRESS, this.spawnFee, 550000, ()=>{}, ()=>{}, ()=>{});
    }
  }

  getName(id) {
    if (id === "") {
      return "";
    }
    return this.monLookup[id]["name"];
  }

  getImg(id) {
    if (id === "") {
      return "./assets/placeholder.png";
    }
    return this.monLookup[id]["img"];
  }

  getUnlockBlock(id) {
    if (id === "") {
      return new BigNumber(0);
    }
    return this.monLookup[id]["unlockBlock"];
  }
}
