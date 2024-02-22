import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { sanitizeHtml } from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = posts.map((comment) => {
    const commentUser = comment.likes.map((name) =>{
      console.log(name.name);
    })
    return `<div class="page-container">
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
              Нравится: <strong>${comment.likes}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${comment.user.name}</span>
           ${comment.description}
          </p>
          <p class="post-date">
            19 минут назад
          </p>
        </li>
        <li class="post">
          <div class="post-header" data-user-id="6425602ce156b600f7858df2">
              <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png" class="post-header__user-image">
              <p class="post-header__user-name">Варварва Н.</p>
          </div></div>`;
  });

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
