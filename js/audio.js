// ══════════════════════════════════════════════════
//  Audiophile Data — GatesInDev / Vitor Altmann
//  Preencha com sua coleção real.
// ══════════════════════════════════════════════════

export const headphones = [

    // Adicione seus fones seguindo este modelo:
    // {
    //     id: 'kebab-id',
    //     name: 'Marca Modelo',
    //     type: 'IEM | Over-ear | On-ear',
    //     driver: 'Dynamic | Planar | BA | Hybrid',
    //     signature: 'Warm | Neutral | Bright | V-shaped | Harman',
    //     status: 'owned',     // owned | sold | wishlist
    //     squigUrl: 'https://squig.link/?share=...',
    //     notes: 'Impressões pessoais'
    // },

    {
         id: 'aful-explorer',
         name: 'Aful Acoustics Explorer',
         image: '//afulaudio.com/cdn/shop/files/AFULExplorer_9.jpg?v=1716946584&width=1445',
         type: 'IEM',
         driver: '1 DD & 2 BA',
         signature: 'Warm',
         status: 'owned',     // owned | sold | wishlist
         squigUrl: 'https://squig.link/?share=Harman_IE_2019_Target,Aful_Explorer',
         notes: 'É um fone com uma assinatura sonora muito confortável. Embora não seja considerado uma referência em fidelidade de áudio, entrega um excelente nível de detalhes e boa capacidade técnica.'
     },
    {
         id: 'moondrop-spacetravel2',
         name: 'Moondrop Space Travel 2',
         image: 'https://shenzhenaudio.com/cdn/shop/files/8_a356700b-d177-4fae-ba5a-e07b3c52d095.png?v=1752032131&width=990',
         type: 'TWS',
         driver: '1 DD',
         signature: 'Natural',
         status: 'owned',     // owned | sold | wishlist
         squigUrl: 'https://graph.hangout.audio/iem/5128/?share=Space_Travel_2',
         notes: 'É um fone que oferece um nível de detalhamento bastante competitivo para a categoria de TWS com ANC. No entanto, em comparação com fones cabeados da mesma faixa de preço, apresenta limitações em aspectos técnicos como separação instrumental, imagem sonora e sensação de palco.'
     },
    {
         id: 'edifier-w820nb-plus',
         name: 'EDIFIER W820NB PLUS',
         type: 'Over-ear',
         image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.headphonecheck.com%2Fwp-content%2Fuploads%2FEdifier-W820NB-Plus-1-1536x863.jpg&f=1&nofb=1&ipt=58e4e7525472305e21999259be951a7a88fa95cc24e1d5f807be15bb6a98f1c5',
         driver: '1 DD',
         signature: 'V-shaped',
         status: 'owned',     // owned | sold | wishlist
         squigUrl: 'https://filk.squig.link/?share=Edifier_W820NB_Plus',
         notes: 'É um fone com assinatura sonora levemente quente e equilibrada, priorizando conforto auditivo em vez de uma apresentação excessivamente analítica. Os graves possuem boa presença e extensão, os médios são naturais e os agudos suaves, resultando em uma sonoridade agradável para longas sessões de audição.'
     }

];

export const vinyls = [

    // Adicione seus discos seguindo este modelo:
    // {
    //     artist: 'Nome do Artista',
    //     album: 'Título do Álbum',
    //     year: 1973,
    //     genre: 'Rock | Jazz | Classical | Electronic | Pop',
    //     notes: ''
    // },

];

export const audioPreferences = {
    targetCurve: 'Harman 2019 in-ear',
    signatures: ['Ligeiramente Warm', 'Natural'],
    notes: '',

    // Cada entrada renderiza um gráfico embutido na seção Assinaturas Sonoras.
    // label: título exibido no card
    // url:   URL do squig.link (ou hangout.audio, filk.squig.link, etc.)
    // description: texto opcional abaixo do gráfico
    squigs: [
        {
            label: 'Harman 2019 In-Ear Target',
            url: 'https://squig.link/?share=Harman_IE_2019_Target',
            description: 'Curva-alvo que define como um IEM bem calibrado deveria soar segundo as pesquisas da Harman International. É minha referência principal ao avaliar fones.'
        },
    ]
};
