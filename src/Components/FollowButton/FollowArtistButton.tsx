import React from "react"
import {
  commitMutation,
  createFragmentContainer,
  graphql,
  RelayProp,
} from "react-relay"
import { FollowButton } from "./Button"
import * as Artsy from "../Artsy"

export interface Props
  extends RelayProps,
    React.HTMLProps<FollowArtistButton>,
    Artsy.ContextProps {
  relay?: RelayProp
}

interface RelayProps {
  artist?: {
    __id: string
    id: string
    is_followed: boolean | null
  }
}

interface State {
  showUnfollow: boolean
}

export class FollowArtistButton extends React.Component<Props, State> {
  state = {
    showUnfollow: false,
  }

  handleFollow = () => {
    const { artist, currentUser, relay } = this.props

    if (currentUser && currentUser.id) {
      commitMutation(relay.environment, {
        mutation: graphql`
          mutation FollowArtistButtonMutation($input: FollowArtistInput!) {
            followArtist(input: $input) {
              artist {
                is_followed
              }
            }
          }
        `,
        variables: {
          input: {
            artist_id: artist.id,
            unfollow: artist.is_followed,
          },
        },
        optimisticResponse: {
          followArtist: {
            artist: {
              __id: artist.__id,
              is_followed: !artist.is_followed,
            },
          },
        },
      })
    } else {
      // TODO: trigger signup/login modal
      window.location.href = "/login"
    }
  }

  render() {
    const { artist } = this.props

    return (
      <FollowButton
        isFollowed={artist && artist.is_followed}
        handleFollow={this.handleFollow}
      />
    )
  }
}

export default createFragmentContainer(
  FollowArtistButton,
  graphql`
    fragment FollowArtistButton_artist on Artist {
      __id
      id
      is_followed
    }
  `
)
