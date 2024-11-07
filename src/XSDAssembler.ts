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

        // Mescla quaisquer propriedades adicionais usando o XSDPropertyMerger
        const mergedSchema = this.merger.mergeProperties(resolvedSchema);

        return mergedSchema;
    }
}
