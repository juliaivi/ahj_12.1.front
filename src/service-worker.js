// добавление заглушек для обрабтки событий
const FETCH_PRIORITY_URLS = ['/', '/index.html', '/main.css'];// то что обновляется часто
const CacheKey = 'cache';// имя

const initCache = () => caches.open(CacheKey)// caches для хранение кеша, глобальный объект. open - открывает хранилище  по ключу (принимает имя хранилища)
  .then(
    (cache) => // вернет промисс, (cache) - открывается первое хранилище
      cache.addAll([ // кеширование жизненно необходимые для приложения файлы, добавляем страницы
        './',
        './index.html',
        './main.css',
      ]),
    (err) => { // если во время установки произойдет ошибка выведем ее в консоль
      console.log(err);
    },
  );

self.addEventListener('install', (e) => { // self для подписки на событие, инициализация сервис воркера
  console.log('Установлен');
  e.waitUntil(initCache()); // передача дествий,  api  выполнит эти дествия  и пока результат дествий не будет получин мы не перейдем к следующей стадии
});

self.addEventListener('activate', (e) => { // используют для очистки ранее загруженных в кеш данных
  console.log('Активен');
  e.waitUntil(
    caches.keys().then((keyList) => // получаем все ключи в хранилище, получаем массив ключей
      Promise.all(keyList.map((key) => { // проходимся по ключу и удоляем все хранилища которые не соответствуют задонному ключу. Необходимо для того чтобы обновлять данные в хранилище когда нам будет нужно
        if (key !== CacheKey) { // автоматически удалить данное хранилище нельзя до тех пор пока приложение использует хотя бы 1 файл из этого хранилища, по этому для гарантированого обновления хеша нужно использовать такой мехонизм
          return caches.delete(key);// если мы хотим обновить кеш, просто меняем значение CacheKey
        }
      }))),
  );
});

async function fetchPriorityThenCache(e) {
  let response;

  try {
    response = await fetch(e.request); // дождатся результата фетч
  } catch (err) {
    const cacheResponse = await caches.match(e.request); // если ошибка ответ из кеша

    if (cacheResponse) { // если ответ не пустой
      return cacheResponse;
    }
    console.error(err); // сделать загрузку и высветить сообщение
    return new Response('Нет соединения'); // добавление честных ошибок 404
  }

  // свежий ответ ложится в кеш
  const cache = await caches.open(CacheKey);
  cache.put(e.request, response.clone()); // положить копию запроса
  return response;
}

async function fetchPriorityThenCacheThenImageFallback(e) { // ошибка если из кеша ничего не получили нужно оставить загрузку и показать банер
  let response;

  try {
    response = await fetch(e.request); // дождатся результата фетч
  } catch (err) {
    const cacheResponse = await caches.match(e.request); // если ошибка ответ из кеша

    if (cacheResponse) { // если ответ не пустой
      return cacheResponse;
    }
    console.error(err); // сделать загрузку и высветить сообщение
    return; // await caches.match(e.request) не картинку а класс установить банер..............
  }

  // свежий ответ ложится в кеш
  const cache = await caches.open(CacheKey);
  cache.put(e.request, response.clone()); // положить копию запроса
  return response;
}

self.addEventListener('fetch', (e) => { // вызывается тогда, когда браузер пытается загрузить какой-то удоленный ресурс
  console.log('Происходит запрос на сервер');
  const url = new URL(e.request.url);// получение разобранного URL запроса, передаем ссылку лежащую в поле req в нашем объекте событий
  if (FETCH_PRIORITY_URLS.includes(url.pathname)) { // попытка получить запрос по сети
    e.respondWith(fetchPriorityThenCache(e));
    return;
  }

  if (url.pathname.startsWith()) {
    e.respondWith(fetchPriorityThenCacheThenImageFallback(e));//
    return;
  }

  e.respondWith(fetchPriorityThenCache(e));
});
