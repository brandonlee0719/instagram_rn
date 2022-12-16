import React, { useMemo } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { useTheme } from 'dopenative'
import GridCellContainer from './GridCellContainer/GridCellContainer'
import PropTypes from 'prop-types'
import dynamicStyles from './styles'
import { feedItemHeight as ITEM_HEIGHT } from './GridCellContainer/styles'
import { TNEmptyStateView } from '../../../Core/truly-native'

function Explore(props) {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const {
    feed,
    onMediaPress,
    loading,
    videoResizeMode,
    handleOnEndReached,
    pullToRefreshConfig,
    isLoadingBottom,
    emptyStateConfig,
  } = props

  const { onRefresh, refreshing } = pullToRefreshConfig

  const formattedFeed = useMemo(() => {
    if (!feed?.length) {
      return []
    }

    let handlerArr = []
    const formatedData = []
    let isRight = true
    feed.forEach((item, index) => {
      if (!item.postMedia?.length) {
        return
      }
      if (handlerArr.length < 6) {
        handlerArr.push({ item, index })
      }

      if (handlerArr.length === 6 || index === feed.length - 1) {
        formatedData.push({
          id: feed[index].id,
          data: handlerArr,
          isRight,
        })
        handlerArr = []
        isRight = !isRight
      }
    })
    return formatedData
  }, [feed?.length])

  const renderListFooter = () => {
    return (
      <ActivityIndicator
        animating={isLoadingBottom}
        style={{ marginVertical: 7 }}
        size="small"
      />
    )
  }

  const renderItem = ({ index, item }) => {
    return (
      <GridCellContainer
        key={item.id || index + ''}
        index={index}
        item={item}
        onPress={onMediaPress}
        videoResizeMode={videoResizeMode}
      />
    )
  }

  if (loading) {
    return (
      <View style={styles.feedContainer}>
        <ActivityIndicator style={{ marginTop: 15 }} size="small" />
      </View>
    )
  }

  const renderEmptyComponent = () => {
    return (
      <TNEmptyStateView
        style={styles.emptyStateView}
        emptyStateConfig={emptyStateConfig}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Explore grid container */}
      <FlatList
        scrollEventThrottle={16}
        data={formattedFeed}
        contentContainerStyle={
          formattedFeed?.length && styles.flatListContainer
        }
        keyExtractor={(keyItem, index) => keyItem.id + `${index}`}
        renderItem={renderItem}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        onEndReachedThreshold={0.5}
        onEndReached={handleOnEndReached}
        onRefresh={onRefresh}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  )
}

Explore.propTypes = {
  data: PropTypes.array,
  onPress: PropTypes.func,
}

export default Explore
