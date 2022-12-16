import React, {
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Share } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { useDispatch } from 'react-redux'
import { DetailPost } from '../../components'
import { useUserReportingMutations } from '../../Core/user-reporting'
import { setLocallyDeletedPost } from '../../Core/socialgraph/feed/redux'
import {
  useCommentMutations,
  useComments,
  usePost,
  usePostMutations,
} from '../../Core/socialgraph/feed'
import { useCurrentUser } from '../../Core/onboarding'

export default function DetailPostScreen({ route, navigation }) {
  const item = route.params.item
  const lastScreenTitle = route.params.lastScreenTitle
  const profileScreenTitle = lastScreenTitle + 'Profile'

  const dispatch = useDispatch()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()

  const { deletePost } = usePostMutations()
  const { addComment } = useCommentMutations()
  const { markAbuse } = useUserReportingMutations()

  const { comments, commentsLoading, loadMoreComments, subscribeToComments } =
    useComments()
  const { remotePost, subscribeToPost, addReaction } = usePost()

  const [feedItem, setFeedItem] = useState(item)

  const scrollViewRef = useRef(null)

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]

    navigation.setOptions({
      headerTitle: localized('Post'),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  useEffect(() => {
    if (!item?.id) {
      return
    }
    const postUnsubscribe = subscribeToPost(item.id, currentUser?.id)
    const commentsUnsubscribe = subscribeToComments(item.id)
    return () => {
      postUnsubscribe && postUnsubscribe()
      commentsUnsubscribe && commentsUnsubscribe()
    }
  }, [item?.id])

  useEffect(() => {
    if (remotePost) {
      setFeedItem(remotePost)
    }
  }, [remotePost])

  const onCommentSend = useCallback(
    async text => {
      await addComment(text, feedItem.id, currentUser.id)
    },
    [addComment, currentUser?.id, feedItem?.id],
  )

  const onReaction = useCallback(
    async (reaction, item) => {
      await addReaction(feedItem, currentUser, reaction)
    },
    [addReaction, feedItem, currentUser],
  )

  const onFeedUserItemPress = useCallback(
    async item => {
      if (item.id === currentUser.id) {
        navigation.navigate(profileScreenTitle, {
          stackKeyTitle: profileScreenTitle,
          lastScreenTitle: lastScreenTitle,
        })
      } else {
        navigation.navigate(profileScreenTitle, {
          user: item,
          stackKeyTitle: profileScreenTitle,
          lastScreenTitle: lastScreenTitle,
        })
      }
    },
    [currentUser, navigation, profileScreenTitle, item],
  )

  const onSharePost = async item => {
    let url = ''
    if (item.postMedia?.length > 0) {
      url = item.postMedia[0]?.url || item.postMedia[0]
    }
    try {
      const result = await Share.share(
        {
          title: 'Share post.',
          message: item.postText,
          url,
        },
        {
          dialogTitle: 'Share post',
        },
      )
    } catch (error) {
      alert(error.message)
    }
  }

  const onDeletePost = useCallback(
    async item => {
      dispatch(setLocallyDeletedPost(item.id))
      const res = await deletePost(item.id, currentUser.id)
      navigation.goBack()
    },
    [navigation],
  )

  const onUserReport = async (item, type) => {
    await markAbuse(currentUser.id, item.authorID, type)
    navigation.goBack()
  }

  return (
    <DetailPost
      scrollViewRef={scrollViewRef}
      feedItem={feedItem}
      commentItems={comments}
      onCommentSend={onCommentSend}
      onFeedUserItemPress={onFeedUserItemPress}
      onReaction={onReaction}
      onSharePost={onSharePost}
      onDeletePost={onDeletePost}
      onUserReport={onUserReport}
      user={currentUser}
      commentsLoading={commentsLoading}
      navigation={navigation}
    />
  )
}
