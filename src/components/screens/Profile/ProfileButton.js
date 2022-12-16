import React from 'react'
import PropTypes from 'prop-types'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function ProfileButton(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)
  const { containerStyle, titleStyle, title, onPress, disabled } = props

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.profileSettingsButtonContainer, containerStyle]}>
      <Text style={[styles.profileSettingsTitle, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

ProfileButton.propTypes = {
  onPress: PropTypes.func,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  activeOpacity: PropTypes.number,
}
