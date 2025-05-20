import "../css/blogPreview.css";
import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Post } from "../components/BlogPost.ts";
import BlogPost from '../components/BlogPost.ts';

createApp({
	components: {
		BlogPost
	},
	setup() {
		const posts1: Post[] = ref([
			new Post(new Date("January 1, 2002 03:04:00"), 'Title1', 'Content1'),
			new Post(new Date("February 2, 2003 04:05:00"), 'Title2', 'Content2')
		])

		return {
			posts1,
		}
	}
}).mount('#blog_app')