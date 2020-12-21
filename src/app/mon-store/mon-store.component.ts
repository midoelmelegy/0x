import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { ConstantsService } from '../constants.service';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-mon-store',
  templateUrl: './mon-store.component.html',
  styleUrls: ['./mon-store.component.css']
})
export class MonStoreComponent implements OnInit {

  gemsList: Array<Object>;
  tokenBalance: BigNumber;
  price: BigNumber;
  tokenSymbol: string;
  buyAmt: string;
  token: any;
  monsLeft: BigNumber;
  minStakeAmt: BigNumber;
  minStakeTime: BigNumber;

  constructor(public wallet: WalletService, public contract: ContractService, public constants: ConstantsService) { 
    this.resetData();
  }

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

  async loadData() {

    // set token values
    this.token = this.contract.token;
    this.tokenBalance = new BigNumber(await this.contract.token.methods.balanceOf(this.wallet.userAddress).call()).div(this.constants.PRECISION);
    this.price = this.contract.buyPrice;
    this.tokenSymbol = this.contract.tokenSymbol;

    // set max mons values
    this.monsLeft = this.contract.monsLeft;

    // set min stake values
    this.minStakeAmt = new BigNumber(await this.contract.MONS.methods.minStakeAmt.call().call()).div(this.constants.PRECISION);
    this.minStakeTime = new BigNumber(await this.contract.MONS.methods.minStakeTime.call().call());

    let numGems = await this.contract.STAKER.methods.balanceOf(this.wallet.userAddress).call();
    const currBlock = new BigNumber(await this.wallet.web3.eth.getBlockNumber());
    for (let i = 0; i < numGems; i++) {
      let gemId = await this.contract.STAKER.methods.tokenOfOwnerByIndex(this.wallet.userAddress, i).call();
      let gemData = await this.contract.STAKER.methods.rewardRecords(gemId).call();
      gemData["id"] = gemId;
      gemData["amount"] = new BigNumber(gemData["amount"]).div(this.constants.PRECISION);
      const startBlock = new BigNumber(gemData["startBlock"]);
      let endBlock = new BigNumber(gemData["endBlock"]);
      if (endBlock.isLessThan(startBlock)) {
        endBlock = currBlock;
      }
      gemData["duration"] = endBlock.minus(startBlock);

      // disable button if it's not burnable
      if (endBlock.minus(startBlock).isGreaterThanOrEqualTo(new BigNumber(this.minStakeTime)) && (gemData["amount"]).isGreaterThanOrEqualTo(new BigNumber(this.minStakeAmt))) {
        gemData["isBurnable"] = true;
      }
      else {
        gemData["isBurnable"] = false;
      }

      this.gemsList.push(gemData);
    }
  }

  resetData() {
    this.gemsList = [];
    this.tokenBalance = new BigNumber(0);
    this.tokenSymbol = '';
    this.price = new BigNumber(0);
    this.monsLeft = new BigNumber(0);
    this.minStakeAmt = new BigNumber(0);
    this.minStakeTime = new BigNumber(0);
  }

  burnGem(id, isBurnable) {
    if (isBurnable) {
      const func = this.contract.MONS.methods.mineMonster(id);
      this.getMon(func);
    }
  }

  canMakeMon() {
    if (this.monsLeft.isLessThanOrEqualTo(new BigNumber(0))) {
      alert("No monsters left!");
      return false;
    }
    else {
      return true;
    }
  }

  buyMon() {
    if (this.canMakeMon()) {
      const func = this.contract.MONS.methods.buyMonster();
      this.wallet.sendTxWithToken(func, this.token, this.constants.MON_ADDRESS, this.price, 400000, ()=>{}, ()=>{}, ()=>{});
    }
  }

  getMon(f) {
    if (this.canMakeMon()) {
      this.wallet.sendTxWithNFT(f, this.contract.STAKER, this.constants.MON_ADDRESS, 400000, ()=>{}, ()=>{}, ()=> {});
    }
  }

}
