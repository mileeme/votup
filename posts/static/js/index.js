document.addEventListener('DOMContentLoaded', function () {
    // get logged in user id
    const user_id = JSON.parse(document.getElementById("user-id").textContent);

    // dropdown 
    document.querySelector('#dropdown').addEventListener('click', (e) => {
        let dropdown_content = document.querySelector('.dropdown-content');

        if (dropdown_content.style.display == 'none') {
            dropdown_content.style.display = 'block';
        } else {
            dropdown_content.style.display = 'none';
        }
    })

    // bookmark
    document.querySelectorAll('button#bookmark-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const post_id = button.dataset.post.split('-')[0],
                user_id = button.dataset.post.split('-')[1];
            bookmark(post_id, user_id);
        })
    })

    // index pg: display post results
    document.querySelectorAll('[id^="post-section"]').forEach(post => {
        let post_id = post.getAttribute('id').split('-')[2];
        result_post(post_id);
    })

    // profile pg: display post results
    document.querySelectorAll('[id^="profile-bookmark"]').forEach(post => {
        let post_id = post.getAttribute('id').split('-')[2];
        result_post(post_id);
    })
});


/* update bookmark */
function bookmark(post_id, user_id) {
    const csrftoken = Cookies.get('csrftoken');
    const p = window.location.pathname;

    // bookmark css for darkmode and lightmode
    let bookmark_mode; 
    if (p === '/' || p === 0)  {
        bookmark_mode = 'bookmark';
    } else {
        bookmark_mode = 'bookmark-post';
    }

    // bookmark svg elements
    let svg_bookmarked = `<svg class="bookmarked" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -2 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>`;
    
    let svg_bookmark = `<svg class="${bookmark_mode}" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -2 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" /></svg>`;

    // update bookmark via PUT
    fetch(`/bookmark/${post_id}/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            bookmarks: user_id,
        }),
        headers: {'X-CSRFToken': csrftoken },
    })
    .then(res => res.json())
    .then(result => {
        // get bookmark via GET
        fetch(`/bookmark/${post_id}/${user_id}`)
        .then(res => res.json())
        .then(result => {
            // toggle bookmark status 
            const change_status = document.querySelector(`[data-post="${post_id}-${user_id}"]`);
            if (result) {
                change_status.innerHTML = svg_bookmarked;

            } else {
                change_status.innerHTML = svg_bookmark;
                let delete_card = document.querySelector(`#profile-bookmark-${post_id}`);
                delete_card.classList.add('delete-card');
                delete_card.style.animationPlayState = 'running';
                delete_card.addEventListener('animationend', () => {
                    delete_card.remove();
                })
            } 
        })
    })
}

// show candidate match on post features
function result_post(post_id) {
    // get post result
    fetch(`/result/post/${parseInt(post_id)}`)
    .then(res => res.json())
    .then(result => {
        // display result
        document.querySelectorAll('#card-post-answered').forEach(status => {

            if (result.candidate != null && status.dataset.post == post_id) {
                if (result.user_answered == result.total_questions) {
                    status.innerHTML = `&#x2713; ${result.candidate}`
                } else {
                    status.innerHTML = ''
                }
            }
        })
    })
}