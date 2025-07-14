// Variables globales necesarias para la DApp
let provider;
let signer;
let simpleSwapContract;
let tokenAContract;
let tokenBContract;

// Direcciones de contratos
const tokenAAddress = "0xf172b357531C281579892b9457eE02404Cb44281"; // Replace with deployed TokenA address
const tokenBAddress = "0xec5089CeE3bDC194b6194dcc32c1Cfb78D83AaF1"; // Replace with deployed TokenB address
const simpleSwapAddress = "0xFbB85e6859Ff9BCA5928bBd49e7DB91dF928fB60"; // Replace with deployed SimpleSwap address

// ABIs
const SIMPLE_SWAP_ABI = [
{
"inputs": [
    { "internalType": "address", "name": "_tokenA", "type": "address" },
    { "internalType": "address", "name": "_tokenB", "type": "address" }
],
"stateMutability": "nonpayable",
"type": "constructor"
},
{
"inputs": [
    { "internalType": "address", "name": "owner", "type": "address" }
],
"name": "OwnableInvalidOwner",
"type": "error"
},
{
"inputs": [
    { "internalType": "address", "name": "account", "type": "address" }
],
"name": "OwnableUnauthorizedAccount",
"type": "error"
},
{
"anonymous": false,
"inputs": [
    { "indexed": true, "internalType": "address", "name": "provider", "type": "address" },
    { "indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "liquidityMinted", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
],
"name": "LiquidityAdded",
"type": "event"
},
{
"anonymous": false,
"inputs": [
    { "indexed": true, "internalType": "address", "name": "provider", "type": "address" },
    { "indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
],
"name": "LiquidityRemoved",
"type": "event"
},
{
"anonymous": false,
"inputs": [
    { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }
],
"name": "OwnershipTransferred",
"type": "event"
},
{
"anonymous": false,
"inputs": [
    { "indexed": true, "internalType": "address", "name": "swapper", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "tokenIn", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "tokenOut", "type": "address" },
    { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
],
"name": "TokensSwapped",
"type": "event"
},
{
"inputs": [
    { "internalType": "address", "name": "_tokenA", "type": "address" },
    { "internalType": "address", "name": "_tokenB", "type": "address" },
    { "internalType": "uint256", "name": "amountADesired", "type": "uint256" },
    { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" },
    { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
    { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
    { "internalType": "address", "name": "to", "type": "address" },
    { "internalType": "uint256", "name": "deadline", "type": "uint256" }
],
"name": "addLiquidity",
"outputs": [
    { "internalType": "uint256", "name": "actualAmountA", "type": "uint256" },
    { "internalType": "uint256", "name": "actualAmountB", "type": "uint256" },
    { "internalType": "uint256", "name": "liquidity", "type": "uint256" }
],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [
    { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
    { "internalType": "uint256", "name": "reserveIn", "type": "uint256" },
    { "internalType": "uint256", "name": "reserveOut", "type": "uint256" }
],
"name": "getAmountOut",
"outputs": [
    { "internalType": "uint256", "name": "amountOut", "type": "uint256" }
],
"stateMutability": "pure",
"type": "function"
},
{
"inputs": [
    { "internalType": "address", "name": "_tokenA", "type": "address" },
    { "internalType": "address", "name": "_tokenB", "type": "address" }
],
"name": "getPrice",
"outputs": [
    { "internalType": "uint256", "name": "price", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
    { "internalType": "address", "name": "", "type": "address" }
],
"name": "liquidityProvided",
"outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "owner",
"outputs": [
    { "internalType": "address", "name": "", "type": "address" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
    { "internalType": "address", "name": "_tokenA", "type": "address" },
    { "internalType": "address", "name": "_tokenB", "type": "address" },
    { "internalType": "uint256", "name": "liquidityToBurn", "type": "uint256" },
    { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
    { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
    { "internalType": "address", "name": "to", "type": "address" },
    { "internalType": "uint256", "name": "deadline", "type": "uint256" }
],
"name": "removeLiquidity",
"outputs": [
    { "internalType": "uint256", "name": "amountAWithdrawn", "type": "uint256" },
    { "internalType": "uint256", "name": "amountBWithdrawn", "type": "uint256" }
],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "renounceOwnership",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "reserve0",
"outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "reserve1",
"outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
    { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
    { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" },
    { "internalType": "address[]", "name": "path", "type": "address[]" },
    { "internalType": "address", "name": "to", "type": "address" },
    { "internalType": "uint256", "name": "deadline", "type": "uint256" }
],
"name": "swapExactTokensForTokens",
"outputs": [
    { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
],
"stateMutability": "nonpayable",
"type": "function"
},
{
"inputs": [],
"name": "token0",
"outputs": [
    { "internalType": "address", "name": "", "type": "address" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "token1",
"outputs": [
    { "internalType": "address", "name": "", "type": "address" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "totalLiquidity",
"outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [
    { "internalType": "address", "name": "newOwner", "type": "address" }
],
"name": "transferOwnership",
"outputs": [],
"stateMutability": "nonpayable",
"type": "function"
}
];
// Minimal ABI for the ERC-20 functions we need to call (approve, mint if it exists, decimals, balanceOf)
const ERC20_ABI_MINIMAL = [
"function approve(address spender, uint256 amount) returns (bool)",
"function mint(address to, uint256 amount) public",
"function decimals() view returns (uint8)",
"function balanceOf(address account) view returns (uint256)",
"function symbol() view returns (string)" // Added for better display
];

// Función para mostrar secciones
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionName).classList.add('active');
    
    // Actualizar tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
}

// Función para intercambiar tokens en la UI
function swapTokens() {
    const tokenIn = document.getElementById('tokenIn');
    const currentValue = tokenIn.value;
    tokenIn.value = currentValue === 'A' ? 'B' : 'A';
    updateTokenIcons();
}

// Función para actualizar iconos de tokens
function updateTokenIcons() {
    const tokenIn = document.getElementById('tokenIn').value;
    const tokenFromIcon = document.getElementById('tokenFromIcon');
    const tokenToIcon = document.getElementById('tokenToIcon');
    
    tokenFromIcon.textContent = tokenIn;
    tokenToIcon.textContent = tokenIn === 'A' ? 'B' : 'A';
}

// Función para mostrar resultados con estilo
function showResult(elementId, message, isSuccess = true) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="result-message ${isSuccess ? 'result-success' : 'result-error'}">${message}</div>`;
}

// Función para conectar wallet
async function connectWallet() {
    const button = document.getElementById('walletButtonText');
    const status = document.getElementById('accountAddress');
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            button.textContent = 'Conectando...';
            
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const addr = await signer.getAddress();
            
            status.style.display = 'block';
            status.textContent = `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
            button.textContent = 'Billetera Conectada';

            simpleSwapContract = new ethers.Contract(simpleSwapAddress, SIMPLE_SWAP_ABI, signer);
            tokenAContract = new ethers.Contract(tokenAAddress, ERC20_ABI_MINIMAL, signer);
            tokenBContract = new ethers.Contract(tokenBAddress, ERC20_ABI_MINIMAL, signer);

            showResult('swapResult', 'Billetera conectada exitosamente', true);
        } catch (error) {
            console.error("Error connecting wallet:", error);
            button.textContent = 'Conectar Billetera';
            showResult('swapResult', 'Error al conectar billetera. Verifica que MetaMask esté instalado y desbloqueado', false);
        }
    } else {
        showResult('swapResult', 'MetaMask no está instalado. Por favor instala MetaMask para usar esta DApp', false);
    }
}

// Función para mintear tokens
async function mintToken(tokenType) {
    if (!signer) {
        alert("Please connect your wallet first");
        return;
    }

    const amountToMint = document.getElementById("mintAmount").value;
    const mintResultElement = document.getElementById("mintResult");

    if (isNaN(amountToMint) || parseFloat(amountToMint) <= 0) {
        showResult('mintResult', 'Ingresa una cantidad válida para mintear', false);
        return;
    }

    let tokenContract;
    let tokenAddress;

    if (tokenType === 'A') {
        tokenContract = tokenAContract;
        tokenAddress = tokenAAddress;
    } else if (tokenType === 'B') {
        tokenContract = tokenBContract;
        tokenAddress = tokenBAddress;
    } else {
        showResult('mintResult', 'Selección de token inválida', false);
        return;
    }

    try {
        let decimals;
        try {
            decimals = await tokenContract.decimals();
        } catch (error) {
            console.warn(`Could not get token decimals ${tokenType}. Assuming 18. Error:`, error);
            decimals = 18;
        }

        const amountInWei = ethers.utils.parseUnits(amountToMint, decimals);
        const userAddress = await signer.getAddress();

        showResult('mintResult', `Minteando ${amountToMint} Token ${tokenType}... Por favor confirma en MetaMask`, true);

        if (tokenContract.mint) {
            const mintTx = await tokenContract.mint(userAddress, amountInWei);
            const receipt = await mintTx.wait();
            console.log("Minting transaction successful:", receipt);
            showResult('mintResult', `¡Token ${tokenType} minteado exitosamente! Hash: ${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`, true);
        } else {
            showResult('mintResult', `Error: El contrato Token ${tokenType} no tiene una función 'mint' pública`, false);
        }

    } catch (error) {
        console.error(`Error minting Token ${tokenType}:`, error);
        if (error.code === 4001) {
            showResult('mintResult', 'Transacción de minteo rechazada por el usuario', false);
        } else if (error.code === "CALL_EXCEPTION" || (error.reason && error.reason.includes("execution reverted"))) {
            showResult('mintResult', `Error minteando Token ${tokenType}: La transacción fue revertida`, false);
        } else {
            showResult('mintResult', `Error minteando Tokens: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Función para aprobar tokens
async function approveToken(tokenType) {
    if (!signer) {
        alert("Please connect your wallet first");
        return;
    }

    const approveAmountElementId = tokenType === 'A' ? "approveAmountA" : "approveAmountB";
    const amountToApprove = document.getElementById(approveAmountElementId).value;

    if (isNaN(amountToApprove) || parseFloat(amountToApprove) <= 0) {
        showResult('approveResult', 'Por favor ingresa una cantidad válida para aprobar', false);
        return;
    }

    let tokenContract;
    let tokenAddress;

    if (tokenType === 'A') {
        tokenContract = tokenAContract;
        tokenAddress = tokenAAddress;
    } else if (tokenType === 'B') {
        tokenContract = tokenBContract;
        tokenAddress = tokenBAddress;
    } else {
        showResult('approveResult', 'Selección de token inválida', false);
        return;
    }

    try {
        let decimals;
        try {
            decimals = await tokenContract.decimals();
        } catch (error) {
            console.warn(`Could not get the Token's decimals ${tokenType}. Assuming 18. Error:`, error);
            decimals = 18;
        }

        const amountInWei = ethers.utils.parseUnits(amountToApprove, decimals);

        showResult('approveResult', `Aprobando ${amountToApprove} Token ${tokenType}... Por favor confirma en MetaMask`, true);
        const approveTx = await tokenContract.approve(simpleSwapAddress, amountInWei);
        const receipt = await approveTx.wait();
        console.log(`Token approval transaction ${tokenType} Successful:`, receipt);
        showResult('approveResult', `¡Aprobación de Token ${tokenType} exitosa! Hash: ${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`, true);
    } catch (error) {
        console.error(`Error approving Token ${tokenType}:`, error);
        if (error.code === 4001) {
            showResult('approveResult', 'Transacción de aprobación rechazada por el usuario', false);
        } else if (error.code === "CALL_EXCEPTION" || (error.reason && error.reason.includes("execution reverted"))) {
            showResult('approveResult', `Error aprobando Token ${tokenType}: La transacción fue revertida`, false);
        } else {
            showResult('approveResult', `Error aprobando Tokens: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Función para añadir liquidez
async function addLiquidity() {
    if (!simpleSwapContract || !signer) {
        alert("Please connect your wallet first");
        return;
    }

    const amountA = document.getElementById("amountA_liq").value;
    const amountB = document.getElementById("amountB_liq").value;

    if (isNaN(amountA) || isNaN(amountB) || parseFloat(amountA) <= 0 || parseFloat(amountB) <= 0) {
        showResult('addLiquidityResult', 'Por favor ingresa cantidades válidas para añadir liquidez', false);
        return;
    }

    try {
        let decimalsA = 18;
        let decimalsB = 18;
        try {
            decimalsA = await tokenAContract.decimals();
            decimalsB = await tokenBContract.decimals();
        } catch (error) {
            console.warn("Couldn't get exact decimals. Using 18 as default", error);
        }

        const amountAInWei = ethers.utils.parseUnits(amountA, decimalsA);
        const amountBInWei = ethers.utils.parseUnits(amountB, decimalsB);

        const amountAMin = amountAInWei.mul(99).div(100); // 1% slippage tolerance
        const amountBMin = amountBInWei.mul(99).div(100); // 1% slippage tolerance
        const toAddress = await signer.getAddress();
        const deadline = Math.floor(Date.now() / 1000) + (20 * 60); // 20 minutes from now

        showResult('addLiquidityResult', 'Añadiendo liquidez... Por favor confirma la transacción en MetaMask', true);

        const tx = await simpleSwapContract.addLiquidity(
            tokenAAddress,
            tokenBAddress,
            amountAInWei,
            amountBInWei,
            amountAMin,
            amountBMin,
            toAddress,
            deadline
        );

        const receipt = await tx.wait();
        console.log("Add liquidity transaction successful:", receipt);
        showResult('addLiquidityResult', `¡Liquidez añadida exitosamente! Hash: ${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`, true);
    } catch (error) {
        console.error("Error adding liquidity:", error);
        if (error.code === 4001) {
            showResult('addLiquidityResult', 'Transacción rechazada por el usuario', false);
        } else if (error.reason && error.reason.includes("execution reverted")) {
            showResult('addLiquidityResult', 'Error añadiendo liquidez: Transacción revertida', false);
        } else {
            showResult('addLiquidityResult', `Error añadiendo liquidez: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Función para remover liquidez
async function removeLiquidity() {
    if (!simpleSwapContract || !signer) {
        alert("Please connect your wallet first");
        return;
    }

    const liquidityToRemoveInput = document.getElementById("liquidityToBurn").value;

    if (isNaN(liquidityToRemoveInput) || parseFloat(liquidityToRemoveInput) <= 0) {
        showResult('removeLiquidityResult', 'Por favor ingresa una cantidad válida de liquidez para remover', false);
        return;
    }

    const liquidityToBurnWei = ethers.utils.parseUnits(liquidityToRemoveInput, 18);

    const amountAMin = 0;
    const amountBMin = 0;
    const toAddress = await signer.getAddress();
    const deadline = Math.floor(Date.now() / 1000) + (20 * 60);

    try {
        showResult('removeLiquidityResult', 'Removiendo liquidez... Por favor confirma la transacción en MetaMask', true);

        const removeLiquidityTx = await simpleSwapContract.removeLiquidity(
            tokenAAddress,
            tokenBAddress,
            liquidityToBurnWei,
            amountAMin,
            amountBMin,
            toAddress,
            deadline
        );

        const receipt = await removeLiquidityTx.wait();
        console.log("Remove liquidity transaction successful:", receipt);
        showResult('removeLiquidityResult', `¡Liquidez removida exitosamente! Hash: ${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`, true);

    } catch (error) {
        console.error("Error removing liquidity:", error);
        if (error.code === 4001) {
            showResult('removeLiquidityResult', 'Transacción rechazada por el usuario', false);
        } else if (error.reason && error.reason.includes("execution reverted")) {
            showResult('removeLiquidityResult', 'Error removiendo liquidez: Transacción revertida', false);
        } else {
            showResult('removeLiquidityResult', `Error removiendo liquidez: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Función para realizar swap
async function swap() {
    if (!simpleSwapContract || !signer) {
        alert("Please connect your wallet first");
        return;
    }

    const tokenInSelection = document.getElementById("tokenIn").value;
    const amountIn = document.getElementById("amountIn").value;

    if (isNaN(amountIn) || parseFloat(amountIn) <= 0) {
        showResult('swapResult', 'Por favor ingresa una cantidad válida para el intercambio', false);
        return;
    }

    let tokenInAddress;
    let tokenOutAddress;
    let tokenInContract;

    if (tokenInSelection === "A") {
        tokenInAddress = tokenAAddress;
        tokenOutAddress = tokenBAddress;
        tokenInContract = tokenAContract;
    } else if (tokenInSelection === "B") {
        tokenInAddress = tokenBAddress;
        tokenOutAddress = tokenAAddress;
        tokenInContract = tokenBContract;
    } else {
        showResult('swapResult', 'Selección de token inválida', false);
        return;
    }

    try {
        let decimalsIn;
        try {
            decimalsIn = await tokenInContract.decimals();
        } catch (error) {
            console.warn(`Couldn't get the input token's decimals (${tokenInSelection}). Assuming 18`, error);
            decimalsIn = 18;
        }

        const amountInWei = ethers.utils.parseUnits(amountIn, decimalsIn);

        showResult('swapResult', `Aprobando Token ${tokenInSelection} para el intercambio... Por favor CONFIRMA la transacción en MetaMask`, true);
        const approveTx = await tokenInContract.approve(simpleSwapAddress, amountInWei);
        await approveTx.wait();
        console.log(`Aprobación de Token ${tokenInSelection} exitosa:`, approveTx.hash);

        const currentToken0 = await simpleSwapContract.token0();
        const currentToken1 = await simpleSwapContract.token1();

        let reserveIn;
        let reserveOut;

        if (tokenInAddress === currentToken0) {
            reserveIn = await simpleSwapContract.reserve0();
            reserveOut = await simpleSwapContract.reserve1();
        } else if (tokenInAddress === currentToken1) {
            reserveIn = await simpleSwapContract.reserve1();
            reserveOut = await simpleSwapContract.reserve0();
        } else {
            console.error("Invalid tokenInAddress relative to simpleSwap's token0/token1");
            showResult('swapResult', 'Error: Configuración de token incorrecta', false);
            return;
        }

        let expectedAmountOut = await simpleSwapContract.getAmountOut(amountInWei, reserveIn, reserveOut);
        const amountOutMin = expectedAmountOut.mul(99).div(100);

        const path = [tokenInAddress, tokenOutAddress];
        const toAddress = await signer.getAddress();
        const deadline = Math.floor(Date.now() / 1000) + (20 * 60);

        showResult('swapResult', 'Realizando intercambio... Por favor CONFIRMA la transacción final en MetaMask', true);

        const transaction = await simpleSwapContract.swapExactTokensForTokens(
            amountInWei,
            amountOutMin,
            path,
            toAddress,
            deadline
        );

        const receipt = await transaction.wait();
        console.log("Swap transaction successful:", receipt);
        const tokenOutSymbol = tokenInSelection === 'A' ? await tokenBContract.symbol() : await tokenAContract.symbol();
        showResult('swapResult', `¡Intercambio exitoso! Recibiste ~${ethers.utils.formatUnits(expectedAmountOut, decimalsIn)} ${tokenOutSymbol}. Hash: ${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.substring(receipt.transactionHash.length - 4)}`, true);
    } catch (error) {
        console.error("Error performing swap:", error);
        if (error.code === 4001) {
            showResult('swapResult', 'Transacción rechazada por el usuario (aprobación o intercambio)', false);
        } else if (error.reason && error.reason.includes("execution reverted")) {
            showResult('swapResult', 'Error de intercambio: Transacción revertida', false);
        } else {
            showResult('swapResult', `Error realizando intercambio: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Función para obtener precio
async function getPrice() {
    if (!simpleSwapContract) {
        alert("Please connect your wallet first");
        return;
    }

    const tokenA_price_selection = document.getElementById("tokenA_price").value;
    const tokenB_price_selection = document.getElementById("tokenB_price").value;

    let priceTokenA;
    let priceTokenB;

    if (tokenA_price_selection === 'A') {
        priceTokenA = tokenAAddress;
    } else if (tokenA_price_selection === 'B') {
        priceTokenA = tokenBAddress;
    } else {
        showResult('priceDisplay', 'Selección inválida de Token A para el precio', false);
        return;
    }

    if (tokenB_price_selection === 'A') {
        priceTokenB = tokenAAddress;
    } else if (tokenB_price_selection === 'B') {
        priceTokenB = tokenBAddress;
    } else {
        showResult('priceDisplay', 'Selección inválida de Token B para el precio', false);
        return;
    }

    if (priceTokenA === priceTokenB) {
        showResult('priceDisplay', 'No se puede obtener el precio de un token en términos de sí mismo', false);
        return;
    }

    try {
        const price = await simpleSwapContract.getPrice(priceTokenA, priceTokenB);

        let decimalsQuoteToken = 18;
        try {
            decimalsQuoteToken = (priceTokenB === tokenAAddress) ? await tokenAContract.decimals() : await tokenBContract.decimals();
        } catch (error) {
            console.warn("Couldn't get the reference token's decimals for the price. Using 18 as default", error);
        }

        const formattedPrice = ethers.utils.formatUnits(price, 18);
        
        const symbolTokenA = (priceTokenA === tokenAAddress) ? await tokenAContract.symbol() : await tokenBContract.symbol();
        const symbolTokenB = (priceTokenB === tokenAAddress) ? await tokenAContract.symbol() : await tokenBContract.symbol();

        showResult('priceDisplay', `1 ${symbolTokenA} = ${formattedPrice} ${symbolTokenB}`, true);

    } catch (error) {
        console.error("Error getting price:", error);
        if (error.reason && error.reason.includes("Invalid token")) {
            showResult('priceDisplay', 'Error: Tokens inválidos seleccionados para el pool. Revisa los contratos', false);
        } else if (error.reason && error.reason.includes("reverted")) {
            showResult('priceDisplay', 'Error: Transacción revertida', false);
        } else {
            showResult('priceDisplay', `Error obteniendo precio: ${error.message || error.reason || "Revisa la consola para más detalles"}`, false);
        }
    }
}

// Inicializar iconos
updateTokenIcons();
