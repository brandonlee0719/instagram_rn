import React, { useState } from 'react'
import { TouchableOpacity, Image, View, TextInput } from 'react-native'
import { useTheme } from 'dopenative'
import PropTypes from 'prop-types'
import dynamicStyles from './styles'

function CommentInput(props) {
  const { onCommentSend } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [value, setValue] = useState('')
  const isDisabled = value.length < 1

  const onChangeText = value => {
    setValue(value)
  }

  const onSendComment = () => {
    onCommentSend(value)
    setValue('')
  }

  return (
    <View style={styles.commentInputContainer}>
      <View style={styles.commentTextInputContainer}>
        <TextInput
          underlineColorAndroid="transparent"
          placeholder={'Add a Comment...'}
          placeholderTextColor={styles.placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          style={styles.commentTextInput}
        />
      </View>
      <TouchableOpacity
        onPress={onSendComment}
        disabled={isDisabled}
        style={styles.commentInputIconContainer}>
        <Image
          style={[
            styles.commentInputIcon,
            isDisabled ? { opacity: 0.3 } : { opacity: 1 },
          ]}
          source={theme.icons.send}
        />
      </TouchableOpacity>
    </View>
  )
}

CommentInput.propTypes = {
  item: PropTypes.object,
}

export default CommentInput
