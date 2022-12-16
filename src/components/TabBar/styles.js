import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    tabBarContainer: {
      ...ifIphoneX(
        {
          height: 80,
        },
        {
          height: 45,
        },
      ),
      backgroundColor: theme.colors[appearance].primaryBackground,
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: theme.colors[appearance].hairline,
    },
    tabContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabIcon: {
      ...ifIphoneX(
        {
          width: 25,
          height: 25,
        },
        {
          width: 22,
          height: 22,
        },
      ),
    },
    focusTintColor: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    unFocusTintColor: {
      tintColor: theme.colors[appearance].grey6,
    },
  })
}

export default dynamicStyles
