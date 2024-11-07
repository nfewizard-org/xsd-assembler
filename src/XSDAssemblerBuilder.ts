import { XSDAssembler } from './XSDAssembler';
import { XSDLoader } from './XSDLoader';
import { XSDIncludeResolver } from './XSDIncludeResolver';
import { XSDPropertyMerger } from './XSDPropertyMerger';
import { MergeStrategy } from './MergeStrategies/MergeStrategy';
import { OverwriteDuplicates } from './MergeStrategies/OverwriteDuplicates';
import { XSDAssemblerBuilderImpl } from '@Protocols/XSDAssemblerBuilderImpl';

export class XSDAssemblerBuilder implements XSDAssemblerBuilderImpl {
    private loader: XSDLoader;
    private resolver: XSDIncludeResolver;
    private merger?: XSDPropertyMerger;

    constructor() {
        this.loader = new XSDLoader();
        this.resolver = new XSDIncludeResolver(this.loader);
        this.setMergeStrategy(new OverwriteDuplicates());
    }

    private setMergeStrategy(strategy: MergeStrategy): XSDAssemblerBuilder {
        this.merger = new XSDPropertyMerger(strategy);
        return this;
    }

    assemble(filePath: string): Promise<string> {
        if (!this.merger) {
            throw new Error("Merge strategy must be set before building XSDAssembler.");
        }

        const xsdAssembler = new XSDAssembler(this.loader, this.resolver, this.merger);
        return xsdAssembler.assemble(filePath);
    }
}
