import Editor from '../components/_archives/Editor'
import Header from '../components/blocs/Header/Header'
import CreateArticle from '../components/blocs/CreateArticle/CreateArticle'
import { Box, Flex } from '@chakra-ui/react'


function Page() {

    return (
        <Box w='100vw' h='100vh'>
            <Flex align='center' justify='space-between'  w="100%" h="15%" direction="row" px='1rem'>
                <Header />
            </Flex>
            <Flex align='center' justify='center' w="100%" h="85%">
                <CreateArticle />
            </Flex>
        </Box>
    )
}

export default Page
