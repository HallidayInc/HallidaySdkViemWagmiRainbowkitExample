import { useEffect } from 'react'
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi'
import { base } from 'wagmi/chains'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { openHallidayPayments, initializeClient } from '@halliday-sdk/payments'
import { connectWalletClient } from '@halliday-sdk/payments/viem'

const HALLIDAY_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY
const hallidayOutputs = [
  'base:0x',
  'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
]

export default function App() {
  const { isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChainAsync } = useSwitchChain()

  useEffect(() => {
    initializeClient({
      apiKey: HALLIDAY_API_KEY,
      outputs: hallidayOutputs,
      onReady: () => console.log('Halliday preloaded and ready'),
      onError: (error) => console.error('Halliday init error:', error),
    })
  }, [])

  const launchHalliday = async () => {
    if (!walletClient) return
    const wallet = connectWalletClient(() => walletClient)
    await switchChainAsync({ chainId: base.id })
    openHallidayPayments({
      apiKey: HALLIDAY_API_KEY,
      outputs: hallidayOutputs,
      funder: wallet,
      userWallet: wallet,
    })
  }

  return (
    <div>
      <h1>Halliday SDK Example</h1>
      {!isConnected && <p>Connect your wallet to get started</p>}
      <div className="connect-wallet"><ConnectButton /></div>
      {isConnected && (
        <button className="open-halliday" onClick={launchHalliday}>
          Open Halliday
        </button>
      )}
    </div>
  )
}
