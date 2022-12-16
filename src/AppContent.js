import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import * as FacebookAds from 'expo-ads-facebook'
import { OnboardingConfigProvider } from './Core/onboarding/hooks/useOnboardingConfig'
import AppContainer from './screens/AppContainer'
import { useConfig } from './config'
import { ProfileConfigProvider } from './Core/profile/hooks/useProfileConfig'

const MainNavigator = 
  AppContainer

export default AppContent = () => {
  const config = useConfig()

  useEffect(() => {
    if (config.adsConfig) {
      FacebookAds.AdSettings.addTestDevice(
        FacebookAds.AdSettings.currentDeviceHash,
      )
      FacebookAds.AdSettings.setLogLevel('debug')
    }
  }, [])

  return (
    <ProfileConfigProvider config={config}>
      <OnboardingConfigProvider config={config}>
        <StatusBar />
        <MainNavigator />
      </OnboardingConfigProvider>
    </ProfileConfigProvider>
  )
}
