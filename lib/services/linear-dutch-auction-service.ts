import { Address, erc20Abi, erc721Abi, parseEther } from "viem";
import { readContracts } from '@wagmi/core';
import { wagmi_config } from "@/config";
import { IAuctionService, DutchAuctionParams } from "../auction-service";
import { Bid } from "../mock-data";
import { generateCode } from "../storage";

export const LINEAR_DUTCH_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "SafeERC20FailedOperation",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "Id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctioneer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startingPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reservedPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "AuctionCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amountWithdrawn",
        "type": "uint256"
      }
    ],
    "name": "fundsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "withdrawer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "auctionedTokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      }
    ],
    "name": "itemWithdrawn",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "auctionCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "auctions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "auctioneer",
        "type": "address"
      },
      {
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startingPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "availableFunds",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reservedPrice",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isClaimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "auctionId",
        "type": "uint256"
      }
    ],
    "name": "getCurrentPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imgUrl",
        "type": "string"
      },
      {
        "internalType": "enum Auction.AuctionType",
        "name": "auctionType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "auctionedToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "auctionedTokenIdOrAmount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "biddingToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "startingPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "reservedPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "createAuction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export class LinearDutchAuctionService implements IAuctionService {
  contractAddress: Address = "0xA6BD412DaeE7367F21c5eD36883b5731FD351B8B";

  private async mapAuctionData(auctionData: any,client: any): Promise<any> {
    if (!auctionData || !Array.isArray(auctionData) || auctionData.length < 16) {
      console.warn("Invalid auction data:", auctionData);
      return null;
    }

    let auctionedTokenName = "";
    let biddingTokenName = "";
    if(client){
      auctionedTokenName = await client.getTokenName(auctionData[6]);
      biddingTokenName = await client.getTokenName(auctionData[8]);
    }

    return {
      protocol: "Linear",
      id: generateCode("Linear",String(auctionData[0])),
      name: auctionData[1],
      description: auctionData[2],
      imgUrl: auctionData[3],
      auctioneer: auctionData[4],
      auctionType: auctionData[5],
      auctionedToken: auctionData[6],
      auctionedTokenIdOrAmount: auctionData[7],
      biddingToken: auctionData[8],
      startingPrice: auctionData[9],
      availableFunds: auctionData[10],
      reservedPrice: auctionData[11],
      winner: auctionData[12],
      deadline: auctionData[13],
      duration: auctionData[14],
      isClaimed: auctionData[15],
      //Placeholders
      currentPrice: BigInt(0),
      higheshtBid: BigInt(0),
      auctionedTokenName: auctionedTokenName,
      biddingTokenName: biddingTokenName
    };
  }

  async getAuctionCounter(): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'auctionCounter'
          }
        ]
      });
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching auction counter:", error);
      throw error;
    }
  }

  async getLastNAuctions(n: number = 10,client?: any): Promise<any[]> {
    try {
      const counter = await this.getAuctionCounter();
      if (counter === BigInt(0)) return [];
      const start = counter > BigInt(n) ? counter - BigInt(n) : BigInt(0);
      const end = counter;
      const contracts = [];
      for (let i = start; i < end; i++) {
        contracts.push({
          address: this.contractAddress,
          abi: LINEAR_DUTCH_ABI,
          functionName: 'auctions',
          args: [i]
        });
      }
      const results = await readContracts(wagmi_config, { contracts });
      const mappedAuctions = Promise.all(results
        .filter((result: any) => !result.error && result.result)
        .map(async (result: any) => await this.mapAuctionData(result.result,client))
        .filter((auction: any) => auction !== null) // Remove null entries
        .reverse()); // Show newest first
      return mappedAuctions;
    } catch (error) {
      console.error("Error fetching last N auctions:", error);
      throw error;
    }
  }

  async getCurrentPrice(auctionId: bigint): Promise<bigint> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'getCurrentPrice',
            args: [auctionId]
          }
        ]
      });
      if (data[0].error) {
        throw new Error('Failed to get current price from contract');
      }
      return data[0].result as bigint;
    } catch (error) {
      console.error("Error fetching current price:", error);
      throw error;
    }
  }

  async createAuction(writeContract: any, params: DutchAuctionParams): Promise<void> {
    try {
      await this.approveToken(
        writeContract,
        params.auctionedToken,
        this.contractAddress,
        (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))),
        params.auctionType === BigInt(0) // 0 = NFT, 1 = ERC20
      );
      await writeContract({
        address: this.contractAddress,
        abi: LINEAR_DUTCH_ABI,
        functionName: "createAuction",
        args: [
          params.name,
          params.description,
          params.imgUrl,
          Number(params.auctionType),
          params.auctionedToken,
          (params.auctionType === BigInt(0)?params.auctionedTokenIdOrAmount:parseEther(String(params.auctionedTokenIdOrAmount))),
          params.biddingToken,
          params.startingPrice,
          params.reservedPrice,
          Number(params.duration)
        ],
      });
    } catch (error) {
      console.error("Error creating Linear Dutch auction:", error);
      throw error;
    }
  }

  // In Linear Dutch Auction, there's no placeBid - buyers directly purchase at current price
  async placeBid(
    writeContract: any,
    auctionId: bigint,
    bidAmount: bigint,
    tokenAddress: Address,
    auctionType: bigint
  ): Promise<void> {
    throw new Error("Linear Dutch auction does not support bidding - use withdrawItem to purchase at current price");
  }

  async withdrawFunds(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: LINEAR_DUTCH_ABI,
        functionName: "withdrawFunds",
        args: [auctionId],
      });
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }

  async withdrawItem(writeContract: any, auctionId: bigint): Promise<void> {
    try {
      const currentPrice = await this.getCurrentPrice(auctionId);
      const auctionData = await this.getAuction(auctionId);
      const isNFT = auctionData[5] === BigInt(0); // auctionType === 0 means NFT
      const biddingToken = auctionData[7] as Address; // biddingToken address from auction data
      await this.approveToken(
        writeContract,
        biddingToken,
        this.contractAddress,
        currentPrice,
        false
      );
      await writeContract({
        address: this.contractAddress as `0x${string}`,
        abi: LINEAR_DUTCH_ABI,
        functionName: "withdrawItem",
        args: [auctionId],
        value: isNFT ? currentPrice : BigInt(0) // Send ETH if it's an NFT auction
      });
    } catch (error) {
      console.error("Error withdrawing item:", error);
      throw error;
    }
  }

  private async approveToken(writeContract: any, tokenAddress: Address, spender: Address, amount: bigint, isNFT: boolean): Promise<void> {
    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: isNFT ? erc721Abi : erc20Abi,
        functionName: "approve",
        args: [spender, amount]
      });
    } catch (error) {
      console.error("Error approving token:", error);
      throw error;
    }
  }

  async getAuction(auctionId: bigint,client?: any): Promise<any> {
    try {
      const data = await readContracts(wagmi_config, {
        contracts: [
          {
            address: this.contractAddress,
            abi: LINEAR_DUTCH_ABI,
            functionName: 'auctions',
            args: [auctionId]
          }
        ]
      });
      const auctionData = data[0].result;
      const mappedAuction = await this.mapAuctionData(auctionData,client);
      if (!mappedAuction) {
        throw new Error(`Invalid auction data for ID ${auctionId}`);
      }
      return mappedAuction;
    } catch (error) {
      console.error("Error fetching auction data:", error);
      throw error;
    }
  }

  async getAllAuctions(client: any, startBlock: bigint, endBlock: bigint): Promise<any[]> {
    try {
      const auctions = await this.getLastNAuctions(50,client); // Get last 50 auctions
      return auctions;
    } catch (error) {
      console.error("Error fetching all auctions:", error);
      throw error;
    }
  }

  async getBidHistory(
    client: any,
    auctionId: bigint,
    startBlock: bigint,
    endBlock: bigint
  ): Promise<Bid[]> {
    return [];
  }
}
