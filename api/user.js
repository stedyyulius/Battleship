import db from '../firebase/clientApp'

export const saveUserClient = (user) => {
  db.ref('users/' + user.id).set(user);

  return null;
}

export const getUserById = async (id) => {
  if (id) {
    const data = await db.ref('users').child(id).once('value');

    return data;
  }

  return null;

}

export const updateUser = details => {
  const userRef = db.ref(`users/${details.id}`);
  userRef.update(details);

  return null;
}

