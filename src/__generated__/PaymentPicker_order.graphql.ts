/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type OrderModeEnum = "BUY" | "OFFER" | "%future added value";
declare const _PaymentPicker_order$ref: unique symbol;
export type PaymentPicker_order$ref = typeof _PaymentPicker_order$ref;
export type PaymentPicker_order = {
    readonly id: string;
    readonly mode: OrderModeEnum | null;
    readonly state: string | null;
    readonly creditCard: ({
        readonly id: string;
        readonly name: string | null;
        readonly street1: string | null;
        readonly street2: string | null;
        readonly city: string | null;
        readonly state: string | null;
        readonly country: string | null;
        readonly postal_code: string | null;
        readonly expiration_month: number;
        readonly expiration_year: number;
        readonly last_digits: string;
        readonly brand: string;
    }) | null;
    readonly requestedFulfillment: ({
        readonly __typename: "Ship";
        readonly name: string | null;
        readonly addressLine1: string | null;
        readonly addressLine2: string | null;
        readonly city: string | null;
        readonly region: string | null;
        readonly country: string;
        readonly postalCode: string | null;
    } | {
        readonly __typename: "Pickup";
        readonly fulfillmentType: string | null;
    } | {
        /*This will never be '% other', but we need some
        value in case none of the concrete values match.*/
        readonly __typename: "%other";
    }) | null;
    readonly lineItems: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly artwork: ({
                    readonly id: string;
                }) | null;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": PaymentPicker_order$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "state",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "country",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "city",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "PaymentPicker_order",
  "type": "Order",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "mode",
      "args": null,
      "storageKey": null
    },
    v1,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "creditCard",
      "storageKey": null,
      "args": null,
      "concreteType": "CreditCard",
      "plural": false,
      "selections": [
        v2,
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "street1",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "street2",
          "args": null,
          "storageKey": null
        },
        v3,
        v1,
        v4,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "postal_code",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "expiration_month",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "expiration_year",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "last_digits",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "brand",
          "args": null,
          "storageKey": null
        },
        v5
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "requestedFulfillment",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "type": "Pickup",
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "fulfillmentType",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "InlineFragment",
          "type": "Ship",
          "selections": [
            v4,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "addressLine1",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "addressLine2",
              "args": null,
              "storageKey": null
            },
            v3,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "region",
              "args": null,
              "storageKey": null
            },
            v2,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "postalCode",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "lineItems",
      "storageKey": null,
      "args": null,
      "concreteType": "OrderLineItemConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "OrderLineItemEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "OrderLineItem",
              "plural": false,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artwork",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Artwork",
                  "plural": false,
                  "selections": [
                    v0,
                    v5
                  ]
                },
                v5
              ]
            }
          ]
        }
      ]
    },
    v5
  ]
};
})();
(node as any).hash = '46e3cc411f464aef2e6375f60a165ad0';
export default node;
