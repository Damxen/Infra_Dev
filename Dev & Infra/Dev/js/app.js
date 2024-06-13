let equippedItems = [];
let equippedRunes = [];
let equippedChampion = null;

//Recup stats items

function getItemStats(itemId) {
    return fetch(`http://localhost:5000/items/${itemId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching item stats:', error);
        });
}

//Recup champs items
function getChampionStats(championId) {
    return fetch(`http://localhost:5000/champions/${championId}`)
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching champion stats:', error);
        });
}

//Update stats totales du champion selectionné
function updateTotalStats() {
    const levelDropdown = document.getElementById('champion-level');
    const selectedLevel = parseInt(levelDropdown.value - 1);

    levelDropdown.addEventListener('change', () => {
        updateTotalStats();
    });

    const totalStats = {
        hp: 0,
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
        hp_regen: 0,
        mana_regen: 0,
        hp_regen_perlevel: 0,
        mana_regen_perlevel: 0,
        hp_perlevel: 0,
        mana_perlevel: 0,
        magic_resist_perlevel: 0,
        attack_damage_perlevel: 0,
        attack_speed_perlevel: 0,
        armor_perlevel: 0,
        magic_resist_perlevel: 0,
    };

    if (equippedChampion) {
        Object.keys(totalStats).forEach(stat => {
            if (stat.endsWith('_perlevel')) {
                const baseStat = stat.replace('_perlevel', '');
                totalStats[baseStat] += (equippedChampion[stat] || 0) * selectedLevel;
                document.getElementById(stat).textContent = (equippedChampion[stat] || 0);
            } else {
                totalStats[stat] += equippedChampion[stat] || 0;
            }
        });
    }

    equippedItems.forEach(item => {
        Object.keys(totalStats).forEach(stat => {
            if (stat.endsWith('_perlevel')) {
                return;
            }
            totalStats[stat] += item.stats[stat] || 0;
        });
    });

    updateStats(totalStats);
    updateSubStats(equippedChampion);
}

