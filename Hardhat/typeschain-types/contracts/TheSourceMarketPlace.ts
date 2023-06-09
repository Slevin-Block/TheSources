/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface TheSourceMarketPlaceInterface extends utils.Interface {
  functions: {
    "articleContract()": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "balanceOfMemberToken()": FunctionFragment;
    "blocknumber()": FunctionFragment;
    "buyArticle(uint256,uint256)": FunctionFragment;
    "buyMemberToken()": FunctionFragment;
    "getArticlePrice()": FunctionFragment;
    "getMemberTokenPrice()": FunctionFragment;
    "init(address,uint256,address,uint256)": FunctionFragment;
    "memberTokenContract()": FunctionFragment;
    "mintArticle(uint256,string,string,string,uint256,uint256,string)": FunctionFragment;
    "myBalance()": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setArticlePrice(uint256)": FunctionFragment;
    "setBaseURIMemberToken(string)": FunctionFragment;
    "setBlocknumber(uint256)": FunctionFragment;
    "setMemberTokenPrice(uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "articleContract"
      | "balanceOf"
      | "balanceOfMemberToken"
      | "blocknumber"
      | "buyArticle"
      | "buyMemberToken"
      | "getArticlePrice"
      | "getMemberTokenPrice"
      | "init"
      | "memberTokenContract"
      | "mintArticle"
      | "myBalance"
      | "owner"
      | "renounceOwnership"
      | "setArticlePrice"
      | "setBaseURIMemberToken"
      | "setBlocknumber"
      | "setMemberTokenPrice"
      | "transferOwnership"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "articleContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfMemberToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "blocknumber",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buyArticle",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "buyMemberToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getArticlePrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getMemberTokenPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "init",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "memberTokenContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "mintArticle",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "myBalance", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setArticlePrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setBaseURIMemberToken",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setBlocknumber",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMemberTokenPrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "articleContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfMemberToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "blocknumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "buyArticle", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "buyMemberToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getArticlePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMemberTokenPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "memberTokenContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "mintArticle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "myBalance", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setArticlePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBaseURIMemberToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setBlocknumber",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMemberTokenPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "createArticle(address,uint256,uint256)": EventFragment;
    "deployBlocknumber(uint256)": EventFragment;
    "membershipPrice(uint256)": EventFragment;
    "newArticlePrice(uint256)": EventFragment;
    "newMemberToken(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "createArticle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "deployBlocknumber"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "membershipPrice"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "newArticlePrice"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "newMemberToken"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface createArticleEventObject {
  from: string;
  memberTokenId: BigNumber;
  articleId: BigNumber;
}
export type createArticleEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  createArticleEventObject
>;

export type createArticleEventFilter = TypedEventFilter<createArticleEvent>;

export interface deployBlocknumberEventObject {
  blocknumber: BigNumber;
}
export type deployBlocknumberEvent = TypedEvent<
  [BigNumber],
  deployBlocknumberEventObject
>;

export type deployBlocknumberEventFilter =
  TypedEventFilter<deployBlocknumberEvent>;

export interface membershipPriceEventObject {
  newPrice: BigNumber;
}
export type membershipPriceEvent = TypedEvent<
  [BigNumber],
  membershipPriceEventObject
>;

export type membershipPriceEventFilter = TypedEventFilter<membershipPriceEvent>;

export interface newArticlePriceEventObject {
  newPrice: BigNumber;
}
export type newArticlePriceEvent = TypedEvent<
  [BigNumber],
  newArticlePriceEventObject
>;

export type newArticlePriceEventFilter = TypedEventFilter<newArticlePriceEvent>;

export interface newMemberTokenEventObject {
  tokenId: BigNumber;
}
export type newMemberTokenEvent = TypedEvent<
  [BigNumber],
  newMemberTokenEventObject
>;

export type newMemberTokenEventFilter = TypedEventFilter<newMemberTokenEvent>;

export interface TheSourceMarketPlace extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TheSourceMarketPlaceInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    articleContract(overrides?: CallOverrides): Promise<[string]>;

    balanceOf(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfMemberToken(overrides?: CallOverrides): Promise<[BigNumber]>;

    blocknumber(overrides?: CallOverrides): Promise<[BigNumber]>;

    buyArticle(
      _articleId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    buyMemberToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getArticlePrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    getMemberTokenPrice(overrides?: CallOverrides): Promise<[BigNumber]>;

    init(
      _memberTokenAddr: PromiseOrValue<string>,
      _memberTokenPrice: PromiseOrValue<BigNumberish>,
      _articleContract: PromiseOrValue<string>,
      _articlePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    memberTokenContract(overrides?: CallOverrides): Promise<[string]>;

    mintArticle(
      _memberTokenId: PromiseOrValue<BigNumberish>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _authorName: PromiseOrValue<string>,
      _supply: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      URI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    myBalance(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setArticlePrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setBaseURIMemberToken(
      _newBase: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setBlocknumber(
      _blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMemberTokenPrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  articleContract(overrides?: CallOverrides): Promise<string>;

  balanceOf(
    user: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfMemberToken(overrides?: CallOverrides): Promise<BigNumber>;

  blocknumber(overrides?: CallOverrides): Promise<BigNumber>;

  buyArticle(
    _articleId: PromiseOrValue<BigNumberish>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  buyMemberToken(
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getArticlePrice(overrides?: CallOverrides): Promise<BigNumber>;

  getMemberTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;

  init(
    _memberTokenAddr: PromiseOrValue<string>,
    _memberTokenPrice: PromiseOrValue<BigNumberish>,
    _articleContract: PromiseOrValue<string>,
    _articlePrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  memberTokenContract(overrides?: CallOverrides): Promise<string>;

  mintArticle(
    _memberTokenId: PromiseOrValue<BigNumberish>,
    _title: PromiseOrValue<string>,
    _description: PromiseOrValue<string>,
    _authorName: PromiseOrValue<string>,
    _supply: PromiseOrValue<BigNumberish>,
    _price: PromiseOrValue<BigNumberish>,
    URI: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  myBalance(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setArticlePrice(
    _newPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setBaseURIMemberToken(
    _newBase: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setBlocknumber(
    _blocknumber: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMemberTokenPrice(
    _newPrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    articleContract(overrides?: CallOverrides): Promise<string>;

    balanceOf(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfMemberToken(overrides?: CallOverrides): Promise<BigNumber>;

    blocknumber(overrides?: CallOverrides): Promise<BigNumber>;

    buyArticle(
      _articleId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    buyMemberToken(overrides?: CallOverrides): Promise<void>;

    getArticlePrice(overrides?: CallOverrides): Promise<BigNumber>;

    getMemberTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      _memberTokenAddr: PromiseOrValue<string>,
      _memberTokenPrice: PromiseOrValue<BigNumberish>,
      _articleContract: PromiseOrValue<string>,
      _articlePrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    memberTokenContract(overrides?: CallOverrides): Promise<string>;

    mintArticle(
      _memberTokenId: PromiseOrValue<BigNumberish>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _authorName: PromiseOrValue<string>,
      _supply: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      URI: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    myBalance(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setArticlePrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setBaseURIMemberToken(
      _newBase: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setBlocknumber(
      _blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMemberTokenPrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "createArticle(address,uint256,uint256)"(
      from?: null,
      memberTokenId?: null,
      articleId?: null
    ): createArticleEventFilter;
    createArticle(
      from?: null,
      memberTokenId?: null,
      articleId?: null
    ): createArticleEventFilter;

    "deployBlocknumber(uint256)"(
      blocknumber?: null
    ): deployBlocknumberEventFilter;
    deployBlocknumber(blocknumber?: null): deployBlocknumberEventFilter;

    "membershipPrice(uint256)"(newPrice?: null): membershipPriceEventFilter;
    membershipPrice(newPrice?: null): membershipPriceEventFilter;

    "newArticlePrice(uint256)"(newPrice?: null): newArticlePriceEventFilter;
    newArticlePrice(newPrice?: null): newArticlePriceEventFilter;

    "newMemberToken(uint256)"(tokenId?: null): newMemberTokenEventFilter;
    newMemberToken(tokenId?: null): newMemberTokenEventFilter;
  };

  estimateGas: {
    articleContract(overrides?: CallOverrides): Promise<BigNumber>;

    balanceOf(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfMemberToken(overrides?: CallOverrides): Promise<BigNumber>;

    blocknumber(overrides?: CallOverrides): Promise<BigNumber>;

    buyArticle(
      _articleId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    buyMemberToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getArticlePrice(overrides?: CallOverrides): Promise<BigNumber>;

    getMemberTokenPrice(overrides?: CallOverrides): Promise<BigNumber>;

    init(
      _memberTokenAddr: PromiseOrValue<string>,
      _memberTokenPrice: PromiseOrValue<BigNumberish>,
      _articleContract: PromiseOrValue<string>,
      _articlePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    memberTokenContract(overrides?: CallOverrides): Promise<BigNumber>;

    mintArticle(
      _memberTokenId: PromiseOrValue<BigNumberish>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _authorName: PromiseOrValue<string>,
      _supply: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      URI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    myBalance(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setArticlePrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setBaseURIMemberToken(
      _newBase: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setBlocknumber(
      _blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMemberTokenPrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    articleContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    balanceOf(
      user: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfMemberToken(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    blocknumber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    buyArticle(
      _articleId: PromiseOrValue<BigNumberish>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    buyMemberToken(
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getArticlePrice(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getMemberTokenPrice(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    init(
      _memberTokenAddr: PromiseOrValue<string>,
      _memberTokenPrice: PromiseOrValue<BigNumberish>,
      _articleContract: PromiseOrValue<string>,
      _articlePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    memberTokenContract(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    mintArticle(
      _memberTokenId: PromiseOrValue<BigNumberish>,
      _title: PromiseOrValue<string>,
      _description: PromiseOrValue<string>,
      _authorName: PromiseOrValue<string>,
      _supply: PromiseOrValue<BigNumberish>,
      _price: PromiseOrValue<BigNumberish>,
      URI: PromiseOrValue<string>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    myBalance(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setArticlePrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setBaseURIMemberToken(
      _newBase: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setBlocknumber(
      _blocknumber: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMemberTokenPrice(
      _newPrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
