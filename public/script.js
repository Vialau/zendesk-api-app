async function fetchCategories() {
    try {
        const response = await fetch('https://newenki.zendesk.com/api/v2/help_center/fr/categories');
        const data = await response.json();
        return data.categories.reduce((acc, category) => {
            acc[category.id] = category.name;
            return acc;
        }, {});
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

async function fetchSections() {
    try {
        const response = await fetch('https://newenki.zendesk.com/api/v2/help_center/fr/sections');
        const data = await response.json();
        const categories = await fetchCategories();
        return data.sections.reduce((acc, section) => {
            acc[section.id] = {name: section.name, category: categories[section.category_id]};
            return acc;
        }, {});
    } catch (error) {
        console.error('Erreur lors de la récupération des sections:', error);
    }
}

// ... Vos fonctions fetchCategories et fetchSections restent inchangées ...

async function fetchArticles(categoryId = 'all') {
    try {
        const sections = await fetchSections();
        const response = await fetch('https://newenki.zendesk.com/api/v2/help_center/fr/articles');  // Assurez-vous que cette URL est correcte
        const data = await response.json();
        const articlesTbody = document.getElementById('articles');

        let filteredArticles = data.articles;

        if (categoryId !== 'all') {
            filteredArticles = data.articles.filter(article => sections[article.section_id].category_id === categoryId);
        }

        filteredArticles.forEach(article => {

            const tr = document.createElement('tr');

            // Titre
            const tdTitle = document.createElement('td');
            tdTitle.textContent = article.title;
            tr.appendChild(tdTitle);

            // Catégorie
            const tdCategory = document.createElement('td');
            tdCategory.textContent = sections[article.section_id]?.category || 'Non spécifié';
            tr.appendChild(tdCategory);

            // Section
            const tdSectionName = document.createElement('td');
            tdSectionName.textContent = sections[article.section_id]?.name || 'Non spécifié';
            tr.appendChild(tdSectionName);

            // Label
            const tdLabel = document.createElement('td');
            tdLabel.textContent = article.label_names.join(', '); // join, car label_names est un tableau
            tr.appendChild(tdLabel);

            // Edit (Lien spécifique)
            const tdSpecificUrl = document.createElement('td');
            const aSpecificUrl = document.createElement('a');
            const idMatch = article.body.match(/id=\"h_([A-Za-z0-9_]+)\"/);
            const specificId = idMatch ? idMatch[1] : null; 
            if (specificId) {
                aSpecificUrl.href = `https://enkiapp.zendesk.com/knowledge/editor/${specificId}/fr?brand_id=13695294652178`;
                aSpecificUrl.target = "_blank";  // pour ouvrir le lien dans un nouvel onglet
                const icon = document.createElement('img');
                icon.src = '/images/edit.png'; 
                icon.alt = "Lien vers l'article";
                aSpecificUrl.appendChild(icon);
                tdSpecificUrl.appendChild(aSpecificUrl);
            }
            tr.appendChild(tdSpecificUrl);

            // URL
            const tdURL = document.createElement('td');
            const link = document.createElement('a');
            link.href = article.html_url;
            link.target = "_blank";
            const iconURL = document.createElement('img');
            iconURL.src = '/images/picto.png'; 
            iconURL.alt = "Lien vers l'article";
            link.appendChild(iconURL);
            tdURL.appendChild(link);
            tr.appendChild(tdURL);

            articlesTbody.appendChild(tr);

        });
    
    } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
    }
}


fetchArticles();

