import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { CriarTagDto } from './dto/criar-tag.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar tags por termo' })
  @ApiResponse({ status: 200, description: 'Tags encontradas com sucesso' })
  async buscarTags(
    @Query('termo') termo?: string,
    @Query('pagina') pagina: number = 1,
    @Query('limite') limite: number = 10
  ) {
    const tags = await this.tagsService.buscarTags(termo);
    
    const total = tags.length;
    const totalPaginas = Math.ceil(total / limite);
    const inicio = (pagina - 1) * limite;
    const fim = inicio + limite;
    const dadosPaginados = tags.slice(inicio, fim);

    return {
      dados: dadosPaginados,
      meta: {
        total,
        pagina,
        limite,
        totalPaginas
      }
    };
  }

  @UseGuards(AuthGuard())
  @Post()
  @ApiOperation({ summary: 'Criar uma nova tag' })
  @ApiResponse({ status: 201, description: 'Tag criada com sucesso' })
  criarTag(@Body() criarTagDto: CriarTagDto) {
    return this.tagsService.criarTag(criarTagDto);
  }

  @UseGuards(AuthGuard())
  @Get()
  @ApiOperation({ summary: 'Obter todas as tags' })
  @ApiResponse({ status: 200, description: 'Tags encontradas com sucesso' })
  obterTodasTags() {
    return this.tagsService.obterTodasTags();
  }

  @UseGuards(AuthGuard())
  @Get(':id')
  @ApiOperation({ summary: 'Obter uma tag por ID' })
  @ApiResponse({ status: 200, description: 'Tag encontrada com sucesso' })
  obterTagPorId(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.obterTagPorId(id);
  }

  @UseGuards(AuthGuard())
  @Get('nome/:nome')
  @ApiOperation({ summary: 'Obter uma tag por nome' })
  @ApiResponse({ status: 200, description: 'Tag encontrada com sucesso' })
  obterTagPorNome(@Param('nome') nome: string) {
    return this.tagsService.obterTagPorNome(nome);
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar uma tag existente' })
  @ApiResponse({ status: 200, description: 'Tag atualizada com sucesso' })
  atualizarTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() criarTagDto: CriarTagDto,
  ) {
    return this.tagsService.atualizarTag(id, criarTagDto.nome);
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir uma tag existente' })
  @ApiResponse({ status: 200, description: 'Tag excluída com sucesso' })
  excluirTag(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.excluirTag(id);
  }
}
