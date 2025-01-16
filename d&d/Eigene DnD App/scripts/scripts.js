//#region HP und HD Funktionen
//#region HP und HD Balken
/** HP-Bar-Funktion (erstellt die HP-Leiste)
 *@param {number} current: aktuelle HP
 *@param {number} max: aktuelle maximale HP*/
function updateHealthBar (current, max) {
  const ratio = Math.max(0, Math.min(current / max, 1)) // ratio = Das verhältnis von current zu max also wie weit die HP-Leiste gefüllt ist
  const pct = Math.round(ratio * 100) + '%' // pct = Prozentwert von ratio
  const healthbarInner = document.getElementById('healthbarInner')
  const currentHpEl = document.getElementById('currentHp')
  const maxHpEl = document.getElementById('maxHp')
  healthbarInner.style.width = pct // Die Breite der HP-Leiste wird auf den Prozentwert gesetzt
  currentHpEl.textContent = current // Der aktuelle HP-Wert wird in das Element mit der ID "currentHp" geschrieben
  maxHpEl.textContent = max // Der maximale HP-Wert wird in das Element mit der ID "maxHp" geschrieben
}
/**  Hit-Dice-Funktion (erstellt die Hit-Dice-Leiste)
 * @param {number} current: aktuelle Hit-Dice
 * @param {number} max: maximale Hit-Dice
 * @param {string} diceArt: Art der Hit-Dice (z.B. "1d8")
 */
function updateHitDice (current, max, diceArt) {
  const ratio = Math.max(0, Math.min(current / max, 1))
  const pct = Math.round(ratio * 100) + '%'
  const hitDiceInner = document.getElementById('hitDiceInner')
  const hitDiceCurrent = document.getElementById('hitDiceCurrent')
  const hitDiceMax = document.getElementById('hitDiceMax')
  const hitDiceArtEl = document.getElementById('hitDiceArt')
  hitDiceInner.style.width = pct
  hitDiceCurrent.textContent = current
  hitDiceMax.textContent = max
  hitDiceArtEl.textContent = diceArt
}
//#endregion
//#region HP-Management
function openHpManagement () {
  const hpManagementModal = document.getElementById('hpManagementModal')
  hpManagementModal.classList.remove('hidden')
}

function closeHpManagement () {
  const hpManagementModal = document.getElementById('hpManagementModal')
  hpManagementModal.classList.add('hidden')
}

function applyHpChange (change) {
  const currentHpEl = document.getElementById('currentHp')
  let currentHp = parseInt(currentHpEl.textContent, 10)
  currentHp += change
  const maxHp = parseInt(document.getElementById('maxHp').textContent, 10)
  currentHp = Math.max(0, Math.min(currentHp, maxHp))
  currentHpEl.textContent = currentHp

  // Aktualisiere das hpInput-Feld nach Änderung
  document.getElementById('hpInput').value = ''
}

// Verhindere negative Eingaben und passe das Scrollverhalten an
document.getElementById('hpInput').addEventListener('input', e => {
  const value = parseInt(e.target.value, 10)
  if (isNaN(value) || value < 0) {
    e.target.value = ''
  }
})

document.getElementById('healingBtn').addEventListener('click', () => {
  const hpInput = document.getElementById('hpInput').value
  const healAmount = parseInt(hpInput, 10) || 0
  applyHpChange(healAmount)
  closeHpManagement()
})

document.getElementById('damageBtn').addEventListener('click', () => {
  const hpInput = document.getElementById('hpInput').value
  const damageAmount = parseInt(hpInput, 10) || 0
  applyHpChange(-damageAmount)
  closeHpManagement()
})

// Ändere den Event Listener für 'currentHp' Klick
document.getElementById('currentHp').removeEventListener('click', () => {
  damageModal.classList.remove('hidden')
})
document.getElementById('currentHp').addEventListener('click', openHpManagement)
//#endregion
//#endregion

/*  3) Hilfsarray: Zuordnung Attributsname -> Kürzel (für ID) zum Update der Attribute
 */
const attributeMapping = [
  { name: 'Stärke', idPrefix: 'ST' },
  { name: 'Geschicklichkeit', idPrefix: 'GE' },
  { name: 'Konstitution', idPrefix: 'KO' },
  { name: 'Intelligenz', idPrefix: 'IN' },
  { name: 'Weisheit', idPrefix: 'WE' },
  { name: 'Charisma', idPrefix: 'CH' }
]

/*    4) getEquipmentAttributeBonuses  => Sammelt alle Ausrüstungs-Boni*/
function getEquipmentAttributeBonuses (charData) {
  // Summenobjekt
  const bonusSum = {
    Stärke: 0,
    Geschicklichkeit: 0,
    Konstitution: 0,
    Intelligenz: 0,
    Weisheit: 0,
    Charisma: 0
  }

  const items = charData.Gegenstände || []
  items.forEach(item => {
    // Nur wenn ausgerüstet
    if (item.equipped) {
      const magisch = item.gegenstandsTyp?.Magisch
      if (magisch) {
        const requiresAttune = magisch.erfordertEinstimmung || false
        const isAttuned = magisch.eingestimmt || false

        // Bedingung: Keine Einstimmung ODER (Einstimmung & eingestimmt)
        if (!requiresAttune || isAttuned) {
          // modifikatoren (Array) => z. B. [ {"Stärke":"+2"} ]
          if (Array.isArray(magisch.modifikatoren)) {
            magisch.modifikatoren.forEach(mod => {
              for (let attrName in mod) {
                const val = parseInt(mod[attrName], 10) || 0
                if (bonusSum[attrName] !== undefined) {
                  bonusSum[attrName] += val
                }
              }
            })
          }
          // Falls es auch "passive modifikatoren" oder Ähnliches gibt ...
          if (Array.isArray(magisch['passive modifikatoren'])) {
            magisch['passive modifikatoren'].forEach(mod => {
              for (let attrName in mod) {
                const val = parseInt(mod[attrName], 10) || 0
                if (bonusSum[attrName] !== undefined) {
                  bonusSum[attrName] += val
                }
              }
            })
          }
        }
      }
    }
  })

  return bonusSum
}

