import React, { useCallback, useEffect, useState } from 'react'
import Modal from 'react-native-modal'
import { useChatChannelsAndFriends } from '../api'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { TNEmptyStateView } from '../../truly-native'
import { useCurrentUser } from '../../onboarding'
import dynamicStyles from './styles'
import { useTheme, useTranslations } from 'dopenative'
import IMConversationIconView from '../IMConversationView/IMConversationIconView/IMConversationIconView'
import { SearchBarAlternate } from '../../index'

export const ForwardMessageModal = props => {
  const { isVisible, onDismiss, onSend } = props
  const currentUser = useCurrentUser()
  const { hydratedListWithChannelsAndFriends } = useChatChannelsAndFriends()

  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [sendIds, setSendIds] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [isSearch, setIsSearch] = useState(false)

  useEffect(() => {
    setSendIds([])
  }, [isVisible])

  const onSendActionButton = useCallback(
    item => {
      let tempArr = [...sendIds]
      tempArr.push(item?.id)
      setSendIds(tempArr)
      onSend && onSend(item)
    },
    [onSend, sendIds],
  )

  const renderActions = (displayActions, disabled, onSendButton) => {
    return (
      <View style={styles.sendFlexContainer}>
        <TouchableOpacity
          disabled={disabled}
          onPress={onSendButton}
          style={!disabled ? styles.sendButton : styles.disabledSendButton}>
          <Text
            style={!disabled ? styles.actionTitle : styles.disabledActionTitle}>
            {!disabled? localized('send'): localized('sent')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderConversationView = ({ item }) => {
    let title = item?.title
    if (!title && item?.participants?.length > 0) {
      title =
        item.participants[0]?.fullName ||
        item.participants[0]?.firstName + ' ' + item.participants[0]?.lastName
    }

    return (
      <View style={styles.conversationViewContainer}>
        <View style={styles.conversationIconContainer}>
          <IMConversationIconView
            participants={
              item?.admins?.length
                ? item.participants
                : item.participants.filter(value => {
                    return value?.id !== currentUser?.id
                  })
            }
          />
          <Text style={styles.conversationTitle}>{title}</Text>
        </View>
        {renderActions(true, sendIds.includes(item?.id), () =>
          onSendActionButton(item),
        )}
        <View style={styles.divider} />
      </View>
    )
  }

  const emptyStateConfig = {
    title: localized('No Conversations'),
    description: localized(
      'Add some friends and start chatting with them. Your conversations will show up here.',
    ),
  }

  const onChangeText = text => {
    if (text.length === 0) {
      setIsSearch(false)
    } else {
      let filteredArr = hydratedListWithChannelsAndFriends.filter(item =>
        item?.title?.toLowerCase().includes(text?.toLowerCase()),
      )
      setSearchResults(filteredArr)
      setIsSearch(true)
    }
  }

  return (
    <Modal
      style={styles.modal}
      transparent={true}
      animationType="slide"
      isVisible={isVisible}
      onBackdropPress={() => onDismiss()}
      onDismiss={() => onDismiss()}>
      <View style={styles.forwardMessageMainContainer}>
        <SearchBarAlternate
          onPress={() => {}}
          placeholderTitle={localized('Search for friends')}
          onChangeText={onChangeText}
          onSearchBarCancel={onDismiss}
        />
        <FlatList
          vertical={true}
          style={styles.forwardMessageFlatListContainer}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={isSearch ? searchResults : hydratedListWithChannelsAndFriends}
          renderItem={renderConversationView}
          keyExtractor={item => `${item.id}`}
          removeClippedSubviews={false}
          ListEmptyComponent={
            <View style={styles.emptyViewContainer}>
              <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
            </View>
          }
        />
      </View>
    </Modal>
  )
}
