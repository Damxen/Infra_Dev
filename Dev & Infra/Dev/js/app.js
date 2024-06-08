// Fonction pour basculer l'affichage du sous-menu
function toggleSubMenu() {
    const subMenu = document.getElementById('statsSubMenu');
    subMenu.classList.toggle('active');
}

let equippedItems = [];
let equippedChampion = null;

// Fonction pour gérer le placement automatique dans les slots
function placeInFirstAvailableSlot(item, slotSelector) {
    const slots = document.querySelectorAll(slotSelector);
    for (const slot of slots) {
        if (!slot.classList.contains('occupied')) {
            const imageUrl = item.icon ? item.icon : item.image;
            slot.innerHTML = `<img src="${imageUrl}" alt="${item.name}" onerror="this.src='default_image.png'">`;
            slot.classList.add('occupied');
            slot.setAttribute('data-item-id', item.id); // Associer l'ID de l'item à l'emplacement
            equippedItems.push({ id: item.id, stats: item }); // Ajoute l'item à equippedItems
            return slot; // Retourne le slot où l'item a été placé
        }
    }
    return null; // Si aucun slot disponible
}

// Fonction pour récupérer les statistiques d'un item
function getItemStats(itemId) {
    return fetch(`http://localhost:5000/items/${itemId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching item stats:', error);
        });
}

// Fonction pour récupérer les statistiques d'un champion
function getChampionStats(championId) {
    return fetch(`http://localhost:5000/champions/${championId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching champion stats:', error);
        });
}

function updateTotalStats() {
    const totalStats = {
        health: 0,
        mana: 0,
        armor: 0,
        ability_power: 0,
        attack_damage: 0,
        attack_speed: 0,
        percent_armor_penetration: 0,
        percent_magic_penetration: 0,
        lethality: 0,
        critical_strike: 0,
        percent_critical_strike_damage: 0,
        movement_speed: 0,
        percent_movement_speed: 0,
        magic_resist: 0,
        ability_haste: 0,
        percent_life_steal: 0,
    };

    equippedItems.forEach(item => {
        Object.keys(totalStats).forEach(stat => {
            totalStats[stat] += item.stats[stat] || 0;
        });
    });

    if (equippedChampion) {
        Object.keys(totalStats).forEach(stat => {
            totalStats[stat] += equippedChampion.stats[stat] || 0;
        });
    }

    updateStats(totalStats);
}

// Fonction pour mettre à jour l'affichage des statistiques
function updateStats(stats) {
    const statElements = {
        'health': 'health',
        'mana': 'mana',
        'armor': 'armor',
        'ability_power': 'ability_power',
        'attack_damage': 'attack_damage',
        'attack_speed': 'attack_speed',
        'percent_armor_penetration': 'percent_armor_penetration',
        'percent_magic_penetration': 'percent_magic_penetration',
        'lethality': 'lethality',
        'critical_strike': 'critical_strike',
        'percent_critical_strike_damage': 'percent_critical_strike_damage',
        'movement_speed': 'movement_speed',
        'percent_movement_speed': 'percent_movement_speed',
        'magic_resist': 'magic_resist',
        'ability_haste': 'ability_haste',
        'percent_life_steal': 'percent_life_steal',
    };

    Object.entries(stats).forEach(([key, value]) => {
        const elementId = statElements[key];
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        }
    });
}

// Gestion de la sélection et la désélection des objets dans l'inventaire
function toggleSelection(slot, itemId) {
    if (slot.classList.contains('occupied')) {
        // Retirer l'item des items équipés
        equippedItems = equippedItems.filter(item => item.id !== itemId);
        slot.innerHTML = ''; // Videz l'emplacement
        slot.classList.remove('occupied'); // Supprimez la classe "occupied"
        slot.removeAttribute('data-item-id'); // Supprimez l'attribut data-item-id
        updateTotalStats(); // Mettez à jour les statistiques totales après la suppression
    } else {
        getItemStats(itemId).then(itemStats => {
            if (itemStats) {
                const placedSlot = placeInFirstAvailableSlot(itemStats, '.item-slot');
                if (placedSlot) {
                    updateTotalStats(); // Mettez à jour les statistiques totales après l'ajout
                }
            }
        });
    }
}

function equipChampion(championId) {
    return fetch(`http://localhost:5000/champions/${championId}`)
        .then(response => response.json())
        .then(championStats => {
            equippedChampion = championStats;
            updateTotalStats();
        })
        .catch(error => {
            console.error('Error equipping champion:', error);
        });
}


// Ajoutez un gestionnaire d'événements de clic à chaque emplacement de champion
document.querySelectorAll('.champion-slot').forEach(slot => {
    slot.addEventListener('click', (event) => {
        const championName = slot.getAttribute('data-champion-name'); // Récupérez le nom du champion
        if (championName) {
            equipChampion(championName); // Utilisez le nom du champion pour équiper
        }
    });
});

// Ajoutez un gestionnaire d'événements de clic à chaque emplacement d'objet
function initializeItemSlots() {
    document.querySelectorAll('.item-slot').forEach(slot => {
        slot.addEventListener('click', (event) => {
            const itemId = parseInt(slot.getAttribute('data-item-id'));
            if (itemId) {
                toggleSelection(slot, itemId);
            }
        });
    });
}

// Récupération des runes, champions et items depuis le serveur et affichage dans la page
fetch('http://localhost:5000/runes')
    .then(response => response.json())
    .then(data => {
        const runesDiv = document.getElementById('runes');
        data.forEach(rune => {
            const runeDiv = document.createElement('div');
            runeDiv.classList.add('rune');
            runeDiv.innerHTML = `<img src="${rune.icon}" alt="${rune.name}" title="${rune.name}" onerror="this.src='default_image.png'">`;

            runeDiv.addEventListener('click', () => {
                placeInFirstAvailableSlot(rune, '.rune-slot');
            });

            runesDiv.appendChild(runeDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching runes:', error);
    });


    fetch('http://localhost:5000/champions')
    .then(response => response.json())
    .then(data => {
        const championsDiv = document.getElementById('champions');
        data.forEach(champion => {
            const championDiv = document.createElement('div');
            championDiv.classList.add('champion');
            championDiv.setAttribute('data-champion-name', champion.name); // Utilisez le nom du champion comme attribut
            championDiv.innerHTML = `<img src="${champion.image}" alt="${champion.name}" title="${champion.name}" onerror="this.src='default_image.png'">`;

            championDiv.addEventListener('click', () => {
                placeInFirstAvailableSlot(champion, '.champion-slot');
            });

            championsDiv.appendChild(championDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching champions:', error);
    });

// Fetch and display items
fetch('http://localhost:5000/items')
    .then(response => response.json())
    .then(data => {
        const itemsDiv = document.getElementById('items');
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            itemDiv.setAttribute('data-item-id', item.id); // Ajout de l'ID de l'item comme attribut de données
            itemDiv.innerHTML = `<img src="${item.image}" alt="${item.name}" title="${item.name}" onerror="this.src='default_image.png'">`;

            itemDiv.addEventListener('click', () => {
                const slot = placeInFirstAvailableSlot(item, '.item-slot');
                if (slot) {
                    slot.classList.add('selected'); // Assurez-vous que le slot est sélectionné
                    updateTotalStats(); // Mettez à jour les statistiques totales après l'ajout
                }
            });

            itemsDiv.appendChild(itemDiv);
        });
        initializeItemSlots(); // Mettre à jour les événements de clic après que les éléments sont ajoutés au DOM
    })
    .catch(error => {
        console.error('Error fetching items:', error);
    });
