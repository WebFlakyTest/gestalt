/**
 * Error on disallowed props on `Box`
 */

// @flow strict
const allowedBaseProps = [
  'dangerouslySetInlineStyle',
  'display',
  'column',
  'direction',
  'smDisplay',
  'smColumn',
  'smDirection',
  'mdDisplay',
  'mdColumn',
  'mdDirection',
  'lgDisplay',
  'lgColumn',
  'lgDirection',
  'alignContent',
  'alignItems',
  'alignSelf',
  'as',
  'bottom',
  'borderStyle',
  'color',
  'fit',
  'flex',
  'height',
  'justifyContent',
  'left',
  'margin',
  'marginTop',
  'marginBottom',
  'marginStart',
  'marginEnd',
  'smMargin',
  'smMarginTop',
  'smMarginBottom',
  'smMarginStart',
  'smMarginEnd',
  'mdMargin',
  'mdMarginTop',
  'mdMarginBottom',
  'mdMarginStart',
  'mdMarginEnd',
  'lgMargin',
  'lgMarginTop',
  'lgMarginBottom',
  'lgMarginStart',
  'lgMarginEnd',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'opacity',
  'overflow',
  'padding',
  'smPadding',
  'mdPadding',
  'lgPadding',
  'paddingX',
  'smPaddingX',
  'mdPaddingX',
  'lgPaddingX',
  'paddingY',
  'smPaddingY',
  'mdPaddingY',
  'lgPaddingY',
  'position',
  'right',
  'rounding',
  'top',
  'width',
  'wrap',
  'userSelect',
  'role',
  'zIndex',
];

const allowedPrefixProps = ['data-', 'aria-'];

const errorMessage = (props: $ReadOnlyArray<string>): string =>
  `${
    props.length === 1 ? `${props[0]} is` : `${props.join(', ')} are`
  } not allowed on Box. Please see https://gestalt.netlify.app/Box for all allowed props.`;

const rule = {
  meta: {
    docs: {
      description: 'Do no allow certain props on Box',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
      },
    ],
  },

  // $FlowFixMe[unclear-type]
  create(context: Object): Object {
    let importedComponent = false;

    return {
      ImportDeclaration(decl) {
        if (decl.source.value !== 'gestalt') {
          return;
        }
        importedComponent = decl.specifiers.some((node) => {
          return node.imported.name === 'Box';
        });
      },
      JSXOpeningElement(node) {
        if (!importedComponent) {
          return;
        }

        const disallowedProps = Object.keys(node.attributes)
          .map((key: string) => node.attributes[key]?.name?.name)
          .filter(
            (propName: string) =>
              propName &&
              !allowedBaseProps.includes(propName) &&
              !allowedPrefixProps.some((allowedPrefixProp) =>
                propName.startsWith(allowedPrefixProp),
              ),
          );

        if (disallowedProps.length) {
          const message = errorMessage(disallowedProps);
          context.report(node, message);
        }
      },
    };
  },
};

export default rule;