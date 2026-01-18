import { Module } from '@nestjs/common';
import { GlossariesService } from './glossaries.service';
import { GlossariesController } from './glossaries.controller';
import { GLOSSARY_PROVIDERS } from './glossaries.providers';
import { CitiesModule } from '../cities/cities.module';

@Module({
  imports: [CitiesModule],
  providers: [GlossariesService, ...GLOSSARY_PROVIDERS],
  controllers: [GlossariesController],
  exports: [GlossariesService],
})
export class GlossariesModule {}
