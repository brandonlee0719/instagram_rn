import React, { useRef, useState, useEffect } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
import { useTheme } from 'dopenative'
import { Video } from 'expo-av'
import convertToProxyURL from 'react-native-video-cache'
import { createImageProgress } from 'react-native-image-progress'
import FastImage from 'react-native-fast-image'
import CircleSnail from 'react-native-progress/CircleSnail'
import { TNTouchableIcon } from '../../Core/truly-native'

const Image = createImageProgress(FastImage)

const { width } = Dimensions.get('window')
const circleSnailProps = { thickness: 1, color: '#D0D0D0', size: 25 }

export default function FeedMedia({
  media,
  index,
  item,
  isLastItem,
  onMediaPress,
  dynamicStyles,
  postMediaIndex,
  inViewPort,
  willBlur,
  onMediaResize,
  mediaCellcontainerStyle,
  mediaContainerStyle,
  mediaStyle,
  videoResizeMode,
  showVideo = true,
  playVideoOnLoad,
}) {
  const currentUser = useSelector(state => state.auth.user)

  const { theme } = useTheme()

  const [videoLoading, setVideoLoading] = useState(true)
  const [isVideoMuted, setIsVideoMuted] = useState(true)
  const [playEnabledFromSettings, setPlayEnabledFromSettings] = useState(true)

  const videoRef = useRef()

  const isVideo = media?.mime?.includes('video')

  // autoplay_video_enabled
  // mute_video_enabled

  const settingsHandler = {
    autoplay_video_enabled: playValue => setPlayEnabledFromSettings(playValue),
    mute_video_enabled: muteValue => setIsVideoMuted(muteValue),
  }

  useEffect(() => {
    const appSettings = currentUser.settings
    if (appSettings) {
      const settingsKeys = Object.keys(appSettings)
      if (settingsKeys.length > 0) {
        settingsKeys.forEach(
          key => settingsHandler[key] && settingsHandler[key](appSettings[key]),
        )
      }
    }
  }, [currentUser])

  useEffect(() => {
    setPlayEnabledFromSettings(playEnabledFromSettings)
  }, [playEnabledFromSettings])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(isVideoMuted)
    }
  }, [isVideoMuted])

  useEffect(() => {
    ;(async () => {
      if (playVideoOnLoad) {
        return
      }
      if (postMediaIndex === index && inViewPort && playEnabledFromSettings) {
        if (videoRef.current) {
          await videoRef.current.replayAsync()
        }
      } else {
        if (videoRef.current) {
          await videoRef.current.pauseAsync(true)
        }
      }
    })()
  }, [postMediaIndex])

  useEffect(() => {
    handleInViewPort()
  }, [inViewPort])

  useEffect(() => {
    ;(async () => {
      if (videoRef.current) {
        const videoStatus = await videoRef.current.getStatusAsync()
        if (videoStatus.isPlaying) {
          videoRef.current.pauseAsync(true)
        }
      }
    })()
  }, [willBlur])

  const handleInViewPort = async () => {
    const postMedia = item.postMedia
    if (
      !playVideoOnLoad &&
      postMediaIndex === index &&
      postMedia[postMediaIndex] &&
      isVideo &&
      playEnabledFromSettings
    ) {
      if (inViewPort) {
        if (videoRef.current) {
          const videoStatus = await videoRef.current.getStatusAsync()
          !videoStatus.isPlaying && (await videoRef.current.replayAsync())
        }
      } else {
        if (videoRef.current) {
          await videoRef.current.pauseAsync(true)
        }
      }
    }
  }

  const onVideoLoadStart = () => {
    setVideoLoading(true)
  }

  const onVideoLoad = payload => {
    setVideoLoading(false)
    if (playVideoOnLoad) {
      videoRef.current?.playAsync(true)
      return
    }
    handleInViewPort()
  }

  const onSoundPress = () => {
    setIsVideoMuted(prevIsVideoMuted => !prevIsVideoMuted)
  }

  const onVideoMediaPress = url => {
    onMediaPress({ index, item })
  }

  const onImageMediaPress = () => {
    onMediaPress({ index, item })
  }

  const onMediaFilePress = () => {
    if (isVideo) {
      onVideoMediaPress(media && media.url)
      return
    }
    onImageMediaPress()
  }

  const rendenderMediaFile = () => {
    if (showVideo && isVideo) {
      const url = media?.url || media
      const videoURL = typeof url === 'string' ? convertToProxyURL(url) : ''
      return (
        <Video
          ref={videoRef}
          source={
            playVideoOnLoad
              ? { uri: videoURL }
              : inViewPort
              ? { uri: videoURL }
              : undefined
          }
          posterSource={{ uri: media?.thumbnailURL }}
          onLoad={onVideoLoad}
          posterStyle={{
            resizeMode: videoResizeMode ? videoResizeMode : 'contain',
          }}
          resizeMode={videoResizeMode ? videoResizeMode : 'contain'}
          onLoadStart={onVideoLoadStart}
          style={dynamicStyles.bodyImage}
          usePoster={!!media.thumbnailURL}
        />
      )
    }

    if (media?.thumbnailURL || media?.url) {
      return (
        <Image
          source={{ uri: media?.thumbnailURL || media?.url }}
          style={[dynamicStyles.bodyImage, mediaStyle]}
          indicator={CircleSnail}
          indicatorProps={circleSnailProps}
          onLoad={evt => {
            if (onMediaResize) {
              onMediaResize({
                height:
                  (evt.nativeEvent.height / evt.nativeEvent.width) * width,
              })
            }
          }}
        />
      )
    }
  }

  return (
    <View style={[mediaContainerStyle, mediaCellcontainerStyle]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onMediaFilePress}
        style={[dynamicStyles.centerItem, mediaContainerStyle]}>
        {isVideo && videoLoading && (
          <View
            style={[dynamicStyles.mediaVideoLoader, dynamicStyles.centerItem]}>
            <CircleSnail {...circleSnailProps} />
          </View>
        )}
        {rendenderMediaFile()}
        {isVideo && (
          <TNTouchableIcon
            onPress={onSoundPress}
            imageStyle={dynamicStyles.soundIcon}
            containerStyle={dynamicStyles.soundIconContainer}
            iconSource={
              isVideoMuted ? theme.icons.soundMute : theme.icons.sound
            }
          />
        )}
      </TouchableOpacity>
    </View>
  )
}
