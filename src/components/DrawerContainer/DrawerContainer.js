import React from 'react'
import { View } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { connect } from 'react-redux'
import DrawerItem from '../DrawerItem/DrawerItem'
import { logout } from '../../Core/onboarding/redux/auth'
import dynamicStyles from './styles'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'

function DrawerContainer(props) {
  const { navigation } = props
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const authManager = useAuth()

  const onLogout = async () => {
    authManager.logout(props.user)
    props.logout()
    navigation.navigate('LoadScreen')
  }

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <DrawerItem
          title={localized('Home')}
          source={theme.icons.homeUnfilled}
          onPress={() => {
            navigation.navigate('Feed')
          }}
        />
        <DrawerItem
          title={localized('Explore')}
          source={theme.icons.search}
          onPress={() => {
            navigation.navigate('Discover')
          }}
        />
        <DrawerItem
          title={localized('Direct Messages')}
          source={theme.icons.commentUnfilled}
          onPress={() => {
            navigation.navigate('Chat')
          }}
        />
        <DrawerItem
          title={localized('People')}
          source={theme.icons.friendsUnfilled}
          onPress={() => {
            navigation.navigate('Friends')
          }}
        />
        <DrawerItem
          title={localized('Profile')}
          source={theme.icons.profileUnfilled}
          onPress={() => {
            navigation.navigate('Profile')
          }}
        />
        <DrawerItem
          title={localized('Logout')}
          source={theme.icons.logout}
          onPress={onLogout}
        />
      </View>
    </View>
  )
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  }
}

export default connect(mapStateToProps, {
  logout,
})(DrawerContainer)
