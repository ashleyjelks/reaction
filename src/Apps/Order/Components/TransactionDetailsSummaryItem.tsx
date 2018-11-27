import { TransactionDetailsSummaryItem_order } from "__generated__/TransactionDetailsSummaryItem_order.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import {
  Flex,
  FlexProps,
  Sans,
  Serif,
  Spacer,
  StackableBorderBox,
} from "@artsy/palette"

export interface TransactionDetailsSummaryItemProps extends FlexProps {
  order: TransactionDetailsSummaryItem_order
  offerOverride?: string | null
}

export class TransactionDetailsSummaryItem extends React.Component<
  TransactionDetailsSummaryItemProps
> {
  render() {
    const {
      offerOverride,
      order: { mode, myLastOffer },
      order,
      ...others
    } = this.props
    return (
      <StackableBorderBox flexDirection="column" {...others}>
        {mode === "OFFER"
          ? this.offerTotalsComponent(order, myLastOffer, offerOverride)
          : this.orderTotalsComponent(order)}
      </StackableBorderBox>
    )
  }

  private offerTotalsComponent = (order, offer, offerOverride) => {
    return (
      <>
        {/* TODO: Seller's offer / Your offer (/ Buyer's offer? Will sellers see this component?) */}
        <Entry label="Your offer" value={offerOverride || offer.amount} />
        <SecondaryEntry label="List price" value={order.totalListPrice} />
        <Spacer mb={2} />
        <Entry
          label="Shipping"
          value={
            this.formattedAmount(
              offer.shippingTotal,
              offer.shippingTotalCents
            ) || "—"
          }
        />
        <Entry
          label="Tax"
          value={
            this.formattedAmount(offer.taxTotal, offer.taxTotalCents) || "—"
          }
        />
        <Spacer mb={2} />
        <Entry
          label="Total"
          value={
            offer.taxTotalCents + offer.shippingTotalCents + offer.amountCents
          }
          final
        />
      </>
    )
  }

  private orderTotalsComponent = order => {
    return (
      <>
        <Entry label="Price" value={order.itemsTotal} />
        <Entry
          label="Shipping"
          value={
            this.formattedAmount(
              order.shippingTotal,
              order.shippingTotalCents
            ) || "—"
          }
        />
        <Entry
          label="Tax"
          value={
            this.formattedAmount(order.taxTotal, order.taxTotalCents) || "—"
          }
        />
        <Spacer mb={2} />
        <Entry label="Total" value={order.buyerTotal} final />
      </>
    )
  }

  private formattedAmount = (amount, amountCents) => {
    // FIXME: Use actual currency code
    if (amount) {
      return amount
    } else {
      return amountCents === 0 ? "$0.00" : null
    }
  }
}

interface SecondaryEntryProps {
  label: React.ReactNode
  value: React.ReactNode
}

interface EntryProps extends SecondaryEntryProps {
  final?: boolean
}

const Entry: React.SFC<EntryProps> = ({ label, value, final }) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <div>
      <Serif size={["2", "3"]} color="black60">
        {label}
      </Serif>
    </div>
    <div>
      <Serif
        size={["2", "3"]}
        color={final ? "black100" : "black60"}
        weight={final ? "semibold" : "regular"}
      >
        {value}
      </Serif>
    </div>
  </Flex>
)

const SecondaryEntry: React.SFC<SecondaryEntryProps> = ({ label, value }) => (
  <Flex justifyContent="space-between" alignItems="baseline">
    <div>
      <Sans size="2" color="black60">
        {label}
      </Sans>
    </div>
    <div>
      <Sans size="2" color="black60">
        {value}
      </Sans>
    </div>
  </Flex>
)

export const TransactionDetailsSummaryItemFragmentContainer = createFragmentContainer(
  TransactionDetailsSummaryItem,
  graphql`
    fragment TransactionDetailsSummaryItem_order on Order {
      mode
      shippingTotal(precision: 2)
      shippingTotalCents
      taxTotal(precision: 2)
      taxTotalCents
      itemsTotal(precision: 2)
      totalListPrice(precision: 2)
      buyerTotal(precision: 2)
      lastOffer {
        id
        amountCents
      }
      ... on OfferOrder {
        myLastOffer {
          id
          amount(precision: 2)
          amountCents
          shippingTotal(precision: 2)
          shippingTotalCents
          taxTotal(precision: 2)
          taxTotalCents
        }
      }
    }
  `
)
