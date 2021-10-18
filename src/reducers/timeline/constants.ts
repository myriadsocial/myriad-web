import type {ACTION_LOADING} from '../base/constants';

export const LOAD_TIMELINE = 'LOAD_TIMELINE';
export type LOAD_TIMELINE = typeof LOAD_TIMELINE;

export const TIMELINE_LOADING = 'TIMELINE_LOADING';
export type TIMELINE_LOADING = ACTION_LOADING;

export const ADD_POST_TO_TIMELINE = 'ADD_POST_TO_TIMELINE';
export type ADD_POST_TO_TIMELINE = typeof ADD_POST_TO_TIMELINE;

export const UPDATE_TIMELINE_FILTER = 'UPDATE_TIMELINE_FILTER';
export type UPDATE_TIMELINE_FILTER = typeof UPDATE_TIMELINE_FILTER;

export const CLEAR_TIMELINE = 'CLEAR_TIMELINE';
export type CLEAR_TIMELINE = typeof CLEAR_TIMELINE;

export const LIKE_POST = 'LIKE_POST';
export type LIKE_POST = typeof LIKE_POST;

export const REMOVE_LIKE_POST = 'REMOVE_LIKE_POST';
export type REMOVE_LIKE_POST = typeof REMOVE_LIKE_POST;

export const REMOVE_DISLIKE_POST = 'REMOVE_DISLIKE_POST';
export type REMOVE_DISLIKE_POST = typeof REMOVE_DISLIKE_POST;

export const DISLIKE_POST = 'DISLIKE_POST';
export type DISLIKE_POST = typeof DISLIKE_POST;

export const FETCH_WALLET_DETAILS = 'FETCH_WALLET_DETAILS';
export type FETCH_WALLET_DETAILS = typeof FETCH_WALLET_DETAILS;

export const REMOVE_POST = 'REMOVE_POST';
export type REMOVE_POST = typeof REMOVE_POST;

export const FETCH_DEDICATED_POST = 'FETCH_DEDICATED_POST';
export type FETCH_DEDICATED_POST = typeof FETCH_DEDICATED_POST;

export const UPDATE_POST_PLATFORM_USER = 'UPDATE_POST_PLATFORM_USER';
export type UPDATE_POST_PLATFORM_USER = typeof UPDATE_POST_PLATFORM_USER;

export const UPVOTE_POST = 'UPVOTE_POST';
export type UPVOTE_POST = typeof UPVOTE_POST;

export const SET_DOWNVOTING = 'SET_DOWNVOTING';
export type SET_DOWNVOTING = typeof SET_DOWNVOTING;

export const DOWNVOTE_POST = 'DOWNVOTE_POST';
export type DOWNVOTE_POST = typeof DOWNVOTE_POST;

export const SET_TIPPED_CONTENT = 'SET_TIPPED_CONTENT';
export type SET_TIPPED_CONTENT = typeof SET_TIPPED_CONTENT;

export const SET_SEARCHED_POSTS = 'SET_SEARCHED_POSTS';
export type SET_SEARCHED_POSTS = typeof SET_SEARCHED_POSTS;
