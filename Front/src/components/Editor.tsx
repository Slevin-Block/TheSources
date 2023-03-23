import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


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

const Editor = () => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(markdown);


    const handleInputChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const sendData = async () => {
        const form = new FormData();
        form.append("data", value)
        console.log(form)
        const res = await fetch('/api/sendToIPFS', {method : "POST", body : form})
        console.log(res)
    }

    return (
        <>
            <div className=" w-3/4 border border-slate-900 py-8 px-8">
                <button
                    className="cursor-pointer relative text-blue-500 font-semibold text-md"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {show ? "Edit" : "Preview"}
                </button>

                {/* text area to type markdown */}
                <textarea
                    className=" bg-slate-900 fullheight w-full relative outline-none text-white border-0 pt-6"
                    placeholder="Write your markdown here"
                    value={value}
                    onChange={handleInputChange}
                />


                {/* preview window */}
                <div className="bg-slate-900 h-full w-full text-white editor">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            </div>
            <button onClick={sendData} >Send</button>
        </>
    );
};

export default Editor;
