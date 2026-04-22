# Projeto PPE

## Objetivo
Portal do Plano Estadual de Educacao do Ceara.

## Contexto
Aplicacao frontend focada em HTML, CSS e JavaScript para paginas institucionais.
Priorizar usabilidade, legibilidade, acessibilidade e responsividade.

## Identidade visual
- manter identidade visual verde + laranja
- layout clean, moderno e institucional
- preservar legibilidade da logo em fundos verdes
- usar sombras suaves e bordas arredondadas
- manter consistencia tipografica

## Regras globais de layout
- usar max-width 1200px nos containers principais
- preferir CSS Grid e Flexbox
- evitar margin-top negativo
- evitar position absolute desnecessario
- evitar !important
- usar espacamentos consistentes
- seguir abordagem mobile first
- menu mobile obrigatorio ate 768px
- evitar overflow horizontal
- evitar sobreposicao entre banner e cards

## Breakpoints obrigatorios
- 375px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

## Agentes disponiveis
- playwright-debugger -> QA visual e screenshots
- css-architect -> refatoracao e arquitetura CSS
- ui-reviewer -> melhorias visuais e UX
- responsive-tester -> validacao por breakpoint

## Pipeline padrao
1. testar localhost:3000
2. validar breakpoints obrigatorios
3. capturar screenshots em `devtools/artifacts/playwright`
4. revisar overflow horizontal, menu mobile e sobreposicoes
