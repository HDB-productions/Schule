function Num (a) {
  function b (a) {
    for (var b = 0; b < a; b++) this.n2.push(0)
  }
  function c (a) {
    for (var b = 0; b < a; b++) this.n1.unshift(0)
  }
  function d (a) {
    if (
      (this.trim(),
      a.trim(),
      this.numberOfPreDecimals() > a.numberOfPreDecimals())
    )
      return 0
    if (a.numberOfPreDecimals() > this.numberOfPreDecimals()) return 1
    for (var b = 0; b < this.numberOfPreDecimals(); b++) {
      if (this.n1[b] < a.n1[b]) return 1
      if (a.n1[b] < this.n1[b]) return 0
    }
    for (var b = 0; b < this.numberOfDecimals(); b++) {
      if (b >= a.numberOfDecimals()) return 0
      if (this.n2[b] < a.n2[b]) return 1
      if (a.n2[b] < this.n2[b]) return 0
    }
    return this.numberOfDecimals() < a.numberOfDecimals() ? 1 : 0
  }
  function e () {
    var a = ''
    !1 == this.positive && (a = '-')
    for (var b = 0; b < this.n1.length; b++) a += this.n1[b].toString()
    if ('.' == this.point || ',' == this.point) {
      a += this.point
      for (var b = 0; b < this.n2.length; b++) a += this.n2[b].toString()
    }
    return a
  }
  function f () {
    for (var a = 0; a < this.n1.length; a++) if (0 != this.n1[a]) return !1
    for (var a = 0; a < this.n2.length; a++) if (0 != this.n2[a]) return !1
    return !0
  }
  if (
    ((this.n1 = []),
    (this.n2 = []),
    (this.point = ''),
    (this.positive = !0),
    (this.print = function () {
      document.write(this.toString()), document.write('<br>')
    }),
    (this.trim = function () {
      for (; 1 < this.n1.length && 0 == this.n1[0]; ) this.n1.shift()
      return '' !== this.point && 0 == this.n2.length && (this.point = ''), this
    }),
    (this.trim_front = function () {
      for (; 1 < this.n1.length && 0 == this.n1[0]; ) this.n1.shift()
      return this
    }),
    (this.numberOfDecimals = function () {
      return this.n2.length
    }),
    (this.numberOfPreDecimals = function () {
      return this.n1.length
    }),
    (this.fill_decimals = b),
    (this.fill_pre_decimals = c),
    (this.same_number_of_decimals = function (a) {
      this.numberOfDecimals() > a.numberOfDecimals()
        ? (a.fill_decimals(this.numberOfDecimals() - a.numberOfDecimals()),
          '' == a.point && (a.point = this.point))
        : this.numberOfDecimals() < a.numberOfDecimals() &&
          (this.fill_decimals(a.numberOfDecimals() - this.numberOfDecimals()),
          '' == this.point && (this.point = a.point))
    }),
    (this.same_number_of_pre_decimals = function (a) {
      this.numberOfPreDecimals() > a.numberOfPreDecimals()
        ? (a.fill_pre_decimals(
            this.numberOfPreDecimals() - a.numberOfPreDecimals()
          ),
          '' == a.point && (a.point = this.point))
        : this.numberOfPreDecimals() < a.numberOfPreDecimals() &&
          (this.fill_pre_decimals(
            a.numberOfPreDecimals() - this.numberOfPreDecimals()
          ),
          '' == this.point && (this.point = a.point))
    }),
    (this.same_comma = function (a) {
      '' !== this.point &&
        '' !== a.point &&
        this.point !== a.point &&
        (a.point = this.point)
    }),
    (this.clear = function () {
      ;(this.n1 = []), (this.n2 = []), (this.point = '')
    }),
    (this.setComma = function (a) {
      this.point = a
    }),
    (this.push_front_n1 = function (a) {
      this.n1.unshift(a)
    }),
    (this.push_front_n2 = function (a) {
      this.n2.unshift(a)
    }),
    (this.push_back_n1 = function (a) {
      this.n1.push(a)
    }),
    (this.push_back_n2 = function (a) {
      this.n2.push(a)
    }),
    (this.smaller = d),
    (this.move_decimal_point_right = function (a) {
      for (; 0 < a; )
        0 < this.n2.length
          ? (this.n1.push(this.n2.shift()),
            0 == this.n2.length && '' == this.point)
          : this.n1.push(0),
          a--
      this.trim()
    }),
    (this.toString = e),
    (this.copy = function () {
      return new Num(this.toString())
    }),
    (this.is_zero = f),
    0 == a.length)
  )
    throw 'empty'
  if ('-' == a[0]) throw 'negative'
  if (',' == a[0] || '.' == a[0]) throw 'not a number'
  for (var g = 0; g < a.length; g++)
    if ('.' == a[g] || ',' == a[g]) {
      if ('' == this.point) this.point = a[g]
      else throw 'not a number'
    } else if (!Number.isInteger(parseInt(a[g]))) throw 'not a number'
    else
      '' == this.point
        ? this.n1.push(parseInt(a[g]))
        : this.n2.push(parseInt(a[g]))
  if ((this.trim(), void 0 !== withRest && withRest && 0 != this.n2.length))
    throw 'decimal'
}
function add (b, c) {
  b.same_number_of_decimals(c),
    b.same_number_of_pre_decimals(c),
    b.same_comma(c)
  var d,
    e = new Num('0'),
    f = new Num('0'),
    g = 0
  e.clear(), f.clear()
  for (var h = b.n2.length - 1; 0 <= h; h--)
    (d = b.n2[h] + c.n2[h] + g),
      e.push_front_n2(d % 10),
      (g = Math.floor(d / 10)),
      f.push_front_n2(Math.floor(d / 10))
  0 < e.n2.length && (e.setComma(b.point), f.setComma(b.point))
  for (var h = b.n1.length - 1; 0 <= h; h--)
    (d = b.n1[h] + c.n1[h] + g),
      e.push_front_n1(d % 10),
      (g = Math.floor(d / 10)),
      f.push_front_n1(Math.floor(d / 10))
  return 0 != g && e.push_front_n1(g), [e, f]
}
function sub (b, c) {
  var d,
    e = new Num('0'),
    f = new Num('0'),
    g = 0
  if ((e.clear(), f.clear(), b.smaller(c))) {
    var h = b
    ;(b = c), (c = h), (e.positive = !1)
  }
  b.same_number_of_decimals(c),
    b.same_number_of_pre_decimals(c),
    b.same_comma(c)
  for (var j = b.n2.length - 1; 0 <= j; j--)
    (d = 10 + b.n2[j] - c.n2[j] - g),
      e.push_front_n2(d % 10),
      (g = 10 > d ? 1 : 0),
      f.push_front_n2(10 > d ? 1 : 0)
  0 < e.n2.length && (e.setComma(b.point), f.setComma(b.point))
  for (var j = b.n1.length - 1; 0 <= j; j--)
    (d = 10 + b.n1[j] - c.n1[j] - g),
      e.push_front_n1(d % 10),
      (g = 10 > d ? 1 : 0),
      f.push_front_n1(10 > d ? 1 : 0)
  return [e, f]
}
function multiply (b, c) {
  b.trim(), c.trim(), b.same_comma(c)
  var d,
    e = [],
    f = [],
    g = 0,
    h = b.n2.length + c.n2.length,
    k = ','
  ;('.' == b.point || '.' == c.point) && (k = '.')
  for (var l = 0; l < c.n1.length; l++) {
    e[l] = []
    for (var m = b.n2.length - 1; 0 <= m; m--)
      (d = b.n2[m] * c.n1[l] + g),
        (g = Math.floor(d / 10)),
        e[l].unshift(d % 10)
    for (var m = b.n1.length - 1; 0 <= m; m--)
      (d = b.n1[m] * c.n1[l] + g),
        (g = Math.floor(d / 10)),
        e[l].unshift(d % 10)
    for (; 0 < g; ) e[l].unshift(g % 10), (g = Math.floor(g / 10))
    f.push(copy_array(e[l]))
    for (var m = c.n1.length + c.n2.length - l - 1; 0 < m; m--) e[l].push(0)
    for (var m = e[l].length; m < e[0].length; m++) e[l].unshift(0)
  }
  for (var l = 0; l < c.n2.length; l++) {
    e[l + c.n1.length] = []
    for (var m = b.n2.length - 1; 0 <= m; m--)
      (d = b.n2[m] * c.n2[l] + g),
        (g = Math.floor(d / 10)),
        e[l + c.n1.length].unshift(d % 10)
    for (var m = b.n1.length - 1; 0 <= m; m--)
      (d = b.n1[m] * c.n2[l] + g),
        (g = Math.floor(d / 10)),
        e[l + c.n1.length].unshift(d % 10)
    for (; 0 < g; ) e[l + c.n1.length].unshift(g % 10), (g = Math.floor(g / 10))
    f.push(copy_array(e[l + c.n1.length]))
    for (var m = c.n2.length - l - 1; 0 < m; m--) e[l + c.n1.length].push(0)
    for (var m = e[l + c.n1.length].length; m < e[0].length; m++)
      e[l + c.n1.length].unshift(0)
  }
  g = 0
  var n = new Num('0')
  n.clear()
  var o = new Num('0')
  o.clear()
  for (var p, l = e[0].length - 1; 0 <= l; l--) {
    ;(d = 0), (p = 0)
    for (var m = 0; m < e.length; m++) p += e[m][l]
    ;(d = p + g),
      n.push_front_n1(d % 10),
      (g = Math.floor(d / 10)),
      o.push_front_n1(Math.floor(d / 10))
  }
  if (0 < g) for (; 0 < g; ) n.push_front_n1(g % 10), (g = Math.floor(g / 10))
  if (0 < h) {
    n.point = k
    for (var l = 0; l < h; l++) n.push_front_n2(n.n1.pop())
  }
  return [n, f, o]
}
function copy_array (a) {
  for (var b = [], c = 0; c < a.length; c++) b.push(a[c])
  return b
}
function divide (b, c, d) {
  b.trim(),
    c.trim(),
    b.same_comma(c),
    (null == d || '' == d) && (d = 100),
    withRest && (d = 0)
  var e = c.n2.length
  0 < e && (b.move_decimal_point_right(e), c.move_decimal_point_right(e))
  var a = [],
    f = new Num('0'),
    g = new Num('0')
  f.clear()
  const h = c.toString()
  var j,
    k,
    l,
    m = new Num('0')
  m.clear()
  var n = 0,
    o = !1,
    p = ','
  ;('.' == b.point || '.' == c.point) && (p = '.')
  for (var q = new Map(), r = -1; !o; ) {
    for (
      n < b.n1.length
        ? f.push_back_n1(b.n1[n])
        : n < b.n1.length + b.n2.length
        ? f.push_back_n1(b.n2[n - b.n1.length])
        : f.push_back_n1(0),
        g = add(f.copy(), new Num('1'))[0],
        a.push(f),
        j = new Num('0'),
        k = new Num(h),
        l = 0;
      k.smaller(g);

    )
      (j = k), (k = add(k, c)[0]), l++
    n < b.n1.length ? m.push_back_n1(l) : m.push_back_n2(l),
      n == b.n1.length && (m.point = p),
      a.push(j),
      (f = sub(f.copy(), j)[0].trim()),
      n >= b.n1.length + b.n2.length - 1 &&
        1 == f.n1.length &&
        0 == f.n1[0] &&
        '' == f.point &&
        ((o = !0), a.push(new Num('0'))),
      n + 1 >= b.n1.length + b.n2.length &&
        !o &&
        (q.has(f.toString())
          ? ((r = q.get(f.toString())), (o = !0), a.push(f))
          : q.set(f.toString(), n)),
      m.n2.length >= d &&
        n >= b.n1.length + b.n2.length - 1 &&
        !1 == o &&
        ((o = !0), !f.is_zero() && a.push(f)),
      n++
  }
  return c.trim(), withRest ? [m, a, f] : [m, a, r, e]
}
let markedInputs = []
class CanvasSelf {
  constructor (a, b) {
    ;(this.boxes_x = a),
      (this.boxes_y = b),
      (this.table = document.createElement('table')),
      (this.table.id = 'exercise'),
      this.table.classList.add('not-selectable'),
      (this.carryoverElements = []),
      (this.solutionElements = []),
      (this.period = void 0)
    for (var c, d, e = 0; e < b; e++) {
      c = document.createElement('tr')
      for (var f = 0; f < a; f++)
        (d = document.createElement('td')), c.appendChild(d)
      this.table.appendChild(c)
    }
    exerciseContainer.appendChild(this.table)
  }
  insertEntry (a, b, c) {
    this.table.childNodes[c].childNodes[b].appendChild(a)
  }
  insertNumber (a, b, c) {
    for (var d = 0; d < a.n1.length; d++)
      this.insertEntry(
        new Digit(a.n1[a.n1.length - d - 1], 'normal-character').element,
        b - d,
        c
      )
    if ('' !== a.point) {
      for (var d = 0; d < a.n2.length; d++)
        this.insertEntry(
          new Digit(a.n2[d], 'normal-character').element,
          b + d + 1,
          c
        )
      this.insertPoint(a.point, b, c)
    }
  }
  insertCarryoverRow (a, b, c) {
    for (var d, e = 0; e < a.n1.length; e++)
      (d = new InputCarryover(a.n1[a.n1.length - e - 1])),
        this.insertEntry(d.element, b - e - 1, c),
        this.carryoverElements.push(d)
    for (var e = 0; e < a.n2.length; e++)
      (d = new InputCarryover(a.n2[e])),
        this.insertEntry(d.element, b + e, c),
        this.carryoverElements.push(d)
  }
  drawLine (a, b, c) {
    for (var d = a; d <= b; d++)
      this.table.childNodes[c].childNodes[d].classList.add('line-top')
  }
  insertSolutionRow (a, b, c, d = !1, e = !1) {
    var f
    let g
    e && (g = [this.table.firstChild.childNodes[d].firstChild])
    for (var h = 0; h < a.n1.length; h++)
      (f = new InputSolution(a.n1[a.n1.length - h - 1])),
        this.insertEntry(f.element, b - h, c),
        this.solutionElements.push(f),
        e && g.push(f.element),
        d &&
          !e &&
          (f.element.addEventListener(
            'focusin',
            () => {
              this.table.firstChild.childNodes[d].classList.add('mark')
            },
            { passive: !0 }
          ),
          f.element.addEventListener(
            'focusout',
            () => {
              this.table.firstChild.childNodes[d].classList.remove('mark')
            },
            { passive: !0 }
          ))
    if ('' !== a.point) {
      for (var h = 0; h < a.n2.length; h++)
        (f = new InputSolution(a.n2[h])),
          this.insertEntry(f.element, b + h + 1, c),
          this.solutionElements.push(f),
          d &&
            (f.element.addEventListener(
              'focusin',
              () => {
                this.table.firstChild.childNodes[d].classList.add('mark')
              },
              { passive: !0 }
            ),
            f.element.addEventListener(
              'focusout',
              () => {
                this.table.firstChild.childNodes[d].classList.remove('mark')
              },
              { passive: !0 }
            ))
      this.insertPoint(a.point, b, c)
    }
    if (e)
      for (var h = 0; h < g.length; h++)
        g[h].addEventListener(
          'focusin',
          () => {
            for (var a = 0; a < g.length; a++) g[a].classList.add('mark')
          },
          { passive: !0 }
        ),
          g[h].addEventListener(
            'focusout',
            () => {
              for (var a = 0; a < g.length; a++) g[a].classList.remove('mark')
            },
            { passive: !0 }
          )
  }
  insertPoint (a, b, c) {
    var d = this.table.childNodes[c].childNodes[b],
      e = new Point(a, 0, 0)
    d.appendChild(e.element), d.classList.add('relative')
  }
  determineIfFlexbox () {
    this.table.getBoundingClientRect().width > window.innerWidth - 100
      ? document.getElementById('exercise-container').classList.remove('center')
      : document.getElementById('exercise-container').classList.add('center')
  }
  checkInputs () {
    for (var a = !0, b = 0; b < this.carryoverElements.length && a; b++)
      this.carryoverElements[b].inputCorrect() || (a = !1)
    if (!a) return !1
    for (var c = !0, b = 0; b < this.solutionElements.length && c; b++)
      this.solutionElements[b].inputCorrect() || (c = !1)
    return c
  }
  showSolution () {
    for (var a = 0; a < this.carryoverElements.length; a++)
      this.carryoverElements[a].showDigit()
    for (var a = 0; a < this.solutionElements.length; a++)
      this.solutionElements[a].showDigit()
    'undefined' != typeof expectedInputPeriod &&
      (this.period
        ? !this.period.checkInput() &&
          this.period.changeStart(expectedInputPeriod, 'wrong')
        : this.drawPeriod(expectedInputPeriod, 'wrong'))
  }
  markWrongInputs () {
    for (var a = 0; a < this.carryoverElements.length; a++)
      this.carryoverElements[a].markIfWrong()
    for (var a = 0; a < this.solutionElements.length; a++)
      this.solutionElements[a].markIfWrong()
    'undefined' != typeof expectedInputPeriod &&
      this.period &&
      !this.period.checkInput() &&
      this.period.changeState('wrong')
  }
  manageCarryoverInputMaxLength () {
    for (var a = 1, b = 0; b < this.carryoverElements.length; b++)
      a = Math.max(a, this.carryoverElements[b].expectedDigit.toString().length)
    if (1 < a)
      for (var b = 0; b < this.carryoverElements.length; b++)
        this.carryoverElements[b].element.maxLength = a.toString()
  }
  disableAllInputfields () {
    for (var a of this.solutionElements)
      (a.element.disabled = !0), a.element.classList.add('disabled')
  }
  enableAllInputfields () {
    for (var a of this.solutionElements)
      (a.element.disabled = !1), a.element.classList.remove('disabled')
  }
  drawPeriod (a, b) {
    this.periodField &&
      (this.periodField.classList.remove('relative-period'),
      this.periodField.lastChild.remove(),
      (this.periodField = void 0))
    var c = document.createElement('div')
    c.id = 'period'
    var d = this.table.firstChild.firstChild.getBoundingClientRect(),
      e = this.table.firstChild.lastChild.getBoundingClientRect()
    ;(c.style.width = e.right - d.left + e.width / 2),
      this.period
        ? this.period.changeStart(a, b)
        : (this.period = new Period(a, this.table.firstChild.lastChild, b))
  }
}
class TableEntry {
  constructor () {}
}
class Digit extends TableEntry {
  constructor (a, b, c = !0) {
    super(),
      (this.element = document.createElement('span')),
      0 == a.length && (a = ' '),
      this.element.appendChild(document.createTextNode(a)),
      c
        ? this.element.classList.add('correct')
        : 'normal-character' != b && this.element.classList.add('incorrect'),
      this.element.classList.add(b)
  }
}
class InputEntry extends TableEntry {
  constructor (a, b = !1) {
    super(),
      (this.element = document.createElement('input')),
      this.element.classList.add('input-number'),
      (this.element.maxLength = 1),
      (this.expectedDigit = a),
      (this.notImportant = b),
      this.element.addEventListener(
        'input',
        () => inputListener(this.element),
        { passive: !0 }
      )
  }
  inputCorrect () {
    return this.element.value === this.expectedDigit.toString()
  }
  showDigit (a, b) {
    var c = b || this.expectedDigit.toString() === this.element.value,
      d = new Digit(this.expectedDigit, a, c)
    this.element.parentElement.replaceChild(d.element, this.element)
  }
}
class InputCarryover extends InputEntry {
  constructor (a) {
    var b = '0' == a ? '' : a
    super(b), this.element.classList.add('input-carryover')
  }
  inputCorrect () {
    return (
      super.inputCorrect() ||
      ('' === this.expectedDigit && '0' === this.element.value)
    )
  }
  showDigit () {
    this.inputCorrect()
      ? super.showDigit('carryover', !0)
      : super.showDigit('carryover', !1)
  }
  markIfWrong () {
    this.inputCorrect() ||
      (this.element.classList.add('wrong'), markedInputs.push(this))
  }
}
class InputSolution extends InputEntry {
  constructor (a, b = !1) {
    super(a, b),
      this.element.classList.add('input-solution'),
      (this.notImportant = b)
  }
  inputCorrect () {
    return (
      super.inputCorrect() || (this.notImportant && '0' === this.element.value)
    )
  }
  showDigit () {
    this.inputCorrect()
      ? super.showDigit('solution', !0)
      : super.showDigit('solution', !1)
  }
  markIfWrong () {
    this.inputCorrect() ||
      (this.element.classList.add('wrong'), markedInputs.push(this))
  }
}
class Point {
  constructor (a) {
    ;(this.element = document.createElement('span')),
      this.element.appendChild(document.createTextNode(a)),
      this.element.classList.add('point')
  }
}
class Period {
  constructor (a, b, c) {
    ;(this.startInputField = a),
      (this.endInputField = b),
      (this.state = c),
      this.startInputField.classList.add('relative-period'),
      (this.period_div = document.createElement('div')),
      (this.period_div.id = 'period'),
      this.period_div.classList.add(this.state)
    var d = this.startInputField.getBoundingClientRect(),
      e = this.endInputField.getBoundingClientRect()
    ;(this.period_div.style.width =
      Math.floor(e.right - d.left + e.width / 2) + 'px'),
      this.startInputField.appendChild(this.period_div)
  }
  changeStart (a, b) {
    this.startInputField.classList.remove('relative-period'),
      (this.startInputField = a),
      this.startInputField.classList.add('relative-period'),
      this.changeState(b)
    var c = this.startInputField.getBoundingClientRect(),
      d = this.endInputField.getBoundingClientRect()
    ;(this.period_div.style.width =
      Math.floor(d.right - c.left + d.width / 2) + 'px'),
      this.startInputField.appendChild(this.period_div)
  }
  changeState (a) {
    this.state != a &&
      (this.period_div.classList.remove(this.state),
      (this.state = a),
      this.period_div.classList.add(this.state))
  }
  removePeriod () {
    this.startInputField.classList.remove('relative-period'),
      this.startInputField.lastChild.remove(),
      (canvas.period = void 0)
  }
  resize () {
    var a = this.startInputField.getBoundingClientRect(),
      b = this.endInputField.getBoundingClientRect()
    this.period_div.style.width =
      Math.floor(b.right - a.left + b.width / 2) + 'px'
  }
  checkInput () {
    return this.startInputField == expectedInputPeriod
  }
  show () {
    !this.checkInput()
  }
  markIfWrong () {}
}
function inputListener (a) {
  ;/^[0-9]+$/.test(a.value) || (a.value = ''), demarkMarked()
}
function demarkMarked () {
  for (; 0 < markedInputs.length; )
    markedInputs.shift().element.classList.remove('wrong')
  messageContainer.classList.remove('show'),
    canvas.period &&
      'wrong' == canvas.period.state &&
      canvas.period.changeState('normal')
}
function Canvas (a, b, c, d, e) {
  function f (a, b, c, d = !1) {
    var e = document.createElementNS(svgns, 'text')
    e.setAttribute('x', b * this.box_size + this.box_size / 2 + 1),
      e.setAttribute('y', c * this.box_size + this.box_size / 2 + 1),
      (e.textContent = a),
      e.setAttribute('text-anchor', 'middle'),
      e.setAttribute('dominant-baseline', 'central'),
      e.setAttribute('font-family', 'Arial, Helvetica, sans-serif'),
      e.setAttribute('font-size', 0.9 * this.box_size + 'px'),
      (e.style.pointerEvents = 'none'),
      d && e.setAttribute('fill', '#888888'),
      svg.appendChild(e)
  }
  function g (a, b, d, e = !1) {
    var f = document.createElementNS(svgns, 'text')
    return (
      f.setAttribute('x', (b + 1) * this.box_size),
      f.setAttribute('y', d * this.box_size + 0.5 * c),
      (f.textContent = a),
      f.setAttribute('text-anchor', 'middle'),
      f.setAttribute('dominant-baseline', 'central'),
      f.setAttribute('font-family', 'Arial, Helvetica, sans-serif'),
      f.setAttribute('font-size', 1.5 * this.box_size + 'px'),
      (f.style.pointerEvents = 'none'),
      svg.appendChild(f),
      e && (this.solCommaElement = f),
      [a, (b + 1) * this.box_size, (d + 1) * this.box_size]
    )
  }
  function h (a, b) {
    var d = svg.getBoundingClientRect(),
      e = a - d.left,
      f = b - d.top,
      g = Math.floor(e / c),
      h = Math.floor(f / c)
    return [g, h]
  }
  function i (a, b, c, d, e) {
    var f = document.createElementNS(svgns, 'rect')
    f.setAttribute('x', a),
      f.setAttribute('y', b),
      f.setAttribute('width', c),
      f.setAttribute('height', d),
      f.setAttribute('fill', e),
      svg.appendChild(f)
  }
  function j (a, b, c, d, e, f = !1) {
    var g = document.createElementNS(svgns, 'line')
    g.setAttribute('x1', a),
      g.setAttribute('x2', c),
      g.setAttribute('y1', b),
      g.setAttribute('y2', d),
      g.setAttribute('style', 'stroke:' + e + ';+stroke-width:1'),
      f && (this.period = g),
      svg.appendChild(g)
  }
  function k (a, b, c, d = !1) {
    var e = document.createElementNS(svgns, 'text')
    e.setAttribute('x', b * this.box_size + this.box_size / 2 + 1),
      e.setAttribute('y', c * this.box_size + this.box_size / 2 + 1),
      (e.textContent = a),
      e.setAttribute('text-anchor', 'middle'),
      e.setAttribute('dominant-baseline', 'central'),
      e.setAttribute('font-family', 'Arial, Helvetica, sans-serif'),
      e.setAttribute('font-size', 0.9 * this.box_size + 'px'),
      (e.style.pointerEvents = 'none'),
      d && e.setAttribute('fill', '#888888'),
      svg.appendChild(e)
  }
  ;(this.boxes_x = a),
    (this.boxes_y = b),
    (this.box_size = c),
    (this.drawBoxes = function () {
      for (var a = 0; a <= this.boxes_x; a++)
        this.drawLineSVG(
          a * this.box_size,
          0,
          a * this.box_size,
          this.boxes_y * this.box_size,
          '#d3d3d3'
        )
      for (var a = 0; a <= this.boxes_y; a++)
        this.drawLineSVG(
          0,
          a * this.box_size,
          this.boxes_x * this.box_size,
          a * this.box_size,
          '#d3d3d3'
        )
    }),
    (this.drawDigit = f),
    (this.drawNumber = function (b, c, d, e = !1) {
      for (var f = [], a = 0; a < b.n1.length; a++)
        this.drawDigit(b.n1[b.n1.length - a - 1], c - a, d),
          f.unshift([b.n1[b.n1.length - a - 1], c - a, d])
      if ('' !== b.point) {
        f.unshift(this.drawPoint(b.point, c, d, e))
        for (var a = 0; a < b.n2.length; a++)
          this.drawDigit(b.n2[a], c + a + 1, d), f.push([b.n2[a], c + a + 1, d])
      }
      return f
    }),
    (this.drawLine = function (a, b, d, e) {
      var f = a * this.box_size,
        g = b * this.box_size + this.box_size
      e && (g += l), this.drawLineSVG(f, g, f + d * c, g, '#000000')
    }),
    (this.drawCarryover = function (a, b, c) {
      for (var d = 0; d < a.n1.length; d++)
        0 < a.n1[a.n1.length - d - 1] &&
          this.drawDigitSVG(a.n1[a.n1.length - d - 1], b - d, c, !0)
      if (0 < a.n2.length)
        for (var d = 0; d < a.n2.length; d++)
          0 < a.n2[d] && this.drawDigitSVG(a.n2[d], b + d + 1, c, !0)
    }),
    (this.drawNumberArray = function (b, c, d, e) {
      for (var f = [], a = 0; a < b.length; a++)
        this.drawDigit(b[b.length - a - 1], c + d - a, e),
          f.unshift([b[b.length - a - 1], c + d - a, e])
      return f
    }),
    (this.drawPeriod = function (a, b, d) {
      var e = a * this.box_size,
        f = b * this.box_size + this.box_size
      return (
        this.drawLineSVG(e, f - c, e + d * c + l, f - c, '#000000', !0),
        [e, f - c, e + d * c + l, f - c]
      )
    }),
    (this.drawRest = function (a, b, c) {
      return this.drawDigit('R', b, c), this.drawNumber(a, b + a.n1.length, c)
    }),
    (this.drawPoint = g),
    (this.coordinates_to_position = h),
    (this.mark_box = function (a, b) {
      var d = document.createElementNS(svgns, 'rect')
      d.setAttribute('x', a * c + 1),
        d.setAttribute('y', b * c + 1),
        d.setAttribute('width', c - 2),
        d.setAttribute('height', c - 2),
        this.markers.appendChild(d)
    }),
    (this.mark_period = function (a) {
      a
        ? this.period.setAttribute('style', 'stroke:#0000FF;+stroke-width:1')
        : this.period.setAttribute('style', 'stroke:#000000;+stroke-width:1')
    }),
    (this.mark_comma = function (a) {
      this.solCommaElement &&
        (a
          ? this.solCommaElement.setAttribute('fill', '#0000FF')
          : this.solCommaElement.setAttribute('fill', '#000000'))
    }),
    (this.determineIfFlexbox = function () {
      this.boxes_x * this.box_size > window.innerWidth - 40
        ? document.getElementById('svg-container').classList.remove('center')
        : document.getElementById('svg-container').classList.add('center')
    }),
    (this.drawRectSVG = i),
    (this.drawDigitSVG = k),
    (this.drawLineSVG = j),
    (this.demark_boxes = function () {
      for (; this.markers.hasChildNodes(); ) this.markers.firstChild.remove()
    }),
    (this.solCommaElement = void 0),
    (this.period = void 0),
    (this.svg = svg),
    window.addEventListener
      ? (svg.addEventListener('mousemove', d, !1, { passive: !0 }),
        svg.addEventListener('mouseleave', e, !1, { passive: !0 }))
      : window.attachEvent &&
        (svg.attachEvent('mousemove', d), svg.attachEvent('mouseleave', e))
  const l = this.box_size / 2
  ;(0.9 * this.box_size).toString() + 'px Arial'
  for (
    svg.setAttribute('width', a * c),
      svg.setAttribute('height', b * c),
      this.drawRectSVG(0, 0, a * c, b * c, 'white'),
      this.markers = document.createElementNS(svgns, 'g'),
      this.markers.setAttribute('fill', '#B6DCFC'),
      svg.appendChild(this.markers);
    document.getElementById('svg-container').hasChildNodes();

  )
    document.getElementById('svg-container').firstChild.remove()
  document.getElementById('svg-container').appendChild(svg), this.drawBoxes()
}
const box_size = 25
let period,
  current_x,
  current_y,
  repeating_number,
  number_array,
  mouse_on_period
