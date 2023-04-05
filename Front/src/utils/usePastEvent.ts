import { Contract } from "ethers"
import { useEffect, useState } from "react"

export const usePastEvents = (contract: Contract | null, eventName: string) => {
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        if (contract !== null){
        const filter = contract.filters[eventName]()
        if (filter){
            (async ()=>{
                const res = await contract.queryFilter(filter, 0, 'latest')
                if (res) {
                    setEvents(res.map(event => event.args))
                }
            })()
        }else{
            console.log("filter invalid")
        }
        console.log("contract invalid")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, eventName])

    return events
}
