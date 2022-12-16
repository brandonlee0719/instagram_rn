import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')

const styles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width,
      height: 60,
      flexDirection: 'row',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 17,
      color: appearance == 'dark' ? '#ffffff' : '#989898',
    },
    titleFocused: {
      color: appearance == 'dark' ? '#a6a6a6' : '#0d0d0d',
    },
  })
}

export default styles
