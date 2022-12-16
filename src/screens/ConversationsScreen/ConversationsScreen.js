import React, { useLayoutEffect } from 'react'
import { useTheme, useTranslations } from 'dopenative'
import ConversationsHomeComponent from './ConversationsHomeComponent'
import { Platform } from 'react-native'
import { TNTouchableIcon } from '../../Core/truly-native'
import { useCurrentUser } from '../../Core/onboarding'

const ConversationsScreen = props => {
  const { navigation } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    navigation.setOptions({
      headerTitle: localized('Messages'),
      headerRight: () => (
        <TNTouchableIcon
          imageStyle={{ tintColor: colorSet.primaryText }}
          iconSource={theme.icons.inscription}
          onPress={() => navigation.navigate('CreateGroup')}
        />
      ),
      headerLeft: () =>
        Platform.OS === 'android' && (
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryText }}
            iconSource={theme.icons.menuHamburger}
            onPress={navigation.openDrawer}
          />
        ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [currentUser])

  const onEmptyStatePress = () => {
    navigation.navigate('Friends')
  }

  openDrawer = () => {
    navigation.openDrawer()
  }

  const emptyStateConfig = {
    title: localized('No Conversations'),
    description: localized(
      'Start chatting with the people you follow. Your conversations will show up here.',
    ),
    buttonName: localized('Find friends'),
    onPress: onEmptyStatePress,
  }

  return (
    <ConversationsHomeComponent
      navigation={navigation}
      emptyStateConfig={emptyStateConfig}
    />
  )
}

export default ConversationsScreen
