//variables for form
var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');

//variables for output
var repoContainerEl = document.querySelector('#repos-container');
var repoSearchTerm = document.querySelector('#repo-search-term');

var languageButtonsEl =document.querySelector('#language-buttons');

var getUserRepos = function(user) {
    //format github api url
    var apiUrl ="https://api.github.com/users/"+user+"/repos";
    
    //make a request to the url
    fetch(apiUrl)
        .then(function(response){
            if (response.ok) {
                response.json().then(function(data){
                    displayRepos(data, user);
                });
            } else {
                alert('Error: GitHub User Not Found');
            }
        })
        .catch(function(error){
            alert('Unable to connect to GitHub');
        });
};

var formSubmitHandler = event => {
    event.preventDefault();
    //get value from input element
    var username = nameInputEl.value;

    if(username){
        getUserRepos(username);
        nameInputEl.value="";
    } else {
        alert('Please enter a GitHub username');
    }
};

var displayRepos = function(repos, searchTerm) {
    //check if api returned any repos
    if (repos.length === 0){
        repoContainerEl.textContent = 'No repositories found.';
        return;
    }
    
    //clear ols content
    repoContainerEl.textContent="";
    repoSearchTerm.textContent=searchTerm;

    //loop over repos
    for (var i=0;i< repos.length; i++){
        //format repo name
        var repoName = repos[i].owner.login+"/"+repos[i].name;

        //create a container for each repo
        var repoEl =document.createElement('a');
        repoEl.classList="list-item flex-row justify-space-between align-center";
        repoEl.setAttribute('href', './single-repo.html?q='+repoName)
        
        //create span element to hold repo name
        var titleEl = document.createElement('span');
        titleEl.textContent= repoName;

        //append to cantainer
        repoEl.appendChild(titleEl);

        //create a staatus el
        var statusEl = document.createElement('span');
        statusEl.classList ='flex-row align-center';

        //check if current repo has issues or not 
        if (repos[i].open_issues_count > 0){
            statusEl.innerHTML=
            "<i class='fas fa-times status-icon icon-danger'></i>"+repos[i].open_issues_count + " issues(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append to dom
        repoContainerEl.appendChild(repoEl);
    }
};

var getFeaturedRepos = function(language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayRepos(data.items, language)
            });
        } else {
            alert('Error: GitHub User Not Found');
        }
    });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute('data-language');
    console.log(language);
    if(language){
        getFeaturedRepos(language);
        repoContainerEl.textContent="";
    } 
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);

getUserRepos();