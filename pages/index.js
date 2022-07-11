import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Lottery</title>
                <meta name="description" content="Literally just a lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <LotteryEntrance />
        </div>
    )
}
