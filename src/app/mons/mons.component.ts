import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';
import { ConstantsService } from '../constants.service';
// import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-mons',
  templateUrl: './mons.component.html',
  styleUrls: ['./mons.component.css']
})
export class MonsComponent implements OnInit {

  monsList: Array<Object>;

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
    const response = await fetch("./assets/mons_database.json");
    const monData = await response.json();
    let numMons = await this.contract.MONS.methods.balanceOf(this.wallet.userAddress).call();
    for (let i = 0; i < numMons; i++) {
      let monId = await this.contract.MONS.methods.tokenOfOwnerByIndex(this.wallet.userAddress, i).call();
      let onChainD = await this.contract.MONS.methods.monRecords(monId).call();
      let d = monData[monId];
      
      d["id"] = monId;
      d["img"] = this.constants.S3_URL + d["img"];

      // load placeholder image if no image yet
      // if ((new BigNumber(monId)).isGreaterThanOrEqualTo(this.constants.NUM_WITH_IMGS)) {
      //   d["img"] = "./assets/placeholder.png";
      // }

      d["parent1"] = onChainD["parent1"];
      d["parent2"] = onChainD["parent2"];
      d["series"] = onChainD["series"];
      d["powerBits"] = onChainD["powerBits"].toString(16);
      d["unlockBlock"] = onChainD["unlockBlock"];
      this.monsList.push(d);
    }
  }

  resetData() {
    this.monsList = [];
  }
}
