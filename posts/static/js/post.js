document.addEventListener('DOMContentLoaded', function () {

    const user_id = JSON.parse(document.getElementById("user-id").textContent);
        post_id = document.querySelector('#post-heading').dataset.id,
        questions = document.querySelectorAll('#single-question').length,
        user_total_answered = document.querySelector('#user-picks').dataset.answered.split('-')[1];
    // get checked answer detail
    document.querySelectorAll('input[id^="like-btn-"]').forEach(input => {
        input.addEventListener('change', () => {
            let checked_inputs = [];
            // let checkmark = '<svg class="checkmark" viewBox="0 0 38 36.33" xmlns="http://www.w3.org/2000/svg"><path class="checkmark__check" d="m.5 19.5 13 16 24-35" fill="none" stroke="#000" stroke-linecap="round" stroke-miterlimit="10"/></svg>';
            let checkmark = '<svg class="checkmark" viewBox="0 0 45 42.5" xmlns="http://www.w3.org/2000/svg"><path class="checkmark__check" d="m4 23 12.36 15.22a.76.76 0 0 0 1.21 0l23.43-34.22" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="8" stroke-miterlimit="10" /> </svg>';
            console.log(checked_inputs)
            document.querySelectorAll('input[id^="like-btn-"]').forEach(input => {
                let answer = {
                    'question_id': input.dataset.answer.split('-')[0],
                    'answer_id': input.dataset.answer.split('-')[1],
                    'candidate_id': input.dataset.answer.split('-')[2],
                    'candidate_name': input.dataset.answer.split('-')[3],
                    'checked': input.checked ? true : false,
                }

                // get all checked answers
                if (answer.checked === true) {
                    checked_inputs.push(answer)

                    // add checkmark for checked answer
                    document.querySelector(`#check-box-${answer.answer_id}`).innerHTML = checkmark;
                } else {
                    document.querySelector(`#check-box-${answer.answer_id}`).innerHTML = '';
                }
            })

            // if all questions answered show results
            if (checked_inputs.length === questions) {
                update_likes(checked_inputs, post_id, user_id);
                document.querySelector('#show-candidate-result').style.display = 'block';
                document.querySelector('#result-arrow').className = 'arrow down';
            } else {
                document.querySelector('#show-candidate-result').style.display = 'none';
            }
        })
    })

    // if user is authenticated and answered all, display results
    if (user_total_answered != 0 && user_total_answered == questions) {
        document.querySelector('#show-candidate-result').style.display = 'block';
        document.querySelector('#result-arrow').className = 'arrow down';
    } else {
        document.querySelector('#show-candidate-result').style.display = 'none';
    }

    // animate section
    document.querySelectorAll('#animate-heading').forEach(section => {
        if (inViewPort(section)) {
            section.classList.add('animate-heading');
            section.style.animationPlayState = 'running';
        } 
    })

});

// document.addEventListener('scroll', () => {

//     // animate section
//     document.querySelectorAll('#animate-heading').forEach(section => {
//         if (inViewPort(section)) {
//             section.style.animationPlayState = 'running';
//         } 
//     })
// });

// in viewport
function inViewPort(element) {
    const rect = element.getBoundingClientRect();
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth)) {
        return true;
    } else {
        return false;
    }
}

// display result of liked candidate
function update_likes(checked_inputs, post_id, user_id) {
    let checkedCandidate_ids, obj, mostLiked, likedCandidate_id, likedCandidate_name, candidateProfile_section;

    // for user authenticated, save results
    if (user_id) {
        checked_inputs.forEach(checked => {
            let question_id = checked.question_id,
                answer_id = checked.answer_id;

            // update user like in answer via PUT 
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
                update_answers(post_id, user_id);
            })
        })
    }

    checkedCandidate_ids = [];
    obj = {};
    mostLiked = 0;
    likedCandidate_id = 0;
    likedCandidate_name = '';

    // get candidate ids
    checked_inputs.forEach(checked => {
        checkedCandidate_ids.push(checked.candidate_id);
    })

    // get liked frequency of candidate
    checkedCandidate_ids.forEach(candidate => {

        // check if candidate is represented in obj
        // if not, give value of 1 else increase value by 1
        if (!obj[candidate]) {
            obj[candidate] = 1;
        } else {
            obj[candidate]++;
        }

        // check candidate value against last most liked number
        // if value equals number, get candidate id 
        if (obj[candidate] > mostLiked) {
            mostLiked = obj[candidate];
        }
        if (obj[candidate] === mostLiked) {
            likedCandidate_id = candidate;
        }
    })

    // get name of most liked candidate
    checked_inputs.find(input => {
        if (input.candidate_id == likedCandidate_id) {
            likedCandidate_name = input.candidate_name;
        }
    })

    // most liked candidate
    document.querySelector('#final-result-candidate').innerHTML = likedCandidate_name;
    document.querySelector('#final-result-answer-total').innerHTML = mostLiked;

    // fetch most liked candidate data
    fetch(`/result/candidate/${likedCandidate_id}`)
    .then(res => res.json())
    .then(data => {
        candidateProfile_section = document.querySelectorAll('[id^="sectionProfile"]');

        candidateProfile_section.forEach(section => {
            let section_name = section.getAttribute('id').split('-')[1];
            // iterate through obj dictionary
            Object.keys(data).forEach(function(key) {
                // if dictionary key == section_name, display value
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
            })
        })
    });
}

// update answers of liked candidate
function update_answers(post_id, user_id) {
    // if user is logged in
    if (user_id) {
        fetch(`/update_answers/${post_id}`)
        .then(res => res.json())
        .then(results => {

            const user_answers = document.querySelector('#user-answers');
                user_answers.innerHTML = '';

            // set answers content to none
            results.forEach(result => {
                let answer_container, heading_id, heading_candidate, heading_question_title, answer_description, answer_source, answer_source_link;

                // create answer container
                answer_container = document.createElement('div');
                answer_container.className = 'card-answer';
                answer_heading = document.createElement('div');
                answer_source = document.createElement('div');
                answer_source.className = 'card-answer-source';

                // create element for key values
                heading_id = document.createElement('label');
                heading_candidate = document.createElement('h6');
                // heading_question = document.createElement('h5');
                // heading_title = document.createElement('h4');
                heading_question_title = document.createElement('h4');
                answer_description = document.createElement('p');
                answer_description.className = 'mt-1';
                answer_source_link = document.createElement('a');

                // loop through obj and insert value into element
                Object.keys(result).forEach(function(key) {
                    heading_id.innerHTML = `${result['id']}`;
                    heading_candidate.innerHTML = `&#x2713; ${result['candidate']}`;
                    heading_question_title.innerHTML = `${result['question']}: ${result['title']}`;
                    // heading_title.innerHTML = `${result['title']}`;
                    answer_description.innerHTML = `${result['description']}`;
                    answer_source_link.innerHTML =`Source`;
                })

                // append element to answer container
                answer_heading.append(heading_candidate);
                answer_heading.append(heading_question_title);
                // answer_heading.append(heading_title);
                answer_source.append(answer_source_link);

                answer_container.append(answer_heading);
                answer_container.append(answer_description);
                answer_container.append(answer_source_link);

                user_answers.append(answer_container)
            })
        })
    }
}