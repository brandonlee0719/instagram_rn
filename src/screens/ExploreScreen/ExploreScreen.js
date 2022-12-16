import React, {
  useCallback,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Platform } from 'react-native'
import { useTheme, useTranslations } from 'dopenative'
import { Explore } from '../../components'
import { TNTouchableIcon } from '../../Core/truly-native'
import { useDiscoverPosts } from '../../Core/socialgraph/feed'
import { useCurrentUser } from '../../Core/onboarding'

export default function ExploreScreen({ navigation, route }) {
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()

  const {
    batchSize,
    posts,
    refreshing,
    loadMorePosts,
    pullToRefresh,
    isLoadingBottom,
  } = useDiscoverPosts()
  const currentUser = useCurrentUser()

  useLayoutEffect(() => {
    const colorSet = theme.colors[appearance]

    navigation.setOptions({
      headerTitle: localized('Explore'),
      headerLeft: () =>
        Platform.OS === 'android' && (
          <TNTouchableIcon
            imageStyle={{ tintColor: colorSet.primaryText }}
            iconSource={theme.icons.menuHamburger}
            onPress={openDrawer}
          />
        ),
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: colorSet.primaryBackground,
        borderBottomColor: colorSet.hairline,
      },
      headerTintColor: colorSet.primaryText,
    })
  }, [])

  useEffect(() => {
    if (currentUser?.id) {
      loadMorePosts(currentUser?.id)
    }
  }, [currentUser?.id])

  const openDrawer = () => {
    navigation.openDrawer()
  }

  const onMediaPress = useCallback(({ item }) => {
    const copyItem = { ...item }
    navigation.navigate('DiscoverDetailPost', {
      item: { ...copyItem },
      lastScreenTitle: 'Discover',
    })
  }, [])

  const handleOnEndReached = useCallback(
    distanceFromEnd => {
      if (posts.length >= batchSize) {
        loadMorePosts(currentUser?.id)
      }
    },
    [loadMorePosts, currentUser?.id, posts],
  )

  const pullToRefreshConfig = useMemo(
    () => ({
      refreshing: refreshing,
      onRefresh: () => {
        pullToRefresh(currentUser?.id)
      },
    }),
    [],
  )

  const emptyStateConfig = {
    title: localized('No Explore Posts'),
    description: localized(
      "There are currently no posts from people you don't follow. Posts from non-followers will show up here.",
    ),
  }

  return (
    <Explore
      feed={posts}
      loading={posts == null}
      onMediaPress={onMediaPress}
      videoResizeMode={'cover'}
      handleOnEndReached={handleOnEndReached}
      pullToRefreshConfig={pullToRefreshConfig}
      isLoadingBottom={isLoadingBottom}
      emptyStateConfig={emptyStateConfig}
    />
  )
}
