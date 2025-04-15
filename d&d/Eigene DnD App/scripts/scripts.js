//Die Funktion, die die Attributsboni durch Rüstung durchgeht funktioniert, die für Proficiency und Skills nicht scheinbar noch nicht. evtl eine daraus machen.)

//#region JSON-Laden, mergen und in AllDataGlobal speichern
let allDataGlobal = null // Enthält alle geladenen JSON-Daten (globaler Zugriff)
let activeCharacter = null // Enthält den aktuell ausgewählten Charakter (globaler Zugriff)

const JSON_URLS = [
  // Liste der zu ladenden JSON-Dateien (Reihenfolge ist wichtig, untere überschreiben obere, wenn Schlüssel gleich)
  'data/DnDKalender.json',
  'data/Zustaende/Zustaende.json',
  'data/Charaktaere/Spieler/Diundriel.json',
  'data/Charaktaere/Spieler/test.json',
  'data/Charaktaere/Spieler/Thoralf.json',
  'data/Skills/Skills.json'
]

// #region einzelne JSON-Laden
/** Lädt eine JSON-Datei und gibt das Ergebnis zurück
 * @param {string} url - Die URL der zu ladenden JSON-Datei
 * @returns {Promise<Object>} - Das geladene JSON-Objekt als Promise (oder ein Fehler, falls das Laden fehlschlägt)
 */
async function loadJson (url) {
  try {
    //Alles innerhalb von try { ... } wird ausgeführt, und falls ein Fehler auftritt, wird der Code in catch { ... } ausgeführt.
    // 1. Daten abrufen:
    // Fetch-API genutzt, um eine HTTP-Anfrage an die übergebene URL zu senden.
    // "await" sorgt dafür, dass der Code wartet, bis die Anfrage abgeschlossen ist.
    const response = await fetch(url)

    // 2. HTTP-Status prüfen:
    // Mit "response.ok" wird überprüft, ob der HTTP-Status im erfolgreichen Bereich (200–299) liegt.
    // Falls nicht, wird ein Fehler mit einer entsprechenden Fehlermeldung geworfen.
    if (!response.ok) {
      throw new Error(`HTTP-Fehler! Status: ${response.status}`)
    }

    // 3. JSON-Daten parsen:
    // Wenn die Antwort erfolgreich war, wird der Inhalt der Antwort als JSON interpretiert.
    // Auch hier wird "await" verwendet, da response.json() ein Promise zurückgibt.
    return await response.json()
  } catch (err) {
    // 4. Fehlerbehandlung:
    // Falls bei irgendeinem Schritt ein Fehler auftritt (z. B. Netzwerkfehler oder ungültiges JSON),
    // wird dieser Fehler hier abgefangen, in der Konsole protokolliert und anschließend erneut geworfen.
    console.error(`Fehler beim Laden der JSON (${url}):`, err)
    throw err
  }
}
//#endregion

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
//#region Charakterdaten Header und Metadaten Laden
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
  loadProficiency(charData)
  loadSkills()
  loadPortrait()
  loadInventory(charData) // NEU: Inventar laden
}