function div (a, b, c = '0') {
  ;(current_x = -1),
    (current_y = -1),
    (period = -1),
    (mouse_on_period = !1),
    (repeating_number = [-1, -1]),
    a.same_comma(b)
  for (
    var d = divide(a, b, c, withRest),
      e = d[0],
      f = d[1],
      g = d[2],
      h = 0,
      j = 0;
    j < e.n1.length - 1 && f[2 * j + 1].is_zero();

  )
    j++
  for (var k = 0; k < j; k++) e.n1.shift(), h++
  var l = withRest
    ? a.n1.length + b.n1.length + 8 + d[2].n1.length + e.n1.length
    : a.n1.length + a.n2.length + b.n1.length + 6 + e.n1.length + e.n2.length
  var m = 4 + f.length - 2 * j
  ;(canvas = new Canvas(l, m, box_size, mouse_moved, mouse_leave)),
    (number_array = [])
  for (var k = 0; k < l; k++) number_array[k] = []
  canvas.drawNumber(a, a.n1.length + 1, 2),
    canvas.drawDigit(':', a.n1.length + a.n2.length + 2, 2)
  var n = a.n1.length + a.n2.length + 2 + b.n1.length
  canvas.drawNumber(b, n, 2), canvas.drawDigit('=', n + 1, 2)
  var o = canvas.drawNumber(e, n + 1 + e.n1.length, 2)
  ;-1 < g &&
    (period = canvas.drawPeriod(
      n + 1 + g - h + 2,
      2,
      e.n1.length + h + e.n2.length - g - 1
    ))
  var p,
    q = !1,
    r = j,
    s = r + 2,
    t = 2 * (r - j) + 3,
    u = 0
  for (('.' == o[0][0] || ',' == o[0][0]) && o.shift(); !q; ) {
    ;(p = canvas.drawNumber(f[2 * r + 1].copy().trim(), s, t)),
      p.unshift(o.shift())
    for (var k = 0; k < p.length; k++)
      number_array[p[k][1]][p[k][2]] = [p[k][0], p]
    var v = s - f[2 * r + 1].n1.length
    canvas.drawDigit('-', v, t),
      canvas.drawLine(v, t, f[2 * r + 1].n1.length + 1, !1),
      r++,
      2 * r >= f.length - 1 ? (q = !0) : s++,
      (repeating_number[1] = canvas.drawNumber(f[2 * r], s, t + 1)),
      u == g - h && (repeating_number[0] = repeating_number[1]),
      (t += 2),
      u++
  }
  if (withRest)
    for (
      var w = canvas.drawRest(
          d[2],
          a.n1.length + b.n1.length + e.n1.length + 5,
          2
        ),
        z = repeating_number[1].concat(w),
        k = 0;
      k < z.length;
      k++
    )
      number_array[z[k][1]][z[k][2]] = [z[k][0], z]
  if (!f[f.length - 1].is_zero() && -1 == g && !withRest) {
    var A = document.getElementById('cut_decimals')
    A.hasChildNodes() ||
      A.appendChild(
        document.createTextNode(
          'Die letzten Nachkommastellen werden abgeschnitten, weil die maximale Anzahl an Nachkommastellen erreicht ist.'
        )
      ),
      A.classList.remove('hide')
  }
  if (0 < d[3]) {
    var B = document.getElementById('shift_comma')
    B.hasChildNodes() ||
      B.appendChild(
        document.createTextNode(
          'Da die 2te Zahl eine Dezimalzahl ist, m\xFCssen beide Zahlen so lange mit 10 multipliziert werden, bis die zweite Zahl keine Nachkommastellen mehr hat.'
        )
      ),
      B.classList.remove('hide')
  }
  return canvas.determineIfFlexbox(), canvas
}
function mouse_moved (a) {
  if (-1 != period && mouse_over_period(a)) {
    if (mouse_on_period) return
    mouse_leave(a)
    for (var b = 0; b < repeating_number[1].length; b++)
      canvas.mark_box(repeating_number[0][b][1], repeating_number[0][b][2]),
        canvas.mark_box(repeating_number[1][b][1], repeating_number[1][b][2])
    return canvas.mark_period(!0), void (mouse_on_period = !0)
  }
  if (mouse_on_period) {
    for (var b = 0; b < repeating_number[1].length; b++) canvas.demark_boxes()
    canvas.mark_period(!1), (mouse_on_period = !1)
  }
  var c = canvas.coordinates_to_position(a.clientX, a.clientY),
    d = c[0],
    e = c[1]
  if (current_x != d || current_y != e) {
    if (
      (0 <= current_x &&
        0 <= current_y &&
        null != number_array[current_x][current_y] &&
        canvas.demark_boxes(),
      null != number_array[d][e])
    )
      for (var b = 0; b < number_array[d][e].length; b++)
        for (var f = 0; f < number_array[d][e][b].length; f++)
          canvas.mark_box(
            number_array[d][e][b][f][1],
            number_array[d][e][b][f][2]
          )
    ;(current_x = d), (current_y = e)
  }
}
function mouse_leave () {
  0 <= current_x && 0 <= current_y && canvas.demark_boxes(),
    (current_x = -1),
    (current_y = -1)
}
let expectedInputPeriod, currentInputPeriod, inputArrayPossiblePeriod
function div_self (a, b, c = '0') {
  ;(current_x = -1),
    (current_y = -1),
    (period = -1),
    (mouse_on_period = !1),
    (repeating_number = [-1, -1]),
    a.same_comma(b)
  var d = divide(a, b, c, withRest),
    e = d[0],
    f = d[1]
  let g = withRest ? -1 : d[2]
  for (var h = 0, j = 0; j < e.n1.length - 1 && f[2 * j + 1].is_zero(); ) j++
  for (var k = 0; k < j; k++) e.n1.shift(), h++
  var l = withRest
    ? a.n1.length + b.n1.length + 5 + d[2].n1.length + e.n1.length
    : a.n1.length + a.n2.length + b.n1.length + 3 + e.n1.length + e.n2.length
  var m = f.length - 2 * j
  ;(canvas = new CanvasSelf(l, m, 21)), (number_array = [])
  for (var k = 0; k < l; k++) number_array[k] = []
  canvas.insertNumber(a, a.n1.length, 0),
    canvas.insertEntry(
      new Digit(':', 'normal-character').element,
      a.n1.length + a.n2.length + 1,
      0
    )
  var n = a.n1.length + a.n2.length + b.n1.length + 1
  if (
    (canvas.insertNumber(b, n, 0),
    canvas.insertEntry(new Digit('=', 'normal-character').element, n + 1, 0),
    canvas.insertSolutionRow(e, n + 1 + e.n1.length, 0),
    -1 < g)
  ) {
    document
      .getElementById('period-buttons-container')
      .classList.remove('hide'),
      (expectedInputPeriod =
        canvas.table.firstChild.childNodes[n + 1 + g - h + 2]),
      (currentInputPeriod = void 0),
      (inputArrayPossiblePeriod = [])
    for (var k = n + 2; k < canvas.table.firstChild.childNodes.length; k++)
      inputArrayPossiblePeriod.push(canvas.table.firstChild.childNodes[k])
  }
  for (var o = j, p = o + 1, q = 2 * (o - j) + 1, r = 0, s = [], t = !1; !t; ) {
    canvas.insertSolutionRow(
      f[2 * o + 1].copy().trim(),
      p,
      q,
      a.n1.length + a.n2.length + b.n1.length + b.n2.length + 3 + r,
      !0
    )
    var u = p - f[2 * o + 1].n1.length
    if (
      (canvas.insertEntry(new Digit('-', 'normal-character').element, u, q),
      canvas.drawLine(u, u + f[2 * o + 1].n1.length, q + 1),
      o++,
      2 * o >= f.length - 1 ? (t = !0) : p++,
      canvas.insertSolutionRow(f[2 * o], p, q + 1),
      t)
    )
      for (var k = p - f[2 * o].n1.length + 1; k <= p; k++)
        s.push(exerciseContainer.firstChild.childNodes[q + 1].childNodes[k])
    ;(q += 2), r++
  }
  if (withRest) {
    ;(n = n + 3 + e.n1.length + e.n2.length),
      canvas.insertEntry(new Digit('R', 'normal-character').element, n, 0),
      canvas.insertSolutionRow(d[2], n + d[2].n1.length, 0)
    let a = []
    for (var k = n + 1; k < n + 1 + d[2].n1.length; k++)
      a.push(exerciseContainer.firstChild.firstChild.childNodes[k])
    a = a.concat(s)
    for (var k = 0; k < a.length; k++)
      a[k].addEventListener(
        'focusin',
        () => {
          for (var b = 0; b < a.length; b++)
            a[b].firstChild.classList.add('mark')
        },
        { passive: !0 }
      )
    for (var k = 0; k < a.length; k++)
      a[k].addEventListener(
        'focusout',
        () => {
          for (var b = 0; b < a.length; b++)
            a[b].firstChild.classList.remove('mark')
        },
        { passive: !0 }
      )
  }
  if (!f[f.length - 1].is_zero() && -1 == g && !withRest) {
    var v = document.getElementById('cut_decimals')
    v.hasChildNodes() ||
      v.appendChild(
        document.createTextNode(
          'Die letzten Nachkommastellen werden abgeschnitten, weil die maximale Anzahl an Nachkommastellen erreicht ist.'
        )
      ),
      v.classList.remove('hide')
  }
  if (0 < d[3]) {
    var w = document.getElementById('shift_comma')
    w.hasChildNodes() ||
      w.appendChild(
        document.createTextNode(
          'Da die 2te Zahl eine Dezimalzahl ist, m\xFCssen beide Zahlen so lange mit 10 multipliziert werden, bis die zweite Zahl keine Nachkommastellen mehr hat.'
        )
      ),
      w.classList.remove('hide')
  }
  return canvas.determineIfFlexbox(), canvas
}
function mouse_over_period (a) {
  var b = svg.getBoundingClientRect(),
    c = a.clientX - b.left,
    d = a.clientY - b.top
  return (
    c >= period[0] - 3 &&
    c <= period[2] + 3 &&
    d >= period[1] - 3 &&
    d <= period[3] + 3
  )
}
function changePeriodClicked () {
  var a = document.getElementById('change-period')
  if (a.checked) {
    a.focus(), canvas.disableAllInputfields()
    for (let a of inputArrayPossiblePeriod)
      a.onmouseenter = function () {
        inputMouseEnterListener(a)
      }
    for (let a of inputArrayPossiblePeriod)
      a.onmouseleave = function () {
        inputMouseLeaveListener(a)
      }
    for (let a of inputArrayPossiblePeriod)
      a.onclick = function () {
        inputClickListener(a)
      }
  } else {
    canvas.enableAllInputfields()
    for (let a of inputArrayPossiblePeriod) a.onmouseenter = void 0
    for (let a of inputArrayPossiblePeriod) a.onmouseleave = void 0
    for (let a of inputArrayPossiblePeriod) a.onclick = void 0
  }
  demarkMarked()
}
function inputMouseEnterListener (a) {
  canvas.drawPeriod(a, 'hover')
}
function inputMouseLeaveListener () {
  currentInputPeriod
    ? canvas.period.changeStart(currentInputPeriod, 'normal')
    : canvas.period.removePeriod()
}
function inputClickListener () {
  ;(currentInputPeriod = canvas.period.startInputField),
    canvas.period.changeState('normal'),
    document.getElementById('change-period').click(),
    document.getElementById('delete-period-button').classList.remove('hide'),
    document.getElementById('add-period-text').classList.add('hide'),
    document.getElementById('change-period-text').classList.remove('hide')
}
function deletePeriodClicked () {
  canvas.period.removePeriod(),
    document.getElementById('delete-period-button').classList.add('hide'),
    document.getElementById('add-period-text').classList.remove('hide'),
    document.getElementById('change-period-text').classList.add('hide'),
    (currentInputPeriod = void 0),
    demarkMarked()
}
function deactivatePeriodCheckbox () {
  document.getElementById('change-period').checked &&
    document.getElementById('change-period').click()
}
let canvas,
  svg,
  svgContainer,
  exerciseContainer,
  saveCalculationAccordion,
  input_number1,
  input_number2,
  decimalsInput,
  calcYourselfCheckbox,
  message,
  messageContainer,
  sectionDetailsAccordion,
  withRest = !1,
  svgns = 'http://www.w3.org/2000/svg'
