// js/app.js

// Fonction pour basculer l'affichage du sous-menu
function toggleSubMenu() {
    const subMenu = document.getElementById('statsSubMenu');
    subMenu.classList.toggle('active');
}

// Fonction pour mettre à jour les statistiques du champion sélectionné
function updateStats(stats) {
    document.getElementById('hp').textContent = stats.hp;
    document.getElementById('mana').textContent = stats.mana;
    document.getElementById('armor').textContent = stats.armor;
    document.getElementById('attackDamage').textContent = stats.attack_damage;
    document.getElementById('attackSpeed').textContent = stats.attack_speed;
    document.getElementById('movementSpeed').textContent = stats.movement_speed;
    document.getElementById('magicResist').textContent = stats.magic_resist;
    document.getElementById('hpRegen').textContent = stats.hp_regen;
    document.getElementById('manaRegen').textContent = stats.mana_regen;

    document.getElementById('hpPerLevel').textContent = stats.hpperlevel;
    document.getElementById('manaPerLevel').textContent = stats.manaperlevel;
    document.getElementById('armorPerLevel').textContent = stats.armorperlevel;
    document.getElementById('attackDamagePerLevel').textContent = stats.attack_damage_perlevel;
    document.getElementById('attackSpeedPerLevel').textContent = stats.attack_speed_perlevel;
    document.getElementById('magicResistPerLevel').textContent = stats.magic_resist_perlevel;
    document.getElementById('hpRegenPerLevel').textContent = stats.hp_regen_perlevel;
    document.getElementById('manaRegenPerLevel').textContent = stats.mana_regen_perlevel;
}

// Récupération des runes, champions et items depuis le serveur et affichage dans la page
fetch('http://localhost:5000/runes')
    .then(response => response.json())
    .then(data => {
        const runesDiv = document.getElementById('runes');
        data.forEach(rune => {
            const runeDiv = document.createElement('div');
            runeDiv.classList.add('rune');
            runeDiv.innerHTML = `<img src="${rune.icon}" alt="${rune.name}" onerror="this.src='default_image.png'">`;

            const tooltipContent = `
                <h3>${rune.name}</h3>
                <p>${rune.shortDescription}</p>
            `;

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.innerHTML = tooltipContent;
            runeDiv.appendChild(tooltip);

            runesDiv.appendChild(runeDiv);
        });
    });

fetch('http://localhost:5000/champions')
    .then(response => response.json())
    .then(data => {
        const championsDiv = document.getElementById('champions');
        data.forEach(champion => {
            const championDiv = document.createElement('div');
            championDiv.classList.add('champion');
            championDiv.innerHTML = `<img src="${champion.image}" alt="${champion.name}" onerror="this.src='default_image.png'">`;

            const tooltipContent = `
                <h3>${champion.name}</h3>
                <p>${champion.title}</p>
                <p>${champion.description}</p>
            `;

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.innerHTML = tooltipContent;
            championDiv.appendChild(tooltip);

            championDiv.addEventListener('click', () => {
                updateStats(champion.stats);
            });

            championsDiv.appendChild(championDiv);
        });
    });

fetch('http://localhost:5000/items')
    .then(response => response.json())
    .then(data => {
        const itemsDiv = document.getElementById('items');
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.innerHTML = `<img src="${item.image}" alt="${item.name}" onerror="this.src='default_image.png'">`;

            const tooltipContent = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Cost: ${item.cost}</p>
                <p>Tags: ${item.tags.join(', ')}</p>
            `;

            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.innerHTML = tooltipContent;
            itemDiv.appendChild(tooltip);

            itemsDiv.appendChild(itemDiv);
        });
    });
