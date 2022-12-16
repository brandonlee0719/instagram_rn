import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import TextButton from 'react-native-button'
import { useSelector } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import { CreatePost } from '../../components'
import { usePostMutations } from '../../Core/socialgraph/feed'
import { useSocialGraphFriends } from '../../Core/socialgraph/friendships'
import { useCurrentUser } from '../../Core/onboarding'

const defaultPost = {
  postText: '',
}

export default function CreatePostScreen({ navigation }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const currentUser = useCurrentUser()

  const { addPost } = usePostMutations()
  const { friends } = useSocialGraphFriends(currentUser?.id)

  const [post, setPost] = useState(defaultPost)
  const [postMedia, setPostMedia] = useState([])
  const [location, setLocation] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  const inputRef = useRef(null)

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]

    navigation.setOptions({
      headerTitle: localized('Create Post'),
      headerRight: () =>
        isPosting ? (
          <ActivityIndicator style={{ margin: 10 }} size="small" />
        ) : (
          <TextButton style={{ marginRight: 12 }} onPress={onPost}>
            Post
          </TextButton>
        ),
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [post, location, postMedia])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const onPostDidChange = post => {
    setPost(post)
  }

  const onSetMedia = photos => {
    setPostMedia([...photos])
  }

  const onLocationDidChange = location => {
    setLocation(location)
  }

  const onPost = async () => {
    const tempPost = {
      ...post,
      location: location,
    }
    setPost(tempPost)

    const isEmptyPost = tempPost.postText.trim() === ''
    if (postMedia.length === 0 && isEmptyPost) {
      Alert.alert(
        localized('Empty Post'),
        localized(
          'You may not create an empty post. Write a post or select a photo to proceed.',
        ),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return
    }

    setIsPosting(true)
    await addPost(tempPost, postMedia, currentUser)
    setIsPosting(false)
    navigation.goBack()
    // TODO: Handle errors
  }

  const blurInput = () => {
    inputRef.current?.blur()
  }

  return (
    <CreatePost
      inputRef={inputRef}
      user={currentUser}
      onPostDidChange={onPostDidChange}
      onSetMedia={onSetMedia}
      onLocationDidChange={onLocationDidChange}
      blurInput={blurInput}
      friends={friends}
    />
  )
}
