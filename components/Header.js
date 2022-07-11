import { ConnectButton } from "web3uikit";

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row">
            <h1 className="py-1 font-bold text-3xl">Lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton className="text-black" moralisAuth={false} />
            </div>
        </nav>
    )
}