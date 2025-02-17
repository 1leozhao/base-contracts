import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { ChakraProvider, Box, Button, Input, Text, VStack, Heading, useToast, Container } from '@chakra-ui/react'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config'
import './App.css'

function App() {
  const [account, setAccount] = useState('')
  const [value, setValue] = useState('')
  const [storedValue, setStoredValue] = useState('0')
  const [loading, setLoading] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState(null)
  const toast = useToast()

  // Initialize provider
  useEffect(() => {
    const initProvider = () => {
      // Prioritize MetaMask if available
      if (window.ethereum?.isMetaMask) {
        setProvider(window.ethereum)
      } else if (window.ethereum) {
        // If multiple wallets, ask user to use MetaMask
        toast({
          title: 'Multiple Wallets Detected',
          description: 'Please use MetaMask for the best experience',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        setProvider(window.ethereum)
      }
    }

    initProvider()
  }, [toast])

  const addBaseSepoliaNetwork = async () => {
    if (!provider) return false
    
    try {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x14a34',
            chainName: 'Base Sepolia',
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.base.org'],
            blockExplorerUrls: ['https://sepolia.basescan.org']
          }
        ]
      })
      return true
    } catch (error) {
      console.error('Error adding network:', error)
      return false
    }
  }

  const switchToBaseSepolia = async () => {
    if (!provider) return false

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }]
      })
      return true
    } catch (error) {
      if (error.code === 4902) {
        return addBaseSepoliaNetwork()
      }
      console.error('Error switching network:', error)
      return false
    }
  }

  const fetchStoredValue = useCallback(async () => {
    if (!provider || !account) return

    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, ethersProvider)
      const result = await contract.getValue()
      setStoredValue(result.toString())
    } catch (error) {
      console.error('Error fetching value:', error)
    }
  }, [account, provider])

  const connectWallet = async () => {
    if (isConnecting || !provider) return
    
    try {
      setIsConnecting(true)

      // Simple connection request first
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }).catch((error) => {
        throw new Error('Failed to connect wallet: ' + error.message)
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found')
      }

      // Try to switch network
      const networkSwitched = await switchToBaseSepolia()
      if (!networkSwitched) {
        throw new Error('Failed to switch to Base Sepolia network')
      }

      setAccount(accounts[0])
      
      toast({
        title: 'Connected',
        description: 'Wallet connected successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Connection error:', error)
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setAccount('')
    } finally {
      setIsConnecting(false)
    }
  }

  const updateValue = async () => {
    if (!provider || !account || !value) return
    
    try {
      setLoading(true)
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      const tx = await contract.setValue(value)
      
      toast({
        title: 'Transaction Sent',
        description: 'Waiting for confirmation...',
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
      
      await tx.wait()
      
      toast({
        title: 'Success',
        description: 'Value updated successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      await fetchStoredValue()
      setValue('')
    } catch (error) {
      console.error('Update error:', error)
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account) {
      fetchStoredValue()
    }
  }, [account, fetchStoredValue])

  useEffect(() => {
    if (!provider) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        setAccount('')
        setStoredValue('0')
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    provider.on('accountsChanged', handleAccountsChanged)
    provider.on('chainChanged', handleChainChanged)

    // Check if already connected
    provider.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        }
      })
      .catch(console.error)

    return () => {
      provider.removeListener('accountsChanged', handleAccountsChanged)
      provider.removeListener('chainChanged', handleChainChanged)
    }
  }, [provider])

  return (
    <ChakraProvider>
      <div className="container">
        <Container maxW="container.md" py={10}>
          <VStack spacing={8}>
            <Heading>SimpleStorage dApp</Heading>
            
            {!account ? (
              <Button 
                colorScheme="blue" 
                onClick={connectWallet}
                isLoading={isConnecting}
                loadingText="Connecting..."
                isDisabled={!provider}
              >
                {provider ? 'Connect Wallet' : 'Please Install MetaMask'}
              </Button>
            ) : (
              <Text>Connected: {account.slice(0, 6)}...{account.slice(-4)}</Text>
            )}

            <Box w="100%" p={6} borderWidth="1px" borderRadius="lg" bg="white" boxShadow="sm">
              <VStack spacing={4}>
                <Text fontSize="xl">Current Stored Value: {storedValue}</Text>
                
                <Input
                  placeholder="Enter new value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="number"
                />
                
                <Button
                  colorScheme="green"
                  onClick={updateValue}
                  isLoading={loading}
                  isDisabled={!account || !value}
                  loadingText="Updating..."
                  w="100%"
                >
                  Update Value
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Container>
      </div>
    </ChakraProvider>
  )
}

export default App
