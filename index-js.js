import { createWalletClient, custom, createPublicClient} from "https://esm.sh/viem"
import { contractAddress, abi } from "./constants-js"

const connectBotton = document.getElementById("ConnectBotton")
const getBalance = document.getElementById("GetBalanceBotton")
const buyCoffee = document.getElementById("BuyCoffeeBotton")
const ethAmountInput = document.getElementById("ethAmount")

let walletClient
let publicClient

// 这里用async主要是因为函数requestAddresses
// 可以去https://viem.sh/docs/actions/wallet/requestAddresses#requestaddresses
// 查看usage那一节，可以发现requestAddress返回了一个promise对象
async function connect() {
    if(typeof window.ethereum !== "undefined"){
        walletClient = createWalletClient({
            // window.ethereum指向metamask 规定传输是在metamask中发生的
            transport: custom(window.ethereum)
        })
        // 需要等待requestAddress执行完后才能接着执行 确保已经链接了钱包
        await walletClient.requestAddresses()
        connectBotton.innerHTML = "Connected MetaMask"
    }else{
        // 将按钮中的文本内容改为"Please install MetaMask"
        connectBotton.innerHTML = "Please install MetaMask"
    }
}

async function fund() {
    // 获取输入框中的值
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount} ether to buy coffee`)

    // 点击connect后当时确实连接钱包了 但是后面也可以断开钱包 我们需要在fund时再次确认是否连接钱包
    // 这里用了publicClient 主要是学习simulateContract
    if(typeof window.ethereum !== "undefined"){
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
        
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        // 可以去https://viem.sh/docs/contract/simulateContract#simulatecontract
        // 看到详细的使用案例
        await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: 'fund',
            account,
        })
    }else{
        connectBotton.innerHTML = "Please install MetaMask"
    }
}
connectBotton.onclick = connect
buyCoffee.onclick = fund


