import api from './api';

class App {
    constructor() {
        this.repositories = [];

        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listElement = document.getElementById('repo-list');

        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
     }

     setLoading(loading = true) {
         if (loading === true) {
             let loadingEl = document.createElement('span');
             loadingEl.appendChild(document.createTextNode('Carregando'));
             loadingEl.setAttribute('id','loading');

             this.formEl.appendChild(loadingEl);
         } else {
             document.getElementById('loading').remove();
         }
     }

   async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if(repoInput.length == 0)
            return;

    this.setLoading();

    try {
        const response = await api.get(`/repos/${repoInput}`);

        const { name, description, html_url ,owner: { avatar_url } } = response.data;

        console.log(response);

            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });
            
            this.render();
        }catch(err) {
            alert('Repositório inexistente');
        }
        this.setLoading(false);
        this.inputEl.value = '';
     }

     render() {
        this.listElement.innerHTML = '';

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let description = document.createElement('p');
            description.appendChild(document.createTextNode(repo.description));

            let linkL = document.createElement('a');
            linkL.setAttribute('target','_blank');
            linkL.setAttribute('href',repo.html_url);
            linkL.appendChild(document.createTextNode('Acessar'));

            let liEl = document.createElement('li');

            liEl.appendChild(imgEl);
            liEl.appendChild(titleEl);
            liEl.appendChild(description);
            liEl.appendChild(linkL);

            this.listElement.appendChild(liEl);
        });
    }
};

new App();