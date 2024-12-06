import { XSDAssemblerBuilder } from './XSDAssemblerBuilder';
import fs from 'fs';

const teste = async () => {
    // Criar instâncias para testar a funcionalidade
    // const merger = new XSDPropertyMerger(new OverwriteDuplicates());
    // const assembler = new XSDAssembler(merger);

    const builder = new XSDAssemblerBuilder();
    // builder.setMerger(merger).setAssembler(assembler);

    // Teste com caminho para o XSD
    await builder.assemble('src/schemas/consSitNFe_v4.00.xsd').then(result => {
        console.log("Resultado do merge:", result);
        fs.writeFileSync('src/schemas/teste.xsd', result)
    }).catch(error => {
        console.error("Erro ao executar assemble:", error);
    });
    

    // import xsdAssemblerBuilder from 'xsd-assembler';
    // import { OverwriteDuplicates } from './MergeStrategies/OverwriteDuplicates';

    // const xsdAssembler = xsdAssemblerBuilder
    //     .setMergeStrategy(new OverwriteDuplicates())
    //     .build();

    // xsdAssembler.assemble('path/to/xsdFile.xsd')
    //     .then((assembledXSD) => {
    //         console.log('XSD Montado:', assembledXSD);
    //     })
    //     .catch((error) => {
    //         console.error('Erro ao montar o XSD:', error);
    //     });
}

teste()