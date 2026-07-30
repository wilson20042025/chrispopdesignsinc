import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('ChrisPop Studio')
    .items([
      S.listItem()
        .title('Categories')
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .child((categoryId) =>
              S.documentList()
                .title('Projects')
                .schemaType('project')
                .filter('_type == "project" && category._ref == $categoryId')
                .params({ categoryId })
                .initialValueTemplates([
                  S.initialValueTemplateItem('project', { category: categoryId })
                ])
            )
        ),
      
      S.listItem()
        .title('All Projects')
        .child(
          S.documentTypeList('project')
            .title('All Projects')
        ),

      S.divider(),

      // Fallback for all other document types (like media or settings if added later)
      ...S.documentTypeListItems().filter(
        (listItem) => !['project', 'category'].includes(listItem.getId() || '')
      ),
    ])
