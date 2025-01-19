//#region Module

/**
 * Lädt eine JSON-Datei und gibt die Daten zurück als Promise.
 * @param {string} url - Der Pfad zur JSON-Datei.
 * @returns {Promise<Object>} - Ein Promise, das die JSON-Daten enthält.
 */
async function loadJson (url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.error('Fehler beim Laden der JSON:', err)
    throw err
  }
}

/**
 * Rekursives Zusammenführen von zwei JSON-Objekten.
 * @param {Object} target - Das Zielobjekt, das aktualisiert werden soll.
 * @param {Object} source - Das Quellobjekt, dessen Werte hinzugefügt/überschrieben werden sollen.
 * @returns {Object} - Das zusammengeführte Zielobjekt.
 */
function mergeJson (target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      // Wenn beide Werte Objekte sind, rekursiv zusammenführen
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {} // Initialisieren, falls nicht vorhanden
        }
        mergeJson(target[key], source[key]) // Rekursiver Aufruf
      }
      // Wenn beide Werte Arrays sind, rekursiv Arrays zusammenführen
      else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        target[key] = mergeArrays(target[key], source[key])
      }
      // Andernfalls den Wert direkt übernehmen
      else {
        target[key] = source[key]
      }
    }
  }
  return target
}

/**
 * Zusammenführen von zwei Arrays.
 * - Primitive Werte werden kombiniert und Duplikate entfernt.
 * - Objekte mit gleichen Schlüsseln werden rekursiv zusammengeführt.
 * @param {Array} targetArray - Das Zielarray, das aktualisiert werden soll.
 * @param {Array} sourceArray - Das Quellarray, dessen Werte hinzugefügt/überschrieben werden sollen.
 * @returns {Array} - Das zusammengeführte Array.
 */
function mergeArrays (targetArray, sourceArray) {
  const result = [...targetArray] // Zielarray kopieren

  for (const sourceItem of sourceArray) {
    if (typeof sourceItem === 'object' && sourceItem !== null) {
      // Prüfen, ob ein entsprechendes Objekt im Zielarray existiert
      const matchingItem = result.find(
        targetItem =>
          typeof targetItem === 'object' &&
          targetItem !== null &&
          getObjectKey(targetItem) === getObjectKey(sourceItem)
      )

      if (matchingItem) {
        // Rekursiv zusammenführen, wenn ein passendes Objekt existiert
        mergeJson(matchingItem, sourceItem)
      } else {
        // Neues Objekt hinzufügen, falls es kein Match gibt
        result.push(sourceItem)
      }
    } else {
      // Primitive Werte hinzufügen, falls sie noch nicht existieren
      if (!result.includes(sourceItem)) {
        result.push(sourceItem)
      }
    }
  }

  return result
}

/**
 * Hilfsfunktion zum Abrufen eines eindeutigen Schlüssels eines Objekts.
 * - Angenommen, jedes Objekt hat einen eindeutigen Schlüssel, z. B. einen Namen oder eine ID.
 * @param {Object} obj - Das Objekt, aus dem der Schlüssel extrahiert werden soll.
 * @returns {string|undefined} - Der Schlüssel des Objekts oder `undefined`, wenn kein Schlüssel gefunden wird.
 */
function getObjectKey (obj) {
  // Beispiel: Verwenden Sie hier "name" oder "id" als eindeutigen Schlüssel
  return obj.name || obj.id
}

/**
 * Befüllt die Charakterliste im Dropdown.
 * @param {Object} data - Die geladenen JSON-Daten.
 */
