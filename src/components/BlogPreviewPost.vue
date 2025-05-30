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
		<h2 class="preview_title">{{ post.title }}</h2>
		<div class="preview_subtitle">
			<h3 class="preview_date">{{ post.getPublishDate() }}</h3>
			<div class="preview_categories">
				<div class="preview_category" v-for="category in post.categories">{{ category }}</div>
			</div>
		</div>
	</div>
	<p class="preview_blurb">{{ post.blurb }}</p>
</div>	
</template>

<style>
.post_preview {
	--blog_preview_post_background_color: #131b13;
	--blog_preview_post_hover_color: #213021;
	--blog_preview_subtitle_background_color: #2d3d2d;
	--blog_preview_category_background_color: #425a42;
	border-radius: 25px;
	background-color: var(--blog_preview_post_background_color);
	padding: 10px;
	margin: .5rem .5rem;
	transition-duration: .5s;

	& .preview_title {
		margin: 0px;
		font-size: 1.25em;
	}
	
	& .preview_subtitle {
		display: flex;
		background-color: var(--blog_preview_subtitle_background_color);
		padding: .2rem;
		border-radius: .4rem;
		align-items: center;
		
		& .preview_date {
			margin: 0px 0px 0px 0.1rem;
			font-size: 0.75em;
		}
		
		& .preview_categories {
			font-size: 0.75em;
			display: flex;
			align-items: center;

			& .preview_category {
				background-color: var(--blog_preview_category_background_color);
				border-radius: 1em;
				margin-left: .5em;
				padding: .1rem 1ch;
			}
		}
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
		--blog_preview_subtitle_background_color: #678667;
		--blog_preview_category_background_color: #88a888;
	}
}
</style>