import { XSDLoader } from './XSDLoader';
import { XSDIncludeResolverImpl } from './protocols';
import path from 'path';

export class XSDIncludeResolver implements XSDIncludeResolverImpl {
    private loader: XSDLoader;

    constructor(loader: XSDLoader) {
        this.loader = loader;
    }

    private applySchemaAttributes(schemaContent: string): string {
        const schemaAttributes = this.loader.getSchemaAttributes();
        const schemaTagMatch = schemaContent.match(/<xs:schema[^>]*>/i);
        if (schemaTagMatch) {
            const updatedSchemaTag = `<xs:schema ${Object.entries(schemaAttributes)
                .map(([key, value]) => `${key}=${value}`)
                .join(' ')}>`;
            return schemaContent.replace(schemaTagMatch[0], updatedSchemaTag);
        }
        return schemaContent;
    }

    // Função para reorganizar diretivas <xs:import> e <xs:include>
    private reorderSchemaDirectives(schemaContent: string): string {
        // Extrai todas as diretivas <xs:import> e <xs:include>
        const importRegex = /<xs:import[^>]*\/>/g;
        const includeRegex = /<xs:include[^>]*\/>/g;
    
        const imports = [...schemaContent.match(importRegex) || []];
        const includes = [...schemaContent.match(includeRegex) || []];
    
        // Remove as diretivas do conteúdo original
        let updatedSchema = schemaContent
            .replace(importRegex, '')
            .replace(includeRegex, '');
    
        // Identifica o fim da tag de abertura <xs:schema>
        const schemaOpenTagMatch = updatedSchema.match(/<xs:schema[^>]*>/i);
        if (!schemaOpenTagMatch) {
            throw new Error("A tag <xs:schema> não foi encontrada no conteúdo do schema.");
        }
    
        const schemaOpenTag = schemaOpenTagMatch[0];
        const schemaOpenTagEndIndex = updatedSchema.indexOf(schemaOpenTag) + schemaOpenTag.length;
    
        // Separa o conteúdo antes e depois da tag <xs:schema>
        const schemaStart = updatedSchema.slice(0, schemaOpenTagEndIndex);
        const schemaRest = updatedSchema.slice(schemaOpenTagEndIndex);
    
        // Reinsere as diretivas após a abertura da tag <xs:schema>
        return `${schemaStart}\n${imports.join('\n')}\n${includes.join('\n')}\n${schemaRest}`;
    }

    // Resolve recursivamente <xs:include> e aplica os atributos no primeiro arquivo
    async resolveIncludes(filePath: string, firstFile = true, basePath = '.'): Promise<string> {
        // Carrega o conteúdo inicial do XSD
        let xsdContent = await this.loader.load(filePath, firstFile);

        // Extrai e processa todas as inclusões recursivamente
        const includeRegex = /<xs:include\s+schemaLocation="([^"]+)"\s*\/?>/g;
        let match;

        while ((match = includeRegex.exec(xsdContent)) !== null) {
            const includePath = path.resolve(basePath, match[1]);
            const includedContent = await this.resolveIncludes(includePath, false, basePath);
            xsdContent = xsdContent.replace(match[0], includedContent);
        }

        // Aplica atributos e reorganiza as diretivas no primeiro arquivo
        if (firstFile) {
            xsdContent = this.applySchemaAttributes(xsdContent); // Aplica atributos ao primeiro xs:schema
            xsdContent = this.reorderSchemaDirectives(xsdContent); // Reorganiza as diretivas
        }

        return xsdContent;
    }
}
