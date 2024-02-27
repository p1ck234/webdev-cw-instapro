import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { sanitizeHtml } from "../helpers.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { likePost, disLikePost } from "../api.js";

export function renderPostsPageComponent({ appEl, token }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);
  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */

  const appHtml = posts.map((comment) => {
    return `<div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        <li class="post">
          <div class="post-header" data-user-id="${comment.user.id}">
              <img src="${
                comment.user.imageUrl
              }" class="post-header__user-image">
              <p class="post-header__user-name">${comment.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${comment.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-postid="${comment.id}" class="like-button">
            <img id="img-like" src="${
              comment.isLiked
                ? "../assets/images/like-active.svg"
                : "../assets/images/like-not-active.svg"
            }">

            </button>
            <p class="post-likes-text">
              Нравится: <strong>${
                comment.likes && comment.likes.length > 0
                  ? comment.likes
                      .map((name) => sanitizeHtml(name.name))
                      .join(", ")
                  : 0
              }</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${comment.user.name}</span>
           ${sanitizeHtml(comment.description)}
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

  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", async () => {
      const likeImage = likeButton.querySelector("img");
      let commentID = likeButton.dataset.postid;

      if (likeImage.src.includes("like-active")) {
        // Dislike post
        await disLikePost(token, commentID);
        likeImage.src = "../assets/images/like-not-active.svg";
      } else {
        // Like post
        await likePost(token, commentID);
        likeImage.src = "../assets/images/like-active.svg";
      }
    });
  }
}
