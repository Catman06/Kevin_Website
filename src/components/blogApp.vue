<script lang="ts" setup>
import { ref, onMounted, type Ref } from "vue";
import { loadPosts, sortPosts, Post } from "../ts/post";
import BlogPreview from './BlogPreviewPost.vue';
import BlogPost from "./blogAppPost.vue";

const getPosts = async () => loadPosts('load');
const posts: Ref<Post[], any> = ref([]);
const nopost = ref(new Post("", "0", "NoPost", "Select a post", "", new DocumentFragment, ""));
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
		<button class="more_button" id="selector_left">&#9664</button>
		<blog-preview v-for="post in posts" :post="post" :key="post.url_name" @click="changeHash(post.url_name)" />
		<button class="more_button" id="selector_right">&#9654</button>
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