const element = document.getElementById("submitButton");
    const username = document.getElementById("name");
    const blog_get = document.getElementById("blog");
    const image_ = document.getElementById("user_img");
    const bio_ID = document.getElementById("bio");
    const location_ = document.getElementById("region");
    //localStorage.clear();
    if (localStorage.length == 0){
        var dict = {'name': 'amirkhosravinejad', 'blog': "", 'avatar_url': "https://avatars.githubusercontent.com/u/70014539?v=4",
        'bio': null, 'location': null};
        localStorage.setItem("1", JSON.stringify(dict));
    }  
    else{
        for (const key in localStorage) {
            console.log(`${key}: ${localStorage.getItem(key)}`);
        }
    }  
    element.addEventListener("click", function() {
        check_localStorage_find();
    });

    function check_localStorage_find(){
        var inLocal = false;
        var uid = document.getElementById("githubID").value;
        for (const profile_number in localStorage) {
            var profile = JSON.parse(localStorage.getItem(profile_number));
            console.log(`salam${profile.name}`);
            if (profile["name"] === uid){
                inLocal = true;
                username.innerHTML = profile["name"];
                blog_get.innerHTML = profile["blog"];
                blog_get.href = profile["blog"];
                image_.src = profile["avatar_url"];
                if (profile["bio"] !== null)
                    bio_ID.innerHTML = profile["bio"].replace(/(\r\n|\r|\n)/g, '<br>');
                else
                    bio_ID.innerHTML = null;
                location_.innerHTML = profile["location"];
                break;
            }
        }
        if (!inLocal){
            var url = "https://api.github.com/users/".concat(uid);
            fetch(url)
            .then(res => res.json())
            .then((out) => {
                check_null_and_set(out);
            }).catch(err => console.error(err));
        }
    }

    function check_null_and_set(out){
        var new_profile = {};
        if (out["login"] !== null)
            username.innerHTML = out["login"];
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
        
        new_profile["name"] = out["login"];  
        new_profile["blog"] = out["blog"];    
        new_profile["avatar_url"] = out["avatar_url"];    
        new_profile["bio"] = bio_ID.innerHTML;    
        new_profile["location"] = out["location"]; 
        localStorage.setItem(String(localStorage.length + 1),
            JSON.stringify(new_profile)); 
    }