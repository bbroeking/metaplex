import React, { useState } from 'react'
import { Button } from 'antd';
import { AmountRange, IPartialCreateAuctionArgs, PriceFloor, PriceFloorType, StringPublicKey, toLamports, useConnection, useMeta, useMint, WinnerLimit, WinnerLimitType, WinningConfigType, ZERO } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { QUOTE_MINT } from '../../constants';
import { createAuctionManager, SafetyDepositDraft } from '../../actions/createAuctionManager';
import { AuctionCategory } from '../auctionCreate';
import BN from 'bn.js';
import { LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { useUserArts } from '../../hooks';


  
interface TierDummyEntry {
    safetyDepositBoxIndex: number;
    amount: number;
    winningConfigType: WinningConfigType;
}

interface Tier {
    items: (TierDummyEntry | {})[];
    winningSpots: number[];
}
interface TieredAuctionState {
    items: SafetyDepositDraft[];
    tiers: Tier[];
    participationNFT?: SafetyDepositDraft;
}
  
export interface AuctionState {
    // Min price required for the item to sell
    reservationPrice: number;
  
    // listed NFTs
    items: SafetyDepositDraft[];
    participationNFT?: SafetyDepositDraft;
    participationFixedPrice?: number;
    // number of editions for this auction (only applicable to limited edition)
    editions?: number;
  
    // date time when auction should start UTC+0
    startDate?: Date;
  
    // suggested date time when auction should end UTC+0
    endDate?: Date;
  
    //////////////////
    category: AuctionCategory;
    saleType?: 'auction' | 'sale';
  
    price?: number;
    priceFloor?: number;
    priceTick?: number;
  
    startSaleTS?: number;
    startListTS?: number;
    endTS?: number;
  
    auctionDuration?: number;
    auctionDurationType?: 'days' | 'hours' | 'minutes';
    gapTime?: number;
    gapTimeType?: 'days' | 'hours' | 'minutes';
    tickSizeEndingPhase?: number;
  
    spots?: number;
    tiers?: Array<Tier>;
  
    winnersCount: number;
}
const AuctionMaker = () => {

    const connection = useConnection();
    const wallet = useWallet();
    const { whitelistedCreatorsByCreator } = useMeta();
    const mint = useMint(QUOTE_MINT);
  
    const [step, setStep] = useState<number>(0);
    const [stepsVisible, setStepsVisible] = useState<boolean>(true);
    const [auctionObj, setAuctionObj] =
      useState<
        | {
            vault: StringPublicKey;
            auction: StringPublicKey;
            auctionManager: StringPublicKey;
          }
        | undefined
      >(undefined);
    const [attributes, setAttributes] = useState<AuctionState>({
      reservationPrice: 0,
      items: [],
      category: AuctionCategory.Open,
      saleType: 'auction',
      auctionDurationType: 'minutes',
      gapTimeType: 'minutes',
      winnersCount: 1,
      startSaleTS: undefined,
      startListTS: undefined,
    });

    const [tieredAttributes, setTieredAttributes] = useState<TieredAuctionState>({
        items: [],
        tiers: [],
    });

    const userArts = useUserArts();

    // const createAuction = () => {
    //     console.log('hello');
    // }


    const createAuction = async () => {    
        const auctionSettings: IPartialCreateAuctionArgs = {
          winners: new WinnerLimit({
            type: WinnerLimitType.Capped,
            usize: new BN(1),
          }), //winnerLimit,
          endAuctionAt: new BN(60 * 60 * 24
            // (attributes.auctionDuration || 0) *
            //   (attributes.auctionDurationType == 'days'
            //     ? 60 * 60 * 24 // 1 day in seconds
            //     : attributes.auctionDurationType == 'hours'
            //     ? 60 * 60 // 1 hour in seconds
            //     : 60), // 1 minute in seconds
          ), // endAuctionAt is actually auction duration, poorly named, in seconds
          auctionGap: new BN(60 * 60 * 24
            // (attributes.gapTime || 0) *
            //   (attributes.gapTimeType == 'days'
            //     ? 60 * 60 * 24 // 1 day in seconds
            //     : attributes.gapTimeType == 'hours'
            //     ? 60 * 60 // 1 hour in seconds
            //     : 60), // 1 minute in seconds
          ),
          priceFloor: new PriceFloor({
            //  attributes.priceFloor
            type: PriceFloorType.Minimum,
            //   : PriceFloorType.None,
            minPrice: new BN((1) * LAMPORTS_PER_SOL),
          }),
          tokenMint: QUOTE_MINT.toBase58(),
          gapTickSizePercentage: null,
          tickSize: new BN(3 * LAMPORTS_PER_SOL)
            //: null,
        };
        console.log(userArts);

        let nft = userArts[0];
        nft.amountRanges = [
            new AmountRange({
              amount: new BN(1),
              length:
                attributes.category === AuctionCategory.Single
                  ? new BN(1)
                  : new BN(attributes.editions || 1),
            })
        ];

        
        const _auctionObj = await createAuctionManager(
          connection,
          wallet,
          whitelistedCreatorsByCreator,
          auctionSettings,
          [userArts[0]],
          undefined,
          QUOTE_MINT.toBase58(),
        );
        console.log(_auctionObj);
        // setAuctionObj(_auctionObj);
      };
      
    return (
        <div>
            Heello
            <Button className="connector" type="primary" onClick={createAuction}>
              Create Auction
            </Button>
        </div>
    )
}

export default AuctionMaker
