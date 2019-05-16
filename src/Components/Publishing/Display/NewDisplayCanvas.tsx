import { color, Flex } from "@artsy/palette"
import { ErrorBoundary } from "Components/ErrorBoundary"
import { isHTLAdEnabled } from "Components/Publishing/Ads/EnabledAd"
import { AdDimension, AdUnit } from "Components/Publishing/Typings"
import React from "react"
import styled from "styled-components"

interface DisplayCanvasProps {
  adUnit?: AdUnit
  adDimension?: AdDimension
}

export class NewDisplayCanvas extends React.Component<DisplayCanvasProps> {
  displayCanvasRef: HTMLDivElement

  shouldComponentUpdate() {
    if (this.displayCanvasRef.hasChildNodes()) {
      return false
    } else {
      return true
    }
  }

  render() {
    const { adUnit, adDimension } = this.props

    if (!isHTLAdEnabled()) {
      return null
    }
    return (
      <ErrorBoundary>
        <DisplayCanvasContainer
          flexDirection="column"
          width="970px"
          height="250px"
          maxWidth="1250px"
        >
          <div
            className="htl-ad"
            data-unit={adUnit}
            data-sizes={adDimension}
            data-eager
            ref={div => {
              this.displayCanvasRef = div
            }}
          />
        </DisplayCanvasContainer>
      </ErrorBoundary>
    )
  }
}

export const DisplayCanvasContainer = styled(Flex)`
  border: 1px solid ${color("black10")};
  min-height: fit-content;
  max-width: 1250px;
  margin: 0 auto;
  box-sizing: border-box;
  a {
    text-decoration: none;
  }
`

// Set names for tests and DOM
DisplayCanvasContainer.displayName = "DisplayCanvasContainer"
