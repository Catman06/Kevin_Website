<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue';
import { loadPosts, sortPosts, Post } from "../ts/post";
import BlogPreviewPost from './BlogPreviewPost.vue';

const getPosts = async () => loadPosts('load')
const posts: Ref<Post[], any> = ref();

function openPost(post: Post) {
	window.location.assign(`${window.location.origin}/blog.html#${post.url_name}`)
}

onMounted(async () => {
	let tempPosts = await getPosts();
	if (tempPosts === undefined) {
		console.error("getPosts() returned undefined");
		return;
	}
	posts.value = tempPosts;
	sortPosts(posts);
})
</script>

<template>
<div id="blog_preview_app">
		<BlogPreviewPost
		v-for="post in posts"
		:post="post"
		:key="post.url_name"
		@click="openPost(post)"
		></BlogPreviewPost>
</div>
</template>

<style lang="css">
#blog_preview_app {
	--blog_preview_background_color: #3a493a;
	
	height: calc(100% - 3rem);
	overflow-y: auto;
	background-color: var(--blog_preview_background_color);
	border-radius: 1rem;
	margin: 0;
}

@media (prefers-color-scheme: light) {
	#blog_preview_app {
		--blog_preview_background_color: #7e9b7e;
	}
}
</style>