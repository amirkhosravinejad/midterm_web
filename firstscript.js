    const element = document.getElementById("submitButton");
    const username = document.getElementById("name");
    const blog_get = document.getElementById("blog");
    const image_ = document.getElementById("user_img");
    const bio_ID = document.getElementById("bio");
    const location_ = document.getElementById("region");
   
    // localStorage.clear();
    if (localStorage.length === 0){
        var dict = {'login':'amirkhosravinejad', 'name': 'Amir Khosravinejad', 'blog': "https://www.linkedin.com/in/amir-khosravinejad-8a2874217?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BJgg%2FvHYQQTeGKVrSgr5aIQ%3D%3D"
        , 'avatar_url': "https://avatars.githubusercontent.com/u/70014539?v=4", 'bio': 'Current Computer Engineering student at Amirkabir University of Technology'
        , 'location': 'Tehran'};
        localStorage.setItem("1", JSON.stringify(dict));
    }  
    else{
        for (const key in localStorage)
            console.log(`${key}: ${localStorage.getItem(key)}`);
    } 
    // on click buttonlistener which first checks the username can
    // be found on github (check_validity function) and if it is
    // valid, the next function (check_localStorage_find) is called
    // in order to check localStorage and maybe the api to find and  
    // show the details of the github profile which is needed.
    element.addEventListener("click", function() {
        //check_validity(uid);
        check_localStorage_find();
    });

    function check_localStorage_find(){
        var uid = document.getElementById("githubID").value;
        var inLocal = false;
        //console.log(uid);
        for (let profile_number in localStorage) {
            if (isNaN(profile_number))
                continue;
            var profile = JSON.parse(localStorage.getItem(profile_number));
            //console.log(`salam ${profile_number}`);
            if (profile["login"] === uid){
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
            load(url);
            // console.log(uid);
            // fetch(url)
            // .then(res => {
            //     res.json()
            //     if (res.status == 404)
            //         alert_user_not_found()
            //     })
            // .then(out =>
            //     check_null_and_set(out))
            // .catch(err => { console.log(err) });
            // var res = fetch(url).then(res.json());
            // console.log(response);
            // if (res.message === "Not Found")
            //     console.log("notfound!");   
            // else
            //     check_null_and_set(res);
            //makeRequest(url);
        }
    }
    async function load(url) {
        try{
            let obj = await (await fetch(url)).json();
            console.log(obj);
            
            if (obj.message === "Not Found")
                alert_user_not_found();
            else
                check_null_and_set(obj);        
        }
        catch{
            
        }
        
    }
    

    function alert_user_not_found(){
        const alert = document.getElementById("wrong_id");
        alert.style.color = "red";
        alert.innerHTML = "Wrong ID!!";
        alert.style.visibility = "visible";
        setTimeout(alert_, 2000, alert);
        
    }

    function alert_(alert){
        alert.style.visibility = "hidden";
    }

    function check_null_and_set(out){
        
        var new_profile = {};
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

        new_profile["login"] = out["login"];
        new_profile["name"] = out["name"];  
        new_profile["blog"] = out["blog"];    
        new_profile["avatar_url"] = out["avatar_url"];    
        new_profile["bio"] = bio_ID.innerHTML;    
        new_profile["location"] = out["location"]; 
        localStorage.setItem(String(localStorage.length + 1),
            JSON.stringify(new_profile)); 
    }