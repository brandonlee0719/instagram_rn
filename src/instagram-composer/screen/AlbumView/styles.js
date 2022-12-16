import { Dimensions, StyleSheet } from 'react-native'

const { width } = Dimensions.get('window')

const styles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    mediaViewContainer: {
      flex: 6,
    },
    mediaView: {
      width: '100%',
      height: '100%',
    },
    mediaContainer: {
      flex: 4,
      // alignItems: 'center',
    },
  })
}

export default styles
