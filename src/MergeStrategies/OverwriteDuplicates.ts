import { MergeStrategy } from './MergeStrategy';

export class OverwriteDuplicates implements MergeStrategy {
    merge(mainSchema: string, includedSchema: string): string {
        // Implementação para sobrescrever duplicatas
        return `${includedSchema}`;
    }
}
