import React, { useRef } from 'react'
import { Text, View, TextInput, Platform } from 'react-native'
import { useTheme } from 'dopenative'
import dynamicStyles from './styles'

export default function CustomTextInput(props) {
  const {
    editorStyles = {},
    formattedText,
    placeholder,
    onChange,
    handleSelectionChange,
    numberOfLines = null,
    onFocus = () => {},
  } = props
  const inputRef = useRef()

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  props.inputRef.current = inputRef.current

  return (
    <View style={[styles.container, { maxHeight: 100 }]}>
      <TextInput
        ref={inputRef}
        style={[styles.input, editorStyles.input]}
        multiline
        // autoFocus
        onFocus={onFocus}
        numberOfLines={numberOfLines}
        clearTextOnFocus={formattedText.length === 0}
        onBlur={props.toggleEditor}
        onFocus={props.onFocus}
        onChangeText={onChange}
        onSelectionChange={handleSelectionChange}
        editable={props.editable}
        onPressIn={props.onPressIn}
        onPressOut={props.onPressOut}
        placeholder={placeholder}>
        {formattedText.length > 0 && (
          <Text style={[styles.formmatedText, editorStyles.inputMaskText]}>
            {formattedText}
          </Text>
        )}
      </TextInput>
      {formattedText === '' && Platform.OS === 'ios' && (
        <Text style={[styles.placeholderText, editorStyles.placeholderText]}>
          {placeholder}
        </Text>
      )}
    </View>
  )
}

CustomTextInput.defaultProps = {
  inputRef: {
    current: {},
  },
}
