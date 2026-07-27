import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { http, WagmiProvider } from 'wagmi'
import { mainnet, base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { HallidayPaymentsProvider } from '@halliday-sdk/payments/react'
import App from './App.jsx'

const HALLIDAY_API_KEY = import.meta.env.VITE_HALLIDAY_API_KEY

if (!HALLIDAY_API_KEY) {
  alert('VITE_HALLIDAY_API_KEY is missing!')
}

// Native ETH and USDC on Base
const tokens = ['base:0x', 'base:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913']

const wagmiConfig = getDefaultConfig({
  appName: 'Halliday SDK Example',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http('https://cloudflare-eth.com'),
    [base.id]: http('https://mainnet.base.org'),
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider>
          <HallidayPaymentsProvider
            apiKey={HALLIDAY_API_KEY}
            deposit={{ outputs: tokens }}
          >
            <App />
          </HallidayPaymentsProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
