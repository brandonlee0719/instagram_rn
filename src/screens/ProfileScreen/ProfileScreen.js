import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { Platform } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { Profile } from '../../components'
import { storageAPI } from '../../Core/media'
import { updateUser } from '../../Core/users'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { TNTouchableIcon } from '../../Core/truly-native'
import { useCurrentUser } from '../../Core/onboarding'
import { useProfile } from '../../Core/socialgraph/feed'
import { useSocialGraphMutations } from '../../Core/socialgraph/friendships'

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg'

export default function ProfileScreen({ route, navigation }) {
  const otherUser = route.params?.user
  const lastScreenTitle = route?.params?.lastScreenTitle ?? 'Profile'
  const stackKeyTitle = route?.params?.stackKeyTitle ?? 'Profile'

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()

  const {
    batchSize,
    profile,
    posts,
    refreshing,
    isLoadingBottom,
    subscribeToProfileFeedPosts,
    loadMorePosts,
    pullToRefresh,
  } = useProfile(otherUser?.id ?? currentUser?.id, currentUser?.id)
  const { user, actionButtonType } = profile ?? {}

  const { addEdge } = useSocialGraphMutations()

  const dispatch = useDispatch()

  const [localActionButtonType, setLocalActionButtonType] = useState(
    !otherUser ? 'settings' : null,
  )

  const [uploadProgress, setUploadProgress] = useState(0)

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]
    var options = {
      headerTitle: localized('Profile'),
      headerRight: () =>
        !otherUser && (
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryForeground }}
            iconSource={theme.icons.bell}
            onPress={navigateToNotifications}
          />
        ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    }
    if (!lastScreenTitle && Platform.OS === 'android') {
      options = {
        ...options,
        headerLeft: () => (
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryText }}
            iconSource={theme.icons.menuHamburger}
            onPress={openDrawer}
          />
        ),
      }
    }
    navigation.setOptions(options)
  }, [])

  useEffect(() => {
    if (!otherUser && !currentUser) {
      return
    }
    const postsUnsubscribe = subscribeToProfileFeedPosts(
      otherUser?.id ?? currentUser?.id,
    )

    return () => {
      postsUnsubscribe && postsUnsubscribe()
    }
  }, [currentUser?.id])

  const navigateToNotifications = () => {
    navigation.navigate(lastScreenTitle + 'Notification', {
      lastScreenTitle: lastScreenTitle,
    })
  }

  const openDrawer = () => {
    navigation.openDrawer()
  }

  const onMainButtonPress = useCallback(() => {
    const actionType = localActionButtonType
      ? localActionButtonType
      : actionButtonType
    if (actionType === 'add') {
      addFriend()
      return
    }
    if (actionType === 'message') {
      onMessage()
      return
    }
    if (actionType === 'settings') {
      const settingsScreen = lastScreenTitle
        ? lastScreenTitle + 'ProfileSettings'
        : 'ProfileProfileSettings'
      navigation.navigate(settingsScreen, {
        lastScreenTitle,
      })
    }
  }, [
    localActionButtonType,
    actionButtonType,
    addFriend,
    onMessage,
    navigation,
  ])

  const onMessage = () => {
    const viewer = currentUser
    const viewerID = viewer.id
    const friendID = otherUser.id
    let channel = {
      id: viewerID < friendID ? viewerID + friendID : friendID + viewerID,
      participants: [otherUser],
    }
    navigation.navigate('PersonalChat', { channel })
  }

  const onFollowersButtonPress = () => {
    navigation.push(lastScreenTitle + 'AllFriends', {
      lastScreenTitle: lastScreenTitle,
      title: localized('Followers'),
      stackKeyTitle: stackKeyTitle,
      otherUser: otherUser ?? currentUser,
      type: 'inbound',
      followEnabled: true,
    })
  }

  const onFollowingButtonPress = () => {
    navigation.push(lastScreenTitle + 'AllFriends', {
      lastScreenTitle: lastScreenTitle,
      title: 'Following',
      stackKeyTitle: stackKeyTitle,
      otherUser: otherUser ?? currentUser,
      type: 'outbound',
      followEnabled: true,
    })
  }

  const startUpload = useCallback(
    async source => {
      dispatch(
        setUserData({
          user: {
            ...currentUser,
            profilePictureURL: source?.path || source.uri,
          },
          profilePictureURL: source?.path || source.uri,
        }),
      )

      storageAPI.processAndUploadMediaFileWithProgressTracking(
        source,
        async snapshot => {
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setUploadProgress(uploadProgress)
        },
        async url => {
          const data = {
            profilePictureURL: url,
          }
          dispatch(
            setUserData({
              user: { ...currentUser, profilePictureURL: url },
            }),
          )

          updateUser(currentUser.id, data)
          setUploadProgress(0)
        },
        error => {
          setUploadProgress(0)
          console.log(error)
          alert(
            localized(
              'Oops! An error occured while trying to update your profile picture. Please try again.',
            ),
          )
          console.log(error)
        },
      )
    },
    [dispatch, setUploadProgress, setUserData, storageAPI, localized],
  )

  const removePhoto = useCallback(async () => {
    const res = await updateUser(currentUser.id, {
      profilePictureURL: defaultAvatar,
    })
    if (res.success) {
      dispatch(
        setUserData({
          user: { ...currentUser, profilePictureURL: defaultAvatar },
        }),
      )
    } else {
      alert(
        localized(
          'Oops! An error occured while trying to remove your profile picture. Please try again.',
        ),
      )
    }
  }, [updateUser, currentUser, localized])

  const addFriend = useCallback(async () => {
    if (!currentUser || !user) {
      return
    }
    setLocalActionButtonType('message')
    await addEdge(currentUser, user)
  }, [currentUser, user, addEdge, setLocalActionButtonType])

  const onPostPress = ({ item, index }) => {
    navigation.navigate('ProfilePostDetails', {
      item: item,
      lastScreenTitle: lastScreenTitle,
    })
  }

  const onEmptyStatePress = () => {
    navigation.navigate('CreatePost')
  }

  const handleOnEndReached = useCallback(() => {
    if (posts.length >= batchSize) {
      loadMorePosts(otherUser?.id ?? currentUser?.id)
    }
  }, [loadMorePosts, posts])

  const pullToRefreshConfig = {
    refreshing: refreshing,
    onRefresh: () => {
      pullToRefresh(currentUser?.id)
    },
  }

  const actionType = localActionButtonType
    ? localActionButtonType
    : actionButtonType
  const mainButtonTitle =
    actionType === 'settings'
      ? localized('Profile Settings')
      : actionType === 'message'
      ? localized('Send Message')
      : actionType === 'add'
      ? localized('Follow')
      : null

  const finalUser = user ?? otherUser ?? currentUser
  return (
    <Profile
      loading={posts == null}
      uploadProgress={uploadProgress}
      user={finalUser}
      mainButtonTitle={mainButtonTitle}
      followingCount={finalUser?.outboundFriendshipCount ?? 0}
      followersCount={finalUser?.inboundFriendshipCount ?? 0}
      postCount={finalUser?.postCount ?? 0}
      recentUserFeeds={posts}
      onMainButtonPress={onMainButtonPress}
      onPostPress={onPostPress}
      removePhoto={removePhoto}
      startUpload={startUpload}
      handleOnEndReached={handleOnEndReached}
      isFetching={isLoadingBottom}
      isOtherUser={otherUser}
      onFollowersButtonPress={onFollowersButtonPress}
      onFollowingButtonPress={onFollowingButtonPress}
      onEmptyStatePress={onEmptyStatePress}
      navigation={navigation}
      pullToRefreshConfig={pullToRefreshConfig}
    />
  )
}
