import { MergeStrategy } from './MergeStrategy';

export class PreserveDuplicates implements MergeStrategy {
    merge(mainSchema: string, includedSchema: string): string {
        // Implementação para preservar duplicatas
        return `${mainSchema}\n${includedSchema}`;
    }
}
