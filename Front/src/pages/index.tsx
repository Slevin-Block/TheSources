import { useState } from 'react'
import { Account } from '../components'
import Editor from '../components/Editor'
import Header from '../components/Header/Header'

const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"]

function Page() {
    const [theme, setTheme] = useState(0)
    const switchTheme: () => void = () => {setTheme((theme + 1)%themes.length)}

    return (
        <div data-theme={themes[theme]} className='w-full h-full'>
            <Header switchTheme={switchTheme} theme={themes[theme]} />

            <Account />
            <Editor />
        </div>
    )
}

export default Page
