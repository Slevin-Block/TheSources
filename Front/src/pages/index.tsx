import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import ArticleCreate from '../components/blocs/ArticleCreate/ArticleCreate'
import { Box, Button, Flex } from '@chakra-ui/react'
import styles from "./index.module.css"

function Page() {

    return (
        <div className={styles.full}>
            <div className={styles.header}>
                <Header />
            </div>
            <div className={styles.body}>
                <ArticleCreate />
            </div>
        </div>
    )
}

export default Page
