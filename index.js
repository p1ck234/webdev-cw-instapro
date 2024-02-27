import { getPosts, addPost, getPostsUser } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import { ru } from "date-fns/locale";
import { sanitizeHtml } from "./helpers.js";
import { formatDistanceToNow } from "date-fns";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = async (newPage, data) => {
  if (
    [
      POSTS_PAGE,
      AUTH_PAGE,
      ADD_POSTS_PAGE,
      USER_POSTS_PAGE,
      LOADING_PAGE,
    ].includes(newPage)
  ) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      // TODO: реализовать получение постов юзера из API
      let id = data.userId;
      console.log("Открываю страницу пользователя: ", data.userId);
      posts = await getPostsUser({ id });
      page = USER_POSTS_PAGE;
      return renderApp();
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
      user,
      goToPage,
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        // TODO: реализовать добавление поста в API
        addPost({ token: getToken(), description, imageUrl });
        console.log("Добавляю пост...", { description, imageUrl });
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
    });
  }

  if (page === USER_POSTS_PAGE) {
    // TODO: реализовать страницу фотографию пользвателя

    const appHtml = posts.map((comment) => {
      return `<div class="posts-user-header">
       <img src="${
         comment.user.imageUrl
       }" class="posts-user-header__user-image">
       <p class="posts-user-header__user-name">${comment.user.name}</p>
   </div>
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      <li class="post">
        <div class="post-header" data-user-id="${comment.id}">
            <img src="${comment.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${comment.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${comment.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${comment.id}" class="like-button">
            <img src="./assets/images/like-active.svg">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${comment.likes.map((name) => {
              return sanitizeHtml(name.name);
            })}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${comment.user.name}</span>
         ${comment.description}
        </p>
        <p class="post-date">
          ${formatDistanceToNow(comment.createdAt, new Date(), {
            locale: ru,
          })}
        </p>
      </li>
        </div>`;
    });
    appEl.innerHTML = appHtml;
    return;
  }
};

goToPage(POSTS_PAGE);
