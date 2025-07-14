🚀 SimpleSwap –Smart Contract
  Introduction
SimpleSwap is a lightweight Solidity smart contract that implements a two-token liquidity pool using an Automated Market Maker (AMM) model. 



🔧 Deployment Details
Component	Blockchain Address
Token Alpha	0x9bd9fEbe7399e3e4B360D2262D778f6cDA921b57
Token Beta	0x76C701fB590D9B72fA4Bb97beC3581DC36B75f4C
DualPool	0xcD98aE6B1a3cd2Aa85EcB97D85fCD53684b4Dd45

🔍 Key Functionalities
🧪 provideLiquidity()
Allows users to supply equal-value amounts of both tokens to the pool.

Automatically determines balanced deposit amounts

Mints LP tokens to represent pool ownership

Emits a LiquidityProvisioned event

🔁 withdrawLiquidity()
Burns the user’s LP tokens and returns a proportional amount of both underlying tokens.

Ensures fair withdrawal based on current reserves

Emits LiquidityWithdrawn event

🔄 swapTokens()
Enables the user to exchange one token for another using a constant product formula.

Charges a 0.3% fee on trades

Prevents front-running with deadline validation

Emits a TokenSwapped event

📈 fetchExchangeRate()
Returns the current price ratio between Token Alpha and Token Beta derived from internal reserves.

📡 Events
solidity
Copiar
Editar
event LiquidityProvisioned(address indexed user, uint amountAlpha, uint amountBeta);
event LiquidityWithdrawn(address indexed user, uint amountAlpha, uint amountBeta);
event TokenSwapped(
    address indexed trader,
    address tokenIn,
    uint amountIn,
    address tokenOut,
    uint amountOut
);
🛡️ Security Considerations
🛑 Reentrancy Protected – via OpenZeppelin’s ReentrancyGuard

🕒 Transaction Deadlines – prevent execution of stale transactions

✅ Token Validation – ensures legitimate ERC-20 interactions

🔗 Dependencies
This contract integrates standard OpenZeppelin components:

IERC20 – Token interface

ReentrancyGuard – Prevents nested calls

🧪 Sample Interactions
Adding Liquidity
solidity
Copiar
Editar
dualPool.provideLiquidity(
    tokenAlpha,
    tokenBeta,
    100 ether,   // desired tokenAlpha
    200 ether,   // desired tokenBeta
    90 ether,    // min acceptable tokenAlpha
    180 ether,   // min acceptable tokenBeta
    msg.sender,
    block.timestamp + 600  // expires in 10 minutes
);
Swapping Tokens
solidity
Copiar
Editar
path[0] = tokenAlpha;
path[1] = tokenBeta;

dualPool.swapTokens(
    10 ether,     // input tokenAlpha
    9 ether,      // minimum tokenBeta to receive
    path,
    msg.sender,
    block.timestamp + 600
);
🌐 Web Interface
An interactive DApp was built for user-friendly interaction with DualPool.

Features include:
Wallet connection (e.g. MetaMask)

Token swaps in real time

Liquidity management

Live token pricing

🔗 Try it now → DApp on Vercel https://tp-modulo-4-eopc.vercel.app/

🛠 Tech Stack
Solidity ^0.8.27

ERC-20 compliant token contracts

OpenZeppelin libraries: IERC20, ReentrancyGuard

👨‍💻 Creator
Developed by Sergio Daniel Blanco