function loadPortrait () {
  const portraitImg = document.querySelector('.portrait-img')
  if (!portraitImg || !activeCharacter) return

  // Cache-Busting und Pfadkorrektur
  const timestamp = new Date().getTime()
  const imagePath = `data/Charaktaere/Spieler/${activeCharacter}.jpg?t=${timestamp}`
  const fallbackPath = 'data/Charaktaere/Spieler/NoIMG.png'

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
//#endregion
//#region Leben Laden
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
//#endregion
//#region Attribute Laden
function loadAttributes (charData) {
  const attrData = charData.Attribute
  const ausrüstungsBoni = loadEquipmentAttributeBonuses(charData)

  attributeMapping.forEach(map => {
    const attrName = map.name
    const attribut = (attrData[attrName] = attrData[attrName] || {})

    // Basiswerte
    const basisWert = attribut.Wert || 0
    const tempMod = attribut['Temp Mod'] || 0
    const ausrüstungMod = ausrüstungsBoni[attrName] || 0

    // Gesamtberechnung
    attribut.GesamtWert = basisWert + tempMod + ausrüstungMod
    attribut.GesamtMod = Math.floor((attribut.GesamtWert - 10) / 2)

    // UI Update
    document.getElementById(`${map.idPrefix}-wert`).textContent =
      attribut.GesamtWert
    document.getElementById(`${map.idPrefix}-bonus`).textContent =
      (attribut.GesamtMod >= 0 ? '+' : '') + attribut.GesamtMod
  })

  document.getElementById('AC-value').textContent =
    calculateArmorClass(charData)
}

function loadEquipmentAttributeBonuses (charData) {
  const bonusMap = {
    Stärke: 0,
    Geschicklichkeit: 0,
    Konstitution: 0,
    Intelligenz: 0,
    Weisheit: 0,
    Charisma: 0
  }

  const processItem = (item, parent = null) => {
    if (item.equipped && item.gegenstandsTyp?.Magisch) {
      const magisch = item.gegenstandsTyp.Magisch
      const istAktiv = !magisch.erfordertEinstimmung || magisch.eingestimmt

      if (istAktiv) {
        const addBonus = (mod, typ) => {
          Object.entries(mod).forEach(([attr, wert]) => {
            if (bonusMap[attr] !== undefined) {
              const numWert = parseInt(wert, 10) || 0
              bonusMap[attr] += numWert

              // Tracke Quelle
              charData.Attribute[attr] = charData.Attribute[attr] || {}
              charData.Attribute[attr].Ausruestungsboni = {
                total: bonusMap[attr],
                sources: [
                  ...(charData.Attribute[attr].Ausruestungsboni?.sources || []),
                  {
                    gegenstand: item.name,
                    wert: numWert,
                    typ,
                    container: parent?.name
                  }
                ]
              }
            }
          })
        }

        // Verarbeite beide Mod-Typen
        if (magisch.modifikatoren) {
          const mods = Array.isArray(magisch.modifikatoren)
            ? magisch.modifikatoren
            : [magisch.modifikatoren]
          mods.forEach(mod => addBonus(mod, 'aktiv'))
        }

        if (magisch['passive modifikatoren']) {
          const passivMods = Array.isArray(magisch['passive modifikatoren'])
            ? magisch['passive modifikatoren']
            : [magisch['passive modifikatoren']]
          passivMods.forEach(mod => addBonus(mod, 'passiv'))
        }
      }
    }

    // Rekursive Container-Verarbeitung
    const processContainer = (container, parentItem) => {
      container?.forEach(subItem => {
        if (subItem.equipped) {
          processItem(subItem, parentItem)
          if (subItem.gegenstandsTyp?.Behälter?.container) {
            processContainer(subItem.gegenstandsTyp.Behälter.container, subItem)
          }
        }
      })
    }

    processContainer(item.gegenstandsTyp?.Behälter?.container, item)
  }

  charData.Gegenstände?.forEach(processItem)
  return bonusMap
}
//#endregion
//#region Zustände Laden
function initializeConditions () {
  const charData = getCurrentCharacterData()
  // Stelle sicher, dass charData.Zustände existiert und ein Objekt ist.
  charData.Zustände = charData.Zustände || {}

  const activeContainer = document.getElementById('active-conditions')
  const inactiveContainer = document.getElementById('inactive-conditions')
  const conditionTemplate =
    document.getElementById('condition-template').content
  const globalZustände = allDataGlobal.Zustände || {}

  // Container leeren
  activeContainer.innerHTML = ''
  inactiveContainer.innerHTML = ''

  Object.keys(globalZustände).forEach(conditionKey => {
    // Prüfe, ob der Zustand aktuell aktiv ist – für "Erschöpft" anhand eines Eintrags in charData.Zustände,
    // für alle anderen z. B. als Boolean (true) gespeichert.
    const isActive = charData.Zustände.hasOwnProperty(conditionKey)
    const conditionData = globalZustände[conditionKey]

    const conditionElement = document.importNode(conditionTemplate, true)
    const checkbox = conditionElement.querySelector('input')
    const label = conditionElement.querySelector('label')

    // Setze Basiswerte
    checkbox.id = `condition-${conditionKey}`
    checkbox.checked = isActive
    label.textContent = conditionData.Name || conditionKey

    if (conditionKey === 'Erschöpft') {
      if (isActive) {
        // Wenn "Erschöpft" aktiv ist, erwarten wir ein Objekt mit einer Stufe.
        // Falls noch keine Stufe vorhanden ist, initialisieren wir mit Stufe 1.
        if (
          !charData.Zustände['Erschöpft'].Stufe ||
          charData.Zustände['Erschöpft'].Stufe < 1
        ) {
          charData.Zustände['Erschöpft'].Stufe = 1
        }

        // Erstelle einen Container für die vertikale Steuerung (Plus, Stufenanzeige, Minus)
        const stageControl = document.createElement('span')
        stageControl.className = 'exhaustion-stage-control'

        // Plus-Button (▲)
        const plusButton = document.createElement('button')
        plusButton.textContent = '▲'
        plusButton.addEventListener('click', e => {
          e.stopPropagation()
          if (charData.Zustände['Erschöpft'].Stufe < 6) {
            charData.Zustände['Erschöpft'].Stufe++
            updateStageDisplay()
            loadCharacterData()
          }
        })

        // Anzeige der aktuellen Stufe
        const stageDisplay = document.createElement('span')
        stageDisplay.className = 'exhaustion-stage-display'
        stageDisplay.textContent = charData.Zustände['Erschöpft'].Stufe

        // Minus-Button (▼)
        const minusButton = document.createElement('button')
        minusButton.textContent = '▼'
        minusButton.addEventListener('click', e => {
          e.stopPropagation()
          if (charData.Zustände['Erschöpft'].Stufe > 1) {
            charData.Zustände['Erschöpft'].Stufe--
            updateStageDisplay()
            loadCharacterData()
          } else {
            // Wäre die nächste Stufe 0, entfernen wir "Erschöpft" komplett.
            delete charData.Zustände['Erschöpft']
            loadCharacterData()
            checkbox.checked = false
            // Entferne auch die Regler aus dem UI.
            stageControl.remove()
          }
        })

        function updateStageDisplay () {
          stageDisplay.textContent = charData.Zustände['Erschöpft'].Stufe
        }

        // Füge die Buttons und die Anzeige vertikal zusammen.
        stageControl.appendChild(plusButton)
        stageControl.appendChild(stageDisplay)
        stageControl.appendChild(minusButton)
        // Positioniere die Steuerung rechts neben dem Label – idealerweise mit CSS (z. B. absolute Positionierung in .condition-box)
        label.parentElement.appendChild(stageControl)

        // Tooltip: Zeige allgemeine Beschreibung plus alle Effekte der Stufen 1 bis zur aktuellen Stufe.
        label.addEventListener('click', e => {
          e.stopPropagation()
          e.preventDefault()
          let tooltipText =
            conditionData.Beschreibung || 'Keine Beschreibung verfügbar'
          const stages = conditionData.Stufen
          let stageDetails = ''
          const currentStage = charData.Zustände['Erschöpft'].Stufe
          for (let i = 1; i <= currentStage; i++) {
            if (stages[i]) {
              stageDetails += `\nStufe ${i}: ${stages[i]}`
            }
          }
          tooltipText += stageDetails
          showTooltipAtElement(label, tooltipText)
        })
      } else {
        // Falls "Erschöpft" nicht aktiv ist, entfernen wir einen eventuell vorhandenen Eintrag.
        if (charData.Zustände['Erschöpft']) {
          delete charData.Zustände['Erschöpft']
        }
        label.addEventListener('click', e => {
          e.stopPropagation()
          e.preventDefault()
          showTooltipAtElement(
            label,
            conditionData.Beschreibung || 'Keine Beschreibung verfügbar'
          )
        })
      }

      // Checkbox-Event für "Erschöpft":
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          // Wird "Erschöpft" aktiviert, legen wir es mit Stufe 1 an (falls noch nicht vorhanden)
          if (!charData.Zustände['Erschöpft']) {
            charData.Zustände['Erschöpft'] = { Stufe: 1 }
          }
          loadCharacterData()
        } else {
          // Wird es deaktiviert, entfernen wir den Eintrag komplett
          if (charData.Zustände['Erschöpft']) {
            delete charData.Zustände['Erschöpft']
          }
          loadCharacterData()
        }
      })
    } else {
      // Standardverhalten für alle anderen Zustände:
      label.addEventListener('click', e => {
        e.stopPropagation()
        e.preventDefault()
        showTooltipAtElement(
          label,
          conditionData.Beschreibung || 'Keine Beschreibung verfügbar'
        )
      })
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          // Für normale Zustände speichern wir einfach true (oder einen anderen Wert)
          charData.Zustände[conditionKey] = true
        } else {
          delete charData.Zustände[conditionKey]
        }
        loadCharacterData()
      })
    }

    // Füge das Element in den entsprechenden Container ein.
    if (isActive) {
      activeContainer.appendChild(conditionElement)
    } else {
      inactiveContainer.appendChild(conditionElement)
    }
  })
}