function divide_init () {
  ;(svgContainer = document.getElementById('svg-container')),
    (exerciseContainer = document.getElementById('exercise-container')),
    (saveCalculationAccordion = document.getElementById(
      'save-calculation-accordion'
    )),
    (input_number1 = document.getElementById('number1')),
    (input_number2 = document.getElementById('number2')),
    (decimalsInput = document.getElementById('decimals')),
    (calcYourselfCheckbox = document.getElementById(
      'calculate-yourself-checkbox'
    )),
    (message = document.getElementById('message')),
    (messageContainer = document.getElementById('message-container')),
    (sectionDetailsAccordion = document.getElementById(
      'section-details-accordion'
    )),
    input_number1.addEventListener('input', () => {
      input_number1.setCustomValidity('')
    }),
    input_number2.addEventListener('input', () => {
      input_number2.setCustomValidity('')
    }),
    decimalsInput.addEventListener('input', () => {
      decimalsInput.setCustomValidity('')
    }),
    input_number1.addEventListener(
      'keyup',
      a => {
        'Enter' == a.key &&
          (calcYourselfCheckbox.checked
            ? calculate(div_self, 'dividieren')
            : calculate(div, 'dividieren'))
      },
      { passive: !0 }
    ),
    input_number2.addEventListener(
      'keyup',
      a => {
        'Enter' == a.key &&
          (calcYourselfCheckbox.checked
            ? calculate(div_self, 'dividieren')
            : calculate(div, 'dividieren'))
      },
      { passive: !0 }
    ),
    decimalsInput.addEventListener(
      'keyup',
      a => {
        'Enter' == a.key &&
          (calcYourselfCheckbox.checked
            ? calculate(div_self, 'dividieren')
            : calculate(div, 'dividieren'))
      },
      { passive: !0 }
    ),
    document.getElementById('input-filename').addEventListener(
      'keyup',
      a => {
        'Enter' == a.key && downloadImage('Division')
      },
      { passive: !0 }
    ),
    document.getElementById('select-rest').addEventListener(
      'click',
      () => {
        withRest = !1
      },
      { passive: !0 }
    ),
    loadParameters()
}
function calculate (a, b) {
  resetCanvas(), window.removeEventListener('resize', resizeHandler)
  var c,
    d,
    e = void 0
  try {
    c = new Num(input_number1.value.trim())
  } catch (a) {
    var f = 'keine g\xFCltige Zahl'
    return (
      'empty' === a
        ? (f = 'Das Feld darf nicht leer sein.')
        : 'negative' === a
        ? (f = 'Die Zahl muss positiv sein.')
        : 'decimal' === a
        ? (f = 'Die Zahl muss eine ganze Zahl sein.')
        : void 0,
      (svg.style.display = 'none'),
      reportValidity(input_number1, f)
    )
  }
  try {
    d = new Num(input_number2.value.trim())
  } catch (a) {
    var f = 'keine g\xFCltige Zahl'
    return (
      'empty' === a
        ? (f = 'Das Feld darf nicht leer sein.')
        : 'negative' === a
        ? (f = 'Die Zahl muss positiv sein.')
        : 'decimal' === a
        ? (f = 'Die Zahl muss eine ganze Zahl sein.')
        : void 0,
      (svg.style.display = 'none'),
      reportValidity(input_number2, f)
    )
  }
  if (document.getElementById('decimals')) {
    if (
      ((e = document.getElementById('decimals').value.trim()),
      !e.match(/^(0|[1-9][0-9]*)$/) && 0 != e.length)
    )
      return (
        (svg.style.display = 'none'),
        reportValidity(decimalsInput, 'Keine g\xFCltige Zahl.')
      )
    var g = !1
    ;(1 != d.n1.length || 0 != d.n1[0]) && (g = !0)
    for (var h = 0; h < d.n2.length && !g; h++) 0 != d.n2[h] && (g = !0)
    if (!g)
      return (
        (svg.style.display = 'none'),
        reportValidity(decimalsInput, 'Teilen durch 0 ist nicht m\xF6glich.')
      )
  }
  if (((canvas = null == e ? a(c, d) : a(c, d, e)), null != canvas)) {
    window.addEventListener('resize', resizeHandler, { passive: !0 }),
      saveCalculationAccordion.classList.remove('hide'),
      (document.getElementById('url-text').innerHTML = '')
    var j =
      'https://schriftlich-rechnen.de/' +
      b +
      '/?z1=' +
      input_number1.value.trim() +
      '&z2=' +
      input_number2.value.trim()
    e &&
      0 < document.getElementById('decimals').value &&
      !withRest &&
      (j += '&komma=' + document.getElementById('decimals').value),
      withRest &&
        (j +=
          '&rest=' +
          (document.getElementById('rest-select').checked ? 'true' : 'false')),
      document.getElementById('calculate-yourself-button') &&
      document
        .getElementById('calculate-yourself-button')
        .classList.contains('checked')
        ? ((j += '&selber=true'),
          (document.getElementById('save-calculation-summary').nodeValue =
            'URL anzeigen'),
          document
            .getElementById('headline-download-image')
            .classList.add('hide'),
          document.getElementById('download-image').classList.add('hide'))
        : ((document.getElementById('save-calculation-summary').nodeValue =
            'Berechnung speichern'),
          document
            .getElementById('headline-download-image')
            .classList.remove('hide'),
          document.getElementById('download-image').classList.remove('hide')),
      document
        .getElementById('url-text')
        .appendChild(document.createTextNode(j)),
      calcYourselfCheckbox.checked &&
        document.getElementById('exercise-buttons-div') &&
        document.getElementById('exercise-buttons-div').classList.remove('hide')
  }
}
function reportValidity (a, b) {
  return a.setCustomValidity(b), a.reportValidity(), !1
}
function loadParameters () {
  if ('' != window.location.search) {
    var a = new URLSearchParams(window.location.search)
    a.get('selber') &&
      'true' == a.get('selber') &&
      document.getElementById('calculate-yourself-button') &&
      document.getElementById('calculate-yourself-button').click()
    var b = a.get('z1') ? a.get('z1') : '',
      c = a.get('z2') ? a.get('z2') : '',
      d = a.get('komma') ? a.get('komma') : '',
      e = a.get('rest') ? a.get('rest') : ''
    0 < b.length && (document.getElementById('number1').value = b),
      0 < c.length && (document.getElementById('number2').value = c),
      document.getElementById('decimals') &&
        (document.getElementById('decimals').value = ''),
      0 < d.length &&
        document.getElementById('decimals') &&
        (document.getElementById('decimals').value = 'leer' == d ? '' : d),
      0 < e.length &&
        document.getElementById('rest-select') &&
        ('true' == e
          ? document.getElementById('rest-select').click()
          : 'false' == e && document.getElementById('comma-select').click()),
      0 < b.length &&
        0 < c.length &&
        document.getElementById('submit-button').click()
  }
}
function copyURLToClipboard () {
  navigator.clipboard.writeText(
    document.getElementById('url-text').firstChild.nodeValue
  )
}
function downloadImage (b) {
  var c = document.getElementById('data-format').value,
    d = document.getElementById('input-filename').value
  ;(d = d.trim()),
    200 < d.length && (d = d.substring(0, 200)),
    (d = d.replace(/[^a-z0-9 .]/gi, '_')),
    d.length >= c.length + 1 &&
      d.substring(d.length - (c.length + 1), d.length).toLowerCase() ==
        '.' + c &&
      (d = d.substring(0, d.length - (c.length + 1))),
    '' == d && (d = b)
  var e,
    f = new XMLSerializer().serializeToString(svg)
  if (((f = '<?xml version="1.0" standalone="no"?>\r\n' + f), 'svg' == c)) {
    e = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(f)
    var g = document.createElement('a')
    ;(g.href = e), (g.download = d), g.click()
  } else {
    var a = new Blob([f], { type: 'image/svg+xml;charset=utf-8' })
    urlSVG = window.URL.createObjectURL(a)
    var h = new Image()
    ;(h.src = urlSVG),
      (h.onload = function () {
        var b = document.createElement('canvas')
        ;(b.width = svg.width.baseVal.value),
          (b.height = svg.height.baseVal.value)
        var f = b.getContext('2d')
        f.drawImage(h, 0, 0), (e = b.toDataURL('image/' + c))
        var g = document.createElement('a')
        ;(g.href = e), (g.download = d), g.click()
      })
  }
}
function changeRestComma () {
  var a = document.getElementById('rest-select').checked
  a
    ? document.getElementById('select-rest-comma').classList.add('checked')
    : document.getElementById('select-rest-comma').classList.remove('checked'),
    withRest != a &&
      ((withRest = a),
      resetCanvas(),
      a
        ? document.getElementById('decimals-input-div').classList.add('hide')
        : document
            .getElementById('decimals-input-div')
            .classList.remove('hide'))
}
function calculateYourselfChanged () {
  function a (a, b) {
    var c = document.getElementById(a)
    c &&
      (b
        ? svgContainer.hasChildNodes()
          ? c.classList.add('hidden')
          : c.classList.remove('hidden')
        : svgContainer.hasChildNodes()
        ? c.classList.remove('hidden')
        : c.classList.add('hidden'))
  }
  var b = calcYourselfCheckbox.checked
  a('cut_decimals', b),
    a('shift_comma', b),
    a('period-buttons-container', b),
    b
      ? (svgContainer.classList.add('hide'),
        exerciseContainer.classList.remove('hide'),
        document
          .getElementById('calculate-yourself-button')
          .classList.add('checked'),
        exerciseContainer.hasChildNodes()
          ? document
              .getElementById('exercise-buttons-div')
              .classList.remove('hide')
          : document
              .getElementById('exercise-buttons-div')
              .classList.add('hide'),
        document.getElementById('message').classList.remove('hide'),
        document.getElementById('switch_numbers') &&
          document
            .getElementById('switch_numbers')
            .parentNode.classList.add('hidden'),
        document.getElementById('solution') &&
          document
            .getElementById('solution')
            .parentNode.classList.add('hidden'))
      : (svgContainer.classList.remove('hide'),
        exerciseContainer.classList.add('hide'),
        document
          .getElementById('calculate-yourself-button')
          .classList.remove('checked'),
        document.getElementById('exercise-buttons-div').classList.add('hide'),
        document.getElementById('message').classList.add('hide'),
        document.getElementById('switch_numbers') &&
          document
            .getElementById('switch_numbers')
            .parentNode.classList.remove('hidden'),
        document.getElementById('solution') &&
          document
            .getElementById('solution')
            .parentNode.classList.remove('hidden'))
}
function resetCanvas () {
  function a (a) {
    var b = document.getElementById(a)
    b && (b.classList.add('hide'), b.classList.remove('hidden'))
  }
  for (
    canvas = void 0,
      saveCalculationAccordion.classList.add('hide'),
      input_number1.parentNode.classList.remove('showError'),
      input_number2.parentNode.classList.remove('showError'),
      document.getElementById('decimals') &&
        decimalsInput.parentNode.classList.remove('showError'),
      document.getElementById('message') &&
        messageContainer.classList.remove('show'),
      a('shift_comma'),
      a('cut_decimals'),
      a('period-buttons-container'),
      document.getElementById('switch_numbers') &&
        document.getElementById('switch_numbers').classList.add('hide'),
      document.getElementById('solution') &&
        document.getElementById('solution').classList.add('hide'),
      document.getElementById('exercise-buttons-div') &&
        document.getElementById('exercise-buttons-div').classList.add('hide'),
      document.getElementById('period-buttons-container') &&
        (document.getElementById('delete-period-button').classList.add('hide'),
        document.getElementById('add-period-text').classList.remove('hide'),
        document.getElementById('change-period-text').classList.add('hide')),
      svgContainer.hasChildNodes() &&
        svgContainer.removeChild(svgContainer.firstChild),
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      svg.id = 'canvas';
    exerciseContainer.hasChildNodes();

  )
    exerciseContainer.removeChild(exerciseContainer.firstChild)
}
function checkInputs () {
  var a = canvas.checkInputs()
  /*Zuerst wird die Methode checkInputs() des canvas-Objekts aufgerufen, die überprüft, ob die Benutzereingaben gültig sind. Das Ergebnis wird in der Variablen a gespeichert.*/

  for (
    a &&
      'undefined' != typeof expectedInputPeriod &&
      (a = canvas.period && canvas.period.checkInput()),
      message.hasChildNodes() ||
        message.appendChild(document.createTextNode('')),
      a
        ? (showSolution(),
          (message.firstChild.nodeValue = 'Alle Eingaben sind richtig.'),
          message.classList.remove('negative'),
          message.classList.add('positive'),
          document.getElementById('period-buttons-container') &&
            document
              .getElementById('period-buttons-container')
              .classList.add('hide'),
          canvas.period && canvas.period.resize())
        : ((message.firstChild.nodeValue =
            'Es stimmen noch nicht alle Eingaben.'),
          message.classList.add('negative'),
          message.classList.remove('positive')),
      messageContainer.classList.add('show');
    0 < markedInputs.length;

  )
    markedInputs.shift().element.classList.remove('wrong')
  canvas.period &&
    'wrong' == canvas.period.state &&
    canvas.period.changeState('normal')
    if (!a) {
      // Wert des Eingabefelds erhöhen
var punkteFeld = document.getElementById('Punkte');
var punkte = parseInt(punkteFeld.value, 10);
punkteFeld.value = punkte - 1;

// Text in "PunkteAusgabe" aktualisieren
var PunktAusgabe = document.getElementById('PunktAusgabe');
PunktAusgabe.innerHTML = 'Du hast ' + (punkteFeld.value) + ' Punkte';

// Ruft die Funktion markWrongInputs() auf
markWrongInputs();
        
    }
    else{ // Wert des Eingabefelds erhöhen
        var punkteFeld = document.getElementById('Punkte');
        var punkte = parseInt(punkteFeld.value, 10);
        punkteFeld.value = punkte + 1;
        
        // Text in "PunkteAusgabe" aktualisieren
        var PunktAusgabe = document.getElementById('PunktAusgabe');
        PunktAusgabe.innerHTML = 'Du hast ' + (punkteFeld.value) + ' Punkte';
        }
}

