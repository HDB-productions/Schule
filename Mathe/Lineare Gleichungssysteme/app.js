(function () {
  "use strict";

  const graphSize = 520;
  const graphPadding = 44;
  const axisLimit = 10;

  const controls = {
    generateButton: document.getElementById("generateButton"),
    coefficientLimit: document.getElementById("coefficientLimit"),
    coefficientLimitValue: document.getElementById("coefficientLimitValue"),
    solutionLimit: document.getElementById("solutionLimit"),
    solutionLimitValue: document.getElementById("solutionLimitValue"),
    outputFormat: document.getElementById("outputFormat"),
    outputFormatValue: document.getElementById("outputFormatValue"),
    newExerciseButton: document.getElementById("newExerciseButton"),
    exerciseOperation: document.getElementById("exerciseOperation"),
    exerciseNumber: document.getElementById("exerciseNumber"),
    exerciseOperand: document.getElementById("exerciseOperand"),
    exerciseVariable: document.getElementById("exerciseVariable"),
    prepareStepButton: document.getElementById("prepareStepButton"),
    checkStepButton: document.getElementById("checkStepButton")
  };

  const output = {
    equationOne: document.getElementById("equationOne"),
    equationTwo: document.getElementById("equationTwo"),
    caseBadge: document.getElementById("caseBadge"),
    solutionSetText: document.getElementById("solutionSetText"),
    reasonText: document.getElementById("reasonText"),
    graph: document.getElementById("graph"),
    exerciseEquations: [
      document.getElementById("selectExerciseEquationOne"),
      document.getElementById("selectExerciseEquationTwo")
    ],
    coefficientEntry: document.getElementById("coefficientEntry"),
    exerciseStepLabel: document.getElementById("exerciseStepLabel"),
    exerciseFeedback: document.getElementById("exerciseFeedback")
  };

  const outputFormats = [
    { key: "slope", label: "y = mx + b" },
    { key: "standard", label: "ax + by = c" },
    { key: "random", label: "zufaellige Reihenfolge" }
  ];

  let exerciseState = {
    system: null,
    selectedEquationIndex: 0,
    pendingSystem: null,
    pendingEquationIndex: null
  };

  function readSettings() {
    return {
      type: document.querySelector("input[name='solutionType']:checked").value,
      coefficientLimit: Number(controls.coefficientLimit.value),
      solutionLimit: Number(controls.solutionLimit.value),
      outputFormat: currentOutputFormat().key,
      requireYCoefficient: currentOutputFormat().key === "slope"
    };
  }

  function updateRangeLabels() {
    controls.coefficientLimitValue.textContent = controls.coefficientLimit.value;
    controls.solutionLimitValue.textContent = controls.solutionLimit.value;
    controls.outputFormatValue.textContent = currentOutputFormat().label;
  }

  function currentOutputFormat() {
    return outputFormats[Number(controls.outputFormat.value)] || outputFormats[1];
  }

  function renderSystem(system) {
    const first = system.equations[0];
    const second = system.equations[1];

    const format = currentOutputFormat().key;
    output.equationOne.textContent = LgsGenerator.formatEquation(first, format);
    output.equationTwo.textContent = LgsGenerator.formatEquation(second, format);
    output.caseBadge.textContent = system.label;
    output.caseBadge.className = `case-badge ${system.type}`;
    output.reasonText.textContent = system.explanation;
    output.solutionSetText.textContent = LgsGenerator.formatSolutionSet(system);

    renderGraph(system);
  }

  function renderGraph(system) {
    clearGraph();
    drawGrid();

    drawEquationLine(system.equations[0], "graph-line line-a");
    drawEquationLine(system.equations[1], "graph-line line-b");

    if (system.type === "unique") {
      drawPoint(system.solution.x, system.solution.y, "S");
    }
  }

  function clearGraph() {
    output.graph.replaceChildren();
  }

  function createSvgElement(name, attributes) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function drawGrid() {
    const style = createSvgElement("style", {});
    style.textContent = `
      .grid-line { stroke: #dfe7f1; stroke-width: 1; }
      .axis-line { stroke: #697789; stroke-width: 2; }
      .tick-label { fill: #6c7888; font: 12px Segoe UI, Arial, sans-serif; }
      .graph-line { fill: none; stroke-width: 4; stroke-linecap: round; }
      .line-a { stroke: #1f7a8c; }
      .line-b { stroke: #d97706; }
      .solution-point { fill: #ba3b46; stroke: #ffffff; stroke-width: 4; }
      .solution-label { fill: #1c2430; font: 700 16px Segoe UI, Arial, sans-serif; }
    `;
    output.graph.appendChild(style);

    for (let value = -axisLimit; value <= axisLimit; value += 1) {
      const startX = toScreenX(-axisLimit);
      const endX = toScreenX(axisLimit);
      const startY = toScreenY(-axisLimit);
      const endY = toScreenY(axisLimit);
      const x = toScreenX(value);
      const y = toScreenY(value);
      const isAxis = value === 0;

      output.graph.appendChild(createSvgElement("line", {
        x1: x,
        y1: startY,
        x2: x,
        y2: endY,
        class: isAxis ? "axis-line" : "grid-line"
      }));

      output.graph.appendChild(createSvgElement("line", {
        x1: startX,
        y1: y,
        x2: endX,
        y2: y,
        class: isAxis ? "axis-line" : "grid-line"
      }));

      if (value !== 0 && value % 2 === 0) {
        output.graph.appendChild(createText(x - 5, toScreenY(0) + 20, String(value)));
        output.graph.appendChild(createText(toScreenX(0) + 8, y + 4, String(value)));
      }
    }

    output.graph.appendChild(createText(toScreenX(axisLimit) + 10, toScreenY(0) + 4, "x"));
    output.graph.appendChild(createText(toScreenX(0) + 8, toScreenY(axisLimit) - 10, "y"));
  }

  function createText(x, y, text) {
    const label = createSvgElement("text", { x, y, class: "tick-label" });
    label.textContent = text;
    return label;
  }

  function drawEquationLine(equation, className) {
    const points = clippedLinePoints(equation);

    if (points.length < 2) {
      return;
    }

    const path = createSvgElement("path", {
      d: `M ${toScreenX(points[0].x)} ${toScreenY(points[0].y)} L ${toScreenX(points[1].x)} ${toScreenY(points[1].y)}`,
      class: className
    });
    output.graph.appendChild(path);
  }

  function clippedLinePoints(equation) {
    const points = [];

    if (equation.b !== 0) {
      [-axisLimit, axisLimit].forEach((x) => {
        const y = (equation.c - equation.a * x) / equation.b;
        if (isInView(y)) {
          points.push({ x, y });
        }
      });
    }

    if (equation.a !== 0) {
      [-axisLimit, axisLimit].forEach((y) => {
        const x = (equation.c - equation.b * y) / equation.a;
        if (isInView(x)) {
          points.push({ x, y });
        }
      });
    }

    return uniquePoints(points).slice(0, 2);
  }

  function uniquePoints(points) {
    return points.filter((point, index) => {
      return points.findIndex((candidate) => {
        return Math.abs(candidate.x - point.x) < 0.0001 && Math.abs(candidate.y - point.y) < 0.0001;
      }) === index;
    });
  }

  function isInView(value) {
    return value >= -axisLimit && value <= axisLimit;
  }

  function drawPoint(x, y, labelText) {
    output.graph.appendChild(createSvgElement("circle", {
      cx: toScreenX(x),
      cy: toScreenY(y),
      r: 8,
      class: "solution-point"
    }));

    const label = createSvgElement("text", {
      x: toScreenX(x) + 12,
      y: toScreenY(y) - 12,
      class: "solution-label"
    });
    label.textContent = labelText;
    output.graph.appendChild(label);
  }

  function toScreenX(x) {
    const drawable = graphSize - graphPadding * 2;
    return graphPadding + ((x + axisLimit) / (axisLimit * 2)) * drawable;
  }

  function toScreenY(y) {
    const drawable = graphSize - graphPadding * 2;
    return graphSize - graphPadding - ((y + axisLimit) / (axisLimit * 2)) * drawable;
  }

  function generateAndRender() {
    renderSystem(LgsGenerator.generateSystem(readSettings()));
  }

  function startNewExercise() {
    const exerciseSystem = LgsGenerator.generateSystem({
      type: "unique",
      coefficientLimit: Number(controls.coefficientLimit.value),
      solutionLimit: Number(controls.solutionLimit.value),
      outputFormat: "standard"
    });

    exerciseState = {
      system: exerciseSystem.equations.map(canonicalToExerciseEquation),
      selectedEquationIndex: 0,
      pendingSystem: null,
      pendingEquationIndex: null
    };

    renderExerciseSystem();
    clearPreparedStep("Bereite zuerst einen Umformungsschritt vor.");
    setExerciseFeedback("");
  }

  function cloneSystem(equations) {
    return equations.map((equation) => ({
      left: { ...equation.left },
      right: { ...equation.right }
    }));
  }

  function canonicalToExerciseEquation(equation) {
    return {
      left: { x: equation.a, y: equation.b, n: 0 },
      right: { x: 0, y: 0, n: equation.c }
    };
  }

  function renderExerciseSystem() {
    exerciseState.system.forEach((equation, index) => {
      output.exerciseEquations[index].textContent = formatExerciseEquation(equation);
      output.exerciseEquations[index].classList.toggle("is-selected", index === exerciseState.selectedEquationIndex);
    });
  }

  function selectExerciseEquation(index) {
    exerciseState.selectedEquationIndex = index;
    exerciseState.pendingSystem = null;
    exerciseState.pendingEquationIndex = null;
    renderExerciseSystem();
    clearPreparedStep("Bereite fuer die gewaehlte Gleichung einen Schritt vor.");
    setExerciseFeedback("");
  }

  function prepareExerciseStep() {
    const operation = controls.exerciseOperation.value;
    const value = parseNumber(controls.exerciseNumber.value);

    if (!Number.isFinite(value)) {
      setExerciseFeedback("Gib eine gueltige Zahl ein.", "error");
      return;
    }

    if (operation === "divide" && value === 0) {
      setExerciseFeedback("Durch 0 darf nicht dividiert werden.", "error");
      return;
    }

    const selectedIndex = exerciseState.selectedEquationIndex;
    const nextSystem = cloneSystem(exerciseState.system);
    nextSystem[selectedIndex] = transformEquation(selectedIndex, operation, value);

    exerciseState.pendingSystem = nextSystem;
    exerciseState.pendingEquationIndex = selectedIndex;

    renderCoefficientEntry(nextSystem, selectedIndex, operation, value);
    output.exerciseStepLabel.textContent = stepLabel(selectedIndex, operation, value);
    controls.checkStepButton.disabled = false;
    setExerciseFeedback("Trage jetzt die Koeffizienten der neuen Gleichung ein.");
  }

  function transformEquation(selectedIndex, operation, value) {
    const selected = exerciseState.system[selectedIndex];
    const other = exerciseState.system[selectedIndex === 0 ? 1 : 0];
    const sign = operation === "subtract" ? -1 : 1;

    if (operation === "add" || operation === "subtract") {
      return addExerciseExpression(selected, buildOperandExpression(other, controls.exerciseOperand.value, value), sign);
    }

    if (operation === "multiply") {
      return scaleExerciseEquation(selected, value);
    }

    if (operation === "divide") {
      return scaleExerciseEquation(selected, 1 / value);
    }

    return substituteValue(selected, controls.exerciseVariable.value, value);
  }

  function buildOperandExpression(otherEquation, operand, value) {
    if (operand === "x") {
      return {
        left: { x: value, y: 0, n: 0 },
        right: { x: value, y: 0, n: 0 }
      };
    }

    if (operand === "y") {
      return {
        left: { x: 0, y: value, n: 0 },
        right: { x: 0, y: value, n: 0 }
      };
    }

    if (operand === "equation") {
      return scaleExerciseEquation(otherEquation, value);
    }

    return {
      left: { x: 0, y: 0, n: value },
      right: { x: 0, y: 0, n: value }
    };
  }

  function addExerciseExpression(equation, expression, sign) {
    return {
      left: addSide(equation.left, expression.left, sign),
      right: addSide(equation.right, expression.right, sign)
    };
  }

  function addSide(side, addition, sign) {
    return {
      x: side.x + sign * addition.x,
      y: side.y + sign * addition.y,
      n: side.n + sign * addition.n
    };
  }

  function scaleExerciseEquation(equation, factor) {
    return {
      left: scaleSide(equation.left, factor),
      right: scaleSide(equation.right, factor)
    };
  }

  function scaleSide(side, factor) {
    return {
      x: side.x * factor,
      y: side.y * factor,
      n: side.n * factor
    };
  }

  function substituteValue(equation, variable, value) {
    if (variable === "x") {
      return {
        left: { x: 0, y: equation.left.y, n: equation.left.n + equation.left.x * value },
        right: { x: 0, y: equation.right.y, n: equation.right.n + equation.right.x * value }
      };
    }

    return {
      left: { x: equation.left.x, y: 0, n: equation.left.n + equation.left.y * value },
      right: { x: equation.right.x, y: 0, n: equation.right.n + equation.right.y * value }
    };
  }

  function renderCoefficientEntry(nextSystem, changedIndex, operation, value) {
    output.coefficientEntry.replaceChildren();

    nextSystem.forEach((equation, index) => {
      const row = document.createElement("div");
      row.className = "coefficient-row";

      const label = document.createElement("span");
      label.textContent = index === 0 ? "I" : "II";
      row.appendChild(label);

      if (index !== changedIndex) {
        const locked = document.createElement("span");
        locked.className = "locked-equation";
        locked.textContent = formatExerciseEquation(equation);
        row.appendChild(locked);
        output.coefficientEntry.appendChild(row);
        return;
      }

      row.appendChild(createCoefficientInput("left.x", "x-Koeffizient links"));
      row.appendChild(createMathText("x +"));
      row.appendChild(createCoefficientInput("left.y", "y-Koeffizient links"));
      row.appendChild(createMathText("y +"));
      row.appendChild(createCoefficientInput("left.n", "Zahl links"));
      row.appendChild(createMathText("="));
      row.appendChild(createCoefficientInput("right.x", "x-Koeffizient rechts"));
      row.appendChild(createMathText("x +"));
      row.appendChild(createCoefficientInput("right.y", "y-Koeffizient rechts"));
      row.appendChild(createMathText("y +"));
      row.appendChild(createCoefficientInput("right.n", "Zahl rechts"));
      output.coefficientEntry.appendChild(row);
    });

    if (operation === "substitute") {
      setExerciseFeedback(`Setze ${controls.exerciseVariable.value} = ${formatNumber(value)} ein und vereinfache die gewaehlte Gleichung.`);
    }
  }

  function createCoefficientInput(name, label) {
    const input = document.createElement("input");
    input.type = "text";
    input.inputMode = "decimal";
    input.dataset.coefficient = name;
    input.placeholder = name;
    input.setAttribute("aria-label", label);
    return input;
  }

  function createMathText(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span;
  }

  function checkExerciseStep() {
    if (!exerciseState.pendingSystem) {
      return;
    }

    const target = exerciseState.pendingSystem[exerciseState.pendingEquationIndex];
    const values = {};
    output.coefficientEntry.querySelectorAll("input[data-coefficient]").forEach((input) => {
      values[input.dataset.coefficient] = parseNumber(input.value);
    });

    const requiredFields = ["left.x", "left.y", "left.n", "right.x", "right.y", "right.n"];

    if (requiredFields.some((field) => !Number.isFinite(values[field]))) {
      setExerciseFeedback("Fuelle alle sechs Koeffizientenfelder aus.", "error");
      return;
    }

    const isCorrect = nearlyEqual(values["left.x"], target.left.x)
      && nearlyEqual(values["left.y"], target.left.y)
      && nearlyEqual(values["left.n"], target.left.n)
      && nearlyEqual(values["right.x"], target.right.x)
      && nearlyEqual(values["right.y"], target.right.y)
      && nearlyEqual(values["right.n"], target.right.n);

    if (!isCorrect) {
      setExerciseFeedback("Noch nicht richtig. Pruefe die neue Gleichung noch einmal.", "error");
      return;
    }

    exerciseState.system = cloneSystem(exerciseState.pendingSystem);
    exerciseState.pendingSystem = null;
    exerciseState.pendingEquationIndex = null;
    controls.checkStepButton.disabled = true;
    renderExerciseSystem();
    clearPreparedStep("Richtig. Waehle den naechsten Umformungsschritt.");
    setExerciseFeedback(solvedExercise() ? "Richtig. Das LGS ist geloest." : "Richtig. Der Schritt wurde uebernommen.", "success");
  }

  function solvedExercise() {
    const first = exerciseState.system[0];
    const second = exerciseState.system[1];
    const normalized = [first, second].map(toCanonicalExerciseEquation);
    const hasXEquation = normalized.some((equation) => nearlyEqual(equation.a, 1) && nearlyEqual(equation.b, 0));
    const hasYEquation = normalized.some((equation) => nearlyEqual(equation.a, 0) && nearlyEqual(equation.b, 1));
    return hasXEquation && hasYEquation;
  }

  function clearPreparedStep(message) {
    output.coefficientEntry.replaceChildren();
    const hint = document.createElement("p");
    hint.textContent = message;
    output.coefficientEntry.appendChild(hint);
    output.exerciseStepLabel.textContent = "Noch kein Schritt";
    controls.checkStepButton.disabled = true;
  }

  function stepLabel(selectedIndex, operation, value) {
    const selected = selectedIndex === 0 ? "I" : "II";
    const other = selectedIndex === 0 ? "II" : "I";
    const operand = operandLabel(controls.exerciseOperand.value, value, other);

    if (operation === "add") {
      return `${selected} + ${operand}`;
    }

    if (operation === "subtract") {
      return `${selected} - ${operand}`;
    }

    if (operation === "multiply") {
      return `${formatNumber(value)}·${selected}`;
    }

    if (operation === "divide") {
      return `${selected} : ${formatNumber(value)}`;
    }

    return `${controls.exerciseVariable.value} = ${formatNumber(value)} einsetzen`;
  }

  function operandLabel(operand, value, other) {
    if (operand === "x") {
      return `${formatNumber(value)}x`;
    }

    if (operand === "y") {
      return `${formatNumber(value)}y`;
    }

    if (operand === "equation") {
      return `${formatNumber(value)}·${other}`;
    }

    return formatNumber(value);
  }

  function toCanonicalExerciseEquation(equation) {
    return {
      a: equation.left.x - equation.right.x,
      b: equation.left.y - equation.right.y,
      c: equation.right.n - equation.left.n
    };
  }

  function formatExerciseEquation(equation) {
    return `${formatExerciseSide(equation.left)} = ${formatExerciseSide(equation.right)}`;
  }

  function formatExerciseSide(side) {
    const terms = [
      { coefficient: side.x, variable: "x" },
      { coefficient: side.y, variable: "y" },
      { coefficient: side.n, variable: "" }
    ].filter((term) => !nearlyEqual(term.coefficient, 0));

    if (terms.length === 0) {
      return "0";
    }

    return terms.map((term, index) => formatExerciseTerm(term.coefficient, term.variable, index === 0)).join("");
  }

  function formatExerciseTerm(coefficient, variable, isFirst) {
    const sign = coefficient < 0 ? "-" : "+";
    const absolute = Math.abs(coefficient);
    const formattedCoefficient = formatNumber(absolute);
    const body = variable && nearlyEqual(absolute, 1) ? variable : `${formattedCoefficient}${variable}`;

    if (isFirst) {
      return coefficient < 0 ? `-${body}` : body;
    }

    return ` ${sign} ${body}`;
  }

  function parseNumber(value) {
    const normalized = String(value).trim().replace(",", ".");

    if (normalized === "") {
      return NaN;
    }

    if (normalized.includes("/")) {
      const parts = normalized.split("/");
      if (parts.length !== 2) {
        return NaN;
      }

      const numerator = Number(parts[0]);
      const denominator = Number(parts[1]);
      return denominator === 0 ? NaN : numerator / denominator;
    }

    return Number(normalized);
  }

  function nearlyEqual(left, right) {
    return Math.abs(left - right) < 0.000001;
  }

  function formatNumber(value) {
    return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4)));
  }

  function setExerciseFeedback(message, type) {
    output.exerciseFeedback.textContent = message;
    output.exerciseFeedback.className = type ? `exercise-feedback ${type}` : "exercise-feedback";
  }

  controls.generateButton.addEventListener("click", generateAndRender);
  controls.coefficientLimit.addEventListener("input", updateRangeLabels);
  controls.solutionLimit.addEventListener("input", updateRangeLabels);
  controls.outputFormat.addEventListener("input", () => {
    updateRangeLabels();
    generateAndRender();
  });

  document.querySelectorAll("input[name='solutionType']").forEach((input) => {
    input.addEventListener("change", generateAndRender);
  });

  output.exerciseEquations.forEach((button, index) => {
    button.addEventListener("click", () => selectExerciseEquation(index));
  });

  controls.newExerciseButton.addEventListener("click", startNewExercise);
  controls.prepareStepButton.addEventListener("click", prepareExerciseStep);
  controls.checkStepButton.addEventListener("click", checkExerciseStep);

  updateRangeLabels();
  generateAndRender();
  startNewExercise();
})();
