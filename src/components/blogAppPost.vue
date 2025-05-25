// Component for a single post on the main blog page
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { Post } from "../ts/post.ts";
const props = defineProps({
	post: { type: Post, required: true }
})

// Show header stuff only if a proper post is loaded
const loaded = ref(false);

// Get the element for where the content should go
let content_spot: HTMLElement | null;
onMounted(() => {
	content_spot = document.getElementById("post_content");
})

// Create a stylesheet to apply the post's style to
const static_stylesheet: CSSStyleSheet = new CSSStyleSheet;
document.adoptedStyleSheets.push(static_stylesheet);

// When props.post changes, replace the old content and style with the new
watch(() => props.post, (newpost, _oldpost) => {
	if (props.post.category == "NoPost") {
		loaded.value = false;
	} else {
		loaded.value = true;
	}
	if (!content_spot)
		return
	// Extract and place the post's content
	content_spot.innerHTML = newpost.content.querySelectorAll("body")[0].innerHTML

	// Replace stylesheets
	static_stylesheet.replaceSync(newpost.stylesheet);
})

</script>

<template>
<div id="blog_post">
	<div id="post_header">
		<h1 id="post_title">{{ post.title }}</h1>
		<h2 id="post_date" v-if="loaded">{{ post.getPublishDate() }}</h2>
		<h2 id="post_category" v-if="loaded">{{ post.category }}</h2>
	</div>
	<p id="post_blurb">{{ post.blurb }}</p>
	<div id="post_content" class="clearfix"></div>
</div>
</template>

<style lang="css">
#blog_post {
	--blog_post_background_color: #121612;
	--blog_post_header_color: #202920;
	background-color: var(--blog_post_background_color);
	border-radius: 25px;
	margin: 5px;
	padding: 1rem;
	min-height: 100px;

	text-align: center;
	& #post_header {
		margin-bottom: 1rem;
		background-color: var(--blog_post_header_color);
		padding: .5rem;
		border-radius: 1rem;
		
		& h1 {
			display:block;
			font-size: 2rem;
		}

		& * {
			display: inline-block;
			font-size: 1rem;
			margin: 0rem 1rem;
		}
	}

	& #post_blurb {
		text-align: justify;
		font-weight: bold;
		font-size: 1.25rem;
		margin: 0rem 2rem;
	}

	& #post_content {
		text-align: justify;
		height: fit-content;
	}
}

@media (prefers-color-scheme: light) {
	#blog_post {
		--blog_post_background_color: #b0cab0;
		--blog_post_header_color: #81b981;		
	}
}
</style>