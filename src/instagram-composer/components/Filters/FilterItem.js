import React, { useRef } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function FilterItem(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const {
    item,
    source,
    FilterComponent,
    onFilterSelect,
    originalSource,
    index,
  } = props
  const extractedUri = useRef()

  const onExtractImage = ({ nativeEvent }) => {
    extractedUri.current = nativeEvent.uri
  }

  const getItemNormalFilter = item => {
    const gottenSource = originalSource.find(file => {
      return file.filename === item.filename
    })

    if (gottenSource) {
      return gottenSource
    } else {
      return source
    }
  }

  const normalSource = getItemNormalFilter(source)

  const onPress = () => {
    if (item.title === 'Normal') {
      onFilterSelect(normalSource.uri)
    } else {
      onFilterSelect(extractedUri.current)
    }
  }

  const image = (
    <Image style={styles.filterItemImage} source={{ uri: normalSource.uri }} />
  )

  return (
    <TouchableOpacity
      key={index + ''}
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.filterItemContainer}>
      <Text style={styles.filterItemTitle}>{item.title}</Text>
      <View style={styles.filterItemImageContainer}>
        {item.title === 'Normal' ? (
          image
        ) : (
          <FilterComponent
            extractImageEnabled={true}
            image={image}
            onExtractImage={onExtractImage}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}
