/*-------search by text -----------*/

let search = document.querySelector("#search");
let template = document.querySelector("#template")
//console.log(search);  // check connected or not

search.addEventListener("Keyup", (e) => {
 // console.log(e.target.value);
  let searchText = e.target.value;
  SearchGitHubProfiles(searchText);  //  this is called by calback function in github api block

});


/*-------search by voice -----------*/

let SearchByVoice = document.querySelector("#speechIcon");
SearchByVoice.addEventListener('click', (e) => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener("result", (e) => {
        let transcript = [...e.results]
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("").replace(/\s/g, "") // it is used for removing space b/w username 

      // console.log(transcript);
       search.value = transcript;
       let searchText = transcript;
       SearchGitHubProfiles(searchText); 
    });
    recognition.start();

});

/*--------github api -----------*/

function SearchGitHubProfiles(searchText) {  
  

    let Client_ID = "Iv1.f9c53ed32b2df152";
    let Client_secret = "19515d2b6a1f8ff65c8488fcf9136d2cfa33fed8";
    let BASE_URL = `https://api.github.com/users/${searchText}?client_id=${Client_ID}&client_secret=${Client_secret}`;
    let REPO_URL = `https://api.github.com/users/${searchText}/repos?client_id=${Client_ID}&client_secret=${Client_secret}`
  //  console.log(searchText);
 //base url for base and repo_url for repositories
   
    window
    .fetch(BASE_URL)
    .then((data) =>{
      // console.log(data);  //gives ReadableStream 
       //Should convert the readablestream into Raw data // json object
      // console.log(data.json());
     data.json().then(users => {
          // console.log(users)
         
          if (users.message === "Not Found") {
              template.innerHTML = `<h1 style = "color:red">No Github Profile Found </h1>`;
          }else {
            let output = "";
            output += `
              <section id="ProfileBlock">
                <article>
                  <div class="leftBlock">
                     <figure>
                     <a href="${users.html_url}" target="_blank"> 
                     <img src="${users.avatar_url}" alt="${users.login}" />
                     </a>
                     </figure>
                     <h4><a href="${users.html_url}" target="_blank">${users.name}</a></h4>
                     <h5>${users.login}</h5>
                     <h5>${users.bio}</h5>
                   
                     <h5>${users.company}</h5>
                     <h5>${users.location}</h5>
                  </div>
          <div class="rightBlock">
                    <div id="usersRepo">
                      <span>Repositories : <span class="innerSpan">${users.public_repos}</span></span>
                      <span>Public gists : <span class="innerSpan">${users.public_gists}</span></span>
                      <span>Followers :<span class="innerSpan">${users.followers}</span></span>
                      <span>Following : <span class="innerSpan">${users.following}</span></span>
                    </div>
          <div id = "repoBlock"></div>
          </div>
          </article>
          </section>`;
          template.innerHTML = output;
        }
       }).catch(err => console.log(err))
    })
    .catch((err) => console.log(err));

    //GitHub Public Repository
     window.fetch().then(data => {
       data.json().then(repos => {
       let repos_output = [];
       let Public_repos = document.getElementById("rightSideBlockId");
       console.log(Public_repos);
       for (let repo of repos){
        repos_output += `
        <main>
        <h4><a href="${repo.html_url}" target="_blank">
        ${repo.name}</a>
        </h4>
        <p>${repo.description}</p>
        <p>${new Date(repo.created_at).toLocaleDateString()}</p>
        </main>
        `;
       }
        // console.log(repo);
        document.getElementById("repoBlock").innerHTML = repos_output;
       }).catch (err => console.log(err))
     }).catch (err => console.log(err))

      //---GitHub Public Repository ends here---//
}
