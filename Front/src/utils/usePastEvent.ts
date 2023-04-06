import { Contract } from "ethers"
import { useEffect, useState } from "react"

export const usePastEvents = (contract: Contract | null, eventName: string, schema: string[] = []) => {
    const [events, setEvents] = useState<any[]>([])

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
                        const res = await contract.queryFilter(filter, 0, 'latest')
                        if (res) {
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
                        }
                    } catch (err) {
                        console.error(err)
                    }
                })()
            } else {
                console.log("filter invalid")
            }
            console.log("contract invalid")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contract, eventName])

    return events
}
