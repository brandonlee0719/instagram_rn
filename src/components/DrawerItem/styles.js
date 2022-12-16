import { StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    btnClickContain: {
      flexDirection: 'row',
      padding: 5,
      marginTop: 5,
      marginBottom: 5,
    },
    btnContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    btnIcon: {
      tintColor: theme.colors[appearance].primaryText,
      height: 25,
      width: 25,
    },
    btnText: {
      fontSize: 15,
      marginLeft: 18,
      marginTop: 2,
      color: theme.colors[appearance].primaryText,
    },
  })
}

export default dynamicStyles
