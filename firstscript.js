    // first of all some of elements which their value
    // might have changed are stored in vaiables globally
    const element = document.getElementById("submitButton");
    const username = document.getElementById("name");
    const blog_get = document.getElementById("blog");
    const image_ = document.getElementById("user_img");
    const bio_ID = document.getElementById("bio");
    const location_ = document.getElementById("region");

    let languages = [];
    const l1 = document.getElementById("push_1");
    const l2 = document.getElementById("push_2");
    const l3 = document.getElementById("push_3");
    const l4 = document.getElementById("push_4");
    const l5 = document.getElementById("push_5");
    languages.push(l1);
    languages.push(l2);
    languages.push(l3);
    languages.push(l4);
    languages.push(l5);

    //localStorage.clear();

    // at very first time, when localStorage is empty, I put developer's
    // record as a dictionary into it
    if (localStorage.length === 0){
        var dict = {'login':'amirkhosravinejad', 'name': 'Amir Khosravinejad', 'blog': "https://www.linkedin.com/in/amir-khosravinejad-8a2874217?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BJgg%2FvHYQQTeGKVrSgr5aIQ%3D%3D"
        , 'avatar_url': "https://avatars.githubusercontent.com/u/70014539?v=4", 'bio': 'Current Computer Engineering student at Amirkabir University of Technology'
        , 'location': 'Tehran'
        , 'languages': ['Kotlin', 'Kotlin', 'Python', 'Python', 'Python']};
        localStorage.setItem("1", JSON.stringify(dict));
    }  
    else{
        // only for debugging reason; all of the keys
        // of localStorage is showed in console
        for (const key in localStorage)
            console.log(`${key}: ${localStorage.getItem(key)}`);
    } 

    // on click buttonlistener which first checks the username can
    // be found on localStorage (check_localStorage_find) is called
    // in order to check localStorage and maybe the api to find and  
    // show the details of the github profile which is needed.
    element.addEventListener("click", function() {
        check_localStorage_find();
    });

    // this function is calledfor finding the github profile from
    // local storage and if not, trying to load a json form
    // corresponding url
    function check_localStorage_find(){
        var uid = document.getElementById("githubID").value;
        // used for check if the username is in localStorage or not
        var inLocal = false;
        
        for (let profile_number in localStorage) {
            // because beside of records we save, local Storage
            // have some default keys which are not necessary for us
            if (isNaN(profile_number))
                continue;
            // a query to localStorage to get the present value
            // (user's info) from it's key
            var profile = JSON.parse(localStorage.getItem(profile_number));
            // checks wheter the userid is equal to profile's login
            // or not
            if (profile["login"].toLowerCase() === uid.toLowerCase()){
                // it exists, so the value of inLocal sets to true
                inLocal = true;
                set_data_from_local_storage(profile);
                break;
            }
        }
        if (!inLocal){
            var url = "https://api.github.com/users/".concat(uid);
            load(url);
        }
    }

    // this function will show the data which stored in localStorage
    // to user through html
    function set_data_from_local_storage(profile){
        username.innerHTML = profile["name"];
        blog_get.innerHTML = profile["blog"];
        blog_get.href = profile["blog"];
        image_.src = profile["avatar_url"];
        if (profile["bio"] !== null)
            bio_ID.innerHTML = profile["bio"].
            replace(/(\r\n|\r|\n)/g, '<br>');
        else
            bio_ID.innerHTML = null;
        location_.innerHTML = profile["location"];
        l1.innerHTML = profile["languages"][0];
        l2.innerHTML = profile["languages"][1];
        l3.innerHTML = profile["languages"][2];
        l4.innerHTML = profile["languages"][3];
        l5.innerHTML = profile["languages"][4];
    }

    // asynchronous function which fetches the json from
    // input github username.
    async function load(url) {
        // a try catch for fetching json
        try{
            let out = await (await fetch(url)).json();
            console.log(out);
            
            // check if the json has the not found message
            // (meaning that the user is not found)
            if (out.message === "Not Found")
            // the corresponding function is called
            // in order to warn the client that there
            // isn't any user id assigned to a user
                alert_user_not_found();
            else{
                // if a user id is found, following function
                // will called to set the values in html
                check_null_and_set(out);
                // following lines process the repos part
                // by requesting to the "repos_url" and fetch
                // json, then the repos are stored in array
                let repos_url = url.concat("/repos");
                let repos = await (await fetch(repos_url)).json();
                let repo_list = [];
                for (repo in repos){
                    repo_list.push(repos[repo]);
                }
                // Now we should store new record that is made
                // from json in the localStorage
                new_record_in_local_storage(out, repo_list);   
                
            }
                     
        }
        catch (E){

        }
        
    }
    
    // store the new profile into localStorage by
    // making a new dictionary (new_profile)
    async function new_record_in_local_storage(out, repo_list){
        // first we have to seort the list of repos by date
        // which first repo should be the most recent repo
        // which user pushed there
        var langs = await sort_by_date(repo_list);
        var new_profile = {};
        new_profile["login"] = out["login"];
        new_profile["name"] = out["name"];  
        new_profile["blog"] = out["blog"];    
        new_profile["avatar_url"] = out["avatar_url"];    
        new_profile["bio"] = bio_ID.innerHTML;    
        new_profile["location"] = out["location"];
        new_profile["languages"] = langs;
                
        localStorage.setItem(String(localStorage.length + 1),
            JSON.stringify(new_profile)); 
    }

    async function sort_by_date(repo_list){
        let return_languages = [];
        // if there's not any repos, so we have no languages
        // to show and return an empty list
        if (repo_list.length == 0){
            for (let i = 0; i < 5; i++)
                languages[i].innerHTML = "no language found";
            return return_languages;
        }

        // sort by recent pushes (bubble sort)
        for (let i = 0; i < repo_list.length - 1; i++){
            for (let j = i; j < repo_list.length; j++){
                if (repo_list[i].updated_at < repo_list[j].updated_at){
                    let k = repo_list[i];
                    repo_list[i] = repo_list[j];
                    repo_list[j] = k;
                }
            }
        }

        // pick 5 most recent repos user pushed
       for (let i = 0; i < 5; i++){
        let lang = repo_list[i].language;
        let lang_url = repo_list[i].languages_url;
        if (lang == null){
            let langs = await (await fetch(lang_url)).json();
            if (langs.length != 0){
                languages[i].innerHTML = Object.keys(langs)[0];
                return_languages.push(Object.keys(langs)[0]);
            }
            else{
                console.log(langs);
                languages[i].innerHTML = "No Language Found";
                return_languages.push("");
            }
        }
        else{
            languages[i].innerHTML = lang;
            return_languages.push(lang);
        }
       }
       console.log(return_languages);
       return return_languages;
    }

    // a paragraph with ID "wrong_id" is placed to
    // show that the user entered a wrong id
    function alert_user_not_found(){
        const alert = document.getElementById("wrong_id");
        alert.style.color = "red";
        alert.innerHTML = "Wrong ID!!";
        alert.style.visibility = "visible";
        // this message will be hidden after 2 secs
        setTimeout(alert_, 2000, alert);
        
    }

    // hide the wrong_id_alert
    function alert_(alert){
        alert.style.visibility = "hidden";
    }

    function check_null_and_set(out){
        
        if (out["name"] !== null)
            username.innerHTML = out["name"];
        else
            username.innerHTML = "\t";
        if (out["blog"] !== null){
            blog_get.innerHTML = out["blog"];
            blog_get.href = out["blog"];
        }        
        else{
            blog_get.innerHTML = "\t";
            blog_get.href = "\t";
        }
        if (out["avatar_url"] === null)
            image_.src = "\t";
        else
            image_.src = out["avatar_url"];
        if (out["bio"] !== null)  
            bio_ID.innerHTML = out["bio"].replace(/(\r\n|\r|\n)/g, '<br>');
        else
            bio_ID.innerHTML = "\t";
        if (out["location"] !== null)
            location_.innerHTML = out["location"];
        else
            location_.innerHTML = "\t";
    }