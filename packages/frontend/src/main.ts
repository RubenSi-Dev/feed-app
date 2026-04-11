import type { PostResponse } from "shared";
import { postService } from "./services/post-service";
import { dateResponseToString } from "./util";

export const BASE_URL = 'http://localhost:3000';

async function loadFeed() {
  const feedContainer = document.getElementById('Feed');
    if (!feedContainer) return;

    try {
      const posts = await postService.getPosts();

      feedContainer.innerHTML = '';

      posts.forEach(post => {
        console.log(post);
        const postElement = createPostElement(post);
        feedContainer.appendChild(postElement);
      });
    } catch (error) {
      console.error("Failed to load feed:", error);
    }
}


function createPostElement(post: PostResponse) {
  const article = document.createElement('article');
  article.className = 'post';
  

  article.innerHTML = `
			<div class="post-metadata">
				<span class="author">${post.publisher}</span><span class="date">${dateResponseToString(post.date)}</span>
			</div>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
			<h2 class="post-title">${post.title}</h2>
			<div class="post-body">
				<p>${post.body}</p>
=======
			<h2 class="post-title">${post.contents.title}</h2>
			<div class="post-body">
				<p>${post.contents.body}</p>
>>>>>>> d36dffc (frontend works)
=======
			<h2 class="post-title">${post.contents.title}</h2>
			<div class="post-body">
				<p>${post.contents.body}</p>
>>>>>>> da6ed3b (frontend works)
=======
			<h2 class="post-title">${post.contents.title}</h2>
			<div class="post-body">
				<p>${post.contents.body}</p>
>>>>>>> d36dffc (frontend works)
=======
			<h2 class="post-title">${post.title}</h2>
			<div class="post-body">
				<p>${post.body}</p>
>>>>>>> refs/remotes/origin/frontend/main
			</div>
			<div class="post-actions">
				<span>
					<button class="comments-button">Comments</button>
					<span class="comments-count">${post.commentCount}</span>
				</span>
				<span>
					<span class="score">${post.score}</span>
					<span class="vote-buttons">
						<button class="upvote-button" data-id="${post.UID}">Upvote</button>
						<button class="downvote-button" data-id="${post.UID}">Downvote</button>
					</span>
				</span>
			</div>
  `

	const upvoteBtn = article.querySelector('.upvote-button') as HTMLButtonElement;
	const downvoteBtn = article.querySelector('.downvote-button') as HTMLButtonElement;
  
  upvoteBtn.onclick = async () => {
    try {
      const newScore = await postService.voteOnPost((post.UID), 'up');
      const scoreElement = article.querySelector('.score')
      if (scoreElement) scoreElement.textContent = newScore.toString();
    } catch (err) {
      console.error(err)
    }
  }

  downvoteBtn.onclick = async () => {
    try {
      const newScore = await postService.voteOnPost((post.UID), 'down');
      const scoreElement = article.querySelector('.score')
      if (scoreElement) scoreElement.textContent = newScore.toString();
    } catch (err) {
      console.error(err)
    }
  }

	const commentsBtn = article.querySelector('.comments-button') as HTMLButtonElement;
	commentsBtn.onclick = () => {
		window.location.href = `/comments.html?post=${post.UID}`
		console.log('comments')
	}

  return article;
}




loadFeed()
