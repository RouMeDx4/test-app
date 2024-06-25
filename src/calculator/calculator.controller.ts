import { Body, Controller, Post } from '@nestjs/common';
import { CalculatorRequestDto } from './dto/calculator-request.dto';
import { CalculatorService } from './calculator.service';
import { CalculatorResponseDto } from './dto/calculator-response.dto';

@Controller('')
export class CalculatorController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('evaluate')
  async exportActivityTemplates(
    @Body() calculatorRequestDto: CalculatorRequestDto,
  ): Promise<CalculatorResponseDto> {
    return this.calculatorService.evaluate(calculatorRequestDto);
  }
}
