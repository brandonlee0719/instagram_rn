import { Dimensions, StyleSheet } from 'react-native'

const dynamicStyles = (theme, appearance) => {
  const windowWidth = Dimensions.get('window').width
  const windowHeight = Dimensions.get('window').height
  const reactionIconSize = Math.floor(windowWidth * 0.09)
  const imageWidth = 34

  return StyleSheet.create({
    container: {
      width: '100%',
      alignSelf: 'center',
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    headerContainer: {
      flexDirection: 'row',
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
      margin: 2,
    },
    userImageMainContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    textContainer: {
      flex: 6,
      marginTop: 10,
      justifyContent: 'center',
    },
    mainSubtitleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    subtitleContainer: {
      flex: 1.3,
    },
    title: {
      color: theme.colors[appearance].primaryText,
      fontSize: 14,
      fontWeight: '600',
    },
    subtitle: {
      color: theme.colors[appearance].secondaryText,
      fontSize: 11,
    },
    body: {
      color: theme.colors[appearance].primaryText,
      fontSize: 12,
      lineHeight: 18,
      paddingBottom: 7,
      paddingHorizontal: 12,
    },
    moreText: {
      color: theme.colors[appearance].primaryForeground,
      fontSize: 9,
      lineHeight: 18,
      paddingBottom: 15,
      paddingHorizontal: 12,
    },
    moreIconContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    moreIcon: {
      height: 18,
      width: 18,
      tintColor: theme.colors[appearance].secondaryText,
      margin: 0,
    },
    bodyTitleContainer: {
      marginHorizontal: 8,
    },
    bodyImageContainer: {
      height: windowHeight * 0.5,
    },
    bodyImage: {
      height: '100%',
      width: '100%',
      backgroundColor: theme.colors[appearance].grey0,
    },
    inactiveDot: {
      backgroundColor: 'rgba(255,255,255,.3)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: '#fff',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    reactionContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors[appearance].primaryBackground,
      position: 'absolute',
      bottom: 2,
      width: Math.floor(windowWidth * 0.68),
      height: 48,
      borderRadius: Math.floor(windowWidth * 0.07),
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 2,
    },
    reactionIconContainer: {
      margin: 3,
      padding: 0,
      backgroundColor: 'powderblue',
      width: reactionIconSize,
      height: reactionIconSize,
      borderRadius: reactionIconSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactionIcon: {
      width: reactionIconSize,
      height: reactionIconSize,
      margin: 0,
    },
    footerContainer: {
      flexDirection: 'row',
    },
    footerIconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    footerIcon: {
      margin: 3,
      height: 25,
      width: 25,
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
    tintColor: { tintColor: theme.colors[appearance].primaryText },
    verifiedIcon: {
      width: 18,
      height: 18,
      marginLeft: 3,
    },
    verifiedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
}

export default dynamicStyles
