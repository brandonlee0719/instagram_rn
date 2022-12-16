import React from 'react'
import { ScrollView, ActivityIndicator } from 'react-native'
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { useTheme } from 'dopenative'
import FeedItem from '../../FeedItem/FeedItem'
import CommentItem from './CommentItem'
import CommentInput from './CommentInput'
import dynamicStyles from './styles'

function DetailPost(props) {
  const {
    feedItem,
    commentItems,
    onCommentSend,
    scrollViewRef,
    onReaction,
    onFeedUserItemPress,
    onSharePost,
    onDeletePost,
    onUserReport,
    user,
    commentsLoading,
    navigation,
  } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const onCommentPress = () => {}

  const onTextFieldUserPress = () => {}

  const onTextFieldHashTagPress = hashtag => {
    navigation.push('FeedSearch', { hashtag })
  }

  return (
    <KeyboardAwareView style={styles.detailPostContainer}>
      <ScrollView ref={scrollViewRef}>
        <FeedItem
          item={feedItem}
          isLastItem={true}
          onUserItemPress={onFeedUserItemPress}
          onCommentPress={onCommentPress}
          onReaction={onReaction}
          onSharePost={onSharePost}
          onDeletePost={onDeletePost}
          onUserReport={onUserReport}
          user={user}
          shouldDisplayViewAllComments={false}
          onTextFieldHashTagPress={onTextFieldHashTagPress}
          onTextFieldUserPress={onTextFieldUserPress}
          playVideoOnLoad={true}
        />
        {commentsLoading ? (
          <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
        ) : (
          commentItems?.map(comment => (
            <CommentItem key={comment.id} item={comment} />
          ))
        )}
      </ScrollView>
      <CommentInput onCommentSend={onCommentSend} />
    </KeyboardAwareView>
  )
}

export default DetailPost
