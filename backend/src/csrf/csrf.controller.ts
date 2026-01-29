import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { generateCsrfToken } from './csrf';

@Controller('csrf')
export class CsrfController {
  @Get()
  getCsrfToken(@Req() req: Request, @Res() res: Response): Response {
    const csrfToken = generateCsrfToken(req, res);

    return res.json({ csrfToken });
  }
}
