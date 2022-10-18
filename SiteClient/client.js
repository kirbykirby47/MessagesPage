console.log('Epic games is EPic');

//creat variables to be used later
const form = document.querySelector('form'); //select the form on the client
const loadingElement = document.querySelector('.loading'); //select the loading element of client
const infoElement = document.querySelector('.info');
const API_URL = 'http://localhost:5000/infos';

//remove loading gif when the page loads
loadingElement.style.display = '';

//
listAllInfos();


//adds functionality to the submit button
form.addEventListener('submit', (event) => {
    event.preventDefault(); //stop default action of sending form data

    //get all the entered data from the user
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    //store into new variable info
    const info = {
        name,
        content
    };
    form.style.display = 'none';
    loadingElement.style.display = ''; //stops loading

    //turns info into JSON form and sends to the database 
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {
            'content-type': 'application/json'                    
        }
    }).then(response => response.json())    
      .then(createdInfo => {
        form.reset();                           //empty the form box
        form.style.display = '';
        listAllInfos();                         //update the page with the new entered data
      });
}); 


//function for returning the messages from the database to the client
function listAllInfos(){
    infoElement.innerHTML = '';
    fetch(API_URL) //get request sent to the database
        .then(response => response.json())
        .then(infos =>{
            console.log(infos);
            infos.reverse();
            infos.forEach(info =>{   //loop through the info in the mess collection
                //create the elements that will display the already inserted messages
                const div = document.createElement('div');

                const header = document.createElement('h3');
                header.textContent = info.name;

                const contents = document.createElement('p'); //set the content as paragraph form
                contents.textContent = info.content;

                const date = document.createElement('small');
                date.textContent = new Date(info.created);
                
                //add the elements to the div 
                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);

                //display the element on the page by appending div to infoElement
                infoElement.appendChild(div);
            });
            loadingElement.style.display = 'none'; //remove the loading gif so it doesn't keep playing 
        });
}