/* 5) updateAttributes =>  nutzt getEquipmentAttributeBonuses
  ------------------------------------------- */
function updateAttributes (charData) {
  const attrData = charData.Attribute // Attributdaten aus den Charakterdaten (JSON)
  const itemBonuses = getEquipmentAttributeBonuses(charData) // Ausrüstungsboni aus den item-Daten (JSON)

  // Für Stärke, Geschick usw.
  attributeMapping.forEach(map => {
    // map = { name: "Stärke", idPrefix: "ST" },{ name: "Geschicklichkeit", idPrefix: "GE" }, ...
    const base = attrData[map.name].Wert // Basis Wert Bsp: 12 aus JSON
    const temp = attrData[map.name]['Temp Mod'] || 0 // Bsp: +2 durch Zauber aus JSON (Temp Mod)
    const equipBonus = itemBonuses[map.name] || 0 // Bsp: +1 durch Item aus JSON (Item-Bonus) durch getEquipmentAttributeBonuses
    const finalVal = base + temp + equipBonus // finalVal Berechnet den Finalen Attributwert
    const bonus = Math.floor((finalVal - 10) / 2) // Dein "calcBonus" => rechnet (finalVal - 10)/2?

    // UI-Update
    document.getElementById(`${map.idPrefix}-wert`).textContent = finalVal
    document.getElementById(`${map.idPrefix}-bonus`).textContent =
      (bonus >= 0 ? '+' : '') + bonus
  })
}

/* -------------------------------------------
    6) loadCharacter =>  liest HP/HD und ruft updateAttributes auf
  ------------------------------------------- */
function loadCharacter (allData, characterName) {
  const sc = allData.Charaktäre.Spielercharaktere
  if (!sc) {
    console.error('Keine Spielercharaktere in JSON gefunden!')
    return
  }
  const charData = sc[characterName]
  if (!charData) {
    console.error("Charakter '" + characterName + "' nicht gefunden!")
    return
  }

  // Name
  document.getElementById('charName').textContent = characterName

  // Klasse
  const klasseObj = charData.Klasse
  let klasseName = ''
  let klasseLevel = 0
  for (let k in klasseObj) {
    klasseName = k
    klasseLevel = klasseObj[k]
  }
  document.getElementById('charClass').textContent =
    klasseName + ' Lvl ' + klasseLevel

  // HP
  const hpData = charData.Attribute.Leben
  const hpCurrent = hpData.Wert
  const hpMax = hpData.Max + (hpData['Temp Bonus'] || 0)
  updateHealthBar(hpCurrent, hpMax)

  // Hit Dice
  const hdData = charData.Attribute.HD
  updateHitDice(hdData.Wert, hdData.Maximal, hdData.Art)

  // Attribute (inkl. Gegenstands-Boni)
  updateAttributes(charData)
}

/************************************************
 * Tab-Logik, Modals, Char-Auswahl (unverändert)
 ************************************************/
document.addEventListener('DOMContentLoaded', function () {
  const navButtons = document.querySelectorAll('.nav-btn')
  const sections = document.querySelectorAll('.page-section')

  // Funktion zum Deaktivieren aller Sections
  function hideAllSections () {
    sections.forEach(section => {
      section.classList.remove('active')
    })
    navButtons.forEach(button => {
      button.classList.remove('active')
    })
  }

  // Initial aktivieren der ersten Section
  if (sections.length > 0) {
    sections[0].classList.add('active')
    navButtons[0].classList.add('active')
  }

  navButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab')
      const targetSection = document.getElementById(targetTab)

      if (targetSection) {
        hideAllSections()
        targetSection.classList.add('active')
        this.classList.add('active')
      } else {
        console.warn(`Keine Section mit id="${targetTab}" gefunden.`)
      }
    })
  })
})

const maxHealthModal = document.getElementById('maxHealthModal')
const closeMaxHealthModal = document.getElementById('closeMaxHealthModal')
document.getElementById('currentHp').addEventListener('click', () => {
  damageModal.classList.remove('hidden')
})
document.getElementById('maxHp').addEventListener('click', () => {
  maxHealthModal.classList.remove('hidden')
})
closeMaxHealthModal.addEventListener('click', () => {
  maxHealthModal.classList.add('hidden')
})

let allDataGlobal = null

fetch('data/DnDKalender.JSON')
  .then(r => r.json())
  .then(jsonData => {
    allDataGlobal = jsonData

    // Charakterliste befüllen
    const sc = allDataGlobal.Charaktäre.Spielercharaktere
    const charListEl = document.getElementById('charList')
    for (const charName in sc) {
      const li = document.createElement('li')
      li.textContent = charName
      li.addEventListener('click', () => {
        loadCharacter(allDataGlobal, charName)
        dropdownEl.classList.add('hidden')
      })
      charListEl.appendChild(li)
    }

    // Standard-Char
    loadCharacter(allDataGlobal, 'Diundriel')
  })
  .catch(err => {
    console.error('Fehler beim Laden JSON:', err)
  })

// Klick auf den Char-Namen => Dropdown togglen
const charNameEl = document.getElementById('charName')
const dropdownEl = document.getElementById('charDropdown')
charNameEl.addEventListener('click', () => {
  dropdownEl.classList.toggle('hidden')
})
// Event Listener für Schließen des HP Management Modals
document
  .getElementById('closeHpManagementModal')
  .addEventListener('click', closeHpManagement)
