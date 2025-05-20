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
			new Post(new Date("January 1, 2001"), "Test", 'Title1', "Some lorem ipsum text.", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
			new Post(new Date("February 2, 2002"), "Test", 'Title2', 'Some text to describe the post.2', 'Content2'),
			new Post(new Date("March 3, 2003"), "Test", 'Title3', 'Some text to describe the post.3', 'Content3'),
			new Post(new Date("April 4, 2004"), "Test", 'Title4', 'Some text to describe the post.4', 'Content4'),
			new Post(new Date("April 4, 2004"), "Test", 'Title4', 'Some text to describe the post.4', 'Content4'),
			new Post(new Date("April 4, 2004"), "Test", 'Title4', 'Some text to describe the post.4', 'Content4'),
			new Post(new Date("April 4, 2004"), "Test", 'Title4', 'Some text to describe the post.4', 'Content4'),
			new Post(new Date("April 4, 2004"), "Test", 'Title4', 'Some text to describe the post.4', 'Content4')
		])

		return {
			posts1,
		}
	}
}).mount('#blog_app')