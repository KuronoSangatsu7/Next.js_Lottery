import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import { Moralis } from "moralis"

export default function MoralisHeader() {
    const { enableWeb3, account, isWeb3Enabled, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        window && window.localStorage.getItem("connected") && enableWeb3()
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <>
            {account ? (
                <div>Connected{account}</div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        window && window.localStorage.setItem("connected", "injected")
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </>
    )
}
