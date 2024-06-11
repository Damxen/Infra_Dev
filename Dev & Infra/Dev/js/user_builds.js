document.addEventListener('DOMContentLoaded', function() {
    fetchBuilds();
});

function fetchBuilds() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/builds', {
        headers: {
            'x-access-token': token
        }
    })
    .then(response => response.json())
    .then(builds => {
        const buildsContainer = document.getElementById('builds-container');
        builds.forEach(build => {
            const buildElement = document.createElement('div');
            buildElement.classList.add('build');

            buildElement.innerHTML = `
                <h3>${build.name}</h3>
                <div>Items: ${build.items.map(item => `<img src="http://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${item}.png" alt="Item ${item}" title="Item ${item}">`).join('')}</div>
                <div>Runes: ${build.runes.map(rune => `<img src="${rune.icon}" alt="${rune.name}" title="${rune.name}">`).join('')}</div>
                <div>Champion: ${build.champion ? `<img src="${build.champion.image}" alt="${build.champion.name}" title="${build.champion.name}">` : 'None'}</div>
                <div>Created At: ${new Date(build.created_at).toLocaleString()}</div>
            `;

            buildsContainer.appendChild(buildElement);
        });
    })
    .catch(error => console.error('Error fetching builds:', error));
}
