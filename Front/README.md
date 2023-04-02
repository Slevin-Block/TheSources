This is a [wagmi](https://wagmi.sh) + [ConnectKit](https://docs.family.co/connectkit) + [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wagmi-dev/wagmi/tree/main/packages/create-wagmi)

# Getting Started

Run `npm run dev` in your terminal, and then open [localhost:3000](http://localhost:3000) in your browser.

Once the webpage has loaded, changes made to files inside the `src/` directory (e.g. `src/pages/index.tsx`) will automatically update the webpage.

# Learn more

To learn more about [Next.js](https://nextjs.org), [ConnectKit](https://docs.family.co/connectkit) or [wagmi](https://wagmi.sh), check out the following resources:

- [wagmi Documentation](https://wagmi.sh) – learn about wagmi Hooks and API.
- [wagmi Examples](https://wagmi.sh/examples/connect-wallet) – a suite of simple examples using wagmi.
- [ConnectKit Documentation](https://docs.family.co/connectkit) – learn more about ConnectKit (configuration, theming, advanced usage, etc).
- [Next.js Documentation](https://nextjs.org/docs) learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



--------------------------------------------------------------------

transferts <= Liste des events Transfert (from, to, tokenId)
const myAddress = address

let ownership = {}
let currentProperties = [];
transferts.forEach(transfert => {
    if (currentProperties.length < transfert.id) currentProperties.push(transfert.to)
    else  currentProperties[transfert.id-1] = transfert.to
});

// List que de l'address cherchée
const properties = currentProperties.flatMap((property,index) => property === myAddress ? index+1 : [])
console.log('Listes des tokens de a : ', properties.length ? properties : null)

// Liste complète des propriétés de chaque possesseur de token
currentProperties.forEach((property, index) => {
    if (ownership?.property) ownership.property.push(index+1)
    else ownership[property] = [index+1]
})

console.log(`Listes des tokens de a : `, ownership?.a || null)