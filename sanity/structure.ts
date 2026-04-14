import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('ChrisPop Studio')
    .items([
      // 1. 3D Fabrication Section
      S.listItem()
        .title('3D Fabrication')
        .child(
          S.documentList()
            .title('Fabrication Projects')
            .schemaType('project')
            .filter('_type == "project" && category == "fabrication"')
            .initialValueTemplates([
              S.initialValueTemplateItem('project-fabrication')
            ])
        ),

      // 2. Architectural Design Section
      S.listItem()
        .title('Architectural Design')
        .child(
          S.documentList()
            .title('Architectural Projects')
            .schemaType('project')
            .filter('_type == "project" && category == "architecture"')
            .initialValueTemplates([
              S.initialValueTemplateItem('project-architecture')
            ])
        ),

      S.divider(),

      // 3. Fallback for all other document types (like media or settings if added later)
      ...S.documentTypeListItems().filter(
        (listItem) => !['project'].includes(listItem.getId() || '')
      ),
    ])
