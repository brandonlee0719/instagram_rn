import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'
import { Alert, Platform, View, Share, Image } from 'react-native'
import { useDispatch } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu'
import { Camera } from 'expo-camera'
import { useTheme, useTranslations } from 'dopenative'
import { Feed } from '../../components'
import styles from './styles'
import { TNTouchableIcon } from '../../Core/truly-native'
import { setLocallyDeletedPost } from '../../Core/socialgraph/feed/redux'
import { useUserReportingMutations } from '../../Core/user-reporting'
import { useCurrentUser } from '../../Core/onboarding'
import {
  useHomeFeedPosts,
  useStories,
  useStoryMutations,
  usePostMutations,
} from '../../Core/socialgraph/feed'

const FeedScreen = props => {
  const { navigation } = props
  const dispatch = useDispatch()

  const currentUser = useCurrentUser()
  const {
    posts,
    refreshing,
    isLoadingBottom,
    subscribeToHomeFeedPosts,
    loadMorePosts,
    pullToRefresh,
    addReaction,
    batchSize,
  } = useHomeFeedPosts()
  const { groupedStories, myStories, subscribeToStories, loadMoreStories } =
    useStories()
  const loading = posts === null
  const { addStory } = useStoryMutations()
  const { addPost, deletePost } = usePostMutations()
  const { markAbuse } = useUserReportingMutations()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false)
  const [isMediaComposerVisible, setIsMediaComposerVisible] = useState(false)
  const [selectedFeedItems, setSelectedFeedItems] = useState([])
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(null)
  const [isStoryUpdating, setIsStoryUpdating] = useState(false)
  const [willBlur, setWillBlur] = useState(false)

  const navMenuRef = useRef()

  useEffect(() => {
    navigation.setParams({
      toggleCamera: toggleCamera,
      openDrawer: openDrawer,
      openCamera: openCamera,
      openVideoRecorder: openVideoRecorder,
      openMediaPicker: openMediaPicker,
      toggleMediaComposer: toggleMediaComposer,
      navMenuRef: navMenuRef,
    })
  }, [])

  useEffect(() => {
    if (!currentUser?.id) {
      return
    }
    const postsUnsubscribe = subscribeToHomeFeedPosts(currentUser?.id)
    const storiesUnsubscribe = subscribeToStories(currentUser?.id)
    return () => {
      postsUnsubscribe && postsUnsubscribe()
      storiesUnsubscribe && storiesUnsubscribe()
    }
  }, [currentUser?.id])

  useEffect(() => {
    setIsStoryUpdating(false)
  }, [groupedStories, myStories])

  const onCommentPress = item => {
    navigation.navigate('FeedDetailPost', {
      item: item,
      lastScreenTitle: 'Feed',
    })
  }

  const runIfCameraPermissionGranted = async callback => {
    const response = await Camera.requestPermissionsAsync()
    if (response.status === 'granted') {
      callback && callback()
    } else {
      Alert.alert(
        localized('Camera permission denied'),
        localized(
          'You must enable camera permissions in order to take photos.',
        ),
      )
    }
  }

  const toggleCamera = () => {
    runIfCameraPermissionGranted(() => {
      if (Platform.OS === 'ios') {
        setIsCameraOpen(!isCameraOpen)
      } else {
        if (navMenuRef.current) {
          navMenuRef.current.open()
        }
      }
    })
  }

  const openVideoRecorder = () => {
    runIfCameraPermissionGranted(() => {
      ImagePicker.openCamera({
        mediaType: 'video',
      }).then(image => {
        if (image.path) {
          onPostStory(image)
        }
      })
    })
  }

  const openCamera = () => {
    runIfCameraPermissionGranted(() => {
      ImagePicker.openCamera({
        mediaType: 'photo',
      }).then(image => {
        if (image.path) {
          onPostStory({ uri: image.path, mime: image.mime })
        }
      })
    })
  }

  const openMediaPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    }).then(image => {
      if (image.path) {
        onPostStory(image)
      }
    })
  }

  const openDrawer = () => {
    navigation.openDrawer()
  }

  const toggleMediaComposer = () => {
    if (Platform.OS === 'ios') {
      setIsMediaComposerVisible(!isMediaComposerVisible)
    } else {
      navigation.navigate('CreatePost')
    }
  }

  const onShareMediaPost = async ({ postText, location, postMedia }) => {
    const newPost = {
      postText,
      location,
    }

    if (postMedia?.length === 0) {
      Alert.alert(
        localized('Incomplete Post'),
        localized(
          'You cannot upload an empty post. Please select a video or a photo first.',
        ),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return
    }

    toggleMediaComposer()
    await addPost(newPost, postMedia, currentUser)
  }

  const onCameraClose = () => {
    setIsCameraOpen(false)
  }

  const onUserItemPress = useCallback(shouldOpenCamera => {
    if (shouldOpenCamera) {
      toggleCamera()
    }
  }, [])

  const onFeedUserItemPress = async item => {
    if (item.id === currentUser.id) {
      navigation.navigate('FeedProfile', {
        stackKeyTitle: 'FeedProfile',
        lastScreenTitle: 'Feed',
      })
    } else {
      navigation.navigate('FeedProfile', {
        user: item,
        stackKeyTitle: 'FeedProfile',
        lastScreenTitle: 'Feed',
      })
    }
  }

  const onMediaClose = () => {
    setIsMediaViewerOpen(false)
  }

  const onMediaPress = (media, mediaIndex) => {
    setSelectedFeedItems(media)
    setSelectedMediaIndex(mediaIndex)
    setIsMediaViewerOpen(true)
  }

  const onPostStory = useCallback(
    async file => {
      // We close down the camera modal, before uploading the story, to make the UX faster
      toggleCamera()

      const res = await addStory(file, currentUser)
      // TODO: handle errors
    },
    [toggleCamera, addStory, currentUser],
  )

  const onReaction = useCallback(
    async (reaction, post) => {
      await addReaction(post, currentUser, reaction)
    },
    [addReaction, currentUser],
  )

  const onSharePost = async item => {
    let url = ''
    if (item.postMedia?.length > 0) {
      url = item.postMedia[0]?.url || item.postMedia[0]
    }
    try {
      const result = await Share.share(
        {
          title: 'Share SocialNetwork post.',
          message: item.postText,
          url,
        },
        {
          dialogTitle: 'Share SocialNetwork post.',
        },
      )
    } catch (error) {
      alert(error.message)
    }
  }

  const onDeletePost = useCallback(
    async item => {
      dispatch(setLocallyDeletedPost(item.id))
      await deletePost(item.id, currentUser?.id)
    },
    [deletePost, currentUser],
  )

  const onUserReport = useCallback(
    async (item, type) => {
      markAbuse(currentUser.id, item.authorID, type)
    },
    [currentUser.id, markAbuse],
  )

  const handleOnEndReached = useCallback(() => {
    if (posts.length >= batchSize) {
      loadMorePosts(currentUser?.id)
    }
  }, [currentUser?.id, loadMorePosts, posts])

  const onFeedScroll = () => {}

  const onEmptyStatePress = () => {
    props.navigation.navigate('Friends')
  }

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]

    const androidNavIconOptions = [
      {
        key: 'camera',
        onSelect: openCamera,
        iconSource: theme.icons.camera,
      },
      {
        key: 'video',
        onSelect: openVideoRecorder,
        iconSource: theme.icons.videoCamera,
      },
      {
        key: 'picker',
        onSelect: openMediaPicker,
        iconSource: theme.icons.libraryLandscape,
      },
    ]
    props.navigation.setOptions({
      headerTitle: localized('Instamobile'),
      headerLeft: () => (
        <TNTouchableIcon
          imageStyle={{ tintColor: colorSet.primaryText }}
          iconSource={
            Platform.OS === 'ios'
              ? theme.icons.camera
              : theme.icons.menuHamburger
          }
          onPress={Platform.OS === 'ios' ? toggleCamera : openDrawer}
        />
      ),
      headerRight: () => (
        <View style={styles.doubleNavIcon}>
          {Platform.OS === 'android' && (
            <Menu ref={navMenuRef}>
              <MenuTrigger>
                <Image
                  style={[
                    {
                      tintColor: colorSet.primaryText,
                      marginRight: -5,
                    },
                    styles.navIcon,
                  ]}
                  source={theme.icons.camera}
                />
              </MenuTrigger>
              <MenuOptions
                customStyles={{
                  optionsContainer: {
                    ...styles.navIconMenuOptions,
                    backgroundColor: colorSet.primaryBackground,
                  },
                }}>
                {androidNavIconOptions.map(option => (
                  <MenuOption onSelect={option.onSelect}>
                    <Image
                      style={[
                        {
                          tintColor: colorSet.primaryText,
                        },
                        styles.navIcon,
                      ]}
                      source={option.iconSource}
                    />
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          )}
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryText }}
            iconSource={theme.icons.inscription}
            onPress={toggleMediaComposer}
            // onPress={() => navigation.navigate('CreatePost')}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  })

  const pullToRefreshConfig = {
    refreshing: refreshing,
    onRefresh: () => {
      pullToRefresh(currentUser?.id)
    },
  }

  return (
    <View style={styles.container}>
      <Feed
        loading={loading}
        feed={posts}
        onCommentPress={onCommentPress}
        user={currentUser}
        isCameraOpen={isCameraOpen}
        onCameraClose={onCameraClose}
        onUserItemPress={onUserItemPress}
        onFeedUserItemPress={onFeedUserItemPress}
        isMediaViewerOpen={isMediaViewerOpen}
        feedItems={selectedFeedItems}
        onMediaClose={onMediaClose}
        onMediaPress={onMediaPress}
        selectedMediaIndex={selectedMediaIndex}
        stories={groupedStories || []}
        userStories={myStories}
        onPostStory={onPostStory}
        onReaction={onReaction}
        handleOnEndReached={handleOnEndReached}
        isFetching={isLoadingBottom}
        isStoryUpdating={isStoryUpdating}
        onSharePost={onSharePost}
        onDeletePost={onDeletePost}
        onUserReport={onUserReport}
        onFeedScroll={onFeedScroll}
        shouldReSizeMedia={true}
        willBlur={willBlur}
        onEmptyStatePress={onEmptyStatePress}
        isMediaComposerVisible={isMediaComposerVisible}
        onMediaComposerDismiss={toggleMediaComposer}
        onShareMediaPost={onShareMediaPost}
        navigation={navigation}
        pullToRefreshConfig={pullToRefreshConfig}
      />
    </View>
  )
}

export default FeedScreen
