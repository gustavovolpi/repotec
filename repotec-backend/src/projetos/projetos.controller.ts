import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjetosService } from './projetos.service';
import { CriarProjetoDto } from './dto/criar-projeto.dto';
import { AtualizarProjetoDto } from './dto/atualizar-projeto.dto';
import { GetUser } from '../auth/get-user.decorator';
import { Usuario } from '../usuarios/usuario.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ListarSemestresResponseDto } from './dto/listar-semestres.dto';
import { BuscarProjetosQueryDto } from './dto/buscar-projetos-query.dto';
import { AdminGuard } from '../auth/admin.guard';
import { Projeto } from './projeto.entity';

@ApiTags('Projetos')
@Controller('projetos')
@UseGuards(AuthGuard())
export class ProjetosController {
  constructor(private projetosService: ProjetosService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar um novo projeto' })
  async criarProjeto(
    @Body() criarProjetoDto: CriarProjetoDto,
    @GetUser() usuario: Usuario,
  ): Promise<Projeto> {
    console.log('** controle.criarProjeto = ', criarProjetoDto);
    try {
      return this.projetosService.criarProjeto(criarProjetoDto, usuario);
    } catch (error) {
      console.log('** error **', error);
      throw error;
    }
  }

  @Get('semestres')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar semestres disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de semestres retornada com sucesso',
    type: ListarSemestresResponseDto,
  })
  @ApiQuery({
    name: 'pagina',
    required: false,
    type: Number,
    description: 'Número da página',
  })
  @ApiQuery({
    name: 'limite',
    required: false,
    type: Number,
    description: 'Quantidade de itens por página',
  })
  async listarSemestres(
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('limite', new DefaultValuePipe(10), ParseIntPipe) limite: number,
  ): Promise<ListarSemestresResponseDto> {
    //console.log('\n\nlistarSemestres', pagina, limite);
    const ret = await this.projetosService.listarSemestres(pagina, limite);
    //console.log('\n\nret', ret);
    return ret;
  }

  @Get()
  @ApiOperation({ summary: 'Buscar projetos' })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Projetos encontrados com sucesso',
    schema: {
      properties: {
        dados: {
          type: 'array',
          items: { $ref: '#/components/schemas/Projeto' },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            pagina: { type: 'number' },
            ultimaPagina: { type: 'number' },
            limite: { type: 'number' },
            autorId: { type: 'number' },
          },
        },
      },
    },
  })
  buscarProjetos(@Query(ValidationPipe) query: BuscarProjetosQueryDto) {
    return this.projetosService.buscarProjetos(query);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter um projeto por ID' })
  @ApiResponse({ status: 200, description: 'Projeto encontrado com sucesso' })
  obterProjeto(@Param('id', ParseIntPipe) id: number) {
    console.log('--------------------------------');
    console.log('id', id);
    console.log('--------------------------------');
    return this.projetosService.obterProjeto(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar um projeto existente' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso' })
  atualizarProjeto(
    @Param('id', ParseIntPipe) id: number,
    @Body() atualizarProjetoDto: AtualizarProjetoDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.projetosService.atualizarProjeto(
      id,
      atualizarProjetoDto,
      usuario,
    );
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Excluir um projeto existente' })
  @ApiResponse({ status: 200, description: 'Projeto excluído com sucesso' })
  excluirProjeto(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() usuario: Usuario,
  ) {
    return this.projetosService.excluirProjeto(id, usuario);
  }
}
