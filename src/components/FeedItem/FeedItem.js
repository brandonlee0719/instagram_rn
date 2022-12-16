import React, { useState, useRef, useEffect } from 'react'
import { Dimensions, Image, Text, View, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-swiper'
import { useTheme, useTranslations } from 'dopenative'
import ActionSheet from 'react-native-actionsheet'
import TruncateText from 'react-native-view-more-text'
import { Viewport } from '@skele/components'
import { TNStoryItem, TNTouchableIcon } from '../../Core/truly-native'
import { IMRichTextView } from '../../Core/mentions'
import FeedMedia from './FeedMedia'
import dynamicStyles from './styles'
import { timeFormat } from '../../Core'

const ViewportAwareSwiper = Viewport.Aware(Swiper)
const windowHeight = Dimensions.get('window').height
const mediaHeight = windowHeight * 0.3

function FeedItem(props) {
  const {
    feedIndex,
    item,
    isLastItem,
    onCommentPress,
    containerStyle,
    onUserItemPress,
    shouldReSizeMedia,
    onReaction,
    onSharePost,
    onDeletePost,
    onUserReport,
    user,
    willBlur,
    shouldDisplayViewAllComments,
    onTextFieldUserPress,
    onTextFieldHashTagPress,
    playVideoOnLoad = false,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  let defaultReaction = 'heartUnfilled'

  const [postMediaIndex, setPostMediaIndex] = useState(0)
  const [inViewPort, setInViewPort] = useState(false)

  const [calcMediaHeight, setCalcMediaHeight] = useState(mediaHeight)
  const moreRef = useRef()
  const lastPress = useRef(0)

  // inline actions & counts
  const [reactionCount, setReactionCount] = useState(item.reactionsCount)
  const [selectedIcon, setSelectedIcon] = useState(
    item.myReaction ? 'filledHeart' : defaultReaction,
  )

  useEffect(() => {
    setSelectedIcon(item.myReaction ? 'filledHeart' : defaultReaction)
  }, [item?.myReaction])

  useEffect(() => {
    setReactionCount(item.reactionsCount)
  }, [item?.reactionsCount])

  const onReactionPress = async () => {
    // Optimistically update the UI right away for perceived performance reasons
    if (item.myReaction) {
      setSelectedIcon('heartUnfilled')
      if (reactionCount > 0) {
        setReactionCount(reactionCount - 1)
      }
    } else {
      setSelectedIcon('filledHeart')
      setReactionCount(reactionCount + 1)
    }
    onReaction('like', item)
  }

  const onMorePress = () => {
    moreRef.current.show()
  }

  const didPressComment = () => {
    onCommentPress(item, feedIndex)
  }

  const didPressMedia = async (filteredImages, index) => {
    const time = new Date().getTime()
    const delta = time - lastPress.current
    const DOUBLE_PRESS_DELAY = 400

    if (delta < DOUBLE_PRESS_DELAY && selectedIcon !== 'filledHeart') {
      const reationCountToUpdate = item.reactions['like']
      setSelectedIcon('filledHeart')
      setReactionCount(reactionCount + 1)
      onReaction('like', item)
    }
    lastPress.current = time
  }

  const moreArray = [localized('Share Post')]

  if (item.authorID === user.id) {
    moreArray.push(localized('Delete Post'))
  } else {
    moreArray.push(localized('Block User'))
    moreArray.push(localized('Report Post'))
  }

  moreArray.push(localized('Cancel'))

  const onMoreDialogDone = index => {
    if (index === moreArray.indexOf(localized('Share Post'))) {
      onSharePost(item)
    }

    if (
      index === moreArray.indexOf(localized('Report Post')) ||
      index === moreArray.indexOf(localized('Block User'))
    ) {
      onUserReport(item, moreArray[index])
    }

    if (index === moreArray.indexOf(localized('Delete Post'))) {
      onDeletePost(item)
    }
  }

  const inactiveDot = () => <View style={styles.inactiveDot} />

  const activeDot = () => <View style={styles.activeDot} />

  const renderViewMore = onPress => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {'more'}
      </Text>
    )
  }

  const renderViewLess = onPress => {
    return (
      <Text onPress={onPress} style={styles.moreText}>
        {'less'}
      </Text>
    )
  }

  const onMediaResize = ({ height }) => {
    const maxMediaHeight = Math.floor(windowHeight * 0.55)
    if (shouldReSizeMedia && height) {
      setCalcMediaHeight(height > maxMediaHeight ? maxMediaHeight : height)
    }
  }

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.9}
      onPress={didPressComment}
      style={[styles.container, containerStyle]}>
      <View style={styles.headerContainer}>
        <TNStoryItem
          imageStyle={styles.userImage}
          imageContainerStyle={styles.userImageContainer}
          containerStyle={styles.userImageMainContainer}
          item={item.author}
          onPress={onUserItemPress}
        />
        <View style={styles.textContainer}>
          {item.author && (
            <View style={styles.verifiedContainer}>
              <Text style={styles.title}>{item.author.firstName}</Text>
              {item.author.isVerified && (
                <Image
                  style={styles.verifiedIcon}
                  source={require('../../assets/icons/verified.png')}
                />
              )}
            </View>
          )}
          <View style={styles.mainSubtitleContainer}>
            <View style={[styles.subtitleContainer, { flex: 2 }]}>
              <Text style={styles.subtitle}>{item.location}</Text>
            </View>
          </View>
        </View>
        <TNTouchableIcon
          onPress={onMorePress}
          imageStyle={styles.moreIcon}
          containerStyle={styles.moreIconContainer}
          iconSource={theme.icons.more}
        />
      </View>
      {item.postMedia && item.postMedia.length > 0 && (
        <View style={{ height: calcMediaHeight }}>
          <ViewportAwareSwiper
            removeClippedSubviews={false}
            style={{ height: calcMediaHeight }}
            dot={inactiveDot()}
            activeDot={activeDot()}
            paginationStyle={{
              bottom: 20,
            }}
            onIndexChanged={swiperIndex => setPostMediaIndex(swiperIndex)}
            loop={false}
            onViewportEnter={() => setInViewPort(true)}
            onViewportLeave={() => setInViewPort(false)}
            preTriggerRatio={-0.4}>
            {item.postMedia.map((media, index) => (
              <FeedMedia
                key={index + ''}
                inViewPort={inViewPort}
                index={index}
                postMediaIndex={postMediaIndex}
                media={media}
                item={item}
                isLastItem={isLastItem}
                onMediaResize={onMediaResize}
                onMediaPress={didPressMedia}
                dynamicStyles={styles}
                willBlur={willBlur}
                playVideoOnLoad={playVideoOnLoad}
              />
            ))}
          </ViewportAwareSwiper>
        </View>
      )}
      <View style={styles.footerContainer}>
        <TNTouchableIcon
          containerStyle={styles.footerIconContainer}
          iconSource={theme.icons[selectedIcon]}
          imageStyle={[
            styles.footerIcon,
            selectedIcon === 'heartUnfilled' && styles.tintColor,
          ]}
          renderTitle={true}
          onPress={onReactionPress}
        />
        <TNTouchableIcon
          containerStyle={styles.footerIconContainer}
          iconSource={theme.icons.commentUnfilled}
          imageStyle={[styles.footerIcon, styles.tintColor, { marginLeft: -8 }]}
          renderTitle={true}
          onPress={didPressComment}
        />
      </View>
      <View style={styles.textContainer}>
        {reactionCount > 0 && (
          <Text style={[styles.body, styles.title]}>
            {reactionCount === 1
              ? `${reactionCount} like`
              : `${reactionCount} likes`}
          </Text>
        )}
        <TruncateText
          numberOfLines={2}
          renderViewMore={renderViewMore}
          renderViewLess={renderViewLess}
          textStyle={styles.body}>
          <Text style={styles.title}>
            {item.author.username || item.author.firstName + ' '}
          </Text>
          <IMRichTextView
            defaultTextStyle={styles.body}
            onUserPress={onTextFieldUserPress}
            onHashTagPress={onTextFieldHashTagPress}>
            {item.postText || ' '}
          </IMRichTextView>
        </TruncateText>
        {shouldDisplayViewAllComments && item.commentCount > 0 && (
          <TouchableOpacity activeOpacity={1} onPress={didPressComment}>
            <Text style={[styles.body, styles.subtitle]}>
              {item.commentCount === 1
                ? `View ${item.commentCount} comment`
                : `View all ${item.commentCount} comments`}
            </Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.body, styles.subtitle]}>
          {timeFormat(item.createdAt)}
        </Text>
      </View>

      <ActionSheet
        ref={moreRef}
        title={'More'}
        options={moreArray}
        destructiveButtonIndex={moreArray.indexOf('Delete Post')}
        cancelButtonIndex={moreArray.length - 1}
        onPress={onMoreDialogDone}
      />
    </TouchableOpacity>
  )
}

export default FeedItem
