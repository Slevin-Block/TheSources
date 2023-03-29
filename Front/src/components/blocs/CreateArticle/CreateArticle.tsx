import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { UserState } from '../../../store/UserState';
import { useToast } from '@chakra-ui/react'
import { FormDataEncoder } from 'form-data-encoder';
import DragDropFiles from '../../atoms/DragAndDrop/DragDropFiles'


export default function CreateArticle() {
    const user = useRecoilValue(UserState)
    const [cover, setCover] = useState<FileList | null>(null);
    const [article, setArticle] = useState<FileList | null>(null);
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const authorRef = useRef<HTMLInputElement>(null)
    const quantityRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const toast = useToast()

    // const boundary = '----WebKitFormBoundary' + Math.random().toString(16).substring(2, 16);
    // const body = addBoundary(formData, boundary)
    // console.log(body)

    const handleClick = async () => {
        const title = titleRef.current?.value
        const description = descriptionRef.current?.value
        const author = authorRef.current?.value

        if (cover && article && title && author) {
            const myCover = cover[0]
            const myArticle = article[0]
            const metadata = {
                name: titleRef.current?.value,
                description,
                attributes: [
                    {
                        trait_type: "Author reference",
                        value: author
                    },
                    {
                        trait_type: "Author address",
                        address: user.address
                    },
                ]
            }
            
            const formData = new FormData();
            const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
            const myMetadata = new File([blob], 'metadata.json', { type: 'application/json' })
            console.log(myCover, myArticle, myMetadata)
            formData.append('file', myCover,      `test/cover.${myCover.name.split('.').at(1)}`);
            formData.append('file', myArticle,    `test/article.${myArticle.name.split('.').at(1)}`);
            formData.append('file', myMetadata, `test/metadata.json`);
            const response = await fetch('/api/upload',{ method: "POST", body : formData })
            const body = await response.json() as { status: 'ok' | 'fail', message: string };
            console.log('Reponse : ',body.message)
        } else { console.log("Error, il manque des éléments") }
    }


    return (
        <>
            <Flex direction='column' gap='0.5rem' w='30rem' align='center' justify='center' border='1px' borderColor='accent' borderRightRadius="0.4rem" p='1rem' >
                <Flex justify='space-around' w="100%">
                    <Box>
                        <Text>Title of your article</Text>
                        <Input placeholder='Title' variant='outline' ref={titleRef} defaultValue="Mon Titre" />
                    </Box>
                    <Box>
                        <Text>Author of the article</Text>
                        <Input placeholder='Author' variant='outline' ref={authorRef} defaultValue="Moi" />
                    </Box>
                </Flex>
                <Box>
                    <Text>Description of your article</Text>
                    <Input placeholder='Description' variant='outline' ref={descriptionRef} defaultValue="Mon super article" />
                </Box>
                <Flex justify='space-around' w="100%">
                    <Box>
                        <Text>Quantity of NFT</Text>
                        <Input placeholder='Quantity' variant='outline' ref={quantityRef} defaultValue="4" />
                    </Box>
                    <Box>
                        <Text>Price of each NFT</Text>
                        <Input placeholder='Price of each NFT' variant='outline' ref={priceRef} defaultValue="0.2" />
                    </Box>
                </Flex>
                <Flex justify='space-around' w="100%">
                    <Box>
                        <Text>Add your cover</Text>
                        <DragDropFiles files={cover} setFiles={setCover} />
                    </Box>
                    <Box>
                        <Text>Add your article</Text>
                        <DragDropFiles files={article} setFiles={setArticle} />
                    </Box>
                </Flex>
                <Button onClick={() => handleClick()}>Button</Button>
            </Flex>
        </>
    )
}