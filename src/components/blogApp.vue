<script lang="ts" setup>
import { ref, onMounted, type Ref } from "vue";
import { loadPosts, Post } from "../ts/post";
import BlogPreview from './BlogPreviewPost.vue';
import BlogPost from "./blogAppPost.vue";

const getPosts = async () => loadPosts();
const posts: Ref<Post[], any> = ref([]);
const nopost = new Post(-1, "0", "NoPost", "Select a post", "", new DocumentFragment, "")
const selected_post: Ref<Post, any> = ref(nopost);

function getPost(id: number) {
	for (const post of posts.value) {
		if (post.id == id) {
			return post;
		}
	}
	return nopost;
}

onMounted(async () => {
	posts.value = await getPosts();
})
</script>

<script lang="ts">
	
</script>

<template>
	<div id="post_selector">
		<button class="more_button" id="selector_left">&#9664</button>
		<blog-preview v-for="post in posts" :post="post" :key="post.id" @click="selected_post = getPost(post.id)" />
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
		max-height: 8rem;
	}

	& .more_button {
		width: 3rem;
		height: 3.5rem;
	}

}
</style>