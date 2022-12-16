import { Dimensions } from 'react-native'
import { StyleSheet } from 'react-native'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export const feedItemHeight = Math.floor(deviceHeight * 0.516)

const dynamicStyles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      height: feedItemHeight,
      width: deviceWidth * 0.97,
      marginBottom: 1,
      alignItems: 'center',
    },
    fieldLayoutContainer: {
      height: '100%',
      width: '100%',
    },
    image: {
      height: '100%',
      width: '100%',
    },
    columnCells: {
      height: deviceHeight * 0.332,
      width: '100%',
      flexDirection: 'row',
      marginTop: 1,
    },
    largeCell: {
      flex: 3.8,
      marginRight: 1,
    },
    smallCellColumnContainer: {
      flex: 1.9,
      justifyContent: 'space-between',
    },
    mediaContainer: {
      height: deviceHeight * 0.18,
      flex: 1,
      marginRight: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mediaFieldLayoutContainer: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    media: {
      height: '100%',
      width: '100%',
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
  })
}
export default dynamicStyles
