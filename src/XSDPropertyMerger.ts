import { MergeStrategy } from './MergeStrategies/MergeStrategy';
import { XSDPropertyMergerImpl } from './protocols';

export class XSDPropertyMerger implements XSDPropertyMergerImpl {
    private strategy: MergeStrategy;

    constructor(strategy: MergeStrategy) {
        this.strategy = strategy;
    }

    mergeProperties(schemaContent: string): string {
        // Implementação fictícia de exemplo: pode adicionar ou mesclar propriedades do schema conforme necessário.
        // Por exemplo, adicionar namespaces ou resolver conflitos de elementos.

        // Aqui, apenas retornamos o conteúdo do schema como está.
        return schemaContent;
    }
}