function fillCharacterList (data) {
  const spielercharaktere = data.Charaktäre.Spielercharaktere
  const charListEl = document.getElementById('charList')
  const dropdownEl = document.getElementById('charDropdown') // Passen Sie die ID an

  // Debugging: Überprüfen der Elemente
  console.log('spielercharaktere:', spielercharaktere)
  console.log('charListEl:', charListEl)
  console.log('dropdownEl:', dropdownEl)

  // Überprüfen, ob die Elemente vorhanden sind
  if (!spielercharaktere || !charListEl || !dropdownEl) {
    console.error(
      'Spielercharaktere, charList Element oder dropdown Element nicht gefunden.'
    )
    return
  }

  // **Leeren der bestehenden Liste**
  charListEl.innerHTML = ''

  // Charaktere zur Liste hinzufügen
  for (const charName in spielercharaktere) {
    if (spielercharaktere.hasOwnProperty(charName)) {
      const li = document.createElement('li')
      li.textContent = charName
      li.style.cursor = 'pointer' // Hinzufügen eines Cursors für bessere UX
      li.addEventListener('click', () => {
        dropdownEl.classList.toggle('hidden') // Dropdown schließen
        loadCharacter(allDataGlobal, charName) // Charakter laden
      })
      charListEl.appendChild(li)
    }
  }

  // Optional: Standard-Charakter laden, falls vorhanden
  if (spielercharaktere.hasOwnProperty('Diundriel')) {
    loadCharacter(allDataGlobal, 'Diundriel')
  } else {
    console.warn('Standard-Charakter "Diundriel" nicht gefunden.')
  }
}

//#endregion

//#region JSON-Laden und Initialisierung

let allDataGlobal = null // Globale Variable für alle Daten
let isInitialized = false // Flag zur Vermeidung mehrfacher Initialisierung

/**
 * Zeigt eine Fehlermeldung im UI an.
 * @param {string} message - Die Fehlermeldung.
 */
function showError (message) {
  // Entfernt vorhandene Fehlermeldungen
  const existingError = document.querySelector('.error-message')
  if (existingError) {
    existingError.remove()
  }

  const errorEl = document.createElement('div')
  errorEl.textContent = message
  errorEl.classList.add('error-message')
  document.body.appendChild(errorEl)
}

/**
 * Initialisiert die Anwendung, lädt JSON-Daten und befüllt die Charakterliste.
 */
async function initialize () {
  if (isInitialized) {
    console.log('Initialisierung bereits abgeschlossen.')
    return
  }

  try {
    // **Erstes JSON laden**
    const jsonData = await loadJson('data/DnDKalender.JSON')
    allDataGlobal = jsonData

    // **Zweites JSON laden und zusammenführen**
    const newJsonData = await loadJson('data/Charaktäre/Spieler/test.JSON')
    mergeJson(allDataGlobal, newJsonData)

    // **Charakterliste befüllen**
    fillCharacterList(allDataGlobal)

    isInitialized = true // Markiert die Initialisierung als abgeschlossen
  } catch (err) {
    console.error('Initialisierungsfehler:', err)
    showError(
      'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.'
    )
  }
}

// **Initialisierung beim Laden des DOM**
document.addEventListener('DOMContentLoaded', initialize)

//#endregion

/**
 * Mock loadCharacter-Funktion (setzen Sie Ihre eigene Implementierung ein)
 * @param {Object} data - Die globalen Daten.
 * @param {string} charName - Der Name des Charakters.
 */
function loadCharacter (data, charName) {
  const char = data.Charaktäre.Spielercharaktere[charName]
  if (char) {
    document.getElementById('charName').textContent = charName
    document.getElementById('charClass').textContent =
      char.Klasse || 'Klasse nicht definiert'
    console.log(`Charakter "${charName}" geladen.`)
  } else {
    console.warn(`Charakter "${charName}" nicht gefunden.`)
  }
}
// #region Leben
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
// #region Öffnen und Schließen des HP-Management-Modals
function openHpManagement () {
  const hpManagementModal = document.getElementById('hpManagementModal')
  hpManagementModal.classList.remove('hidden')
}

function closeHpManagement () {
  const hpManagementModal = document.getElementById('hpManagementModal')
  hpManagementModal.classList.add('hidden')
}
document.getElementById('currentHp').addEventListener('click', openHpManagement)
//#endregion

// #region HP-Änderungen
/** Funktion zum Anwenden von HP-Änderungen
 * @param {number} change: Änderung der HP
 */
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
    //Verhindere negative oder ungültige Eingaben
    e.target.value = ''
  }
})

// Event Listener für die Buttons im HP-Management-Modal
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

//#endregion

//#endregion
//#endregion
// #region Zustände

// #endregion
// #region Attribute
// #region Hilfsarray: Zuordnung Attributsname -> Kürzel (für ID) zum Update der Attribute
const attributeMapping = [
  { name: 'Stärke', idPrefix: 'ST' },
  { name: 'Geschicklichkeit', idPrefix: 'GE' },
  { name: 'Konstitution', idPrefix: 'KO' },
  { name: 'Intelligenz', idPrefix: 'IN' },
  { name: 'Weisheit', idPrefix: 'WE' },
  { name: 'Charisma', idPrefix: 'CH' }
]
// #endregion

