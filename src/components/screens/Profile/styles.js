import { Dimensions, StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const imageWidth = windowWidth / 4.0

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey0,
      alignItems: 'center',
    },
    progressBar: {
      backgroundColor: theme.colors[appearance].primaryForeground,
      height: 3,
      shadowColor: '#000',
      width: 0,
    },
    subContainer: {
      flex: 1,
      backgroundColor: theme.colors[appearance].grey0,
      alignItems: 'center',
      // width: '100%',
    },
    userCardContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      // width: '100%',
    },
    countItemsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    countContainer: {
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userImage: {
      width: imageWidth,
      height: imageWidth,
      borderRadius: Math.floor(imageWidth / 2),
      borderWidth: 0,
    },
    userImageContainer: {
      width: imageWidth,
      height: imageWidth,
      borderWidth: 0,
      margin: 18,
    },
    userImageMainContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    count: {
      color: theme.colors[appearance].primaryText,
      fontSize: 15,
      fontWeight: '600',
    },
    countTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 14,
      fontWeight: '400',
    },
    userName: {
      fontSize: 13,
      textAlign: 'center',
      fontWeight: '600',
      color: theme.colors[appearance].primaryText,
      // paddingTop: 15,
    },
    profileSettingsButtonContainer: {
      width: '92%',
      height: 40,
      borderRadius: 8,
      backgroundColor: theme.colors[appearance].primaryForeground,
      marginVertical: 9,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileSettingsTitle: {
      color: theme.colors[appearance].primaryBackground,
      fontSize: 13,
      fontWeight: '600',
    },
    gridItemContainer: {
      height: Math.floor(windowHeight * 0.18),
      width: Math.floor(windowWidth * 0.318),
      backgroundColor: theme.colors[appearance].primaryBackground,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      margin: 2,
    },
    gridItemImage: {
      height: '100%',
      width: '100%',
    },
    FriendsTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 20,
      fontWeight: '600',
      alignSelf: 'flex-start',
      padding: 10,
    },
    FriendsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '98%',
    },
    friendCardContainer: {
      height: Math.floor(windowHeight * 0.18),
      width: Math.floor(windowWidth * 0.292),
      borderRadius: Math.floor(windowWidth * 0.013),
      backgroundColor: theme.colors[appearance].primaryBackground,
      justifyContent: 'flex-start',
      overflow: 'hidden',
      margin: 5,
    },
    friendCardImage: {
      height: '75%',
      width: '100%',
    },
    friendCardTitle: {
      color: theme.colors[appearance].primaryText,
      fontSize: 13,
      padding: 4,
    },
    subButtonColor: {
      backgroundColor: appearance === 'dark' ? '#20242d' : '#eaecf0',
    },
    mediaVideoLoader: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    centerItem: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIconContainer: {
      position: 'absolute',
      backgroundColor: 'transparent',
      bottom: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    soundIcon: {
      tintColor: '#fff',
      width: 19,
      height: 19,
    },
    titleStyleColor: { color: theme.colors[appearance].primaryText },
  })
}

export default dynamicStyles
