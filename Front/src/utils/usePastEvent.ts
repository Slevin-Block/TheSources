import { Contract } from "ethers"
import { useEffect, useState } from "react"
import { ContractsState } from "../store/ContractsState"
import { useRecoilValue } from "recoil"

export const usePastEvents = (contract: Contract | null, eventName: string, address :`0x${string}` | undefined, schema: string[] = []) => {
    const [events, setEvents] = useState<any[]>([])
    const {blocknumber} = useRecoilValue(ContractsState)
    useEffect(() => {
        if (contract !== null) {
            let filter
            try {
                filter = contract.filters[eventName]()
            } catch (err) {
                console.error(err)
            }
            if (filter) {
                (async () => {
                    try {
                        const res = await contract.queryFilter(filter, blocknumber, 'latest')
                        if (res && res.length > 0) {
                            if (schema.length === 0) {
                                setEvents(res.map(event => event.args))
                            } else if (res[0].args?.length !== schema.length) {
                                console.error("Schema incorrect")
                                setEvents(res.map(event => event.args))
                            } else {
                                const values = res.map(event => event.args)
                                if (values.length > 0) {
                                    // @ts-ignore
                                    setEvents(values.map(value => Object.fromEntries(value.map((value, index) => [schema[index], value]))))
                                } else {
                                    setEvents([])
                                }
                            }
                        }else{
                            setEvents([])
                        }
                    } catch (err) {
                        console.error(err)
                    }
                })()
            } else {
                console.log("filter invalid")
            }
        }else{
            console.log("contract invalid")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, eventName, address])

    return events
}
