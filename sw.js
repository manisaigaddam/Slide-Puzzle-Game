const version = "1.0.0";
const static_cacheName = `static-v-${version}`
let cachex = [
    //"/",
    "index.html",
    "css/style.css",
    "css/images/dog.jpg",
    "css/images/tigre.jpeg",
    "css/images/tucan.jpeg",
    "css/images/left_arrow.png",
    "css/images/right_arrow.png",
    "css/sounds/clap.mp3",
    "js/blocks.js",
    "js/control.js",
    "js/main.js",
    "js/scramble.js"
]

self.addEventListener('install', e => {
    console.log('installing...')
    let cache = caches.open(static_cacheName)
        .then(cache => cache.addAll(cachex))
    e.waitUntil(cache)
    self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log('activate....')
    let response = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key != static_cacheName && key.includes('static')) {
                    return caches.delete(key)
                }
            })
        })
    event.waitUntil(response)
})

self.addEventListener('fetch', event => {
    console.log('fetch..')

    let response = caches.match(event.request)
        .then(res => {
            if (res) {
                return res
            } else {
                fetch(event.request)
                    .then(res => {
                        caches.open(static_cacheName)
                            .then(cache => cache.put(event.request, res))
                    })
                return fetch(event.request)
            }
        })
    event.respondWith(response)
})
