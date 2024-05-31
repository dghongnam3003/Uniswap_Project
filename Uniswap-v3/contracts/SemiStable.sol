import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract SemiStableSwap {
    ISwapRouter public immutable swapRouter;
    uint256 public constant MAX_SWAP_AMOUNT = 1000 ether; // Maximum swap amount to trigger semi-stable logic

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function semiStableSwap(
        uint256 amountIn,
        uint256 amountOutMinimum,
        address tokenIn,
        address tokenOut,
        uint24 poolFee
    ) external returns (uint256 amountOut) {
        if (amountIn > MAX_SWAP_AMOUNT) {
            // Split the large trade into multiple smaller trades
            uint256 numSwaps = amountIn / MAX_SWAP_AMOUNT;
            uint256 remainingAmount = amountIn % MAX_SWAP_AMOUNT;

            for (uint256 i = 0; i < numSwaps; i++) {
                amountOut += splitSwap(
                    MAX_SWAP_AMOUNT,
                    0, // Minimum output amount for intermediate swaps
                    tokenIn,
                    tokenOut,
                    poolFee
                );
            }

            // Execute the final swap for the remaining amount
            amountOut += splitSwap(
                remainingAmount,
                amountOutMinimum,
                tokenIn,
                tokenOut,
                poolFee
            );
        } else {
            // Execute a single swap for small trades
            amountOut = singleSwap(
                amountIn,
                amountOutMinimum,
                tokenIn,
                tokenOut,
                poolFee
            );
        }
    }

    function splitSwap(
        uint256 amountIn,
        uint256 amountOutMinimum,
        address tokenIn,
        address tokenOut,
        uint24 poolFee
    ) internal returns (uint256 amountOut) {
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function singleSwap(
        uint256 amountIn,
        uint256 amountOutMinimum,
        address tokenIn,
        address tokenOut,
        uint24 poolFee
    ) internal returns (uint256 amountOut) {
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }
}