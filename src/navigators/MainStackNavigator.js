import { Platform } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useTranslations } from 'dopenative'
import DrawerNavigator from './DrawerNavigator'
import BottomTabNavigator from './BottomTabNavigator'
import useNotificationOpenedApp from '../Core/helpers/notificationOpenedApp'
import React from 'react'
import { DetailPostScreen, ProfileScreen } from '../screens'
import { IMChatScreen, IMViewGroupMembersScreen } from '../Core/chat'
import { IMNotificationScreen } from '../Core/notifications'
import {
  IMProfileSettingsScreen,
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from '../Core/profile'
import { IMAllFriendsScreen } from '../Core/socialgraph/friendships'

const Stack = createStackNavigator()

const MainStackNavigator = () => {
  const { localized } = useTranslations()
  useNotificationOpenedApp()
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: localized('Back'),
      }}
      initialRouteName="NavStack"
      headerMode="float">
      <Stack.Screen
        options={{ headerShown: false }}
        name="NavStack"
        component={Platform.OS === 'ios' ? BottomTabNavigator : DrawerNavigator}
      />
      <Stack.Screen
        options={{
          title: localized('Post'),
        }}
        name="MainDetailPost"
        component={DetailPostScreen}
      />
      <Stack.Screen name="MainProfile" component={ProfileScreen} />
      <Stack.Screen name="Notification" component={IMNotificationScreen} />
      <Stack.Screen
        name="ProfileSettings"
        component={IMProfileSettingsScreen}
      />
      <Stack.Screen name="EditProfile" component={IMEditProfileScreen} />
      <Stack.Screen name="AppSettings" component={IMUserSettingsScreen} />
      <Stack.Screen name="ContactUs" component={IMContactUsScreen} />
      <Stack.Screen name="AllFriends" component={IMAllFriendsScreen} />
      <Stack.Screen
        name="MainProfilePostDetails"
        component={DetailPostScreen}
      />
      <Stack.Screen name="PersonalChat" component={IMChatScreen} />
      <Stack.Screen
        name="ViewGroupMembers"
        component={IMViewGroupMembersScreen}
      />
    </Stack.Navigator>
  )
}

export default MainStackNavigator
