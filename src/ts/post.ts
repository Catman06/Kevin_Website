// A class to hold all the data for a post
export class Post {
	url_name: string;
	publish_time: Date;
	category: string;
	title: string;
	blurb: string;
	content: DocumentFragment;
	stylesheet: string;

	constructor(url_name: string, publish_time: string, category: string, title: string, blurb: string, content: DocumentFragment, style: string) {
		this.url_name = url_name;
		this.publish_time = new Date(`${publish_time}`);
		this.category = category;
		this.title = title;
		this.blurb = blurb;
		this.content = content;
		this.stylesheet = style;
	}

	getPublishDate() {
		return this.publish_time.toLocaleDateString();
	}
}

// A function that returns a promise of an array of Posts
export async function loadPosts() {
	let urls: string[] = [];
	let post_strings: string[] = [];
	// Load posts into post_strings
	try {
		// Get the files in /posts/
		// const file_path = import.meta.glob(["/posts/*.html", '!**/EmptyPost.html']);
		const file_paths = await (await fetch("https://kevinserver/src/php/getPosts.php", { method: "get" })).json();
		console.log(await (await fetch("https://kevinserver/src/php/getPosts.php", { method: "get" })).json());
		for (const index in file_paths) {
			if (file_paths[index] == "EmptyPost") {
				continue;
			}
			urls.push(`${file_paths[index]}`);
			post_strings.push(await (await fetch(`/posts/${file_paths[index]}.html`, { method: "get" })).text());
		}
	} catch (error) {
		console.error('Error loading posts', error);
	}

	if (post_strings.length == 0 || urls.length == 0) {
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
		let index = 0;
		// For each provided Document, add a Post to post_posts
		for (const post_document of post_html_docs) {
			const tag_list = post_document.getElementsByTagName("meta");
			let date: string = '', category: string = '', title: string = '', blurb: string = '', content: DocumentFragment = new DocumentFragment, stylesheet: string = '';
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

			// Get the body of the content and put into a DocumentFragment
			const body = post_document.getElementsByTagName("body")[0];
			content.appendChild(body);

			// Get and store style data
			const style = post_document.getElementsByTagName("style")[0];
			stylesheet = style.innerHTML;
			if (stylesheet === null) {
				stylesheet = "";
			}

			// Apply all the gathered variables into a new Post and return it
			post_posts.push(new Post(urls[index], date, category, title, blurb, content, stylesheet));
			index++;
		};
	} catch (error) {
		console.error('Error parsing HTML to Posts', error);
	}
	return(post_posts);
}