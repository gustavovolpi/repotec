import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerguntasFrequentesService } from './perguntas-frequentes.service';
import { CriarPerguntaFrequenteDto } from './dto/criar-pergunta-frequente.dto';
import { AtualizarPerguntaFrequenteDto } from './dto/atualizar-pergunta-frequente.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PerguntaFrequente } from './pergunta-frequente.entity';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Perguntas Frequentes')
@Controller('perguntas-frequentes')
@UseGuards(AuthGuard())
export class PerguntasFrequentesController {
  constructor(private perguntasFrequentesService: PerguntasFrequentesService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar uma nova pergunta frequente' })
  @ApiResponse({
    status: 201,
    description: 'Pergunta frequente criada com sucesso',
    type: PerguntaFrequente,
  })
  criarPerguntaFrequente(
    @Body() criarPerguntaFrequenteDto: CriarPerguntaFrequenteDto,
  ): Promise<PerguntaFrequente> {
    console.log('** criarPerguntaFrequente **', criarPerguntaFrequenteDto);
    return this.perguntasFrequentesService.criarPerguntaFrequente(
      criarPerguntaFrequenteDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as perguntas frequentes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perguntas frequentes retornada com sucesso',
    type: [PerguntaFrequente],
  })
  buscarPerguntasFrequentes(): Promise<PerguntaFrequente[]> {
    return this.perguntasFrequentesService.buscarPerguntasFrequentes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter uma pergunta frequente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Pergunta frequente encontrada com sucesso',
    type: PerguntaFrequente,
  })
  obterPerguntaFrequente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PerguntaFrequente> {
    return this.perguntasFrequentesService.obterPerguntaFrequente(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Atualizar uma pergunta frequente existente' })
  @ApiResponse({
    status: 200,
    description: 'Pergunta frequente atualizada com sucesso',
    type: PerguntaFrequente,
  })
  atualizarPerguntaFrequente(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarPerguntaFrequenteDto: AtualizarPerguntaFrequenteDto,
  ): Promise<PerguntaFrequente> {
    return this.perguntasFrequentesService.atualizarPerguntaFrequente(
      id,
      atualizarPerguntaFrequenteDto,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Excluir uma pergunta frequente existente' })
  @ApiResponse({
    status: 200,
    description: 'Pergunta frequente excluída com sucesso',
  })
  excluirPerguntaFrequente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.perguntasFrequentesService.excluirPerguntaFrequente(id);
  }
}
