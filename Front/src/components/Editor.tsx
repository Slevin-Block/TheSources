import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useForm } from "react-hook-form";
import { Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.
A block quote with ~strikethrough~ and a URL: https://reactjs.org.
A block quote with ~strikethrough~ and a URL: https://reactjs.org. [apple](https://apple.com).

## hekko
# This ~is not~ strikethrough, but ~~this is~~!

* Lists
* [ ] todo
* [x] done

A table:

| head | tail   | mid  |
| ---- | ------ | ---- |
|      |        | yam  |
| app  | cheese | milk |
| rice | a      | b    |


`;
type FormData = {
    title: string;
    article: string;
    author?: string;
    quantity: number;
};

const Editor = () => {
    const [show, setShow] = useState(false);
    const [article, setArticle] = useState(markdown);
    const { register, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        defaultValues: {
            title: 'Mon super titre',
            article: 'Mon article de folie',
            author: 'Moi, moi et moi',
            quantity: 4,
        }
    });


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setArticle(e.target.value);
    };

    const onSubmit: (data: FormData) => Promise<void> = (data) => {
        return new Promise((resolve, reject) => {
            const form = new FormData();
            const bodyData = {
                title: data.title,
                article: data.article,
                author: data.author,
                quantity: data.quantity
            };
            const bodyJson = JSON.stringify(bodyData);
            form.append("data", bodyJson)
            fetch('/api/sendToIPFS', { method: "POST", headers : { 'Content-Type' : 'application/json'}, body: bodyJson })
                .then(res => console.log(res))
                .then(() => resolve())
                .catch(err => reject(err))
        })
    };

    /* const form = new FormData();
    form.append("data", data.article)
    console.log(form)
    const res = await fetch('/api/sendToIPFS', { method: "POST", body: form })
    console.log(res)
    return true; */


    /* const sendData = async () => {
        const form = new FormData();
        form.append("data", data)
        console.log(form)
        const res = await fetch('/api/sendToIPFS', {method : "POST", body : form})
        console.log(res)
    } */

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl >
                    <FormLabel>Title of your article</FormLabel>
                    <Input {...register("title")} placeholder='Title' />
                    <FormLabel>Your article in markdown</FormLabel>
                    <Textarea {...register("article")} placeholder='Your article, type in markdown' />
                    <FormLabel>Author</FormLabel>
                    <Input {...register("author")} placeholder='your name' />
                    <FormLabel>Quantity</FormLabel>
                    <Input {...register("quantity")} placeholder='mint quantity' />

                </FormControl>
                <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>Button</Button>
            </form>

            {/* <div className="">
                <input />
                <textarea
                    className=""
                    placeholder="Write your markdown here"
                    value={value}
                    onChange={handleInputChange}
                />



                <div className="">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            </div>
            <button onClick={sendData} >Send</button> */}
        </>
    );
};

export default Editor;
