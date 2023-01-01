function entries(t = r()) { return t("readonly", (n => { if (n.getAll && n.getAllKeys) return Promise.all([e(n.getAllKeys()), e(n.getAll())]).then((([e, t]) => e.map(((e, n) => [e, t[n]])))); const r = []; return t("readonly", (e => d(e, (e => r.push([e.key, e.value]))).then((() => r)))) })) }
function del(t, n = r()) { return n("readwrite", (n => (n.delete(t), e(n.transaction)))) }
function r(){return n||(n=t("keyval-store","keyval")),n}
function t(t,n){const r=indexedDB.open(t);r.onupgradeneeded=()=>r.result.createObjectStore(n);const o=e(r);return(e,t)=>o.then((r=>t(r.transaction(n,e).objectStore(n))))}let n;
function e(e){return new Promise(((t,n)=>{e.oncomplete=e.onsuccess=()=>t(e.result),e.onabort=e.onerror=()=>n(e.error)}))}

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

/*
self.addEventListener('sync', function (event) {
    console.log('Background sync!', event);
    if (event.tag === 'sync-snaps') {
        event.waitUntil(
            syncSnaps()
        );
    }
});

let syncSnaps = async function () {
    entries()
        .then((entries) => {
            entries.forEach((entry) => {
                let snap = entry[1]; //  Each entry is an array of [key, value].
                let formData = new FormData();
                formData.append('id', snap.id);
                formData.append('ts', snap.ts);
                formData.append('title', snap.title);
                formData.append('image', snap.image, snap.id + '.png');
                fetch('/saveSnap', {
                    method: 'POST',
                    body: formData
                })
                    .then(function (res) {
                        if (res.ok) {
                            res.json()
                                .then(function (data) {
                                    console.log("Deleting from idb:", data.id);
                                    del(data.id);
                                });
                        } else {
                            console.log(res);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        });
} */