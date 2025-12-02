// src/notifications/domains/core/template-renderer.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class TemplateRendererService {
  private readonly logger = new Logger(TemplateRendererService.name);

  async render(
    templateRelativePath: string, // ej: 'auth/templates/email/user-registered.html'
    variables?: Record<string, any>,
  ): Promise<string> {
    const projectRoot = process.cwd();

    // 1) Ruta de producción / ejecución normal (dist)
    const distPath = join(
      projectRoot,
      'dist',
      'notifications',
      'domains',
      templateRelativePath,
    );

    // 2) Ruta de desarrollo directa desde src (por si ejecutas con ts-node o algo raro)
    const srcPath = join(
      projectRoot,
      'src',
      'notifications',
      'domains',
      templateRelativePath,
    );

    const candidates = [distPath, srcPath];

    let lastError: any;

    for (const fullPath of candidates) {
      try {
        let content = await fs.readFile(fullPath, 'utf8');

        if (variables) {
          content = this.applyVariables(content, variables);
        }

        return content;
      } catch (err) {
        lastError = err;
        this.logger.debug(
          `Template not found at ${fullPath}: ${(err as any)?.message}`,
        );
      }
    }

    // Si ninguna de las rutas funcionó, logueamos error y lanzamos
    this.logger.error(
      `Error rendering template ${templateRelativePath}: ${lastError?.message}`,
    );
    throw lastError;
  }

  private applyVariables(
    template: string,
    variables: Record<string, any>,
  ): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }

    return result;
  }
}