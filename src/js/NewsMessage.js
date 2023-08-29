import creatNews from './creatMessage';
import creatLoading from './createLoading';

export default class NewsMessage {
  constructor() {
    this.container = document.querySelector('.container');
    this.newsList = this.container.querySelector('.news__list');
    this.error = this.container.querySelector('.error');
    this.data = null;
    this.url = 'http://localhost:3000/news';
  }

  init() {
    this.addSWorker();
    creatLoading();
    this.createRequest();
  }

  async createRequest() { // запрос
    try {
      const request = await fetch(this.url);
      this.data = await request.json();
      console.log(this.data);
      this.newsList.replaceChildren();
      this.data.news.forEach((element) => {
        creatNews(element.id, element.image, element.description, element.received);
      });
    } catch (err) {
      console.log('Error: ', err);
      if (this.error.classList.contains('d__none')) { // банер при неудачной загрузки
        this.error.classList.remove('d__none');
      }
    }
  }

  addSWorker() {
    if (!this.error.classList.contains('d__none')) { // убрать банер
      this.error.classList.add('d__none');
    }

    if ('serviceWorker' in navigator) { // создаем экземпляр. Проверка наличия api  сервис воркера в объекте навигатор
      navigator.serviceWorker.register('/service-worker.js', { scope: './' }) // , ./ корень сайта  путь, опции/ scope: - это папка внутри сайта на которую будут применятся дествия сервис воркера т.е. это те url которые будут проходить через сервис воркер
        .then((reg) => { // создаем экземпляр. О регистрации сервис воркера расположеного в файле по передоваемому урлу
          console.log(`registration succeded/ Scope is ${reg.scope}`);
        }).catch((error) => {
          console.log(`registration failed with ${error}`);
        });
    }// проверка наличия сервис воркера
  }
}
