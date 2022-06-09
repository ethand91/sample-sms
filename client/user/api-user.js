const create = async (user) => {
  try {
  console.log(user)
    const response = await fetch('/api/users/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const list = async (signal) => {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      signal
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const read = async (params, credentials, signal) => {
console.log('read', params)
  try {
    const response = await fetch('/api/users/' + params.userId, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const update = async (params, credentials, user) => {
console.log(user);
console.log(credentials);
  try {
    const response = await fetch('/api/users/' + params.userId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: user
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const remove = async (params, credentials) => {
  try {
    const response = await fetch('/api/users/' + params.userId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const follow = async (params, credentials, followId) => {
  try {
    const response = await fetch('/api/users/follow/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ userId: params.userId, followId })
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const unfollow = async (params, credentials, unfollowId) => {
  try {
    const response = await fetch('/api/users/unfollow/', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify({ userId: params.userId, unfollowId })
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const findPeople = async (params, credentials, signal) => {
  try {
    const response = await fetch('/api/users/findpeople/' + params.userId, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export {
  create,
  list,
  read,
  update,
  remove,
  follow,
  unfollow,
  findPeople
};
