import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    topContainer: {
      flex: 1,
    },
    headerContainer: {
      flexDirection: 'row',
      flex: 4.2,
    },
    titleContainer: {
      marginTop: 19,
    },
    title: {
      color: theme.colors[appearance].primaryText,
      fontSize: 15,
      fontWeight: '600',
    },
    subtitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 10,
    },
    postInputContainer: {
      flex: 6,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    postInput: {
      height: '90%',
      width: '90%',
      color: theme.colors[appearance].primaryText,
    },
    bottomContainer: {
      flex: 0.5,
      justifyContent: 'flex-end',
    },
    blankBottom: {
      ...ifIphoneX(
        {
          flex: 1.1,
        },
        {
          flex: 1.4,
        },
      ),
    },
    postImageAndLocationContainer: {
      width: '100%',
      backgroundColor: theme.colors[appearance].grey0,
    },
    imagesContainer: {
      width: '100%',
      marginBottom: 23,
    },
    imageItemcontainer: {
      width: 65,
      height: 65,
      margin: 3,
      marginTop: 5,
      borderRadius: 9,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'grey',
      overflow: 'hidden',
    },
    imageItem: {
      width: '100%',
      height: '100%',
    },
    addImageIcon: {
      width: '50%',
      height: '50%',
    },
    addTitleAndlocationIconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    addTitleContainer: {
      flex: 5.8,
      justifyContent: 'center',
    },
    addTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 13,
      padding: 8,
    },
    iconsContainer: {
      flex: 3,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    iconContainer: {
      height: 50,
      width: 50,
      marginHorizontal: 2,
    },
    icon: {
      height: 23,
      width: 23,
    },
    imageBackground: {
      backgroundColor: theme.colors[appearance].primaryForeground,
    },
    cameraFocusTintColor: {
      tintColor: theme.colors[appearance].primaryForeground,
    },
    cameraUnfocusTintColor: {
      tintColor: theme.colors[appearance].primaryText,
    },
    pinpointTintColor: {
      tintColor: theme.colors[appearance].primaryText,
    },
  })
}

export default dynamicStyles
