import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  // old stuff
  PRECISION = 1e18;
  YFB_ADDRESS = '0x89ee58af4871b474c30001982c3d7439c933c838';
  STAKER_ADDRESS = '0xC5802bCf619301Bdc6B1B9EDA4B6fd26e63339aF';
  MON_ADDRESS = '0xAf488234796CA27DBa8ECF17f803Ea1f4Ab33E15';
  DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
  CLAIMER_ADDRESS = '0xe354AC0bB78a8013617fe0efA6099769749F027C';
  S3_URL = 'https://d3h0sbhg72k3qr.cloudfront.net/';
  API_URL = 'https://yflambda.herokuapp.com/mons/';

  // new stuff (rinkeby network for now) (note you have to change chainId in web3Enabled)
  XMON_ADDRESS = '0x8dc2f7D19217245b117aEBa0f1D050c9e85c7767';
  MON_MINTER_ADDRESS = '0x9683D905cAa55743ac63c464C34053B0b219Cc8D';
  MON_STAKER_ADDRESS = '0xF81d6EBAE82b429Dcf0b29fddC4d17538Ac0EAD8';
  MON_SPAWNER_ADDRESS = '0x39D327150ff6F7D59F6BB698895CbFAD2c4816C2';

  MULTICALL_ADDRESS = '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821';
  NFT_AGGREGATOR_ADDRESS = '0x03Cb9a56c5F7Ce6796562730E3D217B1F4Dd428b';

  // Mainnet address
  LP_POOL_REWARDS_ADDRESS = '0x57Ffef72352f285a9477293d35Bacc9C6667eEBf';
  // probably need to change this b/c I picked the wrong number for duration
}