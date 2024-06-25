import { Injectable } from '@nestjs/common';
import { CalculatorRequestDto } from './dto/calculator-request.dto';
import { CalculatorResponseDto } from './dto/calculator-response.dto';

@Injectable()
export class CalculatorService {
  constructor() {}
  private numStack: number[] = [];
  private opStack: string[] = [];

  public evaluate(
    calculatorRequestDto: CalculatorRequestDto,
  ): CalculatorResponseDto {
    let i = 0;

    while (i < calculatorRequestDto.expression.length) {
      if (calculatorRequestDto.expression[i] === ' ') {
        i++;
        continue;
      }

      if (
        calculatorRequestDto.expression[i] >= '0' &&
        calculatorRequestDto.expression[i] <= '9'
      ) {
        let num = 0;
        while (
          i < calculatorRequestDto.expression.length &&
          calculatorRequestDto.expression[i] >= '0' &&
          calculatorRequestDto.expression[i] <= '9'
        ) {
          num = num * 10 + parseInt(calculatorRequestDto.expression[i]);
          i++;
        }
        this.numStack.push(num);
        continue;
      }

      if (calculatorRequestDto.expression[i] === '(') {
        this.opStack.push(calculatorRequestDto.expression[i]);
      } else if (calculatorRequestDto.expression[i] === ')') {
        while (
          this.opStack.length &&
          this.opStack[this.opStack.length - 1] !== '('
        ) {
          this.numStack.push(this.applyOperation());
        }
        this.opStack.pop();
      } else if (this.isOperator(calculatorRequestDto.expression[i])) {
        while (
          this.opStack.length &&
          this.precedence(this.opStack[this.opStack.length - 1]) >=
            this.precedence(calculatorRequestDto.expression[i])
        ) {
          this.numStack.push(this.applyOperation());
        }
        this.opStack.push(calculatorRequestDto.expression[i]);
      }

      i++;
    }

    while (this.opStack.length) {
      this.numStack.push(this.applyOperation());
    }

    return { result: this.numStack.pop()! };
  }

  private applyOperation(): number {
    const b = this.numStack.pop()!;
    const a = this.numStack.pop()!;
    const op = this.opStack.pop()!;
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return a / b;
      default:
        throw new Error(`Unknown operator: ${op}`);
    }
  }

  private isOperator(c: string): boolean {
    return c === '+' || c === '-' || c === '*' || c === '/';
  }

  private precedence(op: string): number {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
  }
}
