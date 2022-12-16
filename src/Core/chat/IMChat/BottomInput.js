import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  Alert,
  Keyboard,
} from 'react-native'
import { Audio } from 'expo-av'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import BottomAudioRecorder from './BottomAudioRecorder'
import { IMMentionList, IMRichTextInput } from '../../mentions'
import IMRichTextView from '../../mentions/IMRichTextView/IMRichTextView'

const assets = {
  cameraFilled: require('../assets/camera-filled.png'),
  send: require('../assets/send.png'),
  mic: require('../assets/microphone.png'),
  close: require('../assets/close-x-icon.png'),
  newDocument: require('../assets/new-document.png'),
}

function BottomInput(props) {
  const {
    value,
    onChangeText,
    onAudioRecordDone,
    onSend,
    onAddMediaPress,
    onAddDocPress,
    uploadProgress,
    inReplyToItem,
    onReplyingToDismiss,
    participants,
    clearInput,
    setClearInput,
    onChatUserItemPress,
  } = props

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const textInputRef = useRef(null)

  const editorRef = useRef()
  const [formattedParticipants, setFormattedParticipants] = useState([])
  const [showUsersMention, setShowUsersMention] = useState(false)
  const [mentionsKeyword, setMentionsKeyword] = useState('')
  const [isTrackingStarted, setIsTrackingStarted] = useState(false)
  const [isAudioRecorderVisible, setIsAudioRecorderVisible] = useState(false)

  useEffect(() => {
    if (!participants) {
      return
    }
    const formattedUsers = participants.map(user => {
      const name = `${user.firstName} ${user.lastName}`
      const id = user.id || user.userID

      return { id, name, ...user }
    })
    setFormattedParticipants(formattedUsers)
  }, [participants])

  const isDisabled = () => {
    if (/\S/.test(value?.content)) {
      return false
    } else {
      return true
    }
  }

  const onVoiceRecord = useCallback(async () => {
    const response = await Audio.getPermissionsAsync()
    if (response.status === 'granted') {
      Keyboard.dismiss()
      setTimeout(() => {
        setIsAudioRecorderVisible(prevValue => !prevValue)
      }, 300)
    } else if (response.status === 'denied') {
      Alert.alert(
        localized('Audio permission denied'),
        localized(
          'You must enable audio recording permissions in order to send a voice note.',
        ),
      )
    } else {
      const response = await Audio.requestPermissionsAsync()
      if (response.status === 'granted') {
        onVoiceRecord()
      }
    }
  }, [onVoiceRecord, localized])

  const focusTextInput = () => {
    if (isAudioRecorderVisible) {
      setIsAudioRecorderVisible(false)
      setTimeout(() => {
        textInputRef.current?.focus()
      }, 300)
    }
  }

  const onTextPressOut = () => {
    focusTextInput()
  }

  const onAudioSend = audioSource => {
    onAudioRecordDone(audioSource)
    focusTextInput()
  }

  const editorStyles = {
    input: {
      color: theme.colors[appearance].primaryText,
      paddingLeft: 0,
    },
    placeholderText: {
      color: theme.colors[appearance].secondaryText,
    },
    inputMaskText: {
      color: theme.colors[appearance].secondaryText,
    },
  }

  const renderBottomInput = useCallback(() => {
    return (
      <View style={styles.bottomContentContainer}>
        {inReplyToItem && (
          <View style={styles.inReplyToView}>
            <Text style={styles.replyingToHeaderText}>
              {localized('Replying to')}{' '}
              <Text style={styles.replyingToNameText}>
                {inReplyToItem.senderFirstName || inReplyToItem.senderLastName}
              </Text>
            </Text>
            <IMRichTextView
              onUserPress={onChatUserItemPress}
              defaultTextStyle={styles.replyingToContentText}>
              {inReplyToItem.content}
            </IMRichTextView>
            <TouchableHighlight
              style={styles.replyingToCloseButton}
              onPress={onReplyingToDismiss}>
              <Image source={assets.close} style={styles.replyingToCloseIcon} />
            </TouchableHighlight>
          </View>
        )}
        <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        <View style={styles.inputBar}>
          <TouchableOpacity
            onPress={onAddDocPress}
            style={styles.inputIconContainer}>
            <Image style={styles.inputIcon} source={assets.newDocument} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddMediaPress}
            style={styles.inputIconContainer}>
            <Image style={styles.inputIcon} source={assets.cameraFilled} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onTextPressOut}
            style={styles.inputContainer}>
            <TouchableOpacity
              onPress={onVoiceRecord}
              style={styles.micIconContainer}>
              <Image style={styles.micIcon} source={assets.mic} />
            </TouchableOpacity>
            <IMRichTextInput
              richTextInputRef={editorRef}
              inputRef={textInputRef}
              initialValue={''}
              clearInput={clearInput}
              placeholder={localized('Start typing...')}
              onChange={onChangeText}
              onPressOut={onTextPressOut}
              editable={!isAudioRecorderVisible}
              showEditor={true}
              toggleEditor={() => {}}
              editorStyles={editorStyles}
              showMentions={showUsersMention}
              onHideMentions={() => setShowUsersMention(false)}
              onUpdateSuggestions={setMentionsKeyword}
              onTrackingStateChange={setIsTrackingStarted}
              setClearInput={setClearInput}
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDisabled()}
            onPress={onSend}
            style={[
              styles.inputIconContainer,
              isDisabled() ? { opacity: 0.2 } : { opacity: 1 },
            ]}>
            <Image style={styles.inputIcon} source={assets.send} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }, [
    isAudioRecorderVisible,
    inReplyToItem,
    clearInput,
    editorStyles,
    showUsersMention,
    setClearInput,
  ])

  return (
    <>
      <IMMentionList
        list={formattedParticipants}
        keyword={mentionsKeyword}
        isTrackingStarted={isTrackingStarted}
        onSuggestionTap={editorRef.current?.onSuggestionTap}
      />
      {renderBottomInput()}
      <BottomAudioRecorder
        theme={theme}
        appearance={appearance}
        localized={localized}
        visible={isAudioRecorderVisible}
        onSend={onAudioSend}
      />
    </>
  )
}

export default BottomInput
