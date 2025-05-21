import { Post } from "../ts/post.ts";
// A Web Component for a single instance of a blog post

export default {
	props: {
		post: Post
	},
	template: `
		<div class="blog_post">
			<div>
				<h3 class="blog_title">{{ post.title }}</h3>
				<h6 class="blog_date">{{ post.getPublishDate() }}</h6>
			</div>
			<p class="blog_content">{{ post.blurb }}</p>
		</div>`
}