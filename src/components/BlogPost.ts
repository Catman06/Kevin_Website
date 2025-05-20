// A Web Component for a single instance of a blog post

// A class to hold all the data for a post
export class Post {
	publish_time: Date;
	category: String;
	title: String;
	blurb: String;
	content: String;

	constructor(publish_time: Date, category: String, title: String, blurb: String, content: String) {
		this.publish_time = publish_time;
		this.category = category;
		this.title = title;
		this.blurb = blurb;
		this.content = content;
	}

	getPublishDate() {
		return this.publish_time.toLocaleDateString();
	}
}

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