import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState(0)
    const [numPlayers, setNumPlayers] = useState(0)
    const [recentWinner, setRecentWinner] = useState(0)
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const dispatch = useNotification()

    const { runContractFunction: enterLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUi = async () => {
        const entranceFeeCall = (await getEntranceFee()).toString()
        const numPlayersCall = (await getNumPlayers()).toString()
        const recentWinnerCall = await getRecentWinner()
        setEntranceFee(entranceFeeCall)
        setNumPlayers(numPlayersCall)
        setRecentWinner(recentWinnerCall)
    }

    useEffect(() => {
        isWeb3Enabled && updateUi()
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <>
            <div>Lottery Entrance:</div>
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Lottery
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatEther(entranceFee)} AVAX</div>
                    <div>Current Number of players: {numPlayers}</div>
                    <div>Most Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>Please switch to Fuji testnet</div>
            )}
        </>
    )
}
