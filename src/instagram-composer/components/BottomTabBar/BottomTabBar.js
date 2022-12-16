import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

const titles = ['Library', 'Photo', 'Video']

export default function BottomTabBar(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const { focusedIndex, onPress } = props

  const renderTabTitle = (title, index) => {
    const isFocused = focusedIndex === index
    return (
      <TouchableOpacity
        onPress={() => onPress(index)}
        key={index + ''}
        activeOpacity={1}
        style={styles.titleContainer}>
        <Text style={[styles.title, isFocused && styles.titleFocused]}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {titles.map((title, index) => renderTabTitle(title, index))}
    </View>
  )
}
