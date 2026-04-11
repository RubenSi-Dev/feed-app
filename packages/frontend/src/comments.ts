import type { CommentResponse, PostResponse } from 'shared';
import { dateResponseToString } from './util';
import { commentService } from './services/comments-service';
import { postService } from './services/post-service';

async function loadCommentsPage() {
  const params = new URLSearchParams(window.location.search);
  const postUID = params.get('post');

  if (!postUID) {
    console.error('No poost ID found in URL');
    return;
  }

  try {
		const post = await postService.getPost(postUID);
		const postContainer = document.getElementById('TopPost');
		if (postContainer) {
			postContainer.innerHTML = '';
			postContainer.appendChild(createPostElement(post))
		}

    const comments = await commentService.getCommentsByPost(postUID);

    const commentsContainer = document.getElementById('CommentsList');
    if (commentsContainer) {
      commentsContainer.innerHTML = '';

      comments.forEach((comment) => {
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
      });
    }
  } catch (err) {
    console.error('Error loading comments', err);
  }
}

export function createPostElement(post: PostResponse) {
  const article = document.createElement('article');
  article.className = 'post';

  article.innerHTML = `
			<div class="post-metadata">
				<span class="author">${post.publisher}</span><span class="date">${dateResponseToString(post.date)}</span>
			</div>
			<h2 class="post-title">${post.title}</h2>
			<div class="post-body">
				<p>${post.body}</p>
			</div>
			<div class="post-actions">
				<span>
					<span class="vote-buttons">
						<button class="upvote-button" data-id="${post.UID}">Upvote</button>
						<button class="downvote-button" data-id="${post.UID}">Downvote</button>
					</span>
					<span class="score">${post.score}</span>
				</span>
			</div>
  `;

  const upvoteBtn = article.querySelector('.upvote-button') as HTMLButtonElement;
  const downvoteBtn = article.querySelector('.downvote-button') as HTMLButtonElement;

  upvoteBtn.onclick = async () => {
    try {
      const newScore = await postService.voteOnPost(post.UID, 'up');
      const scoreElement = article.querySelector('.score');
      if (scoreElement) scoreElement.textContent = newScore.toString();
    } catch (err) {
      console.error(err);
    }
  };

  downvoteBtn.onclick = async () => {
    try {
      const newScore = await postService.voteOnPost(post.UID, 'down');
      const scoreElement = article.querySelector('.score');
      if (scoreElement) scoreElement.textContent = newScore.toString();
    } catch (err) {
      console.error(err);
    }
  };

  return article;
}

function createCommentElement(comment: CommentResponse) {
  const article = document.createElement('article');
  article.className = 'comment';
	console.log(comment.score)

  article.innerHTML = `
		<div class="comment-metadata">
			<span class="author">${comment.commenter}</span><span class="date">${dateResponseToString(comment.date)}</span>
		</div>
		<div class="comment-body">
			<p>${comment.body}</p>
		</div>
		<div class="comment-actions">
			<span>
				<span class="vote-buttons">
					<button class="upvote-button" data-id="${comment.UID}">Upvote</button>
					<button class="downvote-button" data-id="${comment.UID}">Downvote</button>
				</span>
				<span class="score">${comment.score}</span>
			</span>
		</div>
	`;
  return article;
}

loadCommentsPage();
