import CryptoJS from 'crypto-js';

const appConfig = {
    appID:Number(import.meta.env.VITE_ZEGOCLOUD_API_KEY), // Fill in the AppID you applied for
    serverSecret:import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET , // Fill in the ServerSecret you applied for
};

/**
 * Generate token
 *
 * Token = "04" + Base64.encode(expire_time + IV.length + IV + binary_ciphertext.length + binary_ciphertext)
 * Algorithm: AES<ServerSecret, IV>(token_json_str), using mode: CBC/PKCS5Padding
 *
 * This code example only provides a client-side token generation example. Please make sure to generate tokens on your own server to avoid leaking your ServerSecret.
 */
export function generateZegoToken(userID, seconds) {
  if (!userID) return '';

  // Construct encrypted data
  const time = (Date.now() / 1000) | 0;
  const body = {
    app_id: appConfig.appID,
    user_id: userID,
    nonce: (Math.random() * 2147483647) | 0,
    ctime: time,
    expire: time + (seconds || 7200),  // The validity period should not exceed 24 days
  };
  // Encrypt the body
  const key = CryptoJS.enc.Utf8.parse(appConfig.serverSecret);
  let iv = Math.random().toString().substring(2, 18);
  if (iv.length < 16) iv += iv.substring(0, 16 - iv.length);

  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(body), key, { iv: CryptoJS.enc.Utf8.parse(iv) }).toString();
  const ciphert = new Uint8Array(Array.from(atob(ciphertext)).map((val) => val.charCodeAt(0)));
  const len_ciphert = ciphert.length;

  // Assemble token data
  const uint8 = new Uint8Array(8 + 2 + 16 + 2 + len_ciphert);
  // expire: 8
  uint8.set([0, 0, 0, 0]);
  uint8.set(new Uint8Array(new Int32Array([body.expire]).buffer).reverse(), 4);
  // iv length: 2
  uint8[8] = iv.length >> 8;
  uint8[9] = iv.length - (uint8[8] << 8);
  // iv: 16
  uint8.set(new Uint8Array(Array.from(iv).map((val) => val.charCodeAt(0))), 10);
  // ciphertext length: 2
  uint8[26] = len_ciphert >> 8;
  uint8[27] = len_ciphert - (uint8[26] << 8);
  // ciphertext
  uint8.set(ciphert, 28);

  const token = `04${btoa(String.fromCharCode(...Array.from(uint8)))}`;
  console.log('generateToken', iv.length, body, token);

  return token;
}