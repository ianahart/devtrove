import { createContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IPost, IPostsContext } from '../interfaces';
import { http } from '../helpers';

export const PostsContext = createContext<IPostsContext | null>(null);

const PostsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [postsError, setPostsError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const scrape = async () => {
    try {
      const response = await http.post('/posts/', {
        url: 'https://www.dev.to',
      });
      if (response.status === 201) {
        setIsLoaded(true);
        setPosts(response.data);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setHistoryError(e.response?.data.error);
      }
    }
  };

  const addToReadHistory = async (user: number, post: number, tags: string[]) => {
    try {
      const response = await http.post('/history/', { user, post, tags });
    } catch (e: unknown | AxiosError) {}
  };

  const clearPosts = () => {
    setPosts([]);
  };

  const preformUpdate = (post: IPost, id: number, dir: string) => {
    if (post.id === id) {
      if (dir === 'upvote') {
        post.cur_user_voted = true;
        post.upvotes_count = post.upvotes_count + 1;
      } else if (dir === 'downvote') {
        post.cur_user_voted = false;
        post.upvotes_count = post.upvotes_count === 0 ? 0 : post.upvotes_count - 1;
      }
    }
    return post;
  };

  const updatePostUpvote = (id: number, dir: string) => {
    const updated = [...posts].map((post) => {
      return preformUpdate(post, id, dir);
    });
    setPosts(updated);
  };

  const fetchPosts = async () => {
    try {
      const response = await http.get<IPost[]>('/posts/');
      if (response.status === 200) {
        setPosts(response.data);
        setIsLoaded(true);
      }
    } catch (e: unknown | AxiosError) {
      setIsLoaded(true);
      if (axios.isAxiosError(e)) {
        setPostsError(e.response?.data.error);
      }
    }
  };

  const updateBookmarks = (post_id: number, bookmarked: boolean) => {
    const updatedPosts = [...posts].map((post) => {
      return post.id === post_id
        ? { ...post, cur_user_bookmarked: bookmarked }
        : { ...post };
    });
    setPosts(updatedPosts);
  };

  const bookmark = async (post_id: number, user_id: number, dir: string) => {
    try {
      if (dir === 'bookmark') {
        const response = await http.post('/bookmarks/', {
          post: post_id,
          user: user_id,
        });
        if (response.status === 201) {
          updateBookmarks(post_id, true);
        }
      } else {
        const response = await http.delete(`/bookmarks/${post_id}/?initiator=post`);
        updateBookmarks(post_id, false);
      }
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        setPostsError(e.response?.data.error);
      }
    }
  };

  return (
    <PostsContext.Provider
      value={{
        bookmark,
        isLoaded,
        setIsLoaded,
        clearPosts,
        addToReadHistory,
        postsError,
        updatePostUpvote,
        fetchPosts,
        posts,
        scrape,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContextProvider;
