import { XSDLoaderImpl } from './protocols';
import fs from 'fs';

export class XSDLoader implements XSDLoaderImpl {
    private schemaAttributes: { [key: string]: string } = {};

    private extractSchemaAttributes(schemaContent: string) {
        const schemaTagMatch = schemaContent.match(/<xs:schema([^>]*)>/i);
        if (schemaTagMatch) {
            const attributes = schemaTagMatch[1].trim().split(/\s+/);
            for (const attr of attributes) {
                const [key, value] = attr.split('=');
                if (key && value && !this.schemaAttributes[key]) {
                    this.schemaAttributes[key] = value;
                }
            }
        }
    }

    private mergeSchemaAttributes(schemaContent: string) {
        const schemaTagMatch = schemaContent.match(/<xs:schema([^>]*)>/i);
        if (schemaTagMatch) {
            const attributes = schemaTagMatch[1].trim().split(/\s+/);
            for (const attr of attributes) {
                const [key, value] = attr.split('=');
                if (key && value && !this.schemaAttributes[key]) {
                    this.schemaAttributes[key] = value;
                }
            }
        }
    }

    public getSchemaAttributes(): { [key: string]: string } {
        return this.schemaAttributes;
    }

    async load(filePath: string, firstFile: boolean): Promise<string> {
        // console.log({filePath})
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }

                if (firstFile) {
                    this.extractSchemaAttributes(data); // Extrair atributos do primeiro xs:schema
                } else {
                    this.mergeSchemaAttributes(data); // Mesclar atributos dos demais xs:schema
                }

                // Remover declaração XML dos arquivos incluídos
                if (!firstFile) {
                    data = data.replace(/<\?xml.*?\?>\s*/i, '');
                }

                // Remover tags <xs:schema> de arquivos incluídos
                if (!firstFile) {
                    data = data.replace(/<xs:schema[^>]*>/i, '').replace(/<\/xs:schema>/i, '');
                }

                resolve(data);
            });
        });
    }
}
