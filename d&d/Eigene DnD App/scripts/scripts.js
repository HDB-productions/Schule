//todo: die attributsmods müssen gesichert werden, wenn sie durch gegenstände verändert werden damit andere funktionen sie auslesen können (zb für den ac wert)

//#region JSON-Laden, mergen und in AllDataGlobal speichern
let allDataGlobal = null // Enthält alle geladenen JSON-Daten (globaler Zugriff)
let activeCharacter = null // Enthält den aktuell ausgewählten Charakter (globaler Zugriff)

const JSON_URLS = [
  // Liste der zu ladenden JSON-Dateien (Reihenfolge ist wichtig, untere überschreiben obere, wenn Schlüssel gleich)
  'data/DnDKalender.JSON',
  'data/Zustände/Zustände.JSON',
  'data/Charaktäre/Spieler/Diundriel.json',
  'data/Charaktäre/Spieler/test.json'
  // Weitere Dateien können hier hinzugefügt werden
]

async function loadJson (url) {
  // Lädt eine JSON-Datei und gibt das Ergebnis zurück
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP-Fehler! Status: ${response.status}`)
    return await response.json()
  } catch (err) {
    console.error('Fehler beim Laden der JSON (${url}):', err)
    throw err
  }
}

function mergeJson (target, source) {
  // Mergt zwei JSON-Objekte rekursiv
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {}
        mergeJson(target[key], source[key])
      } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
        target[key] = mergeArrays(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

function mergeArrays (targetArray, sourceArray) {
  // Mergt zwei Arrays, wobei Objekte mit gleichem Schlüssel gemerged werden
  const result = [...targetArray]
  for (const sourceItem of sourceArray) {
    if (typeof sourceItem === 'object' && sourceItem !== null) {
      const matchingItem = result.find(
        targetItem =>
          typeof targetItem === 'object' &&
          targetItem !== null &&
          getObjectKey(targetItem) === getObjectKey(sourceItem)
      )
      matchingItem
        ? mergeJson(matchingItem, sourceItem)
        : result.push(sourceItem)
    } else if (!result.includes(sourceItem)) {
      result.push(sourceItem)
    }
  }
  return result
}

function getObjectKey (obj) {
  // Gibt den Schlüssel eines Objekts zurück (Name oder ID)
  return obj.name || obj.id
}

async function initializeData () {
  // Initialisiert die Anwendung, lädt alle JSON-Dateien und setzt den aktiven defaultCharakter
  try {
    allDataGlobal = {}

    // Dateien sequenziell laden und mergen
    for (const url of JSON_URLS) {
      const newData = await loadJson(url)
      mergeJson(allDataGlobal, newData)
    }

    fillCharacterList()

    // Priorität für aktiven Charakter:
    // 1. Gespeicherter Charakter
    // 2. Diundriel (Fallback)
    // 3. Erster verfügbarer Charakter
    const storedChar = localStorage.getItem('activeCharacter')
    const characters = Object.keys(
      allDataGlobal?.Charaktäre?.Spielercharaktere || {}
    )

    if (storedChar && characters.includes(storedChar)) {
      setActiveCharacter(storedChar)
    } else if (characters.includes('Diundriel')) {
      setActiveCharacter('Diundriel')
    } else if (characters.length > 0) {
      setActiveCharacter(characters[0])
    }

    activateFirstTab()
  } catch (err) {
    console.error('Initialisierungsfehler:', err)
    showError(
      'Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.'
    )
  }
}

function activateFirstTab () {
  // Aktiviert den ersten Tab und die erste Sektion
  const navButtons = document.querySelectorAll('.nav-btn')
  const sections = document.querySelectorAll('.page-section')
  if (sections.length > 0) {
    sections[0].classList.add('active')
    navButtons[0].classList.add('active')
  }
}
//#endregion
//#region Charakterauswahl
function setActiveCharacter (characterName) {
  activeCharacter = characterName
  localStorage.setItem('activeCharacter', characterName)
  loadCharacterData()
}

function fillCharacterList () {
  const charListEl = document.getElementById('charList')
  const dropdownEl = document.getElementById('charDropdown')
  const characters = allDataGlobal?.Charaktäre?.Spielercharaktere || {}

  charListEl.innerHTML = ''
  Object.keys(characters).forEach(charName => {
    const li = document.createElement('li')
    li.textContent = charName
    li.style.cursor = 'pointer'
    li.addEventListener('click', () => {
      dropdownEl.classList.add('hidden')
      setActiveCharacter(charName)
    })
    charListEl.appendChild(li)
  })
}
//#endregion

//#region Daten Laden
const attributeMapping = [
  { name: 'Stärke', idPrefix: 'ST' },
  { name: 'Geschicklichkeit', idPrefix: 'GE' },
  { name: 'Konstitution', idPrefix: 'KO' },
  { name: 'Intelligenz', idPrefix: 'IN' },
  { name: 'Weisheit', idPrefix: 'WE' },
  { name: 'Charisma', idPrefix: 'CH' }
]

function loadCharacterData () {
  const charData = getCurrentCharacterData()
  if (!charData) return

  loadKlasse(charData)
  loadHealthData(charData)
  loadAttributes(charData)
  initializeConditions(charData.Zustände)
  loadPortrait()
}
function loadPortrait () {
  const portraitImg = document.querySelector('.portrait-img')
  if (!portraitImg || !activeCharacter) return

  // Cache-Busting und Pfadkorrektur
  const timestamp = new Date().getTime()
  const imagePath = `data/Charaktäre/Spieler/${activeCharacter}.jpg?t=${timestamp}`
  const fallbackPath = 'data/Charaktäre/Spieler/NoIMG.png'

  // Sofortiges Zurücksetzen mit Loading-State
  portraitImg.classList.add('portrait-loading')
  portraitImg.src =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  // Abbrechen laufender Requests
  if (portraitImg._lastImageRequest) {
    portraitImg._lastImageRequest.onload = null
    portraitImg._lastImageRequest.onerror = null
  }

  const testImage = new Image()
  portraitImg._lastImageRequest = testImage

  testImage.onload = () => {
    // Nur aktualisieren wenn noch relevant
    if (activeCharacter === portraitImg.dataset.currentChar) {
      portraitImg.src = imagePath
      portraitImg.classList.remove('portrait-loading', 'portrait-error')
    }
  }

  testImage.onerror = () => {
    if (activeCharacter === portraitImg.dataset.currentChar) {
      const fallbackTest = new Image()
      fallbackTest.onload = () => {
        portraitImg.src = fallbackPath
        portraitImg.classList.remove('portrait-loading')
      }
      fallbackTest.onerror = () => {
        portraitImg.src =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        portraitImg.classList.add('portrait-error')
      }
      fallbackTest.src = fallbackPath
    }
  }

  // Aktuellen Charakter speichern
  portraitImg.dataset.currentChar = activeCharacter
  testImage.src = imagePath
}

function getCurrentCharacterData () {
  return allDataGlobal?.Charaktäre?.Spielercharaktere?.[activeCharacter]
}

function loadKlasse (charData) {
  document.getElementById('charName').textContent = activeCharacter
  const klasse = Object.entries(charData.Klasse)[0]
  document.getElementById(
    'charClass'
  ).textContent = `${klasse[0]} Lvl ${klasse[1]}`
}

function loadHealthData (charData) {
  const hpData = charData['Leben und HD'].Leben
  const hdData = charData['Leben und HD'].HD

  loadHealthBar(hpData.Wert, hpData.Max + (hpData['Temp Bonus'] || 0))
  loadHitDice(hdData.Wert, hdData.Maximal, hdData.Art)
}

function loadHealthBar (current, max) {
  const ratio = Math.max(0, Math.min(current / max, 1))
  const healthbarInner = document.getElementById('healthbarInner')
  healthbarInner.style.width = `${ratio * 100}%`
  document.getElementById('currentHp').textContent = current
  document.getElementById('maxHp').textContent = max
}

function loadHitDice (current, max, diceArt) {
  const hitDiceInner = document.getElementById('hitDiceInner')
  hitDiceInner.style.width = `${(current / max) * 100}%`
  document.getElementById('hitDiceCurrent').textContent = current
  document.getElementById('hitDiceMax').textContent = max
  document.getElementById('hitDiceArt').textContent = diceArt
}

function loadAttributes (charData) {
  const attrData = charData.Attribute
  const itemBonuses = getEquipmentAttributeBonuses(charData)

  attributeMapping.forEach(map => {
    const base = attrData[map.name]?.Wert || 0
    const temp = attrData[map.name]?.['Temp Mod'] || 0
    const equipBonus = itemBonuses[map.name] || 0

    const finalVal = base + temp + equipBonus
    const bonus = Math.floor((finalVal - 10) / 2)

    document.getElementById(`${map.idPrefix}-wert`).textContent = finalVal
    document.getElementById(`${map.idPrefix}-bonus`).textContent =
      (bonus >= 0 ? '+' : '') + bonus
  })
  const acValue = calculateArmorClass(charData)
  document.getElementById('AC-value').textContent = acValue
}

function getEquipmentAttributeBonuses (charData) {
  const bonusSum = {
    Stärke: 0,
    Geschicklichkeit: 0,
    Konstitution: 0,
    Intelligenz: 0,
    Weisheit: 0,
    Charisma: 0
  }

  const processItem = item => {
    // Verarbeite den Gegenstand selbst
    if (item.equipped && item.gegenstandsTyp?.Magisch) {
      const magisch = item.gegenstandsTyp.Magisch
      const requiresAttune = magisch.erfordertEinstimmung || false
      const isAttuned = magisch.eingestimmt || false

      if (!requiresAttune || isAttuned) {
        const processMods = mods => {
          if (Array.isArray(mods)) {
            mods.forEach(mod => {
              Object.entries(mod).forEach(([attr, value]) => {
                const val = parseInt(value, 10) || 0
                if (bonusSum.hasOwnProperty(attr)) {
                  bonusSum[attr] += val
                }
              })
            })
          } else if (typeof mods === 'object') {
            Object.entries(mods).forEach(([attr, value]) => {
              const val = parseInt(value, 10) || 0
              if (bonusSum.hasOwnProperty(attr)) {
                bonusSum[attr] += val
              }
            })
          }
        }

        processMods(magisch.modifikatoren)
        processMods(magisch['passive modifikatoren'])
      }
    }

    // Rekursive Verarbeitung von Containern
    const processContainer = container => {
      if (Array.isArray(container)) {
        container.forEach(subItem => {
          // Prüfe ob Untergegenstand ausgerüstet ist
          if (subItem.equipped) {
            processItem(subItem)

            // Rekursion für verschachtelte Container
            if (subItem.gegenstandsTyp?.Behälter?.container) {
              processContainer(subItem.gegenstandsTyp.Behälter.container)
            }
          }
        })
      }
    }

    // Verarbeite alle Containertypen
    if (item.gegenstandsTyp?.Behälter?.container) {
      processContainer(item.gegenstandsTyp.Behälter.container)
    }
  }

  // Starte die Verarbeitung mit den Hauptgegenständen
  const items = charData.Gegenstände || []
  items.forEach(item => processItem(item))

  return bonusSum
}

//#region Rüstungsklasse Berechnung
function calculateArmorClass (charData) {
  const baseAC = 10
  let armorAC = 0
  let maxDexBonus = Infinity
  let hasArmor = false

  // Durchsuche alle Gegenstände nach Rüstungen
  const items = charData.Gegenstände || []
  items.forEach(item => {
    if (item.equipped && item.gegenstandsTyp?.Rüstung) {
      const rüstung = item.gegenstandsTyp.Rüstung

      // Extrahiere numerischen AC-Wert (z.B. "+8" → 8)
      armorAC += parseInt(rüstung.RC.replace(/[^0-9-]/g, ''), 10) || 0

      // Setze maximalen Dex-Bonus
      if (rüstung.maxDexBonus !== undefined) {
        maxDexBonus = Math.min(maxDexBonus, rüstung.maxDexBonus)
        hasArmor = true
      }
    }
  })

  // Berechne Geschicklichkeitsbonus
  const dexValue =
    charData.Attribute.Geschicklichkeit.Wert +
    (charData.Attribute.Geschicklichkeit['Temp Mod'] || 0)
  const dexBonus = Math.floor((dexValue - 10) / 2)

  // Begrenze Bonus bei Rüstung
  const finalDexBonus = hasArmor ? Math.min(dexBonus, maxDexBonus) : dexBonus

  // Gesamt-AC berechnen
  return baseAC + armorAC + finalDexBonus
}

//#endregion

function initializeConditions (charZuständeArray) {
  const activeContainer = document.getElementById('active-conditions')
  const inactiveContainer = document.getElementById('inactive-conditions')
  const conditionTemplate =
    document.getElementById('condition-template').content
  const globalZustände = allDataGlobal.Zustände || {}

  // Leere die Container
  activeContainer.innerHTML = ''
  inactiveContainer.innerHTML = ''

  // Erstelle für jeden möglichen Zustand ein Element
  Object.keys(globalZustände).forEach(conditionKey => {
    const isActive = charZuständeArray.includes(conditionKey)
    const conditionData = globalZustände[conditionKey]

    const conditionElement = document.importNode(conditionTemplate, true)
    const checkbox = conditionElement.querySelector('input')
    const label = conditionElement.querySelector('label')
    const details = conditionElement.querySelector('.condition-details')

    // Setze Werte
    checkbox.id = `condition-${conditionKey}`
    checkbox.checked = isActive
    label.textContent = conditionData.Name || conditionKey
    label.htmlFor = checkbox.id

    // Tooltip mit Beschreibung
    label.title = conditionData.Beschreibung || 'Keine Beschreibung verfügbar'

    // Event-Listener für Änderungen
    checkbox.addEventListener('change', () => {
      const index = charZuständeArray.indexOf(conditionKey)
      if (checkbox.checked && index === -1) {
        charZuständeArray.push(conditionKey)
      } else if (!checkbox.checked && index > -1) {
        charZuständeArray.splice(index, 1)
      }
      saveCharacterData()
    })

    // Füge in den richtigen Container ein
    if (isActive) {
      activeContainer.appendChild(conditionElement)
    } else {
      inactiveContainer.appendChild(conditionElement)
    }
  })
}
//#endregion

//#region Update
function saveCharacterData () {
  loadCharacterData()
}

function applyHpChange (change) {
  const charData = getCurrentCharacterData()
  if (!charData) return

  const hpData = charData['Leben und HD'].Leben
  hpData.Wert = Math.max(
    0,
    Math.min(hpData.Wert + change, hpData.Max + (hpData['Temp Bonus'] || 0))
  )
  saveCharacterData()
}

function updateMaxHealth (newMax) {
  const charData = getCurrentCharacterData()
  if (!charData) return

  charData['Leben und HD'].Leben.Max = newMax
  charData['Leben und HD'].Leben.Wert = Math.min(
    charData['Leben und HD'].Leben.Wert,
    newMax
  )
  saveCharacterData()
}
//#endregion

//#region Kontrolle

document.addEventListener('DOMContentLoaded', () => {
  // Warte bis die Seite geladen ist
  initializeData() // Initialisiere die Anwendung
  setupEventListeners() // Setze Event-Listener
})

function setupEventListeners () {
  // Tab-Navigation
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', function () {
      document
        .querySelectorAll('.nav-btn.active, .page-section.active')
        .forEach(el => {
          el.classList.remove('active')
        })
      this.classList.add('active')
      document.getElementById(this.dataset.tab).classList.add('active')
    })
  })

  // Charakterauswahl
  document.getElementById('charName').addEventListener('click', () => {
    document.getElementById('charDropdown').classList.toggle('hidden')
  })

  document.getElementById('Home').addEventListener('click', () => {
    document.getElementById('homeDropdown').classList.toggle('hidden')
  })

  // #region HP Management listeners
  document.getElementById('currentHp').addEventListener('click', () => {
    document.getElementById('hpManagementModal').classList.remove('hidden')
  })

  document
    .getElementById('closeHpManagementModal')
    .addEventListener('click', () => {
      document.getElementById('hpManagementModal').classList.add('hidden')
    })

  document.getElementById('healingBtn').addEventListener('click', () => {
    const input = parseInt(document.getElementById('hpInput').value, 10) || 0
    applyHpChange(input)
    document.getElementById('hpInput').value = ''
  })

  document.getElementById('damageBtn').addEventListener('click', () => {
    const input = parseInt(document.getElementById('hpInput').value, 10) || 0
    applyHpChange(-input)
    document.getElementById('hpInput').value = ''
  })

  // Max Health
  document.getElementById('maxHp').addEventListener('click', () => {
    document.getElementById('maxHealthModal').classList.remove('hidden')
  })

  document.getElementById('saveMaxHealth').addEventListener('click', () => {
    const newMax = parseInt(document.getElementById('maxHealthInput').value, 10)
    if (!isNaN(newMax)) {
      updateMaxHealth(newMax)
      document.getElementById('maxHealthInput').value = ''
    }
  })

  document
    .getElementById('closeMaxHealthModal')
    .addEventListener('click', () => {
      document.getElementById('maxHealthModal').classList.add('hidden')
    })

  // #endregion
}

function showError (message) {
  const errorEl = document.createElement('div')
  errorEl.textContent = message
  errorEl.classList.add('error-message')
  document.body.appendChild(errorEl)
}
//#endregion
