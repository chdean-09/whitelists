To check the whitelist status of your email, simply use the whitelists API.

```js
const response = await fetch("https://whitelists-two.vercel.app/api/check-status/<email>");

const data = await response.json();
```

The return type for the data should be:

```js
interface Whitelists {
  whitelisted: boolean;
  message: string;
}
```