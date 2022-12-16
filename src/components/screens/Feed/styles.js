import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    feedContainer: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey0,
    },
    emptyStateView: {
      marginTop: 80,
    },
  })
}

export default dynamicStyles
