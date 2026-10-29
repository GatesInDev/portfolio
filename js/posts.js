// ══════════════════════════════════════════════════
//  Blog Posts — GatesInDev / Vitor Altmann
//  Adicione posts ao array seguindo o schema abaixo.
// ══════════════════════════════════════════════════

export const posts = [
{"id": "analise-desempenho-threads", "title": "Análise de Desempenho: Processamento Concorrente de IDs utilizando POSIX e Win32 Threads", "date": "2026-10-29", "excerpt": "Análise de processamento sequencial e concorrente em C, com threads nativas, mutexes e diferentes escalas de carga. Inclui nota técnica de reprodutibilidade.", "tags": ["C", "POSIX", "Win32", "Threads", "Concorrência"], "type": "pdf", "pdfUrl": "pdfs/analise_desempenho_threads.pdf", "supplementUrl": "pdfs/notas/nota_tecnica_threads.pdf", "metadata": {"author": "Vitor Hugo Altmann", "university": "Unochapecó — Ciência da Computação", "location": "Chapecó, SC, Brasil", "abstract": "Desenvolvimento e análise de desempenho de um sistema orquestrador multiprocesso e multithread para consumir IDs, simular enriquecimento de dados e gravar resultados com sincronização. A nota técnica complementar detalha a geração de cargas e a reprodutibilidade dos experimentos."}},
    {
        id: 'comparativa-escalonadores-linux',
        title: 'Análise Comparativa de Escalonadores de Processos em Sistemas Operacionais para Servidores Críticos: CentOS, RHEL e Slackware',
        date: '2026-08-19',
        excerpt: 'A eficiência de um servidor crítico em ambientes corporativos depende diretamente da capacidade do seu SO em gerenciar recursos de hardware. O coração deste gerenciamento é o escalonador de processos (scheduler)...',
        tags: ['Linux', 'Escalonadores', 'Sistemas Operacionais', 'RHEL', 'CentOS', 'Slackware'],
        type: 'pdf',
        pdfUrl: 'pdfs/comparativa-escalonadores-linux.pdf',
        metadata: {
            author: 'Vitor Hugo Altmann',
            university: 'Universidade Comunitária da Região de Chapecó (Unochapecó)',
            location: 'Chapecó, Santa Catarina, Brasil',
            abstract: 'A eficiência de um servidor crítico em ambientes corporativos depende diretamente da capacidade do seu Sistema Operacional em gerenciar os recursos de hardware. O coração deste gerenciamento é o escalonador de processos (scheduler), responsável por distribuir o tempo de CPU entre as tarefas de forma justa e otimizada. Este artigo apresenta uma análise profunda dos mecanismos de escalonamento presentes em três distribuições Linux consolidadas em servidores point release: Red Hat Enterprise Linux (RHEL), CentOS e Slackware. Discutimos o funcionamento de baixo nível do Completely Fair Scheduler (CFS), sua interação com arquiteturas de hardware modernas, os requisitos mínimos e os cenários ideais de uso para cada sistema.'
        },
        content: ''
    }
];

// PDF discovery keeps this static site build-free. Existing metadata is preserved.
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

export async function loadArticles() {
    const response = await fetch('https://api.github.com/repos/GatesInDev/portfolio/contents/pdfs?ref=master', {
        signal: AbortSignal.timeout(8000),
        headers: { Accept: 'application/vnd.github+json' }
    });
    if (!response.ok) throw new Error('Article discovery unavailable');
    const files = await response.json();
    if (!Array.isArray(files)) throw new Error('Invalid article catalog');
    const next = files.filter(file => file.type === 'file' && /\.pdf$/i.test(file.name)).map(file => {
        const existing = posts.find(post => post.pdfUrl === file.path);
        if (existing) return existing;
        const title = escapeHtml(file.name.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' '));
        return {
            id: encodeURIComponent(file.name.replace(/\.pdf$/i, '')),
            title, date: null, excerpt: 'Artigo disponível para leitura e download em PDF.',
            tags: ['PDF'], type: 'pdf',
            pdfUrl: 'pdfs/' + encodeURIComponent(file.name),
            metadata: { author: 'Vitor Hugo Altmann', university: '—', location: '—', abstract: 'Consulte o documento completo para ler o artigo.' }
        };
    });
    next.sort((a, b) => (b.date || '').localeCompare(a.date || '') || a.title.localeCompare(b.title, 'pt-BR'));
    posts.splice(0, posts.length, ...next);
}