function showTooltipAtElement (element, text) {
  // Falls bereits ein Tooltip existiert, entferne ihn und beende die Funktion.
  if (element._customTooltip) {
    element._customTooltip.remove()
    element._customTooltip = null
    return
  }

  // Erstelle den Tooltip
  const tooltip = document.createElement('div')
  tooltip.className = 'custom-tooltip'

  // Setze den übergebenen Text (mit \n als Zeilenumbruch) und aktiviere Zeilenumbruch-Handling
  tooltip.textContent = text
  tooltip.style.whiteSpace = 'pre-line' // So werden \n als Zeilenumbrüche interpretiert

  // Standard-Styling
  tooltip.style.position = 'absolute'
  tooltip.style.background = 'rgba(0, 0, 0, 0.75)'
  tooltip.style.color = '#fff'
  tooltip.style.padding = '5px 10px'
  tooltip.style.borderRadius = '4px'
  tooltip.style.fontSize = '14px'
  tooltip.style.zIndex = '1000'

  // Positioniere den Tooltip knapp unterhalb des Elements
  const rect = element.getBoundingClientRect()
  tooltip.style.top = rect.bottom + window.scrollY + 5 + 'px'
  tooltip.style.left = rect.left + window.scrollX + 'px'

  // Füge den Tooltip zum Body hinzu
  document.body.appendChild(tooltip)

  // Speichere eine Referenz am Element, um zu wissen, dass bereits ein Tooltip aktiv ist
  element._customTooltip = tooltip

  // Optional: Tooltip schließt sich auch, wenn man ihn direkt anklickt
  tooltip.addEventListener('click', function () {
    tooltip.remove()
    element._customTooltip = null
  })
}

