<script lang="ts" setup>
import { ref, onMounted, type Ref, computed, watch } from "vue";
import { loadPosts, sortPosts, Post } from "../ts/post";
import { getStyleSheet, replaceCSSRule } from "../ts/cssManip";
import BlogPreview from './BlogPreviewPost.vue';
import BlogPost from "./blogAppPost.vue";

const getPosts = async () => loadPosts('load');
// ref to the array of all posts
const posts: Ref<Post[], any> = ref([]);
// 'Post' to display when no post is selected
const nopost = ref(new Post("", "0", "NoPost", "Select a post", "", new DocumentFragment, ""));
// How many posts to preview at once
const batch_size = ref(1);

// Update batch_size based on the width of the root html element
function update_batch_size() {
	const root = document.querySelector('html');
	if (root instanceof HTMLElement) {
		batch_size.value = Math.round(root.clientWidth / 360);
	} else {
		batch_size.value = 3;
	}
}

// Runs update_batch_size() when the window is resized, but throttled to once every 100ms
let throttled = false;
window.addEventListener('resize', () => {
	if (!throttled) {
		throttled = true
		setTimeout(() => {
			throttled = false;
			update_batch_size();
		}, 100);
	}
})

let previous_batch = 0;
// What group of posts to preview
const batch_index = ref(0);
// The previewed posts
const preview_batch: Ref<Post[], any> = computed(() => {
	const start = batch_index.value*batch_size.value;
	const end = start + batch_size.value;
	
	// If the batch would be outside the array, pull batch_index back in
	start >= posts.value.length ? batch_index.value-- : null;
	end <= 0 ? batch_index.value++ : null;

	return posts.value.slice(start, end);
});

// Change the current batch of previews while saving the previous one
function changePreview(dir: 'left' | 'right') {
	previous_batch = batch_index.value;
	dir == 'left' ? batch_index.value-- : dir == 'right' ? batch_index.value++ : null;
}

// Watcher for previewed posts. Hides the left or right button if at the end of the post list
watch(preview_batch, () => {
	const prev_end = (batch_index.value - 1)*batch_size.value + batch_size.value;
	const next_start = (batch_index.value + 1)*batch_size.value;
	const left_button = document.getElementById("selector_left");
	const right_button = document.getElementById("selector_right");
	
	// Narrow the types of left and right button
	if (!left_button) {
		console.error("Failed to get #selector_left");
		return;
	} else if (!right_button) {
		console.error("Failed to get #selector_right");
		return;
	}
	// Change visibility of buttons based on whether the prev/next batch would be out of bounds
	if (prev_end <= 0) {
		left_button.style.visibility = "hidden";
	} else if (left_button.style.visibility == "hidden") {
		left_button.style.visibility = "visible";
	}
	if (next_start >= posts.value.length) {
		right_button.style.visibility = "hidden";
	} else if (right_button.style.visibility == "hidden") {
		right_button.style.visibility = "visible";
	}
})

// The previouly displayed post's url_name
let previous_post: string = nopost.value.url_name;
// The currently displayed post
const selected_post: Ref<Post, any> = nopost;

// Change the hash of the URL
function changeHash(url_name: string, event: Event) {
	// If the pressed key is Space or Enter, continue
	if (event instanceof KeyboardEvent && !(event.key == 'Enter')) { return	};
	location.hash = url_name;
}

// Change display
addEventListener("hashchange", (event) => {
event.newURL == event.oldURL ? null : displayPost(location.hash.slice(1));
})

function displayPost(url_name: string) {
	for (const post of posts.value) {
		if (post.url_name == url_name) {
			previous_post = selected_post.value.url_name;
			selected_post.value = post;
		}
	}
}

onMounted(async () => {
	let tempPosts = await getPosts();
	if (tempPosts === undefined) {
		console.error("getPosts() returned undefined");
		return;
	}
	stylesheet = getStyleSheet(new RegExp(/#post_selector/));
	posts.value = tempPosts;
	sortPosts(posts);
	update_batch_size();
	displayPost(window.location.hash.slice(1));
})

// Get this component's stylesheet
let stylesheet: CSSStyleSheet | undefined = undefined;

// Runs before post change. Sets the direction of the transition
function setPostTransitionDirection(_element: any) {
	// If the stylesheet wasn't found, don't try to alter it
	if (!(stylesheet instanceof CSSStyleSheet)) { return };

	// Get the indices of the old and new posts
	let oldIndex = posts.value.findIndex((val, _ind, _arr) => {	return val.url_name == previous_post });
	let newIndex = posts.value.findIndex((val, _ind, _arr) => { return val.url_name == selected_post.value.url_name });

	// Depending on the relative indices, change the direction of the transition
	if (oldIndex > newIndex) {
		replaceCSSRule(stylesheet, ".shown_post-enter-from", "transform: translateX(-100vw);");
		replaceCSSRule(stylesheet, ".shown_post-leave-to", "transform: translateX(100vw);");
	} else if (oldIndex < newIndex) {
		replaceCSSRule(stylesheet, ".shown_post-enter-from", "transform: translateX(100vw);");
		replaceCSSRule(stylesheet, ".shown_post-leave-to", "transform: translateX(-100vw);");
	}
}
// Runs before preview batch change. Sets the direction of the transition
function setPreviewTransitionDirection(_element: any) {
	// If the stylesheet wasn't found, don't try to alter it
	if (!(stylesheet instanceof CSSStyleSheet)) { return };

	// Depending on the relative indices, change the direction of the transition
	if (previous_batch > batch_index.value) {
		replaceCSSRule(stylesheet, ".preview-enter-from", "transform: translateX(-100vw);");
		replaceCSSRule(stylesheet, ".preview-leave-to", "transform: translateX(100vw);");
	} else if (previous_batch < batch_index.value) {
		replaceCSSRule(stylesheet, ".preview-enter-from", "transform: translateX(100vw);");
		replaceCSSRule(stylesheet, ".preview-leave-to", "transform: translateX(-30vw);");
	}
}

</script>

<template>
	<div id="post_selector">
		<button class="more_button" id="selector_left" @click="changePreview('left')">&#9664</button>
		<TransitionGroup name="preview" @before-leave="setPreviewTransitionDirection">
			<blog-preview v-for="post in preview_batch" :post="post" :key="post.url_name" tabindex="0" @click="changeHash(post.url_name, $event)" @keydown="changeHash(post.url_name, $event)" />
		</TransitionGroup>
		<button class="more_button" id="selector_right" @click="changePreview('right')">&#9654</button>
	</div>
	<Transition id="shown_post" name="shown_post" mode="out-in" @before-leave="setPostTransitionDirection">
		<blog-post :post="selected_post" :key="selected_post.url_name" />
	</Transition>
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

.shown_post-enter-active,
.shown_post-leave-active {
	transition: all .25s ease-in-out;
}

.shown_post-enter-from {
	transform: translateX(-100vw);
}
.shown_post-leave-to {
	transform: translateX(100vw);
}
.preview-move,
.preview-enter-active,
.preview-leave-active {
	transition: all .25s ease;
}
.preview-enter-from {
	transform: translateX(100vw);
}
.preview-leave-to {
	transform: translateX(-100vw);
}
.preview-leave-active {
	position: absolute;
}
</style>