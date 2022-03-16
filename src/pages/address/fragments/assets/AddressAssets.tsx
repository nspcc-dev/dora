import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { toBigNumber } from '../../../../utils/formatter'
import { State as AddressState } from '../../../../reducers/addressReducer'
import tokens from '../../../../assets/nep5/svg'
import { fetchAddress } from '../../../../actions/addressActions'
import useUpdateNetworkState from '../../../../hooks/useUpdateNetworkState'

function getTransferLogo(symbol: string, chain: string): React.ReactNode {
  const isNeo2 = ['NEO', 'GAS'].includes(symbol) && chain === 'neo2'
  const tidySymbol = isNeo2 ? `symbol${2}` : symbol

  const icon = tokens[tidySymbol]

  return icon ? (
    <img src={icon} className="icon" alt="token-logo" />
  ) : (
    <span className="icon-not-found">N/A</span>
  )
}

interface MatchParams {
  hash: string
  chain: string
  network: string
}

type Props = RouteComponentProps<MatchParams>

const AddressAssets: React.FC<Props> = props => {
  const { hash, chain } = props.match.params
  useUpdateNetworkState(props)
  const dispatch = useDispatch()
  const addressState = useSelector(
    ({ address }: { address: AddressState }) => address,
  )
  const { balance, isLoading } = addressState

  useEffect(() => {
    dispatch(fetchAddress(hash, chain))
  }, [chain, dispatch, hash])

  return (
    <div id="nft-container" className="page-container">
      <div id="address-balance-container">
        {balance &&
          balance.map(balance => (
            <div key={balance.symbol} className="balance-container">
              <div className="balance-details">
                <div className="icon-container">
                  {getTransferLogo(balance.symbol, chain)}
                </div>
                <div className="balance-infos">
                  <span className="balance-symbol">{balance.symbol}</span>
                  {balance.name && (
                    <span className="balance-name">{balance.name}</span>
                  )}
                </div>
              </div>
              <div className="balance-amount">
                {toBigNumber(balance.balance).toString()}
              </div>
            </div>
          ))}
      </div>

      {isLoading && (
        <div id="address-balance-container">
          <SkeletonTheme
            color="#21383d"
            highlightColor="rgb(125 159 177 / 25%)"
          >
            <Skeleton count={5} />{' '}
          </SkeletonTheme>
        </div>
      )}
    </div>
  )
}

export default withRouter(AddressAssets)