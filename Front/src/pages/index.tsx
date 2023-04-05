import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import ArticleCreate from '../components/blocs/ArticleCreate/ArticleCreate'
import styles from "./index.module.css"
import { useAccount } from 'wagmi'
import MemberTokenPrice from '../components/atoms/MemberTokenPrice/MemberTokenPrice'
import MintMemberToken from '../components/atoms/MintMemberToken/MintMemberToken'



function Page() {

    const { isConnected } = useAccount()



    return (
        <div className={styles.full}>
            <div className={styles.header}>
                <Header />
            </div>
            {isConnected && <div className={styles.body}>
                {/* <ArticleCreate /> */}
                <MemberTokenPrice />
                {/* <MintMemberToken /> */}
            </div>}
        </div>
    )
}

export default Page
