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

    const {
        runContractFunction: enterLottery,
        isLoading,
        isFetching,
    } = useWeb3Contract({
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
        <div className="p-5 text-xl">
            {lotteryAddress ? (
                <div>
                    <div className="m-3"><strong>Entrance Fee:</strong> {ethers.utils.formatEther(entranceFee)} <strong className="text-red-900">AVAX</strong></div>
                    <div className="m-3"><strong>Current Number of players:</strong> {numPlayers}</div>
                    <div className="m-3"><strong>Most Recent Winner:</strong> <span className="italic">{recentWinner}</span></div>
                    <button
                        className="bg-stone-700 hover:bg-stone-800 text-slate-200 rounded px-3 py-2 disabled:opacity-50 disabled:hover:bg-stone-700 m-3"
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                </div>
            ) : (
                <div>Please switch to Fuji testnet</div>
            )}
        </div>
    )
}
