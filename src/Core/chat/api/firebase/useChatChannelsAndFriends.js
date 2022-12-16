import { useEffect, useState } from 'react'
import { useChatChannels } from './useChatChannels'
import { useSocialGraphFriends } from '../../../socialgraph/friendships'
import { useCurrentUser } from '../../../onboarding'

export const useChatChannelsAndFriends = () => {
  const currentUser = useCurrentUser()
  const { channels, subscribeToChannels } = useChatChannels()
  const { friends } = useSocialGraphFriends(currentUser?.id)
  const [
    hydratedListWithChannelsAndFriends,
    setHydratedListWithChannelsAndFriends,
  ] = useState([])

  useEffect(() => {
    const unsubscribe = subscribeToChannels(currentUser?.id)
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [currentUser?.id])

  useEffect(() => {
    deduplicatedFriends()
  }, [friends, channels])

  const deduplicatedFriends = () => {
    if (!friends?.length || !channels?.length) {
      return friends || channels || []
    }

    let all = channels ? [...channels] : []

    friends?.map(friend => {
      const id1 = currentUser.id || currentUser.userID
      const id2 = friend.id || friend.userID
      if (id1 !== id2) {
        all.push({
          id: id1 < id2 ? id1 + id2 : id2 + id1,
          participants: [friend],
        })
      }
    })

    const deduplicatedList = all.reduce((acc, curr) => {
      if (!acc.some(friend => friend.id === curr.id)) {
        acc.push(curr)
      }
      return acc
    }, [])

    setHydratedListWithChannelsAndFriends(deduplicatedList)
  }

  return {
    hydratedListWithChannelsAndFriends,
  }
}
