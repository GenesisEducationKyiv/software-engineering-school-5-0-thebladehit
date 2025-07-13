module.exports = {
  required: [
    {
      name: 'controllers should depend on services',
      comment: 'Controllers should depend on services',
      module: {
        path: '^apps/.*/.*\\.controller\\.ts$',
      },
      to: {
        path: '^apps/.*/.*\\.service\\.ts$',
      }
    },
  ],
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      comment: 'Cyclic dependencies between modules are prohibited',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'controller should not know about repositories',
      severity: 'error',
      comment:
        'Controllers should not know about repositories',
      from: {
        path: '^apps/.*/.*\\.controller\\.ts$',
      },
      to: {
        path: '^apps/.*/.*\\.repository\\.ts$',
      },
    },
    {
      name: 'abstracts, interfaces, dto, types, constants should not depend on other layers',
      severity: 'error',
      comment: 'Abstracts, interfaces, dto, types, constants should not depend on other layers',
      from: {
        path: '^apps/.*/(abstracts|interfaces|dto|types|constants)/.*\\.ts$',
      },
      to: {
        path: '^apps/.*/.*\\.(service|controller|repository|Impl)\\.ts$',
      },
    },
    {
      name: 'services should only know about repositories interfaces',
      severity: 'error',
      comment:
        'Services should depend on interfaces, not directly on repository implementations',
      from: {
        path: '^apps/.*/.*\\.service\\.ts$',
      },
      to: {
        path: '^apps/.*/.*\\.repository\\.ts$',
      },
    },
    {
      name: 'infrastructure should not depend on services or controllers',
      severity: 'error',
      comment:
        'Infrastructure should not depend on services or controllers',
      from: {
        path: '^apps/.*/(repository|.*Impl)\\.ts$',
      },
      to: {
        path: '^apps/.*/(service|controller)\\.ts$',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    exclude: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    enhancedResolveOptions: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  },
};
