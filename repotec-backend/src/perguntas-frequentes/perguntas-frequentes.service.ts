import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerguntaFrequente } from './pergunta-frequente.entity';
import { CriarPerguntaFrequenteDto } from './dto/criar-pergunta-frequente.dto';
import { AtualizarPerguntaFrequenteDto } from './dto/atualizar-pergunta-frequente.dto';

@Injectable()
export class PerguntasFrequentesService {
  constructor(
    @InjectRepository(PerguntaFrequente)
    private perguntaFrequenteRepository: Repository<PerguntaFrequente>,
  ) {}

  async criarPerguntaFrequente(
    criarPerguntaFrequenteDto: CriarPerguntaFrequenteDto,
  ): Promise<PerguntaFrequente> {
    console.log('** criarPerguntaFrequente **', criarPerguntaFrequenteDto);
    const perguntaFrequente = this.perguntaFrequenteRepository.create(
      criarPerguntaFrequenteDto,
    );
    console.log('** perguntaFrequente **', perguntaFrequente);
    return this.perguntaFrequenteRepository.save(perguntaFrequente);
  }

  async buscarPerguntasFrequentes(): Promise<PerguntaFrequente[]> {
    return this.perguntaFrequenteRepository.find({
      order: { dataCriacao: 'DESC' },
    });
  }

  async obterPerguntaFrequente(id: number): Promise<PerguntaFrequente> {
    const perguntaFrequente = await this.perguntaFrequenteRepository.findOne({
      where: { id },
    });

    if (!perguntaFrequente) {
      throw new NotFoundException('Pergunta frequente não encontrada');
    }

    return perguntaFrequente;
  }

  async atualizarPerguntaFrequente(
    id: number,
    atualizarPerguntaFrequenteDto: AtualizarPerguntaFrequenteDto,
  ): Promise<PerguntaFrequente> {
    const perguntaFrequente = await this.obterPerguntaFrequente(id);

    Object.assign(perguntaFrequente, atualizarPerguntaFrequenteDto);
    return this.perguntaFrequenteRepository.save(perguntaFrequente);
  }

  async excluirPerguntaFrequente(id: number): Promise<void> {
    const perguntaFrequente = await this.obterPerguntaFrequente(id);
    await this.perguntaFrequenteRepository.remove(perguntaFrequente);
  }
} 