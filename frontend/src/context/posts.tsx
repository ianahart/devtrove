import { createContext, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IPost, IPostsContext } from '../interfaces';
import { IAllPostsRequest } from '../interfaces/requests';
import { http } from '../helpers';

export const PostsContext = createContext<IPostsContext | null>(null);

const PostsContextProvider: React.FC<React.ReactNode> = ({ children }) => {
  const paginationState = { page: 1, has_next: false };
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [postsError, setPostsError] = useState('');
  const [historyError, setHistoryError] = useState('');
  const [pagination, setPagination] = useState(paginationState);
  const checkedPostsList = (): number[] => {
    return [...posts]
      .map((post) => {
        return post.is_checked ? post.id : 0;
      })
      .filter((post) => post !== 0);
  };

  const deleteCheckedPosts = (ids: number[]) => {
    const filtered = [...posts].filter((post) => !ids.includes(post.id));
    setPosts(filtered);
  };

  const someCheckedPosts = (): boolean => {
    return posts.some((post) => post.is_checked);
  };

  const toggleCheckAllPosts = (checked: boolean) => {
    const updated = posts.map((post) => ({ ...post, is_checked: checked }));
    setPosts(updated);
  };

  const updateCheckedPost = (id: number, checked: boolean) => {
    const updated = [...posts].map((post) => {
      return post.id === id ? { ...post, is_checked: checked } : post;
    });
    setPosts(updated);
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
      const response = await http.get<IAllPostsRequest>('/posts/?page=0');
      if (response.status === 200) {
        setPosts(response.data.posts);
        setPagination(response.data.pagination);
        setIsLoaded(true);
      }
    } catch (e: unknown | AxiosError) {
      setIsLoaded(true);
      if (axios.isAxiosError(e)) {
        setPostsError(e.response?.data.error);
      }
    }
  };
  const paginatePosts = async () => {
    try {
      if (!pagination.has_next) return;
      const response = await http.get<IAllPostsRequest>(
        `/posts/?page=${pagination.page}`
      );
      if (response.status === 200) {
        setPosts((prevState) => [...prevState, ...response.data.posts]);
        setPagination((prevState) => ({
          ...prevState,
          page: response.data.pagination.page,
          has_next: response.data.pagination.has_next,
        }));
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
        paginatePosts,
        isLoaded,
        setIsLoaded,
        clearPosts,
        addToReadHistory,
        postsError,
        updateCheckedPost,
        updatePostUpvote,
        setPosts,
        toggleCheckAllPosts,
        checkedPostsList,
        deleteCheckedPosts,
        someCheckedPosts,
        pagination,
        fetchPosts,
        posts,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export default PostsContextProvider;
