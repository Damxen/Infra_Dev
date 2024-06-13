document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You need to log in first!');
        window.location.href = 'login.html';
        return;
    }
// Builds
    fetch('http://localhost:5000/builds', {
        method: 'GET',
        headers: {
            'x-access-token': token
        }
    })
    .then(response => response.json())
    .then(builds => {
        const buildsContainer = document.getElementById('builds-container');
        builds.forEach(build => {
            const buildElement = document.createElement('div');
            buildElement.className = 'build';
            buildElement.innerHTML = `
                <h3>${build.name}</h3>
                <div class="items">
                    ${build.items.map(itemId => `
                        <img src="http://ddragon.leagueoflegends.com/cdn/14.10.1/img/item/${itemId}.png" alt="Item ${itemId}" title="Item ${itemId}">
                    `).join('')}
                </div>
                <div class="runes">
                    ${build.runes.map(rune => `
                        <img src="http://ddragon.leagueoflegends.com/cdn/img/${rune.icon}" alt="${rune.name}" title="${rune.name}" style="width: 30px; height: 30px;">
                    `).join('')}
                </div>
                <div class="champion">
                    ${build.champion_image ? `<img src="${build.champion_image}" alt="Champion Image">` : 'None'}
                </div>
                <p>Created : ${new Date(build.created_at).toLocaleString()}</p>
            `;
            buildsContainer.appendChild(buildElement);
        });
    })
    .catch(error => console.error('Error fetching builds:', error));
});
