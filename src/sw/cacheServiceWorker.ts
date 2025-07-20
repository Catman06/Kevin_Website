//// Handle the cache, saving responses for later use, and deleting ones that get too old

// When activated, prune old caches
self.addEventListener("activate", (event) => {
	console.log("Service Worker Activated");
})

self.addEventListener("fetch", (event: FetchEvent) => {
	console.log("Fetch event being handled: ", event.request.url);
	let cache: Cache;
	event.respondWith(
		caches
			.open("zipperserver_Cache")
			.then((openCache) => {
				cache = openCache;
				return cache.match(event.request)
			})
			.then((response) => {
				if (response) {
					console.log("Found cached response:", response.clone());
					return response;
				}
				console.log("Downloading from network");
				return fetch(event.request.clone()).then((response) => {
					if (response.status < 400) {
						console.log("Caching response", response.clone());
						cache.put(event.request, response.clone());
					}
					return response;
				})
			}).catch((error) => {
				console.error("Error in fetch handler:", error);
				throw error;
			})
	)
})