//#endregion
//#region Statistics Laden
//#region Fähigkeiten (Proficiency)Laden
function calculateProficiency (level) {
  return Math.floor((level + 3) / 4) + 1
}
function loadProficiency (charData) {
  // Summiere alle Level aus den verschiedenen Klassen
  const totalLevel = Object.values(charData.Klasse).reduce(
    (sum, lvl) => sum + lvl,
    0
  )
  const base = calculateProficiency(totalLevel)

  charData.Proficiency = charData.Proficiency || {
    Basis: {
      Wert: base,
      Berechnung: `Level ${totalLevel} => Proficiency ${base}`
    },
    Ausrüstungsboni: { total: 0, sources: [] },
    Gesamt: base
  }

  // Equipment-Boni berechnen
  let equipmentBonus = 0
  charData.Gegenstände?.forEach(item => {
    if (
      item.equipped &&
      item.gegenstandsTyp?.Magisch?.modifikatoren?.Proficiency
    ) {
      const bonus = parseInt(
        item.gegenstandsTyp.Magisch.modifikatoren.Proficiency,
        10
      )
      equipmentBonus += bonus
      charData.Proficiency.Ausrüstungsboni.sources.push({
        gegenstand: item.name,
        wert: bonus,
        typ: item.gegenstandsTyp.Magisch.erfordertEinstimmung
          ? 'aktiv'
          : 'passiv'
      })
    }
  })

  charData.Proficiency.Ausrüstungsboni.total = equipmentBonus
  charData.Proficiency.Gesamt = base + equipmentBonus

  document.getElementById('proficiency-value').textContent =
    charData.Proficiency.Gesamt
}