/** updateAttributes =>  Aktualisiert die Attributwerte und -boni im UI mit getEquipmentAttributeBonuses
 * @param {*} charData Die Charakterdaten die durch die Funktion loadCharacter aus dem Json geladen werden */
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

// #endregion
// #region Stattistic
// #endregion
// #region Skills
// #endregion

/* getEquipmentAttributeBonuses  => Sammelt alle Ausrüstungs-Boni*/
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
  const hpData = charData['Leben und HD'].Leben
  const hpCurrent = hpData.Wert
  const hpMax = hpData.Max + (hpData['Temp Bonus'] || 0)
  updateHealthBar(hpCurrent, hpMax)

  // Hit Dice
  const hdData = charData['Leben und HD'].HD
  updateHitDice(hdData.Wert, hdData.Maximal, hdData.Art)

  // Attribute (inkl. Gegenstands-Boni)
  updateAttributes(charData)
  // **Initialisiere die Zustände basierend auf charData.Zustände**

  initializeConditions(charData.Zustände)
}
// #region Tab-Logik, Modals, Char-Auswahl  */
/*Tab-Logik für die Charakterübersicht.
 wartet auf das Laden des DOM.
 Öffnet die erste Section und setzt den ersten Button auf aktiv .
 Fügt Event-Listener zu allen Buttons hinzu.
*/
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

// #endregion

/**
 * Funktion zum Initialisieren der Zustände basierend auf charData.Zustände
 * @param {Object} zustände - Objekt mit Zustandseigenschaften und ihrem Status
 */
function initializeConditions (zustände) {
  const activeContainer = document.getElementById('active-conditions')
  const inactiveContainer = document.getElementById('inactive-conditions')
  const conditionTemplate =
    document.getElementById('condition-template').content

  // Leere die aktuellen Container
  activeContainer.innerHTML = ''
  inactiveContainer.innerHTML = ''

  // Funktion zum Erstellen einer Bedingung
  function createCondition (id, label, active) {
    const conditionFragment = document.importNode(conditionTemplate, true)
    const conditionElement = conditionFragment.querySelector('.condition-box')
    const checkbox = conditionElement.querySelector('input')
    const labelEl = conditionElement.querySelector('label')

    checkbox.id = id
    checkbox.checked = active
    labelEl.htmlFor = id
    labelEl.textContent = label

    // Event Listener für das Umschalten
    checkbox.addEventListener('change', () => {
      const isActive = checkbox.checked
      if (isActive) {
        activeContainer.appendChild(conditionElement)
      } else {
        inactiveContainer.appendChild(conditionElement)
      }
      toggleInactiveDetails()
    })

    return conditionElement
  }

  // Iteriere über die Zustände und erstelle die entsprechenden Elemente
  for (const [key, value] of Object.entries(zustände)) {
    // Erzeuge eine ID basierend auf dem Zustand
    const id = `condition${key}`
    // Optional: Du kannst die Labels anpassen, falls sie anders heißen sollen
    const label = key

    // Erstelle das Zustandselement
    const conditionElement = createCondition(id, label, value)

    // Füge es dem entsprechenden Container hinzu
    if (value) {
      activeContainer.appendChild(conditionElement)
    } else {
      inactiveContainer.appendChild(conditionElement)
    }
  }

  // Aktualisiere die Sichtbarkeit des Inaktiven-Bereichs
  toggleInactiveDetails()
}

/**
 * Funktion zum Anzeigen oder Verbergen des Inaktiven-Bereichs
 */
function toggleInactiveDetails () {
  const inactiveDetails = document.getElementById('inactive-details')
  const inactiveContainer = document.getElementById('inactive-conditions')
  const hasInactive = inactiveContainer.children.length > 0
  if (hasInactive) {
    inactiveDetails.classList.remove('hidden')
    inactiveDetails.open = true // Optional: automatisch öffnen, wenn inaktive Zustände vorhanden sind
  } else {
    inactiveDetails.classList.add('hidden')
  }
}
