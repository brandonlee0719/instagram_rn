import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

const tabIcons = theme => {
  return {
    Feed: {
      focus: theme.icons.homefilled,
      unFocus: theme.icons.homeUnfilled,
    },
    Discover: {
      focus: theme.icons.search,
      unFocus: theme.icons.search,
    },
    Feed: {
      focus: theme.icons.homefilled,
      unFocus: theme.icons.homeUnfilled,
    },
    Chat: {
      focus: theme.icons.commentFilled,
      unFocus: theme.icons.commentUnfilled,
    },
    Friends: {
      focus: theme.icons.friendsFilled,
      unFocus: theme.icons.friendsUnfilled,
    },
    Profile: {
      focus: theme.icons.profileFilled,
      unFocus: theme.icons.profileUnfilled,
    },
  }
}

function Tab({ route, onPress, focus }) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const icons = tabIcons(theme)

  return (
    <TouchableOpacity style={styles.tabContainer} onPress={onPress}>
      <Image
        source={
          focus ? icons[route.routeName].focus : icons[route.routeName].unFocus
        }
        style={[
          styles.tabIcon,
          focus ? styles.focusTintColor : styles.unFocusTintColor,
        ]}
      />
    </TouchableOpacity>
  )
}

export default Tab