//#endregion
//#region Rüstungsklasse Berechnung
function loadEquipmentArmorBonuses (charData) {
  // Initialisiere Rüstungsobjekt
  charData.Rüstung = charData.Rüstung || {
    Basis: 10,
    RC: 0,
    maxDexBonus: Infinity,
    Boni: {
      total: 0,
      sources: []
    }
  }

  // Reset-Werte
  charData.Rüstung.RC = 0
  charData.Rüstung.maxDexBonus = Infinity
  charData.Rüstung.Boni.total = 0
  charData.Rüstung.Boni.sources = []

  // Durchsuche Ausrüstung
  charData.Gegenstände?.forEach(item => {
    if (item.equipped) {
      // Rüstungswerte
      if (item.gegenstandsTyp?.Rüstung) {
        const rüstung = item.gegenstandsTyp.Rüstung

        // Basis RC
        const rcWert = parseInt(rüstung.RC.replace(/[^0-9-]/g, ''), 10) || 0
        charData.Rüstung.RC += rcWert

        // Max Dex
        if (rüstung.maxDexBonus !== undefined) {
          charData.Rüstung.maxDexBonus = Math.min(
            charData.Rüstung.maxDexBonus,
            rüstung.maxDexBonus
          )
        }
      }

      // Magische Boni
      if (item.gegenstandsTyp?.Magisch) {
        const magisch = item.gegenstandsTyp.Magisch
        const mods = magisch.modifikatoren || []

        mods.forEach(mod => {
          if (mod.Rüstung) {
            const bonus = parseInt(mod.Rüstung, 10) || 0
            charData.Rüstung.Boni.total += bonus
            charData.Rüstung.Boni.sources.push({
              gegenstand: item.name,
              wert: bonus,
              typ: 'magisch'
            })
          }
        })
      }
    }
  })
}

function calculateArmorClass (charData) {
  loadEquipmentArmorBonuses(charData)

  // Berechnungskomponenten
  const rüstung = charData.Rüstung
  const geschickMod = charData.Attribute.Geschicklichkeit.GesamtMod

  // Max Dex Bonus begrenzen
  const finalDexBonus =
    rüstung.maxDexBonus !== Infinity
      ? Math.min(geschickMod, rüstung.maxDexBonus)
      : geschickMod

  // Gesamt AC berechnen
  const gesamtAC =
    rüstung.Basis + rüstung.RC + rüstung.Boni.total + finalDexBonus

  // Speichere Wert für weitere Berechnungen
  charData.AC = gesamtAC

  // UI Update
  document.getElementById('AC-value').textContent = gesamtAC

  return gesamtAC
}

//#endregion

