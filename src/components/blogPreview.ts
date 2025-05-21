import "../css/blogPreview.css";
import { ref, onMounted } from 'vue/dist/vue.esm-bundler.js';
import { loadPosts } from "../ts/post";
import BlogPost from './BlogPreviewPost';

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

