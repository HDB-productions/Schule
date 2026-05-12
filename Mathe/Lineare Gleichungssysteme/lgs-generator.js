(function (root) {
  "use strict";

  const TYPE_LABELS = {
    unique: "Eine Loesung",
    equivalent: "Aequivalente Gleichungen",
    none: "Keine Loesung"
  };

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomNonZero(limit, forbiddenValues) {
    const forbidden = new Set(forbiddenValues || [0]);
    let value = 0;
    do {
      value = randomInt(-limit, limit);
    } while (forbidden.has(value));
    return value;
  }

  function randomCoefficientPair(limit, options) {
    const settings = options || {};

    if (settings.requireYCoefficient) {
      return {
        a: randomCoefficientWithOptionalZero(limit),
        b: randomNonZero(limit)
      };
    }

    if (Math.random() < 0.28) {
      return Math.random() < 0.5
        ? { a: 0, b: randomNonZero(limit) }
        : { a: randomNonZero(limit), b: 0 };
    }

    let a = 0;
    let b = 0;

    while (a === 0 && b === 0) {
      a = randomCoefficientWithOptionalZero(limit);
      b = randomCoefficientWithOptionalZero(limit);
    }

    return { a, b };
  }

  function randomCoefficientWithOptionalZero(limit) {
    return randomInt(-limit, limit);
  }

  function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const next = x % y;
      x = y;
      y = next;
    }
    return x || 1;
  }

  function normalizeEquation(equation) {
    const divisor = gcd(gcd(equation.a, equation.b), equation.c);
    let normalized = {
      a: equation.a / divisor,
      b: equation.b / divisor,
      c: equation.c / divisor
    };

    if (normalized.a < 0 || (normalized.a === 0 && normalized.b < 0)) {
      normalized = {
        a: -normalized.a,
        b: -normalized.b,
        c: -normalized.c
      };
    }

    return normalized;
  }

  function determinant(first, second) {
    return first.a * second.b - second.a * first.b;
  }

  function createEquationThroughPoint(x, y, limit, options) {
    const coefficients = randomCoefficientPair(limit, options);
    const a = coefficients.a;
    const b = coefficients.b;
    return normalizeEquation({ a, b, c: a * x + b * y });
  }

  function createSlopeEquationThroughPoint(x, y, limit, fixedSlope) {
    const slope = Number.isInteger(fixedSlope)
      ? fixedSlope
      : randomInt(-limit, limit);
    const intercept = y - slope * x;
    return { a: -slope, b: 1, c: intercept };
  }

  function generateUnique(options) {
    const coefficientLimit = options.coefficientLimit;
    const solutionLimit = options.solutionLimit;
    const solution = {
      x: randomInt(-solutionLimit, solutionLimit),
      y: randomInt(-solutionLimit, solutionLimit)
    };

    const first = options.outputFormat === "slope"
      ? createSlopeEquationThroughPoint(solution.x, solution.y, coefficientLimit)
      : createEquationThroughPoint(solution.x, solution.y, coefficientLimit, options);
    let second = options.outputFormat === "slope"
      ? createSlopeEquationThroughPoint(solution.x, solution.y, coefficientLimit)
      : createEquationThroughPoint(solution.x, solution.y, coefficientLimit, options);

    while (determinant(first, second) === 0) {
      second = options.outputFormat === "slope"
        ? createSlopeEquationThroughPoint(solution.x, solution.y, coefficientLimit)
        : createEquationThroughPoint(solution.x, solution.y, coefficientLimit, options);
    }

    return {
      type: "unique",
      label: TYPE_LABELS.unique,
      equations: [first, second],
      solution,
      determinant: determinant(first, second),
      explanation: "Die beiden Geraden schneiden sich in genau einem Punkt."
    };
  }

  function generateEquivalent(options) {
    const coefficientLimit = options.coefficientLimit;
    const solutionLimit = options.solutionLimit;
    const point = {
      x: randomInt(-solutionLimit, solutionLimit),
      y: randomInt(-solutionLimit, solutionLimit)
    };
    const first = options.outputFormat === "slope"
      ? createSlopeEquationThroughPoint(point.x, point.y, coefficientLimit)
      : createEquationThroughPoint(point.x, point.y, coefficientLimit, { requireYCoefficient: true });
    const factor = randomNonZero(4, [0, 1]);
    const second = {
      a: first.a * factor,
      b: first.b * factor,
      c: first.c * factor
    };

    return {
      type: "equivalent",
      label: TYPE_LABELS.equivalent,
      equations: [first, second],
      samplePoint: point,
      determinant: 0,
      explanation: "Wenn du beide Gleichungen nach y umstellst und als Geraden zeichnest, so erkennst du, dass die Geraden aufeinanderliegen. Die Lösungsmenge besteht aus allen Wertepaaren, die auf dieser Geraden liegen und damit automatisch beide Gleichungen erfüllen."
    };
  }

  function generateNone(options) {
    const coefficientLimit = options.coefficientLimit;
    const solutionLimit = options.solutionLimit;
    const point = {
      x: randomInt(-solutionLimit, solutionLimit),
      y: randomInt(-solutionLimit, solutionLimit)
    };
    const first = options.outputFormat === "slope"
      ? createSlopeEquationThroughPoint(point.x, point.y, coefficientLimit)
      : createEquationThroughPoint(point.x, point.y, coefficientLimit, { requireYCoefficient: true });
    const factor = randomNonZero(4, [0]);
    const offset = randomNonZero(Math.max(2, coefficientLimit));
    const second = options.outputFormat === "slope"
      ? {
        a: first.a * factor,
        b: first.b * factor,
        c: (first.c + offset) * factor
      }
      : {
        a: first.a * factor,
        b: first.b * factor,
        c: first.c * factor + offset
      };

    return {
      type: "none",
      label: TYPE_LABELS.none,
      equations: [first, second],
      determinant: 0,
      explanation: "Wenn du beide Gleichungen nach y umstellst und als Geraden zeichnest, so erkennst du, dass die Geraden parallel zueinander verlaufen. Es gibt keine gemeinsamen Punkte. Das Gleichungssystem hat keine Lösung."
    };
  }

  function generateSystem(options) {
    const settings = {
      type: options && options.type ? options.type : "unique",
      coefficientLimit: Number(options && options.coefficientLimit) || 8,
      solutionLimit: Number(options && options.solutionLimit) || 6,
      requireYCoefficient: Boolean(options && options.requireYCoefficient),
      outputFormat: options && options.outputFormat ? options.outputFormat : "standard"
    };

    if (settings.type === "equivalent") {
      return generateEquivalent(settings);
    }

    if (settings.type === "none") {
      return generateNone(settings);
    }

    return generateUnique(settings);
  }

  function formatEquation(equation, format) {
    if (format === "slope") {
      return formatSlopeIntercept(equation);
    }

    if (format === "random") {
      return formatRandomEquation(equation);
    }

    return formatStandardEquation(equation, ["x", "y"]);
  }

  function formatSolutionSet(system) {
    if (system.type === "unique") {
      return `L = {(${system.solution.x}|${system.solution.y})}`;
    }

    if (system.type === "equivalent") {
      return `L = {(x|y) | ${formatSlopeIntercept(system.equations[0])}}`;
    }

    return "L = {}";
  }

  function formatStandardEquation(equation, order) {
    const nonZeroVariables = order.filter((variable) => {
      const coefficient = variable === "x" ? equation.a : equation.b;
      return coefficient !== 0;
    });
    const terms = nonZeroVariables.map((variable, index) => {
      const coefficient = variable === "x" ? equation.a : equation.b;
      return formatTerm(coefficient, variable, index === 0);
    });

    const leftSide = terms.join("");
    return `${leftSide || "0"} = ${equation.c}`;
  }

  function formatRandomEquation(equation) {
    const zeroSumTerms = [
      { coefficient: equation.a, variable: "x" },
      { coefficient: equation.b, variable: "y" },
      { coefficient: -equation.c, variable: "" }
    ].filter((term) => term.coefficient !== 0);

    if (zeroSumTerms.length < 2) {
      return formatStandardEquation(equation, Math.random() < 0.5 ? ["x", "y"] : ["y", "x"]);
    }

    const leftMask = randomInt(1, 2 ** zeroSumTerms.length - 2);
    const globalSign = Math.random() < 0.5 ? 1 : -1;
    const leftTerms = [];
    const rightTerms = [];

    zeroSumTerms.forEach((term, index) => {
      const isLeft = Boolean(leftMask & (1 << index));
      const displayedTerm = {
        coefficient: term.coefficient * (isLeft ? 1 : -1) * globalSign,
        variable: term.variable
      };

      if (isLeft) {
        leftTerms.push(displayedTerm);
      } else {
        rightTerms.push(displayedTerm);
      }
    });

    return `${formatExpression(shuffle(leftTerms))} = ${formatExpression(shuffle(rightTerms))}`;
  }

  function formatSlopeIntercept(equation) {
    if (equation.b === 0) {
      return `x = ${formatFraction(equation.c, equation.a)}`;
    }

    const slopeNumerator = -equation.a;
    const slopeDenominator = equation.b;
    const interceptNumerator = equation.c;
    const interceptDenominator = equation.b;
    const slope = reduceFraction(slopeNumerator, slopeDenominator);
    const intercept = reduceFraction(interceptNumerator, interceptDenominator);

    if (slope.numerator === 0) {
      return `y = ${formatFractionParts(intercept)}`;
    }

    let result = `y = ${formatSlopePart(slope)}x`;

    if (intercept.numerator > 0) {
      result += ` + ${formatFractionParts(intercept)}`;
    } else if (intercept.numerator < 0) {
      result += ` - ${formatFractionParts({ numerator: Math.abs(intercept.numerator), denominator: intercept.denominator })}`;
    }

    return result;
  }

  function formatTerm(coefficient, variable, isFirst) {
    if (coefficient === 0) {
      return "";
    }

    const sign = coefficient < 0 ? "-" : "+";
    const absolute = Math.abs(coefficient);
    const body = absolute === 1 ? variable : `${absolute}${variable}`;

    if (isFirst) {
      return coefficient < 0 ? `-${body}` : body;
    }

    return ` ${sign} ${body}`;
  }

  function formatExpression(terms) {
    const visibleTerms = terms.filter((term) => term.coefficient !== 0);
    return visibleTerms.map((term, index) => formatDisplayTerm(term.coefficient, term.variable, index === 0)).join("");
  }

  function formatDisplayTerm(coefficient, variable, isFirst) {
    const sign = coefficient < 0 ? "-" : "+";
    const absolute = Math.abs(coefficient);
    const body = variable ? `${absolute}${variable}` : String(absolute);

    if (isFirst) {
      return coefficient < 0 ? `-${body}` : body;
    }

    return ` ${sign} ${body}`;
  }

  function shuffle(items) {
    const shuffled = items.slice();

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(0, index);
      const current = shuffled[index];
      shuffled[index] = shuffled[swapIndex];
      shuffled[swapIndex] = current;
    }

    return shuffled;
  }

  function formatSlopePart(fraction) {
    if (fraction.numerator === 1 && fraction.denominator === 1) {
      return "";
    }

    if (fraction.numerator === -1 && fraction.denominator === 1) {
      return "-";
    }

    return formatFractionParts(fraction);
  }

  function formatFraction(numerator, denominator) {
    return formatFractionParts(reduceFraction(numerator, denominator));
  }

  function formatFractionParts(fraction) {
    return fraction.denominator === 1
      ? String(fraction.numerator)
      : `${fraction.numerator}/${fraction.denominator}`;
  }

  function reduceFraction(numerator, denominator) {
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }

    const divisor = gcd(numerator, denominator);
    return {
      numerator: numerator / divisor,
      denominator: denominator / divisor
    };
  }

  const api = {
    determinant,
    formatEquation,
    formatSolutionSet,
    generateSystem
  };

  root.LgsGenerator = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