//#endregion
//#region Skills Laden
function loadSkills () {
  const skillsContainer = document.getElementById('skills')
  skillsContainer.innerHTML = ''

  const charData = getCurrentCharacterData()
  if (!charData) return

  const skillsData = allDataGlobal.Skills || {}
  Object.entries(skillsData).forEach(([skillName, skillInfo]) => {
    // Ermittle den Basis-Mod des zugehörigen Attributes:
    const mapping = attributeMapping.find(
      m => m.idPrefix === skillInfo.Attribut
    )
    const fullAttrName = mapping ? mapping.name : null
    const baseMod =
      fullAttrName && charData.Attribute[fullAttrName]
        ? charData.Attribute[fullAttrName].GesamtMod
        : 0

    // Zusätzliche Boni aus dem Charakter-Skill:
    let proficiencyBonus = 0
    let otherBonus = 0

    if (charData.Skills && charData.Skills[skillName]) {
      const customSkill = charData.Skills[skillName]

      // Berechne den Proficiency-Bonus
      if (customSkill.Prof !== undefined) {
        const factor = parseFloat(customSkill.Prof)
        const proficiencyValue = charData.Proficiency
          ? charData.Proficiency.Gesamt
          : 0
        proficiencyBonus = Math.floor(factor * proficiencyValue)
      }

      // Addiere weitere Bonuswerte
      if (customSkill.andere) {
        otherBonus = Object.values(customSkill.andere).reduce(
          (sum, val) => sum + (parseInt(val, 10) || 0),
          0
        )
      }
    }

    const totalSkillMod = baseMod + proficiencyBonus + otherBonus

    // Erstelle das Container-Element für den Skill:
    const skillEl = document.createElement('div')
    skillEl.className = 'skill'
    skillEl.style.cursor = 'pointer'

    // Span für den deutschen Namen
    const nameSpan = document.createElement('span')
    nameSpan.className = 'skill-name'
    nameSpan.textContent = skillName

    // Span für den englischen Namen
    const englishSpan = document.createElement('span')
    englishSpan.className = 'skill-english'
    englishSpan.textContent = ' ' + (skillInfo.Englisch || '')

    // Span für das Attribut
    const attributeSpan = document.createElement('span')
    attributeSpan.className = 'skill-attribute'
    attributeSpan.textContent = ' ' + skillInfo.Attribut

    // Span für den berechneten Wert
    const valueSpan = document.createElement('span')
    valueSpan.className = 'skill-value'
    valueSpan.textContent =
      ' (' + (totalSkillMod >= 0 ? '+' : '') + totalSkillMod + ')'

    // Füge alle Spans nacheinander in den Container ein
    skillEl.appendChild(nameSpan)
    skillEl.appendChild(englishSpan)
    skillEl.appendChild(attributeSpan)
    skillEl.appendChild(valueSpan)

    // Beim Klick wird der Tooltip mit der Beschreibung angezeigt:
    skillEl.addEventListener('click', e => {
      e.stopPropagation()
      e.preventDefault()
      showTooltipAtElement(
        skillEl,
        skillInfo.Beschreibung || 'Keine Beschreibung verfügbar'
      )
    })

    skillsContainer.appendChild(skillEl)
  })
}

// #endregion
//#endregion

//#region Update
function updateHP (change) {
  const charData = getCurrentCharacterData()
  if (!charData) return

  const hpData = charData['Leben und HD'].Leben
  hpData.Wert = Math.max(
    0,
    Math.min(hpData.Wert + change, hpData.Max + (hpData['Temp Bonus'] || 0))
  )
  loadCharacterData()
}
function updateMaxHealth (newMax) {
  const charData = getCurrentCharacterData()
  if (!charData) return
  charData['Leben und HD'].Leben.Max = newMax
  charData['Leben und HD'].Leben.Wert = Math.min(
    charData['Leben und HD'].Leben.Wert,
    newMax
  )
  loadCharacterData()
}
//#endregion

//#region Kontrolle
//#region Event-Listener und Seiteninizialisierung
document.addEventListener('DOMContentLoaded', () => {
  // Warte bis die Seite geladen ist
  initializeData() // Initialisiere die Anwendung
  setupEventListeners() // Setze Event-Listener
})

