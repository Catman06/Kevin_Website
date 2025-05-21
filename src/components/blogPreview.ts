import "../css/blogPreview.css";
import { ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { loadPosts } from "../ts/post.ts";
import BlogPost from './BlogPost.ts';

export default {
	components: {
		BlogPost,
	},
	template: `
		<div id="blog_app">
				<blog-post
				v-for="post in posts"
				:post="post"
				:key="post.id"
				></blog-post>
		</div>`,
	setup() {
		const getPosts = async () => loadPosts()
		const posts = ref([]);

		onMounted(async () => {
			posts.value = await getPosts();
		})

		return {
			posts,
		}
	}
}

