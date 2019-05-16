import { Box, color, Flex } from "@artsy/palette"
import { pMedia as breakpoint } from "Components/Helpers"
import { isHTLAdEnabled } from "Components/Publishing/Ads/EnabledAd"
import { AdDimension, AdUnit } from "Components/Publishing/Typings"
import React from "react"
import styled from "styled-components"
import { ErrorBoundary } from "../../ErrorBoundary"

export interface DisplayPanelProps extends React.HTMLProps<HTMLDivElement> {
  adUnit?: AdUnit
  adDimension?: AdDimension
}

export class NewDisplayPanel extends React.Component<DisplayPanelProps> {
  displayPanelRef: HTMLDivElement

  shouldComponentUpdate() {
    if (this.displayPanelRef.hasChildNodes()) {
      return false
    } else {
      return true
    }
  }
  render() {
    const { adDimension, adUnit } = this.props
    if (!isHTLAdEnabled()) {
      return null
    }

    return (
      <ErrorBoundary>
        <Wrapper color="black100">
          <DisplayPanelContainer
            flexDirection="column"
            className="DisplayPanel__DisplayPanelContainer"
          >
            <div
              className="htl-ad"
              data-unit={adUnit}
              data-sizes={adDimension}
              data-eager
              ref={div => {
                this.displayPanelRef = div
              }}
            />
          </DisplayPanelContainer>
        </Wrapper>
      </ErrorBoundary>
    )
  }
}

const Wrapper = styled(Box)`
  cursor: pointer;
  text-decoration: none;
  max-width: 360px;
  width: 350px;
  height: 300px;
  margin: 0 auto;

  ${breakpoint.sm`
    margin: 0 auto;
  `};
`

const DisplayPanelContainer = styled(Flex)`
  border: 1px solid ${color("black10")};
  padding: 20px;
  max-width: 360px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  ${breakpoint.md`
    margin: auto;
  `};
  ${breakpoint.sm`
    margin: auto;
  `};
  ${breakpoint.xs`
    margin: auto;
  `};
`

// Set names for tests and DOM
DisplayPanelContainer.displayName = "DisplayPanelContainer"
Wrapper.displayName = "Wrapper"