// Update stats du champ
function updateStats(stats) {
    const statElements = {
        'hp': 'hp',
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
        'hp_perlevel': 'hp_perlevel',
        'mana_perlevel': 'mana_perlevel',
        'attack_damage_perlevel': 'attack_damage_perlevel',
        'attack_speed_perlevel': 'attack_speed_perlevel',
        'armor_perlevel': 'armor_perlevel',
        'magic_resist': 'magic_resist',
        'ability_haste': 'ability_haste',
        'percent_life_steal': 'percent_life_steal',
        'hp_regen': 'hp_regen',
        'mana_regen': 'mana_regen',
        'hp_regen_perlevel': 'hp_regen_perlevel',
        'mana_regen_perlevel': 'mana_regen_perlevel'
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

// Verif equippement
function toggleSelection(slot, itemId) {
    if (slot.classList.contains('occupied')) {
        equippedItems = equippedItems.filter(item => item.id !== itemId);
        slot.innerHTML = '';
        slot.classList.remove('occupied');
        slot.removeAttribute('data-item-id');
        updateTotalStats();
    } else {
        getItemStats(itemId).then(itemStats => {
            if (itemStats) {
                const placedSlot = placeInFirstAvailableSlot(itemStats, '.item-slot');
                if (placedSlot) {
                    updateTotalStats();
                }
            }
        });
    }
}

// Update verso carte (substats)
function updateSubStats(championStats) {
    const subStats = {
        'hp_perlevel': championStats.hp_perlevel,
        'mana_perlevel': championStats.mana_perlevel,
        'attack_damage_perlevel': championStats.attack_damage_perlevel,
        'attack_speed_perlevel': championStats.attack_speed_perlevel,
        'armor_perlevel': championStats.armor_perlevel,
        'magic_resist_perlevel': championStats.magic_resist_perlevel,
        'hp_regen_perlevel': championStats.hp_regen_perlevel,
        'mana_regen_perlevel': championStats.mana_regen_perlevel
    };

    Object.entries(subStats).forEach(([stat, value]) => {
        const element = document.getElementById(stat);
        if (element) {
            element.textContent = value;
        }
    });
}

//Update champion selectionné
function equipChampion(championId, level) {
    return fetch(`http://localhost:5000/champions/${championId}`)
        .then(response => response.json())
        .then(championStats => {
            if (!equippedChampion || equippedChampion.id !== championId) {
                equippedChampion = championStats;
                updateTotalStats(level);
                updateSubStats(championStats);
            }
        })
        .catch(error => {
            console.error('Error equipping champion:', error);
        });
}

// Placement et MAJ du champ équippé
function placeChampionInSlot(champion, slotSelector) {
    const slots = document.querySelectorAll(slotSelector);
    for (const slot of slots) {
        if (slot.classList.contains('occupied')) {
            slot.innerHTML = '';
            slot.classList.remove('occupied');
            slot.removeAttribute('data-champion-id');
            equippedChampion = null;
            updateTotalStats(); 
        }
        const imageUrl = champion.icon ? champion.icon : champion.image;
        slot.innerHTML = `<img src="${imageUrl}" alt="${champion.name}" onerror="this.src='default_image.png'">`;
        slot.classList.add('occupied');
        slot.setAttribute('data-champion-id', champion.id);
        equipChampion(champion.id); 
        return slot;
    }
    return null;
}

// Mise en place du champion
document.querySelectorAll('.champion-slot').forEach(slot => {
    slot.addEventListener('click', (event) => {
        const championId = slot.getAttribute('data-champion-id');
        if (championId && slot.classList.contains('occupied')) {
            slot.innerHTML = '';
            slot.classList.remove('occupied');
            slot.removeAttribute('data-champion-id');
            equippedChampion = null;
            updateTotalStats(); 
        } else {
            equipChampion(championId);
        }
    });
});

//Mise en place item
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

// Mise en place slot champs
function initializeChampionSlots() {
    document.querySelectorAll('.champion-slot').forEach(slot => {
        slot.addEventListener('click', (event) => {
            if (slot.classList.contains('occupied')) {
                slot.innerHTML = '';
                slot.classList.remove('occupied');
                slot.removeAttribute('data-champion-id');
                equippedChampion = null;
                updateTotalStats(); 
            } else {
                const championId = slot.getAttribute('data-champion-id');
                if (championId) {
                    equipChampion(championId);
                }
            }
        });
    });

}

//Build sv
document.getElementById('save-build').addEventListener('click', () => {
    const buildName = prompt('Enter build name:');
    if (buildName) {
        const build = {
            name: buildName,
            items: equippedItems.map(item => item.id),
            runes: equippedRunes.map(rune => rune.id),
            champion_image: equippedChampion ? equippedChampion.image : null
        };

        const token = localStorage.getItem('token');

        fetch('http://localhost:5000/builds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token // Ensure the token is correctly set
            },
            body: JSON.stringify(build)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Build saved successfully') {
                alert('Build saved successfully');
            } else {
                console.error('Error saving build:', data);
            }
        })
        .catch(error => console.error('Error:', error));
    }
});