function setupEventListeners () {
  //#region Tab-Navigation footer
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
  //#endregion
  // #region Charakterauswahl
  document.getElementById('charName').addEventListener('click', () => {
    document.getElementById('charDropdown').classList.toggle('hidden')
  })
  //#endregion
  // #region header
  document.getElementById('Home').addEventListener('click', () => {
    document.getElementById('homeDropdown').classList.toggle('hidden')
  })
  //#endregion
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
    updateHP(input)
    document.getElementById('hpInput').value = ''
    document.getElementById('hpManagementModal').classList.add('hidden')
  })

  document.getElementById('damageBtn').addEventListener('click', () => {
    const input = parseInt(document.getElementById('hpInput').value, 10) || 0
    updateHP(-input)
    document.getElementById('hpInput').value = ''
    document.getElementById('hpManagementModal').classList.add('hidden')
  })

  // Max Health
  document.getElementById('maxHp').addEventListener('click', () => {
    document.getElementById('maxHealthModal').classList.remove('hidden')
  })

  document
    .getElementById('closeMaxHealthModal')
    .addEventListener('click', () => {
      document.getElementById('maxHealthModal').classList.add('hidden')
    })

  // #endregion
  // #region Menü-Dropdown und Speichern
  const menuBtn = document.getElementById('menuBtn')
  const menuDropdown = document.getElementById('menuDropdown')
  menuBtn.addEventListener('click', () => {
    menuDropdown.classList.toggle('hidden')
  })
  document.addEventListener('click', e => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.classList.add('hidden')
    }
  })
  document.getElementById('saveJsonBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(allDataGlobal, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'DnD_Charakterdaten.json'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 100)
    menuDropdown.classList.add('hidden')
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
//#region JSON-Ansicht Funktionen, die AlldataGlobal anzeigen wenn Home-> Rest gewählt wird

function showJsonView () {
  // Verstecke Hauptinhalt
  document.querySelector('main').classList.add('hidden')
  document.querySelector('.bottom-nav').classList.add('hidden')
  document.querySelector('.portrait-section').classList.add('hidden')
  document.getElementById('homeDropdown').classList.add('hidden')
  const jsonView = document.getElementById('jsonView')
  if (jsonView) jsonView.remove()
  // Erstelle Container
  const container = document.createElement('div')
  container.id = 'jsonView'
  container.className = 'json-view'
  document.body.appendChild(container)
  // JSON-Baum erstellen
  createUniversalJsonView(container, allDataGlobal)
}

function createUniversalJsonView (container, data, depth = 0) {
  const createCollapsible = (content, isCollapsible) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'json-item'
    wrapper.style.marginLeft = `${depth * 1}px`

    if (isCollapsible) {
      const header = document.createElement('div')
      header.className = 'json-header'
      header.innerHTML = '<span class="toggle">▶</span>'

      const contentWrapper = document.createElement('div')
      contentWrapper.className = 'json-content'
      contentWrapper.style.display = 'none'

      header.addEventListener('click', () => {
        const isHidden = contentWrapper.style.display === 'none'
        contentWrapper.style.display = isHidden ? 'block' : 'none'
        header.querySelector('.toggle').textContent = isHidden ? '▼' : '▶'
      })

      wrapper.appendChild(header)
      wrapper.appendChild(contentWrapper)
      header.appendChild(content)
      return { wrapper, content: contentWrapper }
    }

    wrapper.appendChild(content)
    return { wrapper, content: wrapper }
  }

  if (typeof data === 'object' && data !== null) {
    const isArray = Array.isArray(data)
    const typeIndicator = document.createTextNode(isArray ? '[ ' : '{ ')
    const typeEnd = document.createTextNode(isArray ? ' ]' : ' }')

    const { wrapper, content } = createCollapsible(typeIndicator, true)

    const entries = isArray ? data : Object.entries(data)

    entries.forEach((item, index) => {
      const key = isArray ? index : item[0]
      const value = isArray ? item : item[1]

      const entryDiv = document.createElement('div')
      entryDiv.className = 'json-entry'

      if (!isArray) {
        const keyElement = document.createElement('span')
        keyElement.className = 'json-key'
        keyElement.textContent = `"${key}": `
        entryDiv.appendChild(keyElement)
      }

      createUniversalJsonView(entryDiv, value, depth + 1)
      content.appendChild(entryDiv)
    })

    content.appendChild(typeEnd)
    container.appendChild(wrapper)
  } else {
    const valueElement = document.createElement('span')
    valueElement.className = 'json-value'
    valueElement.textContent = typeof data === 'string' ? `"${data}"` : data
    container.appendChild(valueElement)
  }
}

