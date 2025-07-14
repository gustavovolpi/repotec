import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DominioEmail } from './dominio-email.entity';

@Injectable()
export class DominiosEmailService {
  constructor(
    @InjectRepository(DominioEmail)
    private dominioEmailRepository: Repository<DominioEmail>,
  ) {}

  async verificarDominioValido(email: string): Promise<boolean> {
    const dominio = email.split('@')[1];
    if (!dominio) {
      return false;
    }

    const dominioValido = await this.dominioEmailRepository.findOne({
      where: { dominio, ativo: true },
    });

    return !!dominioValido;
  }

  async listarDominios(): Promise<DominioEmail[]> {
    return this.dominioEmailRepository.find();
  }

  async adicionarDominio(dominio: string): Promise<DominioEmail> {
    const novoDominio = this.dominioEmailRepository.create({ dominio });
    return this.dominioEmailRepository.save(novoDominio);
  }

  async desativarDominio(id: number): Promise<DominioEmail> {
    const dominio = await this.dominioEmailRepository.findOne({ where: { id } });
    if (!dominio) {
      throw new Error('Domínio não encontrado');
    }

    dominio.ativo = false;
    return this.dominioEmailRepository.save(dominio);
  }

  async ativarDominio(id: number): Promise<DominioEmail> {
    const dominio = await this.dominioEmailRepository.findOne({ where: { id } });
    if (!dominio) {
      throw new Error('Domínio não encontrado');
    }

    dominio.ativo = true;
    return this.dominioEmailRepository.save(dominio);
  }
} 