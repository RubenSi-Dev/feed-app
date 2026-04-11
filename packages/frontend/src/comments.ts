import type { CommentResponse } from "shared";
import { dateResponseToString } from "./util";
import { commentService } from "./services/comments-service";
import { postService } from "./services/post-service";

async function loadCommentsPage() {
	const params = new URLSearchParams(window.location.search);
	const postUID = params.get('post');

	if (!postUID) {
		console.error('No poost ID found in URL');
		return;
	}

	try {
		const comments = await commentService.getCommentsByPost(postUID)

		const commentsContainer = document.getElementById('CommentsList');
		if (commentsContainer) {
      commentsContainer.innerHTML = '';


      comments.forEach(comment => {
        const postElement = createCommentElement(comment);
        commentsContainer.appendChild(postElement);
      });
		}
	} catch (err) {
		console.error('Error loading comments', err);
	}
}

function createCommentElement(comment: CommentResponse) {
	const article = document.createElement('article');
	article.className = 'comment'

	article.innerHTML = `
		<div class="comment-metadata">
			<span class="author">${comment.commenter}</span><span class="date">${dateResponseToString(comment.date)}</span>
		</div>
		<div class="comment-body">
			<p>${comment.body}</p>
		</div>
	`
	return article;
}

loadCommentsPage();
