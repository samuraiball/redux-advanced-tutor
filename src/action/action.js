import fetch from 'cross-fetch'


export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'

export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

export function invalidateSubreddit(subreddit) {

    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit,
    }
}

function requestPosts(subreddit) {
    return {
        type: REQUEST_POSTS,
        subreddit
    }
}


function receivePosts(subreddit, json) {
    console.log("receive")
    return {
        type: RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receiveAt: Date.now(),
    }
}


function fetchPosts(subreddit) {
    console.log("fetch")
    console.log(subreddit)
    return dispatch => {
        dispatch(requestPosts(subreddit))
        return fetch(`https://www.reddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json => receivePosts(dispatch(subreddit, json)))
    }
}


function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]
    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {
    console.log("ifNeeded")
    console.log(subreddit)
    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            return dispatch(fetchPosts(subreddit))
        }
    }
}
