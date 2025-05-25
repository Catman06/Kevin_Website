<script lang="ts" setup>
import { ref, onMounted, type Ref, computed } from "vue";
import { loadPosts, sortPosts, Post } from "../ts/post";
import BlogPreview from './BlogPreviewPost.vue';
import BlogPost from "./blogAppPost.vue";

const getPosts = async () => loadPosts('load');
// ref to the array of all posts
const posts: Ref<Post[], any> = ref([]);
// 'Post' to display when no post is selected
const nopost = ref(new Post("", "0", "NoPost", "Select a post", "", new DocumentFragment, ""));
// How many posts to preview at once
const batch_size = ref(3);

// Update batch_size based on the width of the root html element
function update_batch_size() {
	const root = document.querySelector('html');
	if (root instanceof HTMLElement) {
		batch_size.value = Math.round(root.clientWidth / 360);
	} else {
		batch_size.value = 3;
	}
}

// Runs update_batch_size() when the window is resized, but throttled to once every 100ms
let throttled = false;
window.addEventListener('resize', () => {
	if (!throttled) {
		throttled = true
		setTimeout(() => {
			throttled = false;
			update_batch_size();
		}, 100);
	}
})


// What group of posts to preview
const batch_index = ref(0);
// The previewed posts
const preview_batch: Ref<Post[], any> = computed(() => {
	let start = batch_index.value*batch_size.value;
	let end = start + batch_size.value;
	
	// If the batch would be outside the array, pull batch_index back in
	start >= posts.value.length ? batch_index.value-- : null;
	end <= 0 ? batch_index.value++ : null;

	return posts.value.slice(start, end);
});
// The currently displayed post
const selected_post: Ref<Post, any> = nopost;

// Change the hash of the URL
function changeHash(url_name: string) {
		location.hash = url_name;
}

// Change display
addEventListener("hashchange", (event) => {
event.newURL == event.oldURL ? null : displayPost(location.hash.slice(1));
})

function displayPost(url_name: string) {
	for (const post of posts.value) {
		post.url_name == url_name ? selected_post.value = post : null;
	}
}

onMounted(async () => {
	let tempPosts = await getPosts();
	if (tempPosts === undefined) {
		console.error("getPosts() returned undefined");
		return;
	}
	posts.value = tempPosts;
	sortPosts(posts);
	displayPost(window.location.hash.slice(1));
})
</script>

<script lang="ts">
	
</script>

<template>
	<div id="post_selector">
		<button class="more_button" id="selector_left" @click="batch_index--">&#9664</button>
		<blog-preview v-for="post in preview_batch" :post="post" :key="post.url_name" @click="changeHash(post.url_name)" />
		<button class="more_button" id="selector_right" @click="batch_index++">&#9654</button>
	</div>
	<div id="shown_post">
		<blog-post :post="selected_post" />
	</div>
</template>

<style lang="css">
#post_selector {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow-x: scroll;

	&>* {
		height: 8rem;
	}

	& .more_button {
		width: 3rem;
		height: 3.5rem;
	}

}
</style>