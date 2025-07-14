import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { MailError } from './interfaces/mail-error.interface';
import { getMailConfig } from './mail.config';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {
    // Criar o transporter para verificação de conexão
    const mailConfig = getMailConfig(configService);
    this.transporter = nodemailer.createTransport(mailConfig.transport);
  }

  async onModuleInit() {
    try {
      this.logger.log('Verificando conexão com o servidor SMTP...');
      
      // Log das configurações de SMTP (ocultando a senha)
      const mailConfig = getMailConfig(this.configService);
      const transport = mailConfig.transport as any;
      const defaults = mailConfig.defaults as any;
      
      this.logger.log(`Configurações SMTP: Host=${transport.host}, Porta=${transport.port}, Seguro=${transport.secure}`);
      this.logger.log(`Usuário SMTP: ${transport.auth?.user || 'não definido'}`);
      this.logger.log(`Senha SMTP: ${transport.auth?.pass ? '******' : 'não definida'}`);
      this.logger.log(`Remetente padrão: ${defaults?.from || 'não definido'}`);
      
      await this.verificarConexaoSMTP();
      this.logger.log('Conexão com o servidor SMTP estabelecida com sucesso!');
      
      // Enviar email de alerta de inicialização
      // await this.enviarEmailAlertaInicializacao();
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Falha ao conectar com o servidor SMTP:',
        mailError.message,
      );
      
      let mensagemErro = 'Erro desconhecido';
      let detalhesErro = '';
      
      if (mailError.code === 'EAUTH') {
        mensagemErro = 'Erro de autenticação. Verifique suas credenciais no arquivo .env';
        detalhesErro = `Código: ${mailError.code}, Mensagem: ${mailError.message}`;
      } else if (mailError.code === 'ECONNREFUSED') {
        mensagemErro = 'Não foi possível conectar ao servidor SMTP. Verifique as configurações de host e porta.';
        detalhesErro = `Código: ${mailError.code}, Mensagem: ${mailError.message}`;
      } else {
        mensagemErro = `Erro ao conectar com o servidor SMTP: ${mailError.message}`;
        detalhesErro = `Código: ${mailError.code || 'N/A'}, Resposta: ${mailError.response || 'N/A'}`;
      }
      
      // Enviar email de alerta de erro
      await this.enviarEmailAlertaErro(
        'Falha na Conexão SMTP',
        mensagemErro,
        detalhesErro,
      );
      
      // Não interrompemos a inicialização da aplicação, apenas registramos o erro
    }
  }

  async verificarConexaoSMTP(): Promise<boolean> {
    try {
      this.logger.log('Iniciando verificação de conexão SMTP...');
      
      // Verifica a conexão com o servidor SMTP
      const resultado = await this.transporter.verify();
      
      this.logger.log(`Verificação SMTP concluída com sucesso. Resultado: ${resultado}`);
      return true;
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error('Erro ao verificar conexão SMTP:', mailError.message);
      
      // Log detalhado do erro
      if (mailError.code) {
        this.logger.error(`Código do erro: ${mailError.code}`);
      }
      
      if (mailError.response) {
        this.logger.error(`Resposta do servidor: ${mailError.response}`);
      }
      
      if (mailError.responseCode) {
        this.logger.error(`Código de resposta: ${mailError.responseCode}`);
      }
      
      if (mailError.command) {
        this.logger.error(`Comando que falhou: ${mailError.command}`);
      }
      
      throw error;
    }
  }

  /**
   * Envia um email de alerta quando a aplicação é iniciada
   * @returns Promise<void>
   */
  async enviarEmailAlertaInicializacao(): Promise<void> {
    try {
      const emailAlerta = this.configService.get<string>('MAIL_ALERT_EMAIL');
      
      if (!emailAlerta) {
        this.logger.warn('Email de alerta não configurado. Pulando envio de email de alerta.');
        return;
      }
      
      this.logger.log(`Enviando email de alerta de inicialização para ${emailAlerta}...`);
      
      const ambiente = this.configService.get<string>('NODE_ENV') || 'desconhecido';
      const dataHora = new Date().toLocaleString('pt-BR');
      const host = this.configService.get<string>('DATABASE_HOST') || 'desconhecido';
      const porta = this.configService.get<string>('DATABASE_PORT') || 'desconhecido';
      
      await this.mailerService.sendMail({
        to: emailAlerta,
        subject: `[RepoTEC] Alerta de Inicialização - ${ambiente.toUpperCase()}`,
        html: `
          <h1>Alerta de Inicialização - RepoTEC</h1>
          <p>A aplicação RepoTEC foi iniciada com sucesso.</p>
          <p><strong>Ambiente:</strong> ${ambiente}</p>
          <p><strong>Data e Hora:</strong> ${dataHora}</p>
          <p><strong>Host:</strong> ${host}</p>
          <p><strong>Porta:</strong> ${porta}</p>
          <p>Este é um email automático enviado pelo sistema RepoTEC.</p>
        `,
      });
      
      this.logger.log(`Email de alerta de inicialização enviado com sucesso para ${emailAlerta}`);
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Erro ao enviar email de alerta de inicialização:',
        mailError.message,
      );
      
      // Não interrompemos a inicialização da aplicação, apenas registramos o erro
    }
  }

  async enviarEmailBoasVindas(nome: string, email: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Bem-vindo(a) ao RepoTEC!',
        template: 'welcome',
        context: {
          nome,
          frontendUrl,
        },
      });
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Erro ao enviar email de boas-vindas:',
        mailError.message,
      );
      
      // Mensagens de erro mais específicas
      if (mailError.code === 'EAUTH') {
        this.logger.error(
          'Erro de autenticação SMTP. Verifique suas credenciais no arquivo .env',
        );
      } else if (mailError.code === 'ECONNREFUSED') {
        this.logger.error(
          'Não foi possível conectar ao servidor SMTP. Verifique as configurações de host e porta.',
        );
      } else {
        this.logger.error(
          'Erro desconhecido ao enviar email:',
          mailError.message,
        );
      }
      
      // Não interrompemos o fluxo se o email falhar
    }
  }

  async enviarEmailRecuperacaoSenha(
    nome: string,
    email: string,
    resetLink: string,
  ): Promise<void> {
    try {
      const dataSolicitacao = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperação de Senha - RepoTEC',
        template: 'reset-password',
        context: {
          nome,
          resetLink,
          dataSolicitacao,
        },
      });
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Erro ao enviar email de recuperação de senha:',
        mailError.message,
      );
      throw error;
    }
  }

  /**
   * Envia um email de teste para verificar se o servidor SMTP está funcionando corretamente
   * @param emailDestino Email para onde o teste será enviado
   * @returns Promise<boolean> True se o email foi enviado com sucesso, false caso contrário
   */
  async enviarEmailTeste(emailDestino: string): Promise<boolean> {
    try {
      this.logger.log(`Enviando email de teste para ${emailDestino}...`);
      
      const resultado = await this.mailerService.sendMail({
        to: emailDestino,
        subject: 'Teste de Email - RepoTEC',
        html: `
          <h1>Teste de Email</h1>
          <p>Este é um email de teste enviado pelo RepoTEC.</p>
          <p>Se você está recebendo este email, significa que a configuração do servidor SMTP está funcionando corretamente.</p>
          <p>Data e hora do envio: ${new Date().toLocaleString('pt-BR')}</p>
        `,
      });
      
      this.logger.log(`Email de teste enviado com sucesso para ${emailDestino}`);
      return true;
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Erro ao enviar email de teste:',
        mailError.message,
      );
      
      // Log detalhado do erro
      if (mailError.code) {
        this.logger.error(`Código do erro: ${mailError.code}`);
      }
      
      if (mailError.response) {
        this.logger.error(`Resposta do servidor: ${mailError.response}`);
      }
      
      if (mailError.responseCode) {
        this.logger.error(`Código de resposta: ${mailError.responseCode}`);
      }
      
      if (mailError.command) {
        this.logger.error(`Comando que falhou: ${mailError.command}`);
      }
      
      return false;
    }
  }

  /**
   * Envia um email de alerta de erro para o email de alertas configurado
   * @param titulo Título do alerta
   * @param mensagem Mensagem do alerta
   * @param detalhes Detalhes adicionais do erro (opcional)
   * @returns Promise<boolean> True se o email foi enviado com sucesso, false caso contrário
   */
  async enviarEmailAlertaErro(
    titulo: string,
    mensagem: string,
    detalhes?: string,
  ): Promise<boolean> {
    try {
      const emailAlerta = this.configService.get<string>('MAIL_ALERT_EMAIL');
      
      if (!emailAlerta) {
        this.logger.warn('Email de alerta não configurado. Pulando envio de email de alerta de erro.');
        return false;
      }
      
      this.logger.log(`Enviando email de alerta de erro para ${emailAlerta}...`);
      
      const ambiente = this.configService.get<string>('NODE_ENV') || 'desconhecido';
      const dataHora = new Date().toLocaleString('pt-BR');
      
      await this.mailerService.sendMail({
        to: emailAlerta,
        subject: `[RepoTEC] Alerta de Erro - ${titulo}`,
        html: `
          <h1>Alerta de Erro - RepoTEC</h1>
          <p><strong>Título:</strong> ${titulo}</p>
          <p><strong>Mensagem:</strong> ${mensagem}</p>
          ${detalhes ? `<p><strong>Detalhes:</strong> ${detalhes}</p>` : ''}
          <p><strong>Ambiente:</strong> ${ambiente}</p>
          <p><strong>Data e Hora:</strong> ${dataHora}</p>
          <p>Este é um email automático enviado pelo sistema RepoTEC.</p>
        `,
      });
      
      this.logger.log(`Email de alerta de erro enviado com sucesso para ${emailAlerta}`);
      return true;
    } catch (error) {
      const mailError = error as MailError;
      this.logger.error(
        'Erro ao enviar email de alerta de erro:',
        mailError.message,
      );
      
      // Não interrompemos o fluxo se o email falhar
      return false;
    }
  }
} 