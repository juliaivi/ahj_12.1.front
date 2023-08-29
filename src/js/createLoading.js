export default function creatLoading() {
  const newsList = document.querySelector('.news__list');
  const boxText = `
      <div class="news">
      <div class="news__date loading "></div>
      <div class="news__content ">
        <div class="news__img__box loading">
          <img>
        </div>
        <div class="news__text ">
        <p class="loader__title loading"></p>
        <p class="loader__title loading"></p>
        <p class="loader__title loading"></p>
        </div>
      </div>
    </div>
`;
  for (let i = 0; i < 3; i++) {
    newsList.insertAdjacentHTML('afterbegin', boxText);
  }
}
