export default function creatNews(id, image, description, received) {
  const newsList = document.querySelector('.news__list');
  const boxText = `
                <div class="news data-id="${id}">
                <div class="news__date">${received}</div>
                <div class="news__content ">
                  <div class="news__img__box">
                    <img src="${image}" alt="image">
                  </div>
                  <div class="news__text ">
                  <p class="loader__title">${description}</p>
                  </div>
                </div>
              </div>
      `;
  newsList.insertAdjacentHTML('afterbegin', boxText);
}
