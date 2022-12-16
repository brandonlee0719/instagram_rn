import React, { useRef, memo, useMemo } from 'react'
import { View } from 'react-native'
import { useTheme } from 'dopenative'
import PropTypes from 'prop-types'
import FeedMedia from '../../../FeedItem/FeedMedia'
import dynamicStyles from './styles'

const GridCellContainer = props => {
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const gridItem = useMemo(() => {
    const { isRight, data } = props.item

    const topRowData = []
    const leftColumnData = []
    const rightColumnData = []
    let largeRightCellData = null
    let largeLeftCellData = null

    data?.map((item, index) => {
      if (index < 3) {
        topRowData.push(item)
      }

      if (isRight) {
        if (index === 3 || index === 5) {
          leftColumnData.push(item)
        }
        if (index === 4) {
          largeRightCellData = item
        }
      }
      if (!isRight) {
        if (index === 3) {
          largeLeftCellData = item
        }
        if (index === 4 || index === 5) {
          rightColumnData.push(item)
        }
      }
    })

    return {
      topRowData,
      leftColumnData,
      rightColumnData,
      largeRightCellData,
      largeLeftCellData,
    }
  }, [props.item.id])

  const renderSmallCell = ({ item }, { isLastItem, isLeft }) => {
    return (
      <FeedMedia
        key={item.id + ''}
        index={item.index}
        onMediaPress={props.onPress}
        media={item.postMedia && item.postMedia[0]}
        item={item}
        mediaCellcontainerStyle={[
          styles.mediaContainer,
          isLeft && { marginBottom: 1 },
          isLastItem && { marginRight: 0, marginBottom: 0 },
        ]}
        mediaContainerStyle={styles.mediaFieldLayoutContainer}
        mediaStyle={styles.media}
        dynamicStyles={styles}
        videoResizeMode={props.videoResizeMode}
        showVideo={false}
      />
    )
  }

  const leftLargeCell = () => {
    return (
      <View style={styles.columnCells}>
        {gridItem.largeLeftCellData && (
          <FeedMedia
            key={props.index + ''}
            index={gridItem.largeLeftCellData.index}
            onMediaPress={props.onPress}
            media={
              gridItem.largeLeftCellData.item.postMedia &&
              gridItem.largeLeftCellData.item.postMedia[0]
            }
            item={gridItem.largeLeftCellData.item}
            mediaCellcontainerStyle={styles.largeCell}
            mediaContainerStyle={[
              styles.fieldLayoutContainer,
              { marginRight: 1 },
            ]}
            mediaStyle={styles.media}
            dynamicStyles={styles}
            videoResizeMode={props.videoResizeMode}
            showVideo={false}
          />
        )}

        <View style={styles.smallCellColumnContainer}>
          {gridItem.rightColumnData?.map(({ item }, index) => {
            return renderSmallCell(
              { item, index },
              {
                isLastItem: gridItem.rightColumnData.length - 1 === index,
                isLeft: true,
              },
            )
          })}
        </View>
      </View>
    )
  }

  const rightLargeCell = () => {
    return (
      <View style={styles.columnCells}>
        <View style={styles.smallCellColumnContainer}>
          {gridItem.leftColumnData?.map(({ item }, index) => {
            return renderSmallCell(
              { item, index },
              {
                isLastItem: gridItem.leftColumnData.length - 1 === index,
                isLeft: true,
              },
            )
          })}
        </View>
        {gridItem.largeRightCellData && (
          <FeedMedia
            key={props.index + ''}
            index={gridItem.largeRightCellData.index}
            onMediaPress={props.onPress}
            media={
              gridItem.largeRightCellData.item.postMedia &&
              gridItem.largeRightCellData.item.postMedia[0]
            }
            item={gridItem.largeRightCellData.item}
            mediaCellcontainerStyle={[styles.largeCell, { marginRight: 2 }]}
            mediaContainerStyle={[
              styles.fieldLayoutContainer,
              { marginLeft: 1 },
            ]}
            mediaStyle={styles.media}
            dynamicStyles={styles}
            videoResizeMode={props.videoResizeMode}
            showVideo={false}
          />
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {gridItem.topRowData?.map(({ item }, index) => {
          return renderSmallCell(
            { item, index },
            {
              isLastItem: null,
              isLeft: null,
            },
          )
        })}
      </View>
      {props.item.isRight === false && leftLargeCell()}
      {props.item.isRight === true && rightLargeCell()}
    </View>
  )
}

export default memo(GridCellContainer)
