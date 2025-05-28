// A component for a single instance of a blog post preview
<script lang="ts" setup>
import { Post } from '../ts/post';
const props = defineProps({
	post: { type: Post, required: true }
})
</script>

<template>
<div class="post_preview">
	<div>
		<h3 class="preview_title">{{ post.title }}</h3>
		<h6 class="preview_date">{{ post.getPublishDate() }}</h6>
	</div>
	<p class="preview_blurb">{{ post.blurb }}</p>
</div>	
</template>

<style>
.post_preview {
	--blog_preview_post_background_color: #131b13;
	--blog_preview_post_hover_color: #213021;
	border-radius: 25px;
	background-color: var(--blog_preview_post_background_color);
	padding: 10px;
	margin: .5rem .5rem;
	transition-duration: .5s;

	& .preview_title {
		margin: 0px;
	}

	& .preview_date {
		margin: 0px;
	}

	& .preview_content {
		max-height: 10.4em;
		line-height: 1.3em;
		padding: 0rem 1rem;
		overflow: hidden;
		text-align: justify;
	}
}

.post_preview:hover {
		transform: scale(1.01, 1.01);
		background-color: var(--blog_preview_post_hover_color);
		transition-duration: .5s;
}
#post_selector>.post_preview:hover {
		transform: scale(1.05, 1.05);
}

@media (prefers-color-scheme: light) {
	.post_preview {
		--blog_preview_post_background_color: #86b186;
		--blog_preview_post_hover_color: #6ea36e;
	}
}
</style>