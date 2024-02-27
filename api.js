// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "prod";
const baseHost = " https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function getPosts({ token }) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      console.log(data.posts);
      return data.posts;
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Такой пользователь уже существует");
      }
      return response.json();
    })
    .catch((error) => {
      if (error.message === "Такой пользователь уже существует") {
        alert("Такой пользователь уже существует");
      } else alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error("Неверный логин или пароль");
      }
      return response.json();
    })
    .catch((error) => {
      if (error.message === "Неверный логин или пароль") {
        alert("Неверный логин или пароль");
      } else alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}

export function addPost({ token, description, imageUrl }) {
  return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description,
      imageUrl,
    }),
    headers: {
      Authorization: token,
    },
  });
}

export function getPostsUser({ id }) {
  return fetch(postsHost + "/user-posts/" + id, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.posts);
      return data.posts;
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        alert("Нет авторизации");
      } else alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}

export function likePost(token, id) {
  return fetch(postsHost + `/${id}/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        alert("Нет авторизации");
      } else alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}
export function disLikePost(token, id) {
  return fetch(postsHost + `/${id}/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .catch((error) => {
      if (error.message === "Нет авторизации") {
        alert("Нет авторизации");
      } else alert("Кажется, у вас сломался интернет, попробуйте позже");
    });
}
