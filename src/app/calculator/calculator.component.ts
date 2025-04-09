import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  expression: string = '';
  isScientific: boolean = false;
  isRadian: boolean = true;
  isInverseTrig: boolean = false;

  pressButton(value: string) {
    if (this.expression === 'Error') this.expression = '';
    this.expression += value;
  }

  clearAll() {
    this.expression = '';
  }

  clearEntry() {
    if (this.expression !== 'Error') {
      this.expression = this.expression.slice(0, -1);
    }
  }

  toggleScientific() {
    this.isScientific = !this.isScientific;
  }

  toggleRadianMode() {
    this.isRadian = !this.isRadian;
  }

  toggleTrigMode() {
    this.isInverseTrig = !this.isInverseTrig;
  }

  calculate() {
    try {
      let exp = this.expression;

      // Apply constants and functions
      exp = exp.replace(/π/g, 'Math.PI')
               .replace(/e/g, 'Math.E')
               .replace(/sqrt/g, 'Math.sqrt')
               .replace(/log/g, 'Math.log10')
               .replace(/ln/g, 'Math.log');

      // Trigonometric functions
      if (this.isInverseTrig) {
        exp = exp.replace(/sin⁻¹/g, this.isRadian ? 'Math.asin' : '(x => Math.asin(x) * 180 / Math.PI)')
                 .replace(/cos⁻¹/g, this.isRadian ? 'Math.acos' : '(x => Math.acos(x) * 180 / Math.PI)')
                 .replace(/tan⁻¹/g, this.isRadian ? 'Math.atan' : '(x => Math.atan(x) * 180 / Math.PI)')
                 .replace(/cot⁻¹/g, this.isRadian ? 'Math.acot' : '(x => Math.acot(x) * 180 / Math.PI)');
      } else {
        exp = exp.replace(/sin/g, this.isRadian ? 'Math.sin' : '(x => Math.sin(x * Math.PI / 180))')
                 .replace(/cos/g, this.isRadian ? 'Math.cos' : '(x => Math.cos(x * Math.PI / 180))')
                 .replace(/tan/g, this.isRadian ? 'Math.tan' : '(x => Math.tan(x * Math.PI / 180))')
                 .replace(/cot/g, this.isRadian ? 'Math.cot' : '(x => Math.cot(x * Math.PI / 180))');
      }

      // Power operator (Regular Expression)
      exp = exp.replace(/([^\s\+\-\*\/\(\)]+)\^([^\s\+\-\*\/\(\)]+)/g, 'Math.pow($1,$2)');

      const result = eval(exp);

      if (result === Infinity || result === 16331239353195370) {
        this.expression = '∞';
      } else if (result === -Infinity || result === -16331239353195370) {
        this.expression = '−∞';
      } else if (isNaN(result) || !isFinite(result)) {
        this.expression = 'Error';
      } else {
        this.expression = result.toString();
      }

    } catch (e) {
      this.expression = 'Error';
    }
  }
}
