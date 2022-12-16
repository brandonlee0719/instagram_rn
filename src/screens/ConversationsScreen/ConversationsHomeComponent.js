import React from 'react'
import { View } from 'react-native'
import { useTheme } from 'dopenative'
import { IMConversationListView } from '../../Core/chat'
import dynamicStyles from './styles'

function ConversationsHomeComponent(props) {
  const { navigation, emptyStateConfig } = props

  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  return (
    <View style={styles.container}>
      <View style={styles.chatsChannelContainer}>
        <IMConversationListView
          navigation={navigation}
          emptyStateConfig={emptyStateConfig}
        />
      </View>
    </View>
  )
}

export default ConversationsHomeComponent