function showSolution () {
        // Wert des Eingabefelds erhöhen
var punkteFeld = document.getElementById('Punkte');
var punkte = parseInt(punkteFeld.value, 10);
punkteFeld.value = punkte - 1;

// Text in "PunkteAusgabe" aktualisieren
var PunktAusgabe = document.getElementById('PunktAusgabe');
PunktAusgabe.innerHTML = 'Du hast ' + (punkteFeld.value) + ' Punkte';
    var a = canvas.checkInputs()
  for (
    a &&
      'undefined' != typeof expectedInputPeriod &&
      (a = canvas.period && canvas.period.checkInput()),
      canvas.showSolution(),
      document.getElementById('exercise-buttons-div').classList.add('hide'),
      a
        ? (!message.hasChildNodes() &&
            message.appendChild(document.createTextNode('')),
          (message.firstChild.nodeValue = 'Alle Eingaben sind richtig.'),
          message.classList.remove('negative'),
          message.classList.add('positive'),
          messageContainer.classList.add('show'))
        : messageContainer.classList.remove('show');
    0 < markedInputs.length;

  )
    markedInputs.shift().element.classList.remove('wrong')
  canvas.period && canvas.period.resize(),
    document.getElementById('period-buttons-container') &&
      document.getElementById('period-buttons-container').classList.add('hide')
}
function markWrongInputs () {
  for (; 0 < markedInputs.length; )
    markedInputs.shift().element.classList.remove('wrong')
  canvas.markWrongInputs(), messageContainer.classList.remove('show')
}
function resizeHandler () {
  canvas != null && canvas.determineIfFlexbox(), console.log('test')
}
function burgerButtonClicked () {
  var a = document.getElementById('nav'),
    b = document.getElementById('header'),
    c = document.getElementById('burger-menu-icon')
  a.classList.toggle('active'),
    c.classList.toggle('active'),
    a.classList.contains('active')
      ? (b.classList.add('active'),
        document.addEventListener('click', navClickSomewhere))
      : (b.classList.remove('active'),
        document.removeEventListener('click', navClickSomewhere))
}
function navClickSomewhere (a) {
  header.contains(a.target) || burgerButtonClicked()
}
