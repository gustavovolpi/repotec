import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DominiosEmailService } from './dominios-email.service';
import { DominioEmail } from './dominio-email.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DominioEmailDto } from './dto/dominio-email.dto';

@ApiTags('Domínios de Email')
@Controller('dominios-email')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DominiosEmailController {
  constructor(private readonly dominiosEmailService: DominiosEmailService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Listar todos os domínios de email' })
  @ApiResponse({ status: 200, description: 'Lista de domínios retornada com sucesso' })
  async listarDominios(): Promise<DominioEmail[]> {
    return this.dominiosEmailService.listarDominios();
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Adicionar um novo domínio de email' })
  @ApiResponse({ status: 201, description: 'Domínio adicionado com sucesso' })
  async adicionarDominio(@Body() dominioDto: DominioEmailDto): Promise<DominioEmail> {
    return this.dominiosEmailService.adicionarDominio(dominioDto.dominio);
  }

  @Put(':id/ativar')
  @Roles('admin')
  @ApiOperation({ summary: 'Ativar um domínio de email' })
  @ApiResponse({ status: 200, description: 'Domínio ativado com sucesso' })
  async ativarDominio(@Param('id') id: number): Promise<DominioEmail> {
    return this.dominiosEmailService.ativarDominio(id);
  }

  @Put(':id/desativar')
  @Roles('admin')
  @ApiOperation({ summary: 'Desativar um domínio de email' })
  @ApiResponse({ status: 200, description: 'Domínio desativado com sucesso' })
  async desativarDominio(@Param('id') id: number): Promise<DominioEmail> {
    return this.dominiosEmailService.desativarDominio(id);
  }
} 