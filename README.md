# fetchutils

Make the `fetch` API great again! This library is a very simple interface on
top of the `fetch` API - so that you don't need to parse stuff or deal with
issues.

This library doesn't include a polyfill - if you need one, make sure to
import it as well!
[`isomorphic-fetch`](https://github.com/matthew-andrews/isomorphic-fetch) is a
great alternative.

## Usage

First, install it:

```bash
$ yarn add fetchutils # or npm install --save fetchutils
```

Then, use it!

```javascript
import { get, post, put, del } from 'fetchutils';

function getUsers() {
    return get('/api/users');
}

function saveUser(user) {
    return post('/api/users', user);
}

function updateUser(user), {
    return put(`/api/users/${user.id}`, user);
}

function deleteUser(user) {
    return del(`/api/users/${user.id}`);
}
```

Each of the methods returns a promise, with the first argument being the parsed
result (either text or JSON, based on content type). **The method will throw if
the response code is >= 400**, also then with the parsed result.

The error thrown is of the type `FetchError`, with the following properties:

```javascript
{
    message,    // The status code description
    status,     // The status code
    details,    // The parsed response from the server
}
```

### Send data

You can send data with your request as the second argument to each function.
If the method is `get`, the argument will be turned into get-parameters.
Otherwise, the second argument is run through `JSON.stringify()` and sent as
the body.

#### Example:

```javascript
import { get, post } from 'fetchutils';

// Produces a get-request for /api/users?search=stuff&limit=10
function searchUsers(query, limit = 10) {
    return get('/api/users', { search: query, limit });
}

// Produces a post-request with {"name": "Scott", "age": 42} as a body
function addUser(name, age) {
    return post('/api/users', { name, age });
}
```

### But...

Yep, this is pretty opinionated. So if you want to override or add headers,
or send some more parameters to the `fetch` function - send all of those in as
a third parameter. Here's an example:

```javascript
import { get } from 'fetchutils';

function getUsersFromMyApp() {
    return get('http://www.some-api.io/api/users', {
        headers: { 'X-Requested-By': 'my-application' },
        mode: 'cors',
    });
}
```

## That's it!

This library is small on purpose. If you need a feature I haven't thought of,
create a new issue, and - if you're cool - submit a pull request.
