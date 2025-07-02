module.exports = {
  required: [
    {
      name: 'controllers should depend on services',
      comment: 'Controllers should depend on services',
      module: {
        path: '^src/.*/.*\\.controller\\.ts$',
      },
      to: {
        path: '^src/.*/.*\\.service\\.ts$',
      }
    },
  ],
  forbidden: [
    {
      name: 'no-circular-dependencies',
      severity: 'error',
      comment: 'Циклічні залежності між модулями заборонені',
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
        path: '^src/modules/.*/.*\\.controller\\.ts$',
      },
      to: {
        path: '^src/modules/.*/.*\\.repository\\.ts$',
      },
    },
    {
      name: 'abstracts, interfaces, dto, types, constants should not depend on other layers',
      severity: 'error',
      comment: 'Abstracts, interfaces, dto, types, constants should not depend on other layers',
      from: {
        path: '^src/.*/(abstracts|interfaces|dto|types|constants)/.*\\.ts$',
      },
      to: {
        path: '^src/modules/.*/.*\\.(service|controller|repository|Impl)\\.ts$',
      },
    },
    {
      name: 'services should only know about repositories interfaces',
      severity: 'error',
      comment:
        'Services should depend on interfaces, not directly on repository implementations',
      from: {
        path: '^src/modules/.*/.*\\.service\\.ts$',
      },
      to: {
        path: '^src/modules/.*/.*\\.repository\\.ts$',
      },
    },
    {
      name: 'infrastructure should not depend on services or controllers',
      severity: 'error',
      comment:
        'Infrastructure should not depend on services or controllers',
      from: {
        path: '^src/modules/.*/(repository|.*Impl)\\.ts$',
      },
      to: {
        path: '^src/modules/.*/(service|controller)\\.ts$',
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
