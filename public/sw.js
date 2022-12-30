const filesToCache = [
    "home",
    "menu",
    "not-found",
    "about-us",
    "manifest.json",
];

const staticCacheName = "static-cache-my-v1";

self.addEventListener("install", (event) => {
    console.log("Attempting to install service worker and cache static assets");
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log(
        "*************************************************************************************"
    );
    console.log(
        "******************   Activating new service worker... *******************************"
    );
    console.log(
        "*************************************************************************************"
    );

    const cacheWhitelist = [staticCacheName];
    // Ovako možemo obrisati sve ostale cacheve koji nisu naš
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                if (response) {
                    console.log("Found " + event.request.url + " in cache!");
                    return response;
                }
                console.log(
                    "----------------->> Network request for ",
                    event.request.url
                );
                return fetch(event.request).then((response) => {
                    console.log("response.status = " + response.status);
                    if (response.status === 404) {
                        return caches.match("not-found");
                    }
                    return caches.open(staticCacheName).then((cache) => {
                        console.log(">>> Caching: " + event.request.url);
                        cache.put(event.request.url, response.clone());
                        return response;
                    });
                });
            })
            .catch((error) => {
                console.log("Error", event.request.url, error);
                
            })
    );
});
