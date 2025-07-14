# 🚀 SimpleSwap – Smart Contract

## 📘 Introduction

**SimpleSwap** is a lightweight Solidity smart contract that implements a two-token liquidity pool using an Automated Market Maker (AMM) model. It enables decentralized token swaps, liquidity provisioning, and price querying — inspired by the mechanics of Uniswap V2.

---

## 🔧 Deployment Details

| Component         | Blockchain Address                             |
|-------------------|------------------------------------------------|
| **TokenA**        | `0xf172b357531c281579892b9457ee02404cb44281`   |
| **TokenB**        | `0xec5089CeE3bDC194b6194dcc32c1Cfb78D83AaF1`   |
| **SimpleSwap**    | `0xFbB85e6859Ff9BCA5928bBd49e7DB91dF928fB60`   |

---

## 🔍 Key Functionalities

### 🧪 `provideLiquidity()`

Allows users to supply equal-value amounts of both tokens to the pool:

- Automatically calculates balanced deposit amounts  
- Mints LP tokens representing user ownership  
- Emits a `LiquidityProvisioned` event  

---

### 🔁 `withdrawLiquidity()`

Burns the user's LP tokens to redeem proportional reserves:

- Ensures fair withdrawal amounts  
- Updates internal reserves  
- Emits a `LiquidityWithdrawn` event  

---

### 🔄 `swapTokens()`

Enables token-to-token swaps using a constant product AMM formula:

- Applies a 0.3% trading fee  
- Validates deadline to avoid stale transactions  
- Emits a `TokenSwapped` event  

---

### 📈 `fetchExchangeRate()`

Returns the current price ratio between Token Alpha and Token Beta using reserve balances.

---

## 📡 Events

solidity
event LiquidityProvisioned(address indexed user, uint amountA, uint amountB);
event LiquidityWithdrawn(address indexed user, uint amountA, uint amountB);
event TokenSwapped(
    address indexed trader,
    address tokenIn,
    uint amountIn,
    address tokenOut,
    uint amountOut
);

---

## 🛡️ Security Considerations

🛑 Reentrancy Protection – via OpenZeppelin's ReentrancyGuard

🕒 Deadline Enforcement – avoids execution of expired transactions

✅ Token Validation – ensures valid ERC-20 token addresses

---

##🔗 Dependencies
This contract relies on trusted OpenZeppelin libraries:

IERC20 – Standard ERC-20 token interface

ReentrancyGuard – Protects against reentrancy attacks

---
##🧪 Sample Interactions
###✅ Adding Liquidity
solidity
simpleSwap.provideLiquidity(
    tokenAlpha,
    tokenBeta,
    100 ether,   // desired amount of Token A
    200 ether,   // desired amount of Token B
    50 ether,    // min acceptable amount of Token A
    90 ether,   // min acceptable amount of Token B
    msg.sender,
    block.timestamp + 600  
);
🔄 Swapping Tokens
solidity
path[0] = tokenA;
path[1] = tokenB;

simpleSwap.swapTokens(
    100 ether,     // input Token A
    90 ether,      // minimum Token B to receive
    path,
    msg.sender,
    block.timestamp + 600
);

---

🌐 Web Interface
A simple web-based DApp was developed to interact with the SimpleSwap contract.

---

##Features:
Wallet connection (e.g. MetaMask)

Real-time token swaps

Add/remove liquidity

View current token price

---

###🔗 Try the DApp on Vercel https://tp-4-ethkipu.vercel.app/

##🛠 Tech Stack
Solidity ^0.8.27

ERC-20 token standards

OpenZeppelin Contracts:

IERC20

ReentrancyGuard

---

👨‍💻 Creator
Developed by Sergio Daniel Blanco
