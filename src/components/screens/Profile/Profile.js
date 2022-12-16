import React, { useRef } from 'react'
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import ActionSheet from 'react-native-actionsheet'
import * as ImagePicker from 'expo-image-picker'
import { TNStoryItem } from '../../../Core/truly-native'
import FeedMedia from '../../FeedItem/FeedMedia'
import ProfileButton from './ProfileButton'
import dynamicStyles from './styles'
import { TNEmptyStateView } from '../../../Core/truly-native'

function Profile(props) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const {
    onMainButtonPress,
    recentUserFeeds,
    user,
    mainButtonTitle,
    removePhoto,
    startUpload,
    uploadProgress,
    loading,
    handleOnEndReached,
    isFetching,
    isOtherUser,
    onFollowingButtonPress,
    onFollowersButtonPress,
    onPostPress,
    followingCount,
    followersCount,
    postCount,
    onEmptyStatePress,
    pullToRefreshConfig,
  } = props
  const { onRefresh, refreshing } = pullToRefreshConfig

  const updatePhotoDialogActionSheet = useRef()
  const photoUploadDialogActionSheet = useRef()

  const onProfilePicturePress = () => {
    if (isOtherUser) {
      return
    }
    updatePhotoDialogActionSheet.current.show()
  }

  const onUpdatePhotoDialogDone = index => {
    if (index === 0) {
      photoUploadDialogActionSheet.current.show()
    }

    if (index === 1) {
      removePhoto()
    }
  }

  const onPhotoUploadDialogDone = index => {
    if (index === 0) {
      onLaunchCamera()
    }

    if (index === 1) {
      onOpenPhotos()
    }
  }

  const onLaunchCamera = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync()

    if (permissionResult.granted === false) {
      return
    }

    let result = await ImagePicker.launchCameraAsync()

    if (result?.uri) {
      startUpload(result)
    }
  }

  const onOpenPhotos = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync()

    if (permissionResult.granted === false) {
      return
    }

    let result = await ImagePicker.launchImageLibraryAsync()

    if (result?.uri) {
      startUpload(result)
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <FeedMedia
        key={index + ''}
        index={index}
        onMediaPress={onPostPress}
        media={item.postMedia && item.postMedia[0]}
        item={item}
        mediaStyle={styles.gridItemImage}
        mediaContainerStyle={styles.gridItemContainer}
        dynamicStyles={styles}
        showVideo={false}
      />
    )
  }

  renderListFooter = () => {
    if (loading) {
      return null
    }
    if (isFetching) {
      return <ActivityIndicator style={{ marginVertical: 7 }} size="small" />
    }
    return null
  }

  const renderListHeader = () => {
    return (
      <View style={styles.subContainer}>
        <View style={styles.userCardContainer}>
          <TNStoryItem
            item={user}
            imageStyle={styles.userImage}
            imageContainerStyle={styles.userImageContainer}
            containerStyle={styles.userImageMainContainer}
            activeOpacity={1}
            title={true}
            onPress={onProfilePicturePress}
            textStyle={styles.userName}
            displayVerifiedBadge={true}
          />
          <View style={styles.countItemsContainer}>
            <TouchableOpacity activeOpacity={1} style={styles.countContainer}>
              <Text style={styles.count}>{postCount}</Text>
              <Text style={styles.countTitle}>
                {postCount != 1 ? localized('Posts') : localized('Post')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onFollowersButtonPress}
              style={styles.countContainer}>
              <Text style={styles.count}>{followersCount}</Text>
              <Text style={styles.countTitle}>
                {followersCount != 1
                  ? localized('Followers')
                  : localized('Follower')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={onFollowingButtonPress}
              style={styles.countContainer}>
              <Text style={styles.count}>{followingCount}</Text>
              <Text style={styles.countTitle}>{localized('Following')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProfileButton
          title={mainButtonTitle}
          containerStyle={{ marginVertical: 40 }}
          onPress={onMainButtonPress}
        />
        {loading ? (
          <View style={styles.container}>
            <ActivityIndicator
              style={{ marginTop: 15, alignSelf: 'center' }}
              size="small"
            />
          </View>
        ) : (
          <View style={styles.FriendsContainer}></View>
        )}
      </View>
    )
  }

  const renderEmptyComponent = () => {
    var emptyStateConfig = {
      title: localized('No Posts'),
      description: localized(
        'There are currently no posts on this profile. All the posts will show up here.',
      ),
    }
    if (!isOtherUser) {
      emptyStateConfig = {
        ...emptyStateConfig,
        buttonName: localized('Add Your First Post'),
        onPress: onEmptyStatePress,
      }
    }
    return <TNEmptyStateView emptyStateConfig={emptyStateConfig} />
  }
  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
      <FlatList
        data={recentUserFeeds}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.3}
        numColumns={3}
        horizontal={false}
        onEndReached={handleOnEndReached}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyComponent}
        style={{ width: '97%' }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />

      <ActionSheet
        ref={updatePhotoDialogActionSheet}
        title={localized('Profile Picture')}
        options={[
          localized('Change Photo'),
          localized('Remove'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={onUpdatePhotoDialogDone}
      />
      <ActionSheet
        ref={photoUploadDialogActionSheet}
        title={localized('Select Photo')}
        options={[
          localized('Camera'),
          localized('Library'),
          localized('Cancel'),
        ]}
        cancelButtonIndex={2}
        onPress={onPhotoUploadDialogDone}
      />
    </View>
  )
}

export default Profile
