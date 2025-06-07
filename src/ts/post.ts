import type { Ref } from "vue";

// A class to hold all the data for a post
export class Post {
	url_name: string;
	publish_time: Date;
	categories: string[];
	title: string;
	blurb: string;
	content: DocumentFragment;
	stylesheet: string;

	constructor(url_name: string, publish_time: string, categories: string[], title: string, blurb: string, content: DocumentFragment, style: string) {
		this.url_name = url_name;
		this.publish_time = new Date(`${publish_time}`);
		this.categories = categories;
		this.title = title;
		this.content = content;
		this.blurb = blurb;
		this.stylesheet = style;
	}

	getPublishDate(): string {
		return this.publish_time.toLocaleDateString();
	}

	getTimeCode(): number {
		return this.publish_time.valueOf();
	}
}

// A function that returns a promise of an array of Posts
// load loads already stored posts, recheck also gets any new posts, and re-fetch downloads all posts
export async function loadPosts(task: 'load' | 'recheck' | 'refetch' = 'load'): Promise<Post[]> {
	// Array of all posts' names
	let filenames: string[] = [];
	// Array of all posts as Post objects
	let post_posts: Post[] = [];
	const last_fetch = sessionStorage.getItem('LastFetch');
	// If the storage hasn't been updated in the last hour, check for new posts. If no LastFetch was found, recheck
	// If the storage hasn't been updated in the last 12 hours, refresh. If no LastFetch was found, re-fetch
	const time_since = Date.now() - parseInt(last_fetch ? last_fetch : '0')
	if (time_since > 3600000) {
		task = 'recheck';
	} else if (time_since > 43200000) {
		task = 'refetch';
	}

	if (task == 'recheck' || task == 'refetch') {
		let new_files: string[] = [];
		sessionStorage.setItem('LastFetch', JSON.stringify(Date.now()));
		// Try to get the list of posts from the server and add any that are missing from
		try {
			const file_paths = await (await fetch("https://zipperserver.duckdns.org/php/getPosts.php", { method: "get" })).json();
			for (const file of file_paths) {
				if (file == "EmptyPost") {
					continue;
				}
				filenames.push(file);
				// Try to get post data from Session Storage, if not there, add it to new_files
				sessionStorage.getItem(file) ? null : new_files.push(file);
			}
			// Save file list to session storage
			sessionStorage.setItem('FileList', JSON.stringify(filenames));
			// If refetching, add all files to new_files for re-download
			task == 'refetch' ? new_files = filenames : null;
		} catch (error) {
			console.error('Error getting list of posts', error);
			sessionStorage.removeItem('LastFetch');
		}
		// Download all files in new_files
		await downloadPosts(new_files)
	}

	// Read all the stored posts into Post objects
	try {
		const file_list_string = sessionStorage.getItem('FileList');
		const stored_files = JSON.parse(file_list_string ? file_list_string : '[]');
		for (const stored_file of stored_files) {
			const stored_post = sessionStorage.getItem(stored_file);
			if (stored_post === null) {
				continue;
			}
			let obj_post = JSON.parse(stored_post);
			// Turn the JSON object back into a Post one
			const parser = new DOMParser();
			let content = new DocumentFragment;
			content.append(parser.parseFromString(obj_post.content, 'text/html').body);
			post_posts.push(new Post(obj_post.url_name, obj_post.publish_time, obj_post.categories, obj_post.title, obj_post.blurb, content, obj_post.stylesheet));
		}
	} catch (error) {
		// On error, report it and clear 'LastFetch' so that new copies of the posts are gotten next time
		console.error('Error parsing stored files', error);
		sessionStorage.removeItem('LastFetch');
	}
	
	return post_posts;
}

// Downloads the passed URLs and parses them into session storage
async function downloadPosts(file_paths: string[]): Promise<void> {
	// Array of all posts as Post objects
	let post_posts: Post[] = [];
	// Array of all posts as strings
	let post_strings: string[] = [];
	// Load posts into post_strings
	try {
		for (const index in file_paths) {
			console.info(`Fetching post: ${file_paths[index]}`);
			post_strings.push(await (await fetch(`https://zipperserver.duckdns.org/posts/${file_paths[index]}.html`, { method: "get" })).text());
		}
	} catch (error) {
		console.error('Error loading posts', error);
		sessionStorage.removeItem('LastFetch');
	}

	if ((post_strings.length == 0 && post_posts.length == 0) || file_paths.length == 0) {
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
		sessionStorage.removeItem('LastFetch');
	}

	if (post_html_docs.length == 0 && post_posts.length == 0) {
		console.error('Error: Parsing issue, no Documents');
	}

	// Turn the HTMLDocuments into Posts
	try {
		let index = 0;
		// For each provided Document, add a Post to post_posts
		for (const post_document of post_html_docs) {
			const tag_list = post_document.getElementsByTagName("meta");
			let date: string = '', categories: string[] = [], title: string = '', blurb: string = '', content: DocumentFragment = new DocumentFragment, stylesheet: string = '';
			// For each meta tag, get it's name and apply it's content to the corresponding variable
			for (const tag of tag_list) {
				switch (tag.name) {
					case "date":
						date = tag.content;
						break;
					case "categories":
						categories = tag.content.split(",");
						break;
					case "title":
						title = tag.content;
						break;
					case "blurb":
						blurb = tag.content;
						break;			
					default:
						break;
				}
			}

			// Get the body of the content and put into a DocumentFragment
			const body = post_document.body;
			content.appendChild(body);

			// Get and store style data
			const style = post_document.getElementsByTagName("style")[0];
			stylesheet = style.innerHTML;
			if (stylesheet === null) {
				stylesheet = "";
			}

			// Apply all the gathered variables into a new Post and return it and store the post in Session Storage
			let newPost = new Post(file_paths[index], date, categories, title, blurb, content, stylesheet)
			sessionStorage.setItem(file_paths[index], JSON.stringify(newPost, (key, value) => {
				let serializer = new XMLSerializer;
				// If the key is 'content' and if value.firstChild isn't null, serialize and return value.firstChild
				// If value.firstChild is null, serialize an empty element. If key isn't 'content' just return value untouched
				return key == 'content' ? serializer.serializeToString(value.firstChild ? value.firstChild : value.appendChild(new Element)) : value;
			}, '\t'));
			index++;
		};
	} catch (error) {
		console.error('Error parsing HTML to Posts', error);
		sessionStorage.removeItem('LastFetch');
	}
}

export function sortPosts(posts: Ref<Post[]>, sort: string = 'DateDes'): void {
	switch (sort) {
		case 'DateAsc':
			posts.value.sort((a, b) => { return a.getTimeCode() - b.getTimeCode(); });
			break;
		case 'DateDes':
			posts.value.sort((a, b) => { 
				return b.getTimeCode() - a.getTimeCode();
			});
			break;
	
		default:
			break;
	}
}