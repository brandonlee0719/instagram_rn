import React, { useCallback, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
} from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { IMRichTextInput } from '../../mentions'
import store from './Store'
import Send from '../assets/send.png'
import { TNTouchableIcon } from '../../truly-native'
import { useStories } from '../../socialgraph/feed'
import { useCurrentUser } from '../../onboarding'
import { useChatChannels, useChatMessages } from '../../chat'

const reactionIcons = ['like', 'love', 'laugh', 'surprised', 'cry', 'angry']

export const InputBarAndReactions = ({ story, storyIndex, authorID }) => {
  const currentUser = useCurrentUser()
  const { addStoryReaction } = useStories()
  const { createChannel } = useChatChannels()
  const { getMessageObject, sendMessage: sendMessageAPI } = useChatMessages()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const textInputRef = useRef(null)
  const [input, setInput] = useState('')
  const [clearInput, setClearInput] = useState(false)

  const [isInputBarFocus, setIsInputBarFocus] = useState(false)
  const [myReaction, setMyReaction] = useState(!!story.myReaction)

  const editorStyles = {
    input: {
      color: theme.colors[appearance].foregroundContrast,
      paddingRight: 20,
      fontSize: 18,
    },
    placeholderText: {
      color: theme.colors[appearance].foregroundContrast,
      paddingLeft: 20,
      fontSize: 18,
    },
    inputMaskText: {
      color: theme.colors[appearance].foregroundContrast,
      fontSize: 18,
    },
  }

  const addReaction = () => {
    console.log('STORIES', story.id, storyIndex)
    setMyReaction(prev => !prev)
    addStoryReaction(story.id, currentUser?.id)

    let reactionsCount = story?.reactionsCount
    store.stories[store.deckIdx].items[storyIndex].myReaction = !myReaction
    store.stories[store.deckIdx].items[storyIndex].reactionsCount = !myReaction
      ? reactionsCount + 1
      : reactionsCount - 1
    store.stories[store.deckIdx].items[storyIndex].reactions = !myReaction
      ? [...(story?.reactions || []), currentUser?.id]
      : story?.reactions.filter(id => id !== currentUser?.id)
  }

  const getParticipantPictures = allParticipants => {
    return allParticipants.map(participant => {
      return {
        participantId: participant.id || participant.userID,
        profilePictureURL: participant.profilePictureURL,
        profilePictureKey: participant.profilePictureKey,
      }
    })
  }

  const sendMessage = async content => {
    const otherParticipants = [JSON.parse(JSON.stringify(story.author))]
    const channel = await createChannel(currentUser, otherParticipants)
    if (channel) {
      const newMessage = getMessageObject(
        currentUser,
        content,
        null,
        null,
        getParticipantPictures([...otherParticipants, currentUser]),
        false,
        true,
        {
          src: story?.src,
          type: story?.type,
        },
      )

      await sendMessageAPI(newMessage, channel)
      setInput('')
    }
  }

  const onSendInput = () => {
    sendMessage({ content: input })
  }

  const onReactionStickers = sticker => {
    sendMessage({
      content: localized('reacted on your story'),
      storyReaction: sticker,
    })
  }

  const inlineActionIconStyle = myReaction
    ? [styles.inlineActionIcon]
    : [styles.inlineActionIconDefault]

  const renderBottomInput = () => {
    return (
      <View style={styles.inputBar}>
        <View style={styles.inputBorder}>
          <View style={styles.inputContainer}>
            <IMRichTextInput
              clearInput={clearInput}
              inputRef={textInputRef}
              initialValue={''}
              onFocus={() => {
                store.pause()
                setIsInputBarFocus(true)
              }}
              onBlur={() => {
                store.play()
                setIsInputBarFocus(false)
              }}
              placeholder={localized('Send message')}
              showMentions={false}
              onChange={({ text }) => {
                setInput(text)
              }}
              onHideMentions={() => {}}
              onUpdateSuggestions={() => {}}
              onTrackingStateChange={() => {}}
              showEditor={true}
              editorStyles={editorStyles}
              setClearInput={setClearInput}
            />
          </View>
          {isInputBarFocus && (
            <TouchableOpacity
              disabled={input.length <= 0}
              onPress={() => {
                store.play()
                Keyboard.dismiss()
                setIsInputBarFocus(false)
                onSendInput()
                setClearInput(true)
              }}
              style={[
                styles.inputIconContainer,
                input.length <= 0 ? { opacity: 0.2 } : { opacity: 1 },
              ]}>
              <Image style={styles.inputIcon} source={Send} />
            </TouchableOpacity>
          )}
        </View>
        {!isInputBarFocus && (
          <TNTouchableIcon
            containerStyle={styles.footerIconContainer}
            iconSource={theme.icons[myReaction ? 'love' : 'heartUnfilled']}
            imageStyle={inlineActionIconStyle}
            renderTitle={true}
            onPress={addReaction}
          />
        )}
      </View>
    )
  }

  const renderReactionsContainer = useCallback(() => {
    if (isInputBarFocus) {
      return (
        <View style={styles.reactionContainer}>
          {reactionIcons.map((icon, index) => (
            <TNTouchableIcon
              key={index + 'icon'}
              containerStyle={styles.reactionIconContainer}
              iconSource={theme.icons[icon]}
              imageStyle={styles.reactionIcon}
              onPress={() => {
                setIsInputBarFocus(false)
                Keyboard.dismiss()
                store.play()
                onReactionStickers(icon)
              }}
            />
          ))}
        </View>
      )
    }
    return <></>
  }, [isInputBarFocus])

  if (currentUser?.id !== authorID) {
    return (
      <KeyboardAvoidingView
        style={
          !isInputBarFocus
            ? styles.container
            : [
                styles.backdropContainer,
                {
                  backgroundColor: 'rgba(0,0,0,0.51)',
                  zIndex: 4,
                },
              ]
        }
        behavior={'padding'}>
        <TouchableOpacity
          activeOpacity={1}
          delayPressIn={200}
          onPressIn={store.pause}
          onPress={() => {
            setIsInputBarFocus(false)
            Keyboard.dismiss()
            store.play()
          }}
          style={[styles.backdropContainer]}>
          {renderReactionsContainer()}
          {renderBottomInput()}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  } else {
    return null
  }
}

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]
  const WINDOW_WIDTH = Dimensions.get('window').width
  const WINDOW_HEIGHT = Dimensions.get('window').height
  const reactionIconSize = Math.floor(WINDOW_WIDTH * 0.12)

  return StyleSheet.create({
    container: {
      position: 'absolute',
      width: '100%',
      bottom: 0,
      zIndex: 2,
    },
    backdropContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      zIndex: 2,
    },
    inputBorder: {
      flex: 8,
      borderColor: colorSet.foregroundContrast,
      borderWidth: 1,
      borderRadius: 50,
      flexDirection: 'row',
      marginHorizontal: 8,
      paddingVertical: Platform.OS === 'ios' ? WINDOW_WIDTH * 0.02 : 0,
    },
    inputContainer: {
      flex: 8,
    },
    inputBar: {
      position: 'absolute',
      bottom: WINDOW_HEIGHT * 0.04,
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: 6,
    },
    inputIconContainer: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center',
      // paddingRight: 20,
      backgroundColor: 'transparent',
    },
    inputIcon: {
      tintColor: colorSet.primaryForeground,
      width: 25,
      height: 25,
    },
    reactionContainer: {
      alignSelf: 'center',
      top: WINDOW_HEIGHT * 0.25,
      position: 'absolute',
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    reactionIconContainer: {
      marginHorizontal: 30,
      marginTop: 25,
      padding: 0,
      backgroundColor: 'powderblue',
      width: reactionIconSize,
      height: reactionIconSize,
      borderRadius: reactionIconSize / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reactionIcon: {
      width: reactionIconSize,
      height: reactionIconSize,
      margin: 0,
    },
    inlineActionIconDefault: {
      height: 30,
      width: 30,
      tintColor: colorSet.foregroundContrast,
    },
    inlineActionIcon: {
      height: 30,
      width: 30,
    },
    footerIconContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })
}
