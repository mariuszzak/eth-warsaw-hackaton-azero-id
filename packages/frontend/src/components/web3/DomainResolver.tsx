import { Button, Card, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { ContractIds } from '@deployments/deployments'
import { useInkathon, useRegisteredContract } from '@scio-labs/use-inkathon'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import {
  SupportedChainId,
  resolveAddressToDomain,
  resolveDomainToAddress,
} from '@azns/resolver-core'
import { type } from 'os'

export const GreeterContractInteractions: FC = () => {
  type returnedValue = {
    value: string
    status: 'SUCCESS' | 'ERROR'
  }
  const [resolvedAddress, setResolvedAddress] = useState<returnedValue>()
  const [resolvedDomain, setResolvedDomain] = useState<returnedValue>()
  const [resolveAddressLoading, setResolveAddressLoading] = useState<boolean>()
  const [resolveDomainLoading, setResolveDomainLoading] = useState<boolean>()
  const form = useForm<{ address: string; domain: string }>()

  const resolveAddress = async () => {
    const address = form.getValues('address')

    setResolveAddressLoading(true)
    try {
      const { primaryDomain: resolvedAddress, error } = await resolveAddressToDomain(address, {
        chainId: SupportedChainId.AlephZeroTestnet,
      })

      if (error) {
        setResolvedAddress({ value: error?.message, status: 'ERROR' })
      } else if (resolvedAddress == null) {
        setResolvedAddress({ value: 'Address is not registered', status: 'ERROR' })
      } else if (resolvedAddress) {
        setResolvedAddress({ value: resolvedAddress, status: 'SUCCESS' })
      }

      form.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setResolveAddressLoading(false)
    }
  }

  const resolveDomain = async () => {
    const domain = form.getValues('domain')

    setResolveDomainLoading(true)
    try {
      const { address: resolvedAddress, error } = await resolveDomainToAddress(domain, {
        chainId: SupportedChainId.AlephZeroTestnet,
      })

      if (error) {
        setResolvedDomain({ value: error?.message, status: 'ERROR' })
      } else if (resolvedAddress == null) {
        setResolvedDomain({ value: 'Domain is not registered', status: 'ERROR' })
      } else if (resolvedAddress) {
        setResolvedDomain({ value: resolvedAddress, status: 'SUCCESS' })
      }

      form.reset()
    } catch (e) {
      console.error(e)
    } finally {
      setResolveDomainLoading(false)
    }
  }

  return (
    <>
      <div tw="flex grow flex-col space-y-4 max-w-[20rem]">
        <h2 tw="text-center font-mono text-gray-400">Resolve domain to address and vice versa</h2>

        {
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmitCapture={(e) => e.preventDefault()} onSubmit={resolveAddress}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Enter address</FormLabel>
                  <Input
                    placeholder="5EFJEY4DG2..."
                    disabled={resolveAddressLoading}
                    {...form.register('address')}
                  />
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="purple"
                  isLoading={resolveAddressLoading}
                  disabled={resolveAddressLoading}
                  type="button"
                  onClick={resolveAddress}
                >
                  Submit
                </Button>
              </Stack>
              {resolvedAddress && (
                <div style={{ marginTop: '10px' }}>
                  <FormLabel>Resolved address</FormLabel>
                  <Input
                    value={resolvedAddress.value}
                    disabled
                    color={resolvedAddress.status === 'SUCCESS' ? 'lime' : 'red'}
                    border={
                      resolvedAddress.status === 'SUCCESS' ? '1px solid lime' : '1px solid red'
                    }
                  />
                </div>
              )}
            </form>
          </Card>
        }

        {
          <Card variant="outline" p={4} bgColor="whiteAlpha.100">
            <form onSubmitCapture={(e) => e.preventDefault()} onSubmit={resolveDomain}>
              <Stack direction="row" spacing={2} align="end">
                <FormControl>
                  <FormLabel>Enter domain</FormLabel>
                  <Input
                    placeholder="domains.tzero"
                    disabled={resolveDomainLoading}
                    {...form.register('domain')}
                  />
                </FormControl>
                <Button
                  mt={4}
                  colorScheme="purple"
                  isLoading={resolveDomainLoading}
                  disabled={resolveDomainLoading}
                  type="button"
                  onClick={resolveDomain}
                >
                  Submit
                </Button>
              </Stack>
              {resolvedDomain && (
                <div style={{ marginTop: '10px' }}>
                  <FormLabel>Resolved domain</FormLabel>
                  <Input
                    value={resolvedDomain.value}
                    disabled
                    color={resolvedDomain.status === 'SUCCESS' ? 'lime' : 'red'}
                    border={
                      resolvedDomain.status === 'SUCCESS' ? '1px solid lime' : '1px solid red'
                    }
                  />
                </div>
              )}
            </form>
          </Card>
        }
      </div>
    </>
  )
}
