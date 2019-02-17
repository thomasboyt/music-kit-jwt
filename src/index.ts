import fs from 'fs';
import jwt from 'jsonwebtoken';

interface BaseParams {
  teamId: string;
  keyId: string;
}

interface PrivateKeyContentParams extends BaseParams {
  privateKeyContent: string;
  pathToPrivateKey?: never;
}

interface PrivateKeyFileParams extends BaseParams {
  pathToPrivateKey: string;
  privateKeyContent?: never;
}

type Params = PrivateKeyContentParams | PrivateKeyFileParams;

const errMsg = (msg: string): string => `generateMusicKitToken(): ${msg}`;

function ensureParams(obj: Record<string, any>, keys: string[]): void {
  for (let key of keys) {
    if (!obj[key]) {
      throw new Error(errMsg(`Missing required param ${key}`));
    }
  }
}

function ensureOneParam(obj: Record<string, any>, keys: string[]): void {
  if (!keys.some((key) => obj[key])) {
    throw new Error(errMsg(`Must supply at least one of: ${keys.join(', ')}`));
  }
}

function getPrivateKeyFromFile(pathname: string): string {
  if (!fs.existsSync(pathname)) {
    throw new Error(errMsg(`No private key found at path ${pathname}`));
  }

  return fs.readFileSync(pathname).toString();
}

export default function generateMusicKitToken(params: Params): string {
  ensureParams(params, ['teamId', 'keyId']);
  ensureOneParam(params, ['pathToPrivateKey', 'privateKeyContent']);

  const privateKey =
    'privateKeyContent' in params
      ? params.privateKeyContent
      : getPrivateKeyFromFile(params.pathToPrivateKey);

  const teamId = params.teamId;
  const keyId = params.keyId;

  const jwtToken = jwt.sign({}, privateKey, {
    algorithm: 'ES256',
    expiresIn: '180d',
    issuer: teamId,
    header: {
      alg: 'ES256',
      kid: keyId,
    },
  });

  return jwtToken;
}
