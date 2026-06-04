import { useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useConnectModal, useAccountModal } from '@rainbow-me/rainbowkit'
import {
  openHallidayPayments,
  openWithdraw,
  openActivity,
  initializeClient,
} from '@halliday-sdk/payments'
import { connectWalletClient } from '@halliday-sdk/payments/viem'

const HALLIDAY_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY

if (!HALLIDAY_API_KEY) {
  alert('HALLIDAY_API_KEY is missing!');
}

const tokens = [
  'base:0x',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
]

export default function App() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  useEffect(() => {
    initializeClient({
      apiKey: HALLIDAY_API_KEY,
      outputs: tokens,
      onReady: () => console.log('Halliday preloaded and ready'),
      onError: (error) => console.error('Halliday init error:', error),
    })
  }, [])

  const enabled = isConnected && !!walletClient
  const userWallet = walletClient ? connectWalletClient(() => walletClient) : null
  const onConnect = openAccountModal || openConnectModal

  const onDeposit = () =>
    openHallidayPayments({ userWallet, destinationAddress: address })

  const onWithdraw = () =>
    openWithdraw({
      withdrawInputs: tokens,
      withdrawFunder: userWallet,
    })

  const onActivity = () => openActivity()

  return (
    <div className="halliday-container">
      <h1>Halliday SDK Wagmi Rainbowkit Example</h1>
      <button onClick={onConnect}>Connect</button>
      <button disabled={!enabled} onClick={onDeposit}>Deposit with Halliday</button>
      <button disabled={!enabled} onClick={onWithdraw}>Withdraw</button>
      <button disabled={!enabled} onClick={onActivity}>Activity</button>
    </div>
  )
}
