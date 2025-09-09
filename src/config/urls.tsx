export const API_URL =import.meta.env.VITE_APP_API_URL;
console.log("API_URL:", API_URL);

export const REGISTER_URL = "account/register";
export const LOGIN_URL = "account/login";
export const CREATE_POST = "posts/create";
export const GET_ALL_POSTS = "posts"
export const TOGGLE_LIKE = (postId: string) => `/posts/${postId}/like`;
export const GET_LIKE_COUNT = (postId: string) => `/posts/${postId}/like-count`;
export const GET_MY_POSTS = "my-posts"


export const PROFILE_URL = "account/profile";
export const PROFILE_UPDATE_URL = "account/profile/update"
export const UPLOAD_USER_PHOTO = "account/profile/upload-photo"
export const DELETE_POST = "my-posts/delete"




