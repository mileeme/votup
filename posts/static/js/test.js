document.addEventListener('DOMContentLoaded', function () {

    // get logged in user id
    const user_id = JSON.parse(document.getElementById("user-id").textContent);

    // dropdown 
    document.querySelectorAll('#dropdown').forEach(button => {
        button.addEventListener('click', (e) => {
            let target_dropdown = e.target.nextElementSibling;
            if (target_dropdown.style.display == 'none') {
                target_dropdown.style.display = 'block';
            } else {
                target_dropdown.style.display = 'none';
            }
        })
    })

    // // load results if user answered all questions
    // if (document.querySelector('#user-picks')) {
    //     const total_questions = document.querySelector('#user-picks').dataset.answered.split('-')[0],
    //         total_answered = document.querySelector('#user-picks').dataset.answered.split('-')[1];
    
    //     if (total_answered != 0 && total_questions == total_answered) {
    //         // post pg
    //         document.querySelector('#show-candidate-result').style.display = 'block';
    //     } else {
    //         document.querySelector('#show-candidate-result').style.display = 'none';
    //     }
    // }

    // bookmark post
    document.querySelectorAll('button#bookmark-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const post_id = button.dataset.post.split('-')[0],
                // user_id = button.dataset.post.split('-')[1],
                bookmark_status = e.target.innerHTML.split(' ').join('');
            bookmark(post_id, user_id, bookmark_status);
        })
    })

    // // like answer
    // document.querySelectorAll('[id^="like-btn"]').forEach(input => {
    //     input.addEventListener('click', () => {
    //         const question_id = input.name.split('-')[1],
    //             answer_id = input.dataset.answer.split('-')[0],
    //             user_id = input.dataset.answer.split('-')[1],
    //             candidate_id = input.dataset.answer.split('-').pop();
    //         like(question_id, answer_id, user_id, candidate_id);
    //     })
    // })

    // index and profile pg show post results
    document.querySelectorAll('[id^="post-section"]').forEach(post => {
        let post_id = post.getAttribute('id').split('-')[2];
        result_post(post_id);
    })
});


/* update bookmark */
function bookmark(post_id, user_id, bookmark_status) {
    const csrftoken = Cookies.get('csrftoken');

    // google bookmark svg elements
    let svg_bookmarked = `<svg class="bookmarked" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -2 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>`;
    let svg_bookmark = `<svg class="bookmark" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 -2 24 24"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" /></svg>`;

    
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
            } 
        })
    })
}

/* update like */
function like(question_id, answer_id, user_id, candidate_id) {
    // update like via PUT 
    const csrftoken = Cookies.get('csrftoken');
    fetch(`/like/${question_id}/${answer_id}/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            likes: user_id,
        }),
        headers: {'X-CSRFToken': csrftoken },
    })
    .then(res => res.json())
    .then(data => {
        // get likes 
        update_like(question_id, answer_id, candidate_id);
    })
}

/* update like */
function update_like(question_id, answer_id, candidate_id) {
    
    // declare all local variables 
    let all_questions, all_answers, candidate_answer, candidate_totals, candidate_answers, candidate_total_likes, max_likes, most_liked_candidate, most_liked_candidate_id, check_boxes, svg_checkbox;

    // get answer liked by logged-in user
    fetch(`/update_like/${answer_id}`)
    .then(res => res.json())
    .then(data => {
        console.log(data)
        console.log(`${question_id} / ${answer_id} / ${candidate_id}`)
        all_questions = document.querySelectorAll(`#question${question_id}`);
        // update each answer likes count
        all_questions.forEach(answer => {
            if (answer.getAttribute('name') == candidate_id) {
                answer.dataset.count = data.likes;
            } else {
                answer.dataset.count = 0;
            }
        })

        // get all candidate answers & total answered by user
        all_answers = [];
        total_answered = 0;
        document.querySelectorAll('[id^="question"]').forEach(answer => {
            // parse data 
            candidate_answer = {
                'candidate_id': answer.getAttribute('name'),
                'like_count': parseInt(answer.dataset.count),
            }
            all_answers.push(candidate_answer);

            // get # of questions answered by user
            if (answer.dataset.count === '1') {
                total_answered += 1;
            }
        })

        // update result variables
        candidate_totals = document.querySelectorAll('[id^="total"]'),
        max_likes = 0,
        most_liked_candidate = '',
        most_liked_candidate_id = 0;

        // loop through candidate and get sum of likes 
        candidate_totals.forEach(total => {
            // get candidate id
            const counter_candidate_id = total.getAttribute('id').split('-')[1];
            
            // filter answers for just current candidate
            candidate_answers = all_answers.filter(function (obj) {
                return obj.candidate_id === counter_candidate_id;
            });

            // aggregate sum of candidate's like count
            candidate_total_likes = candidate_answers.reduce(function(a, b) {
                return a + b['like_count'];
            }, 0);

            // show candidate total
            total.innerHTML = candidate_total_likes;

            // loop through likes and get most liked candidate
            if (total.innerHTML > max_likes) {
                max_likes = total.innerHTML; 
                most_liked_candidate = total.dataset.candidate.split('-')[0];
                most_liked_candidate_id = total.getAttribute('id').split('-')[1];
            } else if (total.innerHTML == max_likes) {
                max_likes = max_likes;
                most_liked_candidate = 'tied';
                most_liked_candidate_id = 0;
            } else  {
                max_likes = max_likes;
            }
        })

        // show final result on post
        // document.querySelector('#final-result').innerHTML = `${most_liked_candidate} / ${Math.floor(max_likes/(candidate_answers.length) * 100)}%`;

        document.querySelector('#final-result-candidate').innerHTML = `${most_liked_candidate}`;
        document.querySelector('#final-result-answer-total').innerHTML = `${max_likes}`

        // if user answers all questions show candidate results 
        if (total_answered === candidate_answers.length) {
            result_candidate(most_liked_candidate_id); 
        } else {
        }

        // update check mark for liked answer
        check_boxes = document.querySelectorAll(`#check-box-${question_id}`);
        svg_checkbox = '<svg class="check" viewBox="0 0 45.4 43.34" xmlns="http://www.w3.org/2000/svg"> <path d="m44.15 7.34c-6.29 6.34-11.32 14.41-16.15 22.21-2.51 4-5.09 8.16-7.8 12a4.31 4.31 0 0 1 -3.47 1.81 4.28 4.28 0 0 1 -3.53-1.76c-1.15-1.54-3.09-4-5.15-6.66-2.79-3.58-5.68-7.27-7.24-9.46a4.31 4.31 0 1 1 7-5c1.46 2 4.42 5.83 7 9.18l1.59 2c1.4-2.15 2.79-4.38 4.23-6.68 5.14-8.2 10.43-16.68 17.37-23.71a4.31 4.31 0 0 1 6.12 6.07z" /></svg>';
        check_boxes.forEach(checkmark => {
            let checkmark_candidate = checkmark.dataset.candidate;
            if (checkmark_candidate == data.candidate) {
                checkmark.innerHTML = svg_checkbox;
            } else {
                checkmark.innerHTML = '';
            }
        })
    });
}

