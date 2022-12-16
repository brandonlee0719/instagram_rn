import { StyleSheet } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'

const styles = (theme, appearance) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    //
    navBarContainer: {
      flexDirection: 'row',
      position: 'absolute',
      justifyContent: 'center',
      ...ifIphoneX(
        {
          top: 50,
        },
        {
          top: 12,
        },
      ),
      paddingVertical: 10,
      // height: 25,
      width: '100%',
      paddingHorizontal: 10,
      backgroundColor: theme.colors[appearance].primaryBackground,
      zIndex: 1,
    },
    navBarTitleContainer: {
      flex: 5,
    },
    leftButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      color: theme.colors[appearance].primaryForeground,
      fontWeight: '600',
    },
    // GooglePlacesAutocomplete
    placesAutocompleteContainer: {
      ...ifIphoneX(
        {
          marginTop: 46,
        },
        {
          marginTop: 50,
        },
      ),
      height: '50%',
      backgroundColor: theme.colors[appearance].grey0,
    },
    placesAutocompleteTextInputContainer: {
      width: '100%',
      backgroundColor: theme.colors[appearance].hairline,
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
    placesAutocompleteTextInput: {
      backgroundColor: theme.colors[appearance].primaryBackground,
      color: theme.colors[appearance].primaryText,
    },
    placesAutocompletedDescription: {
      fontWeight: '400',
      color: theme.colors[appearance].secondaryText,
    },
    predefinedPlacesDescription: {
      color: theme.colors[appearance].secondaryText,
    },
    predefinedPlacesPoweredContainer: {
      backgroundColor: theme.colors[appearance].primaryBackground,
    },
    mapContainer: {
      width: '100%',
      height: '39%',
      backgroundColor: theme.colors[appearance].grey0,
    },
  })
}

export default styles
