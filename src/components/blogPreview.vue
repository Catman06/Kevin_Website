<script lang="ts" setup>
import { ref, onMounted, type Ref } from 'vue'
import { loadPosts, Post } from "../ts/post";
import BlogPost from './BlogPreviewPost.vue'

const getPosts = async () => loadPosts()
const posts: Ref<Post[], any> = ref();

onMounted(async () => {
	posts.value = await getPosts();
})
</script>

<template>
<div id="blog_app">
		<blog-post
		v-for="post in posts"
		:post="post"
		:key="post.id"
		></blog-post>
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
.blog_post {
	border-radius: 25px;
	background-color: #131b13;
	padding: 10px;
	margin: .5rem .5rem;

	& .blog_title {
		margin: 0px;
	}

	& .blog_date {
		margin: 0px;
	}

	& .blog_content {
		max-height: 10.4em;
		line-height: 1.3em;
		padding: 0rem 1rem;
		overflow: hidden;
		text-align: justify;
	}
}
</style>