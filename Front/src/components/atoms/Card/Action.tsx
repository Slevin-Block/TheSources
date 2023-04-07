import React from 'react'
import { usePrepareContractWrite } from 'wagmi'

export const Action = () => {

    usePrepareContractWrite({
        address : contracts.The
    })

  return (
    <div>Action</div>
  )
}
