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

        // Aplica atributos no primeiro arquivo
        return firstFile ? this.applySchemaAttributes(xsdContent) : xsdContent;
    }
}
