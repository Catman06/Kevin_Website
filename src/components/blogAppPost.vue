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
	if (props.post.categories.includes("NoPost")) {
		loaded.value = false;
		return;
	} else {
		loaded.value = true;
	}
	content_spot = document.getElementById("post_content");
	if (!content_spot)
		return
	// Extract and place the post's content
	content_spot ? content_spot.innerHTML = props.post.content.querySelectorAll("body")[0].innerHTML : null

	// Apply Style
	const stylesheet = document.adoptedStyleSheets.find((stylesheet) => stylesheet.cssRules.item(0)?.cssText == "post_stylesheet { display: none; }");
	if (stylesheet) {
		stylesheet.replaceSync(props.post.stylesheet);
		stylesheet.insertRule("post_stylesheet { display: none }", 0);
	} else {
		console.log('No post stylesheet found, making a new one.')
		const new_stylesheet: CSSStyleSheet = new CSSStyleSheet;
		new_stylesheet.replaceSync(props.post.stylesheet);
		new_stylesheet.insertRule("post_stylesheet { display: none }", 0);
		document.adoptedStyleSheets.push(new_stylesheet);
	}
})

</script>

<!-- Extra <div> is because <Transition> eats the outermost element for some reason -->
<template>
<div>
<div id="blog_post">
	<div id="post_header">
		<h1 id="post_title">{{ post.title }}</h1>
		<h2 id="post_date" v-if="loaded">{{ post.getPublishDate() }}</h2>
		<div id="post_categories" v-if="loaded">
			<div class="post_category" v-for="category in post.categories">{{ category }}</div>
		</div>
	</div>
	<p id="post_blurb">{{ post.blurb }}</p>
	<div id="post_content" class="clearfix"></div>
</div>
</div>
</template>

<style lang="css">
#blog_post {
	--blog_post_background_color: #121612;
	--blog_post_header_background_color: #202920;
	--blog_post_category_background_color: #3b4d3b;
	background-color: var(--blog_post_background_color);
	border-radius: 25px;
	margin: 5px;
	padding: 1rem;
	min-height: 100px;

	text-align: center;
	& #post_header {
		margin-bottom: 1rem;
		background-color: var(--blog_post_header_background_color);
		padding: .5rem;
		border-radius: 1rem;
		
		& h1 {
			display:block;
			font-size: 2rem;
		}

		& .post_category {
			background-color: var(--blog_post_category_background_color);
			border-radius: 1em;
			padding: .1rem 1ch;
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
		--blog_post_header_background_color: #81b981;		
		--blog_post_category_background_color: #90c990;
	}
}
</style>