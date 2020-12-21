import { Component, OnInit } from '@angular/core';
import { WalletService } from '../wallet.service';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  constructor(public wallet: WalletService, public contract: ContractService) { }

  ngOnInit(): void {}

  claim() {
    const func = this.contract.ClAIMER.methods.claim();
    this.wallet.sendTx(func, ()=>{}, ()=>{}, ()=>{});
  }

}
