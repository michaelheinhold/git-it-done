var containerEl = document.querySelector('#issues-container');
var limitWarningEl = document.querySelector('#limit-warning');
var queryString = document.location.search;
var repoNameEl = document.querySelector('#repo-name');

getRepoName = function() {
    var repoName = queryString.split('=')[1];
    if (repoName) {
        getRepoIssues(repoName);
        repoNameEl.textContent =repoName;
    } else {
        document.location.replace('./index.html');
    }
}

var getRepoIssues = function(repo){
    var apiUrl = 'https://api.github.com/repos/'+repo+'/issues?direction=asc';
    
    fetch(apiUrl).then(function(response){
        //reponse was successful
        if (response.ok) {
            response.json().then(function(data){
                displayIssues(data);

                //check if api has paginatedd issues
                if(response.headers.get('link')){
                    displayWarning(repo);
                }
            });
        } else {
            document.location.replace('./index.html');
        }
    });
};

var displayIssues = function(issues) {
    if(issues.length === 0) {
        containerEl.textContent='This repo has no open issues!';
        return;
    }

    for (var i = 0; i < issues.length; i++){
        //create a link to take users to the issue on github
        var issuesEl = document.createElement('a');
        issuesEl.classList="list-item flex-row justify-space-between align-center";
        issuesEl.setAttribute('href', issues[i].html_url);
        issuesEl.setAttribute('target', '_blank');

        //create span to hold issue title
        var titleEl =document.createElement('span');
        titleEl.textContent=issues[i].title;

        //append to container
        issuesEl.appendChild(titleEl);

        //create a type element
        var typeEl =document.createElement('span');

        //check if issue is an issue or pull request
        if(issues[i].pull_request){
            typeEl.textContent='(Pull request)';
        } else {
            typeEl.textContent='(Issue)';
        }

        //append to container
        issuesEl.appendChild(typeEl);

        containerEl.appendChild(issuesEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "To see more than 30 issues, visit ";

    var linkEl =document.createElement('a');
    linkEl.textContent='See More Issues on GitHub.com';
    linkEl.setAttribute('href', 'https://github.com/'+repo+'/issues');
    linkEl.setAttribute('targe', '_blank');

    //apend
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
