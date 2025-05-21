// A class to hold all the data for a post
export class Post {
	publish_time: Date;
	category: String;
	title: String;
	blurb: String;
	content: DocumentFragment;

	constructor(publish_time: String, category: String, title: String, blurb: String, content: DocumentFragment) {
		this.publish_time = new Date(`${publish_time}`);
		this.category = category;
		this.title = title;
		this.blurb = blurb;
		this.content = content;
	}

	getPublishDate() {
		return this.publish_time.toLocaleDateString();
	}
}

// A function that returns a promise of an array of Posts
export async function loadPosts() {
	let post_strings: string[] = [];
	// Load posts into post_strings
	try {
		// Get the files in /posts/
		const files = import.meta.glob(['/public/posts/*.html', '!**/EmptyPost.html']);
		console.log(files);
		for (const path in files) {
			post_strings.push(await (await fetch(path, { method: "get" })).text());
		}
	} catch (error) {
		console.error('Error loading posts', error);
	}

	if (post_strings.length == 0) {
		console.error('Error: no posts found');
		return;
	}

	// Turn the strings in post_strings into HTMLDocuments
	let post_html_docs: Document[] = [];
	try {
		const parser = new DOMParser();
		for (const html_string of post_strings) {
			post_html_docs.push(parser.parseFromString(html_string, "text/html"));
		};
	} catch (error) {
		console.error('Error parsing Strings to HTML', error);
	}

	if (post_html_docs.length == 0) {
		console.error('Error: Parsing issue, no Documents');
	}

	// Turn the HTMLDocuments into Posts
	let post_posts: Post[] = [];
	try {
		// For each provided Document, add a Post to post_posts
		for (const post_document of post_html_docs) {
			const tag_list = post_document.getElementsByTagName("meta");
			let date: String = '', category: String = '', title: String = '', blurb: String = '', content: DocumentFragment = new DocumentFragment;
			// For each meta tag, get it's name and apply it's content to the corresponding variable
			for (const tag of tag_list) {
				switch (tag.name) {
					case "date":
						date = tag.content
						break;
					case "category":
						category = tag.content
						break;
					case "title":
						title = tag.content
						break;
					case "blurb":
						blurb = tag.content
						break;			
					default:
						break;
				}
			}

			// Get the body and style of the content and put into a DocumentFragment
			const body = post_document.getElementsByTagName("body")[0];
			// const style = post_document.getElementsByTagName("style")[0];
			content.appendChild(body);

			// Apply all the gathered variables into a new Post and return it
			post_posts.push(new Post(date, category, title, blurb, content));
		};
	} catch (error) {
		console.error('Error parsing HTML to Posts', error);
	}
	console.log(post_posts)
	return(post_posts);
}