function showCharacterView () {
  document.getElementById('homeDropdown').classList.add('hidden')
  document.querySelector('main').classList.remove('hidden')
  document.querySelector('.bottom-nav').classList.remove('hidden')
  document.querySelector('.portrait-section').classList.remove('hidden')
  const jsonView = document.getElementById('jsonView')
  if (jsonView) jsonView.remove()
}
//#endregion
//#endregion

// NEU: Gegenstände/Inventar anzeigen
function loadInventory (charData) {
  const inventoryRow = document.querySelector('#page4 .inventory-row')
  if (!inventoryRow) return
  inventoryRow.innerHTML = ''
  const items = charData.Gegenstände || []
  if (items.length === 0) {
    inventoryRow.innerHTML =
      '<div class="inventory-box"><div class="label">Keine Gegenstände</div></div>'
    return
  }
  // Hilfsfunktion für Behälter rekursiv
  function renderItem (item, parentBox, indent = 0) {
    const box = document.createElement('div')
    box.className = 'inventory-box'
    if (item.equipped) box.classList.add('equipped')
    box.style.marginLeft = indent + 'em'
    // Checkbox für Equip-Status
    const equipCheckbox = document.createElement('input')
    equipCheckbox.type = 'checkbox'
    equipCheckbox.checked = !!item.equipped
    equipCheckbox.className = 'equip-checkbox'
    equipCheckbox.title = 'Ausrüsten/Ablegen'
    equipCheckbox.addEventListener('click', e => {
      e.stopPropagation()
      item.equipped = equipCheckbox.checked
      loadCharacterData() // UI neu laden, damit Boni etc. aktualisiert werden
    })
    // Kopfzeile: Checkbox + Name
    const header = document.createElement('div')
    header.className = 'inventory-header'
    header.appendChild(equipCheckbox)
    const nameSpan = document.createElement('span')
    nameSpan.className = 'item-name'
    nameSpan.textContent = item.name || 'Unbenannt'
    header.appendChild(nameSpan)
    box.appendChild(header)
    // Behälter-Logik
    let isContainer =
      item.gegenstandsTyp &&
      item.gegenstandsTyp.Behälter &&
      Array.isArray(item.gegenstandsTyp.Behälter.container)
    let containerContent = null
    if (isContainer) {
      const toggleBtn = document.createElement('button')
      toggleBtn.textContent = '[+]'
      toggleBtn.className = 'container-toggle'
      header.appendChild(toggleBtn)
      containerContent = document.createElement('div')
      containerContent.className = 'container-content'
      containerContent.style.display = 'none'
      toggleBtn.addEventListener('click', e => {
        e.stopPropagation()
        if (containerContent.style.display === 'none') {
          containerContent.style.display = 'block'
          toggleBtn.textContent = '[-]'
        } else {
          containerContent.style.display = 'none'
          toggleBtn.textContent = '[+]'
        }
      })
      // Rekursiv Inhalt rendern, eingerückt
      item.gegenstandsTyp.Behälter.container.forEach(subItem => {
        renderItem(subItem, containerContent, indent + 2)
      })
      box.appendChild(containerContent)
    }
    // Tooltip für Details (Beschreibung, Wert, Gewicht, Boni)
    box.style.cursor = 'pointer'
    box.addEventListener('click', e => {
      e.stopPropagation()
      e.preventDefault()
      let tooltip = ''
      tooltip += item.beschreibung ? item.beschreibung + '\n' : ''
      tooltip += `Wert: ${item.wert ?? '-'} | Gewicht: ${
        item.Gewicht ?? '-'
      } | Seltenheit: ${item.seltenheit ?? '-'}\n`
      if (item.gegenstandsTyp && item.gegenstandsTyp.Magisch) {
        const mag = item.gegenstandsTyp.Magisch
        if (mag.modifikatoren) {
          tooltip += 'Boni: ' + JSON.stringify(mag.modifikatoren) + '\n'
        }
      }
      showTooltipAtElement(box, tooltip)
    })
    parentBox.appendChild(box)
  }
  items.forEach(item => renderItem(item, inventoryRow, 0))
}