// update result answers
function update_answers(post_id) {
    let user_answers, user_answer, answer_name;
    fetch(`/update_answers/${post_id}`)
    .then(res => res.json())
    .then(results => {
        
        // matches = [];
        // document.querySelectorAll('[id^="like-btn"]').forEach(btn => {
        //     if (btn.checked == true) {
        //         matches.push(btn.dataset.answer.split('-')[0]);
        //     }
        // })
        // user_answers = document.querySelector('#user-answers');
        // user_answers.innerHTML = '';
        // matches.forEach(match => {
        //     results.forEach(result => {
        //         let p_answer = document.createElement('p');

        //         if (parseInt(match) == parseInt(result.id)) {
        //             p_answer.innerHTML = `${result.question} / ${result.candidate} / ${result.title} / ${result.description}` 
        //             user_answers.append(p_answer);
        //         }
        //     })
        // })

        // identify answer element and set content to none
        user_answers = document.querySelector('#user-answers');
        user_answers.innerHTML = '';

        // get each liked answer object
        results.forEach(result => {
            let answer_container, heading_id, heading_candidate, heading_question, heading_title, answer_description;

            // create answer container
            answer_container = document.createElement('div');
            answer_container.className = 'card-answer';
            answer_heading = document.createElement('div');

            // create element for key values
            heading_id = document.createElement('label');
            heading_candidate = document.createElement('h6');
            heading_question = document.createElement('h5');
            heading_title = document.createElement('h4');
            answer_description = document.createElement('p');

            // go through each key of object
            Object.keys(result).forEach(function(key) {
                // insert key values into element 
                heading_id.innerHTML = `${result['id']}`;
                heading_candidate.innerHTML = `${result['candidate']}`;
                heading_question.innerHTML = `${result['question']}`;
                heading_title.innerHTML = `${result['title']}`;
                answer_description.innerHTML = `${result['description']}`;
            })

            // append element to answer container
            answer_heading.append(heading_candidate);
            answer_heading.append(heading_question);
            answer_heading.append(heading_title);
            
            answer_container.append(answer_heading);
            answer_container.append(answer_description);

            user_answers.append(answer_container)
        })
    })
}
 
// get result
function result_candidate(most_liked_candidate_id) {
    let section_element, section_name, post_id;
    // show result section
    // document.querySelector('#show-candidate-result').style.display = 'block';

    // if result not tied (0 value)
    if (most_liked_candidate_id) {
        fetch(`/result/candidate/${most_liked_candidate_id}`)
        .then(res => res.json())
        .then(data => {
            // query all candidate detail elements
            section_element = document.querySelectorAll('[id^="sectionProfile"]');

            // loop through each element and get attribute
            section_element.forEach(section => {
                section_name = section.getAttribute('id').split('-')[1];

                // iterate through dictionary
                Object.keys(data).forEach(function(key) {
                    // if dictionary key == section name, insert value
                    if (key == section_name) {
                        if (section_name == 'profile_photo') {
                            let profile_img = document.createElement('img');
                            profile_img.setAttribute('src', `${data[key]}`);
                            profile_img.setAttribute('alt', `${data['full_name']} profile photo`);

                            document.querySelector(`#sectionProfile-${key}`).innerHTML = '';
                            document.querySelector(`#sectionProfile-${key}`).append(profile_img);
                        } else if (section_name == 'website') {
                            document.querySelector(`#sectionProfile-${key}`).setAttribute('src', `${data[key]}`);
                        } else {
                            document.querySelector(`#sectionProfile-${key}`).innerHTML = `${data[key]}`;
                        }
                    }
                });
            })
        })

        // get liked answers
        post_id = document.querySelector('#post-heading').dataset.id;
        update_answers(post_id)

    } else {
        console.log('tied')
    }
}

// show candidate match on post features
function result_post(post_id) {

    fetch(`/result/post/${parseInt(post_id)}`)
    .then(res => res.json())
    .then(result => {
        // console.log(result)

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