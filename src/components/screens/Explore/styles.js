import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      flex: 1,
    },
    feedContainer: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey0,
    },
    emptyStateView: {
      marginTop: '60%',
    },
    flatListContainer: {
      alignItems: 'center',
    },
  })
}

export default dynamicStyles
