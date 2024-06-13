import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { EntityManager } from 'typeorm';
import {
  Report,
  ReportDocument,
  ReportTemplate,
} from './entities/report.entity';
import { AppConfigService } from 'src/app-config/app-config.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

interface ReportGeneratorResult {
  markdown: string;
}

@Controller('v1/report')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);

  constructor(
    private readonly reportService: ReportService,
    private readonly entityManager: EntityManager,
    private readonly appConfigService: AppConfigService,
    private readonly httpService: HttpService,
  ) {}

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query('withDocuments') withDocuments: string,
  ) {
    return this.reportService.getOne(+id, {
      withDocuments: withDocuments === '1',
    });
  }

  @Post(':id/generate')
  async generate(@Param('id') id: string) {
    const report = await this.reportService.getOne(+id);
    const config = this.appConfigService.getConfig();
    const template = await this.entityManager.findOne(ReportTemplate, {
      where: { id: report.templateId },
      relations: ['topic'],
    });

    const uri = 'http://researcher:80/research';
    const { data } = await firstValueFrom(
      this.httpService
        .post<ReportGeneratorResult>(uri, {
          dummyApi: config.dummyApi,
          openAiKey: config.openAiKey || '',
          tavilyApiKey: config.tavilyApiKey || '',
          reportTopic: template?.topic.code,
          promptParams: report.parameters ? JSON.parse(report.parameters) : {},
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              error + '. Response: ' + JSON.stringify(error.response?.data),
            );
            throw error;
          }),
        ),
    );

    const doc = new ReportDocument();
    doc.content = data.markdown;
    doc.reportId = report.id;
    doc.name = 'markdown';

    const resDoc = await this.entityManager.save(doc);

    return { id: resDoc.id };
  }
}