document.addEventListener('DOMContentLoaded', function() {
    fetchBuilds();

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
                    <div>Items: ${build.items.map(item => `<img src="${item.image}" alt="${item.name}" title="${item.name}">`).join('')}</div>
                    <div>Runes: ${build.runes.map(rune => `<img src="${rune.icon}" alt="${rune.name}" title="${rune.name}">`).join('')}</div>
                    <div>Champion: ${build.champion ? `<img src="${build.champion.image}" alt="${build.champion.name}" title="${build.champion.name}">` : 'None'}</div>
                    <div>Created At: ${new Date(build.created_at).toLocaleString()}</div>
                `;

                buildsContainer
            });
        })
        .catch(error => {
            console.error('Error fetching builds:', error);
        });
    }
});

//Mettre en place dans le slot disponible
    function placeInFirstAvailableSlot(item, slotSelector) {
        const slots = document.querySelectorAll(slotSelector);
        for (const slot of slots) {
            if (!slot.classList.contains('occupied')) {
                const imageUrl = item.icon ? item.icon : item.image;
                slot.innerHTML = `<img src="${imageUrl}" alt="${item.name}" onerror="this.src='default_image.png'">`;
                slot.classList.add('occupied');
                slot.setAttribute('data-item-id', item.id);
                equippedItems.push({ id: item.id, stats: item });
                return slot;
            }
        }
        return null;
    }

    function placeRuneInFirstAvailableSlot(rune, slotSelector) {
        const slots = document.querySelectorAll(slotSelector);
        for (const slot of slots) {
            if (!slot.classList.contains('occupied')) {
                const imageUrl = rune.icon ? rune.icon : rune.image;
                slot.innerHTML = `<img src="${imageUrl}" alt="${rune.name}" onerror="this.src='default_image.png'">`;
                slot.classList.add('occupied');
                slot.setAttribute('data-rune-id', rune.id);
                equippedRunes.push({ id: rune.id, stats: rune });
                return slot;
            }
        }
        return null;
    }
    

//Api /champions
    fetch('http://localhost:5000/champions')
        .then(response => response.json())
        .then(data => {
            const championsDiv = document.getElementById('champions');
            data.forEach(champion => {
                const championDiv = document.createElement('div');
                championDiv.classList.add('champion');
                championDiv.setAttribute('data-champion-id', champion.id);
                championDiv.innerHTML = `<img src="${champion.image}" alt="${champion.name}" title="${champion.name}" onerror="this.src='default_image.png'">`;

                championDiv.addEventListener('click', () => {
                    placeChampionInSlot(champion, '.champion-slot');
                });

                championsDiv.appendChild(championDiv);
            });
            initializeChampionSlots();
        })
        .catch(error => {
            console.error('Error fetching champions:', error);
        });

//Api /runes
    fetch('http://localhost:5000/runes')
        .then(response => response.json())
        .then(data => {
            const runesDiv = document.getElementById('runes');
            data.forEach(rune => {
                const runeDiv = document.createElement('div');
                runeDiv.classList.add('rune');
                runeDiv.innerHTML = `<img src="${rune.icon}" alt="${rune.name}" title="${rune.name}" onerror="this.src='default_image.png'">`;

                runeDiv.addEventListener('click', () => {
                    placeRuneInFirstAvailableSlot(rune, '.rune-slot');
                });

                runesDiv.appendChild(runeDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching runes:', error);
        });

        //Api /items
    fetch('http://localhost:5000/items')
        .then(response => response.json())
        .then(data => {
            const itemsDiv = document.getElementById('items');
            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.innerHTML = `<img src="${item.image}" alt="${item.name}" title="${item.name}" onerror="this.src='default_image.png'">`;

                itemDiv.addEventListener('click', () => {
                    const placedSlot = placeInFirstAvailableSlot(item, '.item-slot');
                    if (placedSlot) {
                        updateTotalStats();
                    }
                });

                itemsDiv.appendChild(itemDiv);
            });
            initializeItemSlots();
        })
.catch(error => {
    console.error('Error fetching items:', error);
});

//simulation de l'attaque
function simulateAttack() {
    const selectedArmor = parseInt(document.getElementById('mannequin-armor').value);
    if (equippedChampion) {
        const attackDamage = parseFloat(document.getElementById('attack_damage').textContent) || 0;
        const critDamage = attackDamage * 2;

        let armorReductionFactor;
        if (selectedArmor === 100) {
            armorReductionFactor = 0.5; // 50% damage reduction
        } else if (selectedArmor === 200) {
            armorReductionFactor = 0.33; // 67% damage reduction
        } else if (selectedArmor === 300) {
            armorReductionFactor = 0.25; // 75% damage reduction
        } else {
            armorReductionFactor = 1 / (1 + selectedArmor / 100);
        }

        const damageAfterArmor = attackDamage * armorReductionFactor;
        const critDamageAfterArmor = critDamage * armorReductionFactor;

        document.getElementById('base-damage').innerText = attackDamage.toFixed(2);
        document.getElementById('crit-damage').innerText = critDamage.toFixed(2);
        document.getElementById('damage-after-armor').innerText = damageAfterArmor.toFixed(2);
        document.getElementById('crit-damage-after-armor').innerText = critDamageAfterArmor.toFixed(2);
    } else {
        alert('Please select a champion first!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    const logoutButton = document.getElementById('logout-button');

    if (token) {
        fetch('http://localhost:5000/user', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                loginLink.style.display = 'none';
                registerLink.style.display = 'none';
                userInfo.style.display = 'inline';
                usernameDisplay.textContent = data.username;
            }
        })
        .catch(error => console.error('Error fetching user info:', error));
    } else {
        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
        userInfo.style.display = 'none';
    }

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });

    document.getElementById('simulate-attack').addEventListener('click', simulateAttack);
});

        