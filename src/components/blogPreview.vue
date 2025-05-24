<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue';
import { loadPosts, Post } from "../ts/post";
import BlogPreviewPost from './BlogPreviewPost.vue';

const getPosts = async () => loadPosts()
const posts: Ref<Post[], any> = ref();

onMounted(async () => {
	posts.value = await getPosts();
})
</script>

<template>
<div id="blog_app">
		<BlogPreviewPost
		v-for="post in posts"
		:post="post"
		:key="post.url_name"
		></BlogPreviewPost>
</div>
</template>

<style lang="css">
#blog_app {
	height: calc(100% - 3rem);
	overflow-y: auto;
	background-color: #3a493a;
	border-radius: 1rem;
	margin: 0;
}
</style>