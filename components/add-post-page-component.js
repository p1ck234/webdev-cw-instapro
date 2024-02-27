import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    let imageUrl = "";

    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
              Добавить пост
                </h3>
              <div class="form-inputs">
              <div class="upload-image-container"></div>
              
                  
                  
                  <textarea id="description" class="input textarea" placeholder="Опишите фотографию"></textarea>
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="add-button">Добавить</button>
              </div>
          </div>
      </div> 
    
  `;

    appEl.innerHTML = appHtml;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }
    const descriptionElement = document.getElementById("description");

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: descriptionElement.value,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
