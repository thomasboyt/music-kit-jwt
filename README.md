# @tboyt/music-kit-jwt

Based on the snippet here: https://medium.com/@leemartin/creating-an-apple-music-api-token-e0e5067e4281

Beefed up a bit for production use, since I'm really bad at remembering to set environment variables. Made in TypeScript since I'm using it in a TS project.

## Usage

```js
const token = generateMusicKitToken({
  teamId: 'abcde12345',
  keyId: 'abcde12345',
  pathToPrivateKey: '/path/to/private/key.p8',
});
```

or:

```js
const token = generateMusicKitToken({
  teamId: 'abcde12345',
  keyId: 'abcde12345',
  // if you are loading your private key from something other than a file
  privateKeyContent: '...',
});
```