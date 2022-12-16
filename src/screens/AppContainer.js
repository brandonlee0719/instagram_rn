import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from '../navigators/RootNavigator'

const RootStack = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

export default RootStack
