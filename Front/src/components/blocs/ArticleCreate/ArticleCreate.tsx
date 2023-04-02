import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { useRecoilValue } from 'recoil';
import { UserState } from '../../../store/UserState';
import { useToast } from '@chakra-ui/react'
import DragDropFiles from '../../atoms/DragAndDrop/DragDropFiles'

type MetadataType = {
    name: string;
    description: string;
    image?: string;
    attributes: {
        trait_type: string;
        value: string;
    }[];
}


export default function ArticleCreate() {
    const user = useRecoilValue(UserState)
    const [cover, setCover] = useState<FileList | null>(null);
    const [article, setArticle] = useState<FileList | null>(null);
    const titleRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLInputElement>(null)
    const authorRef = useRef<HTMLInputElement>(null)
    const quantityRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)
    const toast = useToast()


    const handleClick = async () => {
        const title = titleRef.current?.value
        const description = descriptionRef.current?.value
        const author = authorRef.current?.value
        

        if (cover && article && title && author) {
            const myCover = cover[0]
            const myArticle = article[0]

            if (!["jpg", "png", "svg"].includes(myCover.name.split('.')[1])){
                return console.log("Cover hasn't the good format : ", myCover.name.split('.').at(1))
            }
            if (myArticle.name.split('.')[1] !== 'pdf'){
                return console.log("Article hasn't the good format : ", myArticle.name.split('.').at(1))
            }
            let metadata = {
                name: titleRef.current?.value,
                description,
                attributes: [
                    {
                        trait_type: "Author reference",
                        value: author
                    },
                    {
                        trait_type: "Author address",
                        value: user.address
                    },
                    {
                        trait_type: "Cover",
                        value: `cover.${myCover.name.split('.').at(1)}`
                    },
                    {
                        trait_type: "Article",
                        value: `article.${myArticle.name.split('.').at(1)}`
                    },
                    {
                        trait_type: "Metadata",
                        value: 'metadata.json'
                    },
                ]
            }

            const formData = new FormData();
            const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
            const myMetadata = new File([blob], 'metadata.json', { type: 'application/json' })
            formData.append('file', myCover, `cover.${myCover.name.split('.').at(1)}`);
            formData.append('file', myArticle, `article.${myArticle.name.split('.').at(1)}`);
            formData.append('file', myMetadata, 'metadata.json');
            const response = await fetch('/api/upload', { method: "POST", body: formData })
            const body = await response.json() as { status: 'ok' | 'fail', message: string, cid?: string };
            const folderCID = body.message.split(' ').at(1)
            const metadataCID = `https://gateway.pinata.cloud/ipfs/${body.cid}`
            console.log('Response : ', folderCID, metadataCID)

            if (body.status = 'ok') {
                // AUTOMATIC UNPINNING
                setTimeout(() => {
                    console.log('Try to unpin')
                    fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: metadataCID }) })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                    fetch('/api/unpin', { method: "POST", body: JSON.stringify({ cid: folderCID }) })
                        .then(res => res.json())
                        .then(data => console.log(data))
                        .catch(err => console.log(err))
                }, 3000)
            }
        } else { console.log("Error, il manque des éléments") }
    }


    return (
        <>
            <Flex direction='column' gap='0.5rem' w='30rem' align='center' justify='center' border='1px' borderColor='accent' borderRightRadius="0.4rem" p='1rem'>
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