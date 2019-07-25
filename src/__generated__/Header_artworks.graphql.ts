/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { DefaultHeader_headerArtworks$ref } from "./DefaultHeader_headerArtworks.graphql";
import { FollowArtistButton_artist$ref } from "./FollowArtistButton_artist.graphql";
declare const _Header_artworks$ref: unique symbol;
export type Header_artworks$ref = typeof _Header_artworks$ref;
export type Header_artworks = {
    readonly merchandisable_artists: ReadonlyArray<({
        readonly id: string;
        readonly _id: string;
        readonly name: string | null;
        readonly imageUrl: string | null;
        readonly birthday: string | null;
        readonly nationality: string | null;
        readonly " $fragmentRefs": FollowArtistButton_artist$ref;
    }) | null> | null;
    readonly " $fragmentRefs": DefaultHeader_headerArtworks$ref;
    readonly " $refType": Header_artworks$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Header_artworks",
  "type": "FilterArtworks",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "DefaultHeader_headerArtworks",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "merchandisable_artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "_id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "imageUrl",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "birthday",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "nationality",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "FollowArtistButton_artist",
          "args": null
        },
        v0
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '9f9af55c7e48a35977a2d4c5fa50c4e6';
export default node;
