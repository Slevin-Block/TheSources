import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import ArticleCreate from '../components/blocs/ArticleCreate/ArticleCreate'
import { Box, Button, Flex } from '@chakra-ui/react'


function Page() {

    return (
        <Box w='100vw' h='100vh'>
            <Flex align='center' justify='space-between'  w="100%" h="15%" direction="row" px='1rem'>
                <Header />
            </Flex>
            <Flex align='center' justify='center' w="100%" h="85%">
                <ArticleCreate />
            </Flex>
        </Box>
    )
}

export default Page
