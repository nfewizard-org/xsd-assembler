import { XSDLoader } from './XSDLoader';
import { XSDIncludeResolver } from './XSDIncludeResolver';
import { XSDPropertyMerger } from './XSDPropertyMerger';
import { XSDAssemblerImpl } from '@Protocols';
import path from 'path';

export class XSDAssembler implements XSDAssemblerImpl{
    private loader: XSDLoader;
    private resolver: XSDIncludeResolver;
    private merger: XSDPropertyMerger;

    constructor(loader: XSDLoader, resolver: XSDIncludeResolver, merger: XSDPropertyMerger) {
        this.loader = loader;
        this.resolver = resolver;
        this.merger = merger;
    }

    async assemble(filePath: string): Promise<string> {
        // Resolve todas as inclusões e aplica atributos no primeiro xs:schema
        const resolvedSchema = await this.resolver.resolveIncludes(filePath, true, path.dirname(filePath));
    
        // Normalizar as expressões regulares, removendo a duplicação das barras invertidas
        const normalizedSchema = this.normalizeRegexPatterns(resolvedSchema);
    
        // Mescla quaisquer propriedades adicionais usando o XSDPropertyMerger
        const mergedSchema = this.merger.mergeProperties(normalizedSchema);
    
        return mergedSchema;
    }
    
    // Função para normalizar as expressões regulares
    private normalizeRegexPatterns(schemaContent: string): string {
        // Substitui as ocorrências de \\ por \ (remover escape extra de barras invertidas)
        return schemaContent.replace(/\\\\/g, '\\');
    }
}
