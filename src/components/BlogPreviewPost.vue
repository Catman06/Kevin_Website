// A component for a single instance of a blog post preview
<script lang="ts" setup>
import { Post } from '../ts/post';
const props = defineProps({
	post: { type: Post, required: true }
})
</script>
<template>
<div class="blog_post">
	<div>
		<h3 class="blog_title">{{ post.title }}</h3>
		<h6 class="blog_date">{{ post.getPublishDate() }}</h6>
	</div>
	<p class="blog_content">{{ post.blurb }}</p>
</div>	
</template>