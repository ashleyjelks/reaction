import { Box } from "@artsy/palette"
import { storiesOf } from "@storybook/react"
import React from "react"

import { UserSettingsTwoFactorAuthenticationFragmentContainer } from "../UserSettingsTwoFactorAuthentication"

import { SystemContextProvider, useSystemContext } from "Artsy"
import { renderWithLoadProgress } from "Artsy/Relay/renderWithLoadProgress"
import { graphql, QueryRenderer } from "react-relay"

import { UserSettingsTwoFactorAuthenticationStoryQuery } from "__generated__/UserSettingsTwoFactorAuthenticationStoryQuery.graphql"

const UserSettingsTwoFactorAuthenticationStoryQueryRenderer: React.FC = () => {
  const { relayEnvironment } = useSystemContext()

  return (
    <QueryRenderer<UserSettingsTwoFactorAuthenticationStoryQuery>
      environment={relayEnvironment}
      query={graphql`
        query UserSettingsTwoFactorAuthenticationStoryQuery @raw_response_type {
          me {
            ...UserSettingsTwoFactorAuthentication_me
          }
        }
      `}
      variables={{}}
      render={renderWithLoadProgress(
        UserSettingsTwoFactorAuthenticationFragmentContainer
      )}
    />
  )
}

storiesOf("Settings/2FA", module).add("Setup", () => {
  return (
    <SystemContextProvider>
      <Box maxWidth="800px">
        <UserSettingsTwoFactorAuthenticationStoryQueryRenderer />
      </Box>
    </SystemContextProvider>
  )
})
