// Variables globales necesarias para la DApp
let provider;
let signer;
let simpleSwapContract;
let tokenAContract;
let tokenBContract;

// Direcciones de contratos
const tokenAAddress = "0xa6a40df02fdBf62e48B7FDBB3d80a10F378AF24C"; 
const tokenBAddress = "0x59A7EFAF3C24e2a053B2D92fc427FdA3181a45D5";
const simpleSwapAddress = "0xCc55aFB4BcEf3D24E196693e1a3250e4faFe3eD4";


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
"name": "reserveA",
"outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "reserveB",
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
"name": "tokenA",
"outputs": [
    { "internalType": "address", "name": "", "type": "address" }
],
"stateMutability": "view",
"type": "function"
},
{
"inputs": [],
"name": "tokenB",
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
    // Intercambiar token seleccionado
    const tokenIn = document.getElementById('tokenIn');
    tokenIn.value = tokenIn.value === 'A' ? 'B' : 'A';

    updateTokenIcons();

    // Limpiar inputs
    const amountInInput = document.getElementById('amountIn');

    // El input readonly (de salida) es el segundo input-field dentro de swap-container
    const swapContainer = document.querySelector('.swap-container');
    const amountOutInput = swapContainer.querySelectorAll('input.input-field')[1];

    amountInInput.value = '';
    if (amountOutInput) amountOutInput.value = '';
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
        alert("Por favor, conecta primero tu billetera.");
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
        alert("Por favor, conecta primero tu billetera.");
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
        alert("Por favor, conecta primero tu billetera.");
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
        alert("Por favor, conecta primero tu billetera.");
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
        alert("Por favor, conecta primero tu billetera.");
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

        const currentToken0 = await simpleSwapContract.tokenA();
        const currentToken1 = await simpleSwapContract.tokenB();

        let reserveIn;
        let reserveOut;

        if (tokenInAddress === currentToken0) {
            reserveIn = await simpleSwapContract.reserveA();
            reserveOut = await simpleSwapContract.reserveB();
        } else if (tokenInAddress === currentToken1) {
            reserveIn = await simpleSwapContract.reserveB();
            reserveOut = await simpleSwapContract.reserveA();
        } else {
            console.error("Invalid tokenInAddress relative to simpleSwap's tokenA/tokenB");
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
        const explorerUrl = `https://sepolia.etherscan.io/tx/${receipt.transactionHash}`;
        const hashShort = `${receipt.transactionHash.substring(0, 6)}...${receipt.transactionHash.slice(-4)}`;
        const message = `¡Intercambio exitoso! Recibiste ~${ethers.utils.formatUnits(expectedAmountOut, decimalsIn)} ${tokenOutSymbol}. <a href="${explorerUrl}" target="_blank" rel="noopener noreferrer">Ver transacción: ${hashShort}</a>`;

        showResult('swapResult', message, true);

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



async function estimateSwap() {
    const amountInValue = document.getElementById("amountIn").value;

    if (!simpleSwapContract || !amountInValue || isNaN(amountInValue)) {
        return;
    }

    const tokenInSelect = document.getElementById("tokenIn").value;
    const tokenIn = (tokenInSelect === 'A') ? tokenAAddress : tokenBAddress;
    const tokenOut = (tokenInSelect === 'A') ? tokenBAddress : tokenAAddress;

    try {
        const decimals = 18;
        const amountIn = ethers.utils.parseUnits(amountInValue, decimals);

        // Obtener reservas actuales
        const reserveA = await simpleSwapContract.reserveA();
        const reserveB = await simpleSwapContract.reserveB();

        // Determinar cuál es reserveIn y reserveOut
        let reserveIn, reserveOut;

        if (tokenIn === tokenAAddress) {
            reserveIn = reserveA;
            reserveOut = reserveB;
        } else if (tokenIn === tokenBAddress) {
            reserveIn = reserveB;
            reserveOut = reserveA;
        } else {
            // Token desconocido, mostrar error y salir
            console.error("TokenIn no coincide con tokenA ni tokenB");
            const outputInput = document.querySelectorAll(".swap-container .input-field")[1];
            outputInput.value = "Error";
            return;
        }

        // Llamar correctamente a getAmountOut con amountIn y reservas
        const amountOut = await simpleSwapContract.getAmountOut(amountIn, reserveIn, reserveOut);

        const formattedOut = ethers.utils.formatUnits(amountOut, decimals);

        const outputInput = document.querySelectorAll(".swap-container .input-field")[1];
        outputInput.value = formattedOut;
    } catch (error) {
        console.error("Error estimando el swap:", error);
        const outputInput = document.querySelectorAll(".swap-container .input-field")[1];
        outputInput.value = "Error";
    }
}






// Inicializar iconos
updateTokenIcons();


    document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("amountIn").addEventListener("input", estimateSwap);
    document.getElementById("tokenIn").addEventListener("change", estimateSwap);
});


