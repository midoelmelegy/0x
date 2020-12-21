import { Injectable } from '@angular/core';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public wallet: WalletService) { }

  // https://github.com/Jacob-Friesen/obscurejs/blob/master/2018/zipObject.js
  zipObject(keys, values) {
    const obj = {};
  
    // Assuming the lengths of keys always equals the length of values to simplify the example.
    keys.forEach((key, index) => {
      obj[key] = values[index];
    })
  
    return obj;
  